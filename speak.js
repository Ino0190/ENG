// 英文の読み上げ（全ページ共通）
//
// 狙い: できるだけ自然な声で、正解の文をそのまま耳に入れる。
//
// スマホで引っかかる点:
//   ・getVoices() は最初は空。voiceschanged を待つ必要がある。
//   ・iOSは最初の1回をタップの中で鳴らさないと無音になる。だから解答のタップで鳴らす。
//   ・cancel() しないと連打で溜まる。
//   ・iPhone本体のマナーモード（着信/消音スイッチ）で鳴らないことがある。これは画面側では直せない。
//
// 声の選び方: 名前とネットワーク声かどうかで点数を付けて一番高いものを使う。
//   端末によって入っている声が違うので、決め打ちしない。

(function () {
  var KEY = "eng_speak_v1";
  var voice = null, ready = false, warmed = false;

  function pref() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; }
  }
  function savePref(p) { try { localStorage.setItem(KEY, JSON.stringify(p)); } catch (e) { } }
  function enabled() { return pref().off !== 1; }

  // 名前に点を付ける。上にあるほど自然なことが多い
  var GOOD = [
    [/premium/i, 60], [/enhanced/i, 50], [/siri/i, 45],
    [/\bava\b/i, 35], [/\bsamantha\b/i, 30], [/\ballison\b/i, 28],
    [/\bnicky\b/i, 26], [/\bjoelle\b/i, 26], [/\bnoelle\b/i, 24],
    [/google us english/i, 34], [/google uk english female/i, 30],
    [/\bdaniel\b/i, 20], [/\bkaren\b/i, 18], [/\bmoira\b/i, 14]
  ];
  function score(v) {
    var s = 0, n = v.name || "";
    GOOD.forEach(function (g) { if (g[0].test(n)) s += g[1]; });
    if (v.localService === false) s += 15;           // ネットワーク声は概して自然
    if (/^en[-_]US/i.test(v.lang)) s += 10;
    else if (/^en[-_]GB/i.test(v.lang)) s += 6;
    if (/compact|eloquence/i.test(n)) s -= 40;       // 軽量版は機械的
    return s;
  }
  function pick() {
    if (!window.speechSynthesis) return null;
    var all = speechSynthesis.getVoices() || [];
    var en = all.filter(function (v) { return /^en/i.test(v.lang || ""); });
    if (!en.length) return null;
    var want = pref().voice;
    if (want) {
      var hit = en.filter(function (v) { return v.name === want; })[0];
      if (hit) return hit;
    }
    return en.slice().sort(function (a, b) { return score(b) - score(a); })[0];
  }
  function refresh() { voice = pick(); ready = !!voice; render(); }

  if (window.speechSynthesis) {
    refresh();
    speechSynthesis.addEventListener
      ? speechSynthesis.addEventListener("voiceschanged", refresh)
      : (speechSynthesis.onvoiceschanged = refresh);
    setTimeout(refresh, 300);   // 端末によっては通知が来ないので念のため
  }

  function say(text, opt) {
    if (!window.speechSynthesis || !enabled() || !text) return;
    opt = opt || {};
    var t = String(text).replace(/\s+/g, " ").trim();
    if (!t) return;
    try {
      speechSynthesis.cancel();
      if (!voice) refresh();
      // iOSは最初の発話をタップの中で起こさないと以後も無音になる
      if (!warmed) {
        warmed = true;
        var w = new SpeechSynthesisUtterance(" ");
        w.volume = 0; if (voice) w.voice = voice;
        speechSynthesis.speak(w);
      }
      var u = new SpeechSynthesisUtterance(t);
      if (voice) { u.voice = voice; u.lang = voice.lang; }
      else u.lang = "en-US";
      u.rate = opt.slow ? 0.7 : 1;    // 自然さを優先。聞き取れないときだけ ゆっくり
      u.pitch = 1;
      speechSynthesis.speak(u);
    } catch (e) { }
  }

  // ---------- 切り替えボタン ----------
  function render() {
    var els = document.querySelectorAll(".speakbtn");
    for (var i = 0; i < els.length; i++) {
      els[i].textContent = enabled() ? "🔊 読み上げ オン" : "🔇 読み上げ オフ";
      els[i].title = voice ? ("声: " + voice.name + "（" + voice.lang + "）") : "使える英語の声が見つかりません";
    }
  }
  function toggle() {
    var p = pref();
    p.off = enabled() ? 1 : 0;
    savePref(p);
    render();
    if (enabled()) say("Reading is on.");
  }
  function voiceName() { return voice ? voice.name + "（" + voice.lang + "）" : "なし"; }

  // 正解の文を組み立てて読む（空所つきの英文＋入る語）
  function sayFilled(en, fill) {
    if (!en) return;
    var t = String(en).replace(/_{2,}/, fill || "").replace(/\s+/g, " ");
    say(t);
  }

  window.Speak = {
    say: say, sayFilled: sayFilled, toggle: toggle, enabled: enabled,
    voiceName: voiceName, render: render, refresh: refresh
  };
  document.addEventListener("DOMContentLoaded", render);
})();

// ===== 声を選ぶ小さい画面（🔊ボタンで開く） =====
// 端末によって入っている声が違い、自然さもかなり違う。自動で選んだものが気に入らないときに選び直せるようにする。
(function () {
  var CSS = ''
    + '#spWrap{position:fixed;inset:0;z-index:9998;background:rgba(6,10,18,.92);overflow:auto;display:none}'
    + '#spWrap.on{display:block}'
    + '#spBox{max-width:620px;margin:0 auto;padding:18px 16px 60px;color:#e8edf5;'
    + 'font:16px/1.7 -apple-system,"Hiragino Kaku Gothic ProN","Yu Gothic",Meiryo,sans-serif}'
    + '#spBox h2{font-size:24px;margin:6px 0 10px}'
    + '#spBox .sp-note{font-size:14px;color:#9fb0c8;line-height:1.8;margin:10px 0}'
    + '#spBox .sp-b{width:100%;background:#1a2233;border:1px solid #5aa7ff;color:#5aa7ff;border-radius:10px;'
    + 'padding:12px;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit;margin-bottom:10px}'
    + '#spBox .sp-b.main{background:#f1c40f;border-color:#f1c40f;color:#0f1420}'
    + '#spBox .sp-v{display:flex;gap:8px;align-items:center;background:#1a2233;border:1px solid #2e3a52;'
    + 'border-radius:10px;padding:11px 13px;margin-bottom:7px;cursor:pointer;font-size:15px}'
    + '#spBox .sp-v.on{border-color:#f1c40f;background:#222d44}'
    + '#spBox .sp-v .nm{flex:1;font-weight:700}'
    + '#spBox .sp-v .lg{font-size:13px;color:#9fb0c8}'
    + '#spBox .sp-v .pl{background:none;border:1px solid #5aa7ff;color:#5aa7ff;border-radius:8px;'
    + 'padding:5px 10px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit}';

  var wrap = null;
  var SAMPLE = "I finished writing the report.";

  function build() {
    if (wrap) return;
    var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);
    wrap = document.createElement("div"); wrap.id = "spWrap";
    wrap.innerHTML = '<div id="spBox">'
      + '<button class="sp-b main" onclick="Speak.closePanel()">← もどる</button>'
      + '<h2>読み上げの設定</h2>'
      + '<button class="sp-b" id="spToggle" onclick="Speak.toggle();Speak.renderPanel()"></button>'
      + '<div class="sp-note" id="spNow"></div>'
      + '<div id="spList"></div>'
      + '<div class="sp-note">自然さは端末に入っている声で決まります。'
      + 'iPhoneなら <b>設定 → アクセシビリティ → 読み上げコンテンツ → 声 → 英語</b> で高品質な声を追加できます。'
      + '追加したらこの画面に出てくるので選び直してください。<br>'
      + '本体の消音スイッチがオンだと鳴らないことがあります。</div>'
      + '</div>';
    document.body.appendChild(wrap);
  }
  function enVoices() {
    if (!window.speechSynthesis) return [];
    return (speechSynthesis.getVoices() || []).filter(function (v) { return /^en/i.test(v.lang || ""); });
  }
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  // 声の名前は属性に直接書かず data 属性に入れる（引用符や記号が入っていても壊れない）
  function renderPanel() {
    build();
    document.getElementById("spToggle").textContent =
      Speak.enabled() ? "🔊 読み上げ オン（押すとオフ）" : "🔇 読み上げ オフ（押すとオン）";
    document.getElementById("spNow").innerHTML = "いま使っている声: <b>" + esc(Speak.voiceName()) + "</b>";
    var cur = Speak.voiceName().split("（")[0];
    var list = document.getElementById("spList");
    list.innerHTML = enVoices().map(function (v) {
      return '<div class="sp-v' + (v.name === cur ? ' on' : '') + '" data-v="' + esc(v.name) + '">'
        + '<span class="nm">' + (v.name === cur ? "✓ " : "") + esc(v.name) + '</span>'
        + '<span class="lg">' + esc(v.lang) + (v.localService === false ? " / ネット" : "") + '</span>'
        + '<button class="pl" data-try="' + esc(v.name) + '">▶ 試す</button>'
        + '</div>';
    }).join("") || '<div class="sp-note">この端末に英語の声が見つかりません。</div>';
    if (!list.__wired) {
      list.__wired = true;
      list.addEventListener("click", function (ev) {
        var t = ev.target.closest("[data-try]");
        if (t) { ev.stopPropagation(); Speak.trial(t.getAttribute("data-try")); return; }
        var row = ev.target.closest("[data-v]");
        if (row) Speak.useVoice(row.getAttribute("data-v"));
      });
    }
  }
  Speak.openPanel = function () { renderPanel(); wrap.className = "on"; document.body.style.overflow = "hidden"; };
  Speak.closePanel = function () { if (wrap) wrap.className = ""; document.body.style.overflow = ""; };
  Speak.renderPanel = renderPanel;
  Speak.useVoice = function (name) {
    var p = {}; try { p = JSON.parse(localStorage.getItem("eng_speak_v1")) || {}; } catch (e) { }
    p.voice = name; p.off = 0;
    try { localStorage.setItem("eng_speak_v1", JSON.stringify(p)); } catch (e) { }
    Speak.refresh(); renderPanel(); Speak.say(SAMPLE);
  };
  Speak.trial = function (name) {
    var v = enVoices().filter(function (x) { return x.name === name; })[0];
    if (!v || !window.speechSynthesis) return;
    try {
      speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(SAMPLE);
      u.voice = v; u.lang = v.lang; u.rate = 1;
      speechSynthesis.speak(u);
    } catch (e) { }
  };
})();
