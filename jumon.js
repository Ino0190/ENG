// ふっかつのじゅもん（全ページ共通）
//
// なぜ全ページに入れるのか:
//   localStorage の保存場所はページのURL単位で決まる。ブラウザによっては file:// で開いた
//   ファイルごとに別々になる（Safariはそうなる）。1つのページから全部読める前提で作ると、
//   「診断には記録があるのに再学習から見えない」という状態になって運べなくなる。
//   だから各ページが「自分から見える記録」を出せるようにする。
//
// 形式: ENGv3: + base64(JSON) + :END
//   JSON = {v:3, ls:{キー:値の文字列}}  ← localStorage をそのまま入れる（キーを決め打ちしない）
//   旧 ENGv2 / ENGv1 も読める（再学習ページが出した形）
//
// 外部へは何も送らない。

(function () {
  var PREFIX = "ENGv3:", OLD = ["ENGv2:", "ENGv1:"], END = ":END";

  function enc(s) {
    var b = new TextEncoder().encode(s), r = "";
    b.forEach(function (x) { r += String.fromCharCode(x); });
    return btoa(r);
  }
  function dec(t) {
    var r = atob(t), b = new Uint8Array(r.length);
    for (var i = 0; i < r.length; i++) b[i] = r.charCodeAt(i);
    return new TextDecoder().decode(b);
  }
  function urlSafe(b) { return b.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); }

  // ---------- 出す ----------
  // 値がJSONなら「文字列」ではなく「中身」として入れる。
  // 文字列のまま入れると引用符が全部エスケープされて2〜3割膨らみ、リンクが折り返されて壊れやすくなる。
  function snapshot() {
    var j = {}, t = {};
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (k === "__probe__") continue;
      var v = localStorage.getItem(k);
      if (v == null || v.length > 40000) continue;
      try { j[k] = JSON.parse(v); } catch (e) { t[k] = v; }
    }
    return { j: j, t: t };
  }
  function pack() {
    var s = snapshot();
    return PREFIX + enc(JSON.stringify({ v: 3, j: s.j, t: s.t })) + END;
  }
  // 受け取り側で「キー→文字列」に戻す
  function toRaw(o) {
    var ls = {};
    Object.keys(o.j || {}).forEach(function (k) { ls[k] = JSON.stringify(o.j[k]); });
    Object.keys(o.t || {}).forEach(function (k) { ls[k] = o.t[k]; });
    Object.keys(o.ls || {}).forEach(function (k) { ls[k] = o.ls[k]; });   // v3の初版
    return ls;
  }
  function pageBase() {
    if (location.protocol === "http:" || location.protocol === "https:") {
      return location.origin + location.pathname;
    }
    var root = (typeof PAGES_BASE !== "undefined") ? PAGES_BASE : "";
    if (!root) return "";
    var name = location.pathname.split("/").pop() || "index.html";
    return root.replace(/\/?$/, "/") + name;
  }
  function link() {
    var full = pack();
    var b64 = full.slice(PREFIX.length, full.length - END.length);
    var base = pageBase();
    return base ? base + "#j=" + urlSafe(b64) + END : "";
  }

  // ---------- 読む ----------
  function clean(s) {
    s = String(s || "");
    var i = s.indexOf("#j=");
    if (i >= 0) s = s.slice(i + 3);
    s = s.replace(/[\uFF01-\uFF5E]/g, function (c) { return String.fromCharCode(c.charCodeAt(0) - 0xFEE0); });
    s = s.replace(/[\s\u200B-\u200D\uFEFF\u00A0]/g, "");
    var ps = [PREFIX].concat(OLD);
    for (var j = 0; j < ps.length; j++) { var k = s.indexOf(ps[j]); if (k >= 0) { s = s.slice(k + ps[j].length); break; } }
    var e = s.indexOf(END);
    if (e >= 0) s = s.slice(0, e);
    var runs = s.match(/[A-Za-z0-9+/=_-]+/g);
    if (runs) s = runs.reduce(function (a, b) { return b.length > a.length ? b : a; }, "");
    return s;
  }
  function parse(input) {
    var s = clean(input);
    if (!s) return { err: "空です。じゅもんかリンクを貼り付けてください" };
    s = s.replace(/-/g, "+").replace(/_/g, "/");
    while (s.length % 4) s += "=";
    var json, o;
    try { json = dec(s); } catch (e) { return { err: "文字が壊れています（" + s.length + "文字）。全部コピーできているか確認してください" }; }
    try { o = JSON.parse(json); } catch (e) { return { err: "途中で切れています（" + s.length + "文字）。最後まで選んでコピーしてください" }; }
    if (!o) return { err: "中身が読めません" };
    if (o.j || o.t || o.ls) return { ls: toRaw(o) };
    // 旧形式（再学習ページが出した ENGv2 / ENGv1）を今の形に寄せる
    var ls = fromOld(o);
    if (!ls) return { err: "このアプリのじゅもんではありません" };
    return { ls: ls };
  }
  // 旧形式は中身を組み立て直す。鍵と形はそのページの実装に合わせる
  function fromOld(o) {
    if (!o.sg) return null;
    var ls = {}, said = {}, need = {}, missT = {}, ansho = {};
    (o.sg.s || []).forEach(function (id) { said[id] = 1; });
    Object.keys(o.sg.n || {}).forEach(function (k) { need[k] = o.sg.n[k]; });
    Object.keys(o.sg.m || {}).forEach(function (k) { missT[k] = o.sg.m[k]; });
    Object.keys(o.sg.a || {}).forEach(function (k) { ansho[k] = o.sg.a[k]; });
    ls["saigaku_v1"] = JSON.stringify({ said: said, need: need, missT: missT, ansho: ansho });
    if (o.kn) {
      var ks = {}, kn = {};
      (o.kn.s || []).forEach(function (id) { ks[id] = 1; });
      Object.keys(o.kn.n || {}).forEach(function (k) { kn[k] = o.kn.n[k]; });
      ls["kanryo_v1"] = JSON.stringify({ said: ks, need: kn });
    }
    if (o.dg) {
      var ans = {};
      Object.keys(o.dg.o || {}).forEach(function (id) { ans[id] = { sel: Number(o.dg.o[id]), ok: true }; });
      Object.keys(o.dg.x || {}).forEach(function (id) { ans[id] = { sel: Number(o.dg.x[id]), ok: false }; });
      ls["engdrill_v1"] = JSON.stringify({ ans: ans });
    }
    if (o.tg) {
      var f = {};
      (o.tg.f1 || []).forEach(function (w) { f[w] = 1; });
      (o.tg.f0 || []).forEach(function (w) { f[w] = 0; });
      ls["tango_first_v1"] = JSON.stringify(f);
      ls["tango_need_v1"] = JSON.stringify(o.tg.n || {});
    }
    Object.keys(o.ex || {}).forEach(function (k) { ls[k] = o.ex[k]; });
    return ls;
  }

  // ---------- 合わせる（上書きしない） ----------
  function isNumMap(o) {
    if (!o || typeof o !== "object" || Array.isArray(o)) return false;
    var ks = Object.keys(o);
    if (!ks.length) return true;
    return ks.every(function (k) { return typeof o[k] === "number"; });
  }
  function mergeValue(oldRaw, newRaw) {
    if (oldRaw == null) return { v: newRaw, how: "入れた" };
    var a, b;
    try { a = JSON.parse(oldRaw); b = JSON.parse(newRaw); } catch (e) { return { v: oldRaw, how: "そのまま" }; }
    if (a && b && typeof a === "object" && typeof b === "object") {
      var out = JSON.parse(JSON.stringify(a)), touched = false;
      Object.keys(b).forEach(function (k) {
        var av = a[k], bv = b[k];
        if (av === undefined) { out[k] = bv; touched = true; return; }
        if (typeof av === "number" && typeof bv === "number") {
          if (bv > av) { out[k] = bv; touched = true; }
          return;
        }
        if (isNumMap(av) && isNumMap(bv)) {                 // {said:{...}} のような入れ子
          Object.keys(bv).forEach(function (k2) {
            if (out[k][k2] === undefined || bv[k2] > out[k][k2]) { out[k][k2] = bv[k2]; touched = true; }
          });
          return;
        }
        if (av && bv && typeof av === "object" && typeof bv === "object") {  // 診断の ans など
          Object.keys(bv).forEach(function (k2) {
            if (out[k][k2] === undefined) { out[k][k2] = bv[k2]; touched = true; }
          });
        }
      });
      return { v: JSON.stringify(out), how: touched ? "合わせた" : "変化なし" };
    }
    return { v: oldRaw, how: "そのまま" };
  }
  function apply(input) {
    var r = parse(input);
    if (r.err) return { err: r.err };
    var keys = Object.keys(r.ls || {});
    if (!keys.length) return { err: "このじゅもんには記録が入っていません。出した側で確かめてください" };
    var added = 0, merged = 0, kept = 0;
    keys.forEach(function (k) {
      var res = mergeValue(localStorage.getItem(k), r.ls[k]);
      try { localStorage.setItem(k, res.v); } catch (e) { return; }
      if (res.how === "入れた") added++;
      else if (res.how === "合わせた") merged++;
      else kept++;
    });
    return { added: added, merged: merged, kept: kept, total: keys.length };
  }

  // ---------- 一覧 ----------
  function inventory() {
    var rows = [];
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i), v = localStorage.getItem(k) || "", n = 0;
      try {
        var o = JSON.parse(v);
        if (o && typeof o === "object") {
          n = Array.isArray(o) ? o.length : Object.keys(o).length;
          if (o.ans) n = Object.keys(o.ans).length;
        }
      } catch (e) { }
      rows.push({ k: k, len: v.length, n: n });
    }
    return rows.sort(function (a, b) { return b.len - a.len; });
  }

  window.Jumon = { pack: pack, link: link, apply: apply, parse: parse, inventory: inventory, pageBase: pageBase };
})();

// ===== 画面（どのページでも同じものが出る） =====
(function () {
  var CSS = ''
    + '#jmWrap{position:fixed;inset:0;z-index:9999;background:rgba(6,10,18,.92);overflow:auto;display:none;'
    + '-webkit-overflow-scrolling:touch}'
    + '#jmWrap.on{display:block}'
    + '#jmBox{max-width:680px;margin:0 auto;padding:18px 16px 60px;color:#e8edf5;'
    + 'font:16px/1.7 -apple-system,"Hiragino Kaku Gothic ProN","Yu Gothic",Meiryo,sans-serif}'
    + '#jmBox h2{font-size:24px;margin:6px 0 4px}'
    + '#jmBox .jm-lead{font-size:15px;color:#9fb0c8;margin-bottom:14px}'
    + '#jmBox .jm-card{background:#1a2233;border:1px solid #2e3a52;border-radius:14px;padding:16px;margin-bottom:14px}'
    + '#jmBox h3{font-size:18px;color:#f1c40f;margin-bottom:8px}'
    + '#jmBox .jm-ver{background:#222d44;border:1px solid #5aa7ff;border-radius:10px;padding:10px 13px;'
    + 'font-size:14px;font-weight:700;color:#5aa7ff;margin-bottom:10px;word-break:break-all}'
    + '#jmBox .jm-note{font-size:13px;color:#9fb0c8;margin-top:6px;line-height:1.8;word-break:break-all}'
    + '#jmBox .jm-warn{background:rgba(231,76,60,.12);border:1px solid #e74c3c;border-radius:10px;'
    + 'padding:12px 14px;font-size:14px;line-height:1.8;margin-bottom:10px}'
    + '#jmBox .jm-warn b{color:#e74c3c}'
    + '#jmBox textarea{width:100%;min-height:92px;background:#0f1420;color:#e8edf5;border:1px solid #2e3a52;'
    + 'border-radius:10px;padding:11px;font-size:14px;line-height:1.6;margin:8px 0;'
    + 'font-family:ui-monospace,SFMono-Regular,Menlo,monospace;resize:vertical}'
    + '#jmBox button.jm-b{width:100%;background:#1a2233;border:1px solid #5aa7ff;color:#5aa7ff;border-radius:10px;'
    + 'padding:12px;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit;margin-top:4px}'
    + '#jmBox button.jm-close{background:#f1c40f;border:none;color:#0f1420;margin-bottom:14px;width:auto;padding:9px 16px}'
    + '#jmBox table{width:100%;border-collapse:collapse;font-size:13px;margin-top:8px}'
    + '#jmBox th,#jmBox td{border:1px solid #2e3a52;padding:6px 8px;text-align:left}'
    + '#jmBox th{color:#9fb0c8}'
    + '#jmBox .jm-ok{color:#2ecc71;font-weight:700}'
    + '#jmBox .jm-ng{color:#e74c3c;font-weight:700}'
    + '#jmToast{position:fixed;left:50%;bottom:26px;transform:translateX(-50%) translateY(20px);z-index:10000;'
    + 'background:#222d44;border:1px solid #5aa7ff;color:#e8edf5;border-radius:10px;padding:12px 18px;'
    + 'font-size:15px;font-weight:700;opacity:0;pointer-events:none;transition:.25s;max-width:92%;text-align:center}'
    + '#jmToast.on{opacity:1;transform:translateX(-50%) translateY(0)}';

  var HTML = ''
    + '<div id="jmBox">'
    + '<button class="jm-b jm-close" onclick="Jumon.close()">← もどる</button>'
    + '<h2>ふっかつのじゅもん</h2>'
    + '<p class="jm-lead">パソコンとスマホで進捗を持ち運ぶ。サーバーには何も送らない。</p>'
    + '<div class="jm-ver" id="jmVer"></div>'
    + '<p class="jm-note">記録はページのURLごとに保存される。ブラウザによっては、ファイルを直接開くとページごとに別々になる。'
    + '<b>だからこの画面はどのページにもあり、いま開いているページから見える記録だけを出す。</b>'
    + '運びたい記録があるページで出すこと。</p>'

    + '<div class="jm-card">'
    + '<h3>① いまの状態を出す</h3>'
    + '<div class="jm-warn" id="jmEmpty" style="display:none"></div>'
    + '<div class="jm-note" id="jmUrl"></div>'
    + '<div id="jmInv"></div>'
    + '<textarea id="jmOut" readonly></textarea>'
    + '<button class="jm-b" onclick="Jumon.copyLink()">🔗 復元リンクをコピーする（おすすめ）</button>'
    + '<div class="jm-note">リンクを自分宛てに送って、もう一方の端末でそのリンクを開くだけで戻る。'
    + '宛先：<b id="jmBase" style="color:#5aa7ff"></b></div>'
    + '<div class="jm-warn" id="jmLong" style="display:none"></div>'
    + '<button class="jm-b" onclick="Jumon.copyCode()">📜 じゅもんの文字列をコピーする</button>'
    + '<div class="jm-note">リンクが使えないときはこちら。</div>'
    + '</div>'

    + '<div class="jm-card">'
    + '<h3>② 別の端末で入れる</h3>'
    + '<textarea id="jmIn" placeholder="ここに じゅもん か 復元リンク を貼り付ける"></textarea>'
    + '<div class="jm-note" id="jmStat"></div>'
    + '<button class="jm-b" onclick="Jumon.doApply()">✨ これで復元する</button>'
    + '<div class="jm-note">いまの記録は消えません。進んでいる方を残す形で合わせます。</div>'
    + '</div>'
    + '</div>';

  var wrap = null;

  function build() {
    if (wrap) return;
    var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);
    wrap = document.createElement("div"); wrap.id = "jmWrap"; wrap.innerHTML = HTML;
    document.body.appendChild(wrap);
    var t = document.createElement("div"); t.id = "jmToast"; document.body.appendChild(t);
    document.getElementById("jmIn").addEventListener("input", check);
  }
  var timer = null;
  function toast(msg) {
    build();
    var el = document.getElementById("jmToast");
    el.textContent = msg; el.className = "on";
    clearTimeout(timer); timer = setTimeout(function () { el.className = ""; }, 3000);
  }
  function copyText(text, msg) {
    function fb() {
      var ta = document.createElement("textarea");
      ta.value = text; ta.style.position = "fixed"; ta.style.top = "-1000px";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); toast(msg); }
      catch (e) { toast("コピーできなかった。枠の中を長押しで選んでください"); }
      document.body.removeChild(ta);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { toast(msg); }, fb);
    } else fb();
  }
  function check() {
    var el = document.getElementById("jmStat");
    var raw = document.getElementById("jmIn").value;
    if (!String(raw).trim()) { el.textContent = ""; return; }
    var r = Jumon.parse(raw);
    if (r.err) { el.innerHTML = '<span class="jm-ng">✕ ' + r.err + '</span>'; return; }
    var ks = Object.keys(r.ls || {});
    if (!ks.length) { el.innerHTML = '<span class="jm-ng">✕ 読めたけれど中身が空です</span>'; return; }
    el.innerHTML = '<span class="jm-ok">◯ 読めました（' + ks.length + '件: ' + ks.join(", ") + '）→ 下のボタンを押す</span>';
  }
  function open() {
    build();
    var code = Jumon.pack();
    document.getElementById("jmOut").value = code;
    document.getElementById("jmVer").textContent =
      "このページの版: " + (typeof APP_VER !== "undefined" ? APP_VER : "不明（ver.jsが読めていない）")
      + " ／ 開き方: " + (location.protocol === "file:" ? "ファイルを直接" : location.host);
    document.getElementById("jmUrl").textContent = "いま開いているページ: " + location.href.split("#")[0];
    var base = Jumon.pageBase();
    document.getElementById("jmBase").textContent = base || "（ver.js の PAGES_BASE が未設定）";

    var inv = Jumon.inventory();
    document.getElementById("jmInv").innerHTML = inv.length
      ? '<table><tr><th>記録の名前</th><th>件数</th><th>大きさ</th></tr>'
      + inv.map(function (r) { return '<tr><td>' + r.k + '</td><td>' + r.n + '</td><td>' + r.len + '</td></tr>'; }).join("")
      + '</table>'
      : '<div class="jm-note">このページには記録が1件もありません。</div>';

    // 長すぎるリンクはメールで折り返されて壊れる。そのときは文字列で送る方が確実
    var lg = document.getElementById("jmLong");
    var lk = Jumon.link();
    if (lk && lk.length > 3500) {
      lg.style.display = "block";
      lg.innerHTML = "⚠️ リンクが長い（" + lk.length + "文字）。メールやメモで折り返されると壊れます。"
        + "<b>この長さなら下の「じゅもんの文字列」で送る方が確実</b>（貼り付けなら折り返されても読めます）。";
    } else lg.style.display = "none";

    var w = document.getElementById("jmEmpty");
    if (!inv.length) {
      w.style.display = "block";
      w.innerHTML = "⚠️ <b>このページには記録がありません。</b>このまま送っても相手側で空になります。<br>"
        + "ドリルをやったページ（診断・完了形・再学習・単語のどれか）を開いて、そこでこの画面を出してください。";
    } else w.style.display = "none";

    wrap.className = "on";
    document.body.style.overflow = "hidden";
  }
  function close() {
    if (wrap) wrap.className = "";
    document.body.style.overflow = "";
    if (location.hash && history.replaceState) history.replaceState(null, "", location.pathname);
  }
  function doApply(src) {
    var raw = (src != null) ? src : document.getElementById("jmIn").value;
    var r = Jumon.apply(raw);
    if (r.err) { toast(r.err); return; }
    toast("✨ 復元した（入れた " + r.added + "件 / 合わせた " + r.merged + "件 / そのまま " + r.kept + "件）。開き直すと反映されます");
    setTimeout(function () { location.reload(); }, 1800);
  }

  Jumon.open = open; Jumon.close = close; Jumon.doApply = doApply;
  Jumon.copyLink = function () {
    var u = Jumon.link();
    if (!u) { toast("公開URLが未設定です。ver.js の PAGES_BASE を書いてください"); return; }
    copyText(u, "🔗 リンクをコピーした。もう一方の端末で開くだけで戻る");
  };
  Jumon.copyCode = function () { copyText(Jumon.pack(), "📜 じゅもんをコピーした。相手側の②に貼る"); };

  function byHash() {
    var h = location.hash || "";
    if (h === "#jumon") { open(); return; }
    if (h.indexOf("#j=") === 0) {
      var code = h.slice(3);
      if (history.replaceState) history.replaceState(null, "", location.pathname);
      build(); doApply(code);
    }
  }
  window.addEventListener("hashchange", byHash);
  document.addEventListener("DOMContentLoaded", byHash);
})();
