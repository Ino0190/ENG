// 全ページ共通のヘッダーとメニュー。
//
// 画面の上にメニューが3段（タイトル・ページ移動・版と読み上げ）並んでいたのを1段にまとめた。
// ページ移動・読み上げ・じゅもん・リセットは ☰ の中に入れて、普段は出さない。
//
// 各ページがやること:
//   <header id="apphdr" data-title="🧱 再学習"></header> を置く
//   <script src="menu.js"></script> を ver.js のあとに読む
//   記録を消せるページは window.__resetAll = resetAll; を定義する（無ければ項目を出さない）
//
// 版は ☰ を開かなくても見える位置に小さく出す（出ない＝古いファイル、の切り分けに使う）。
(function () {
  const PAGES = [
    { f: "index.html",      t: "▶ 診断" },
    { f: "kanryo.html",     t: "⏳ 完了形" },
    { f: "saigakushu.html", t: "🧱 再学習" },
    { f: "bunpo.html",      t: "📖 解説" },
    { f: "tango.html",      t: "🎴 単語" }
  ];
  const cur = (location.pathname.split("/").pop() || "index.html").toLowerCase();

  const CSS = `
header#apphdr{position:sticky;top:0;z-index:20;background:rgba(15,20,32,.96);backdrop-filter:blur(8px);
  border-bottom:1px solid var(--line);padding:0;display:block}
#apphdr .hbar{display:flex;align-items:center;gap:8px;padding:9px 14px}
#apphdr .htitle{font-size:16px;font-weight:700;color:var(--accent);white-space:nowrap}
#apphdr .hstat{flex:1;text-align:right;font-size:13px;color:var(--sub);min-width:0;overflow:hidden;white-space:nowrap}
#apphdr .hver{font-size:11px;color:var(--sub);opacity:.75;white-space:nowrap}
#apphdr .hbtn{flex:0 0 auto;background:transparent;border:1px solid var(--line);color:var(--text);
  border-radius:9px;width:38px;height:32px;font-size:16px;line-height:1;cursor:pointer;font-family:inherit}
#apphdr .hbtn:active{transform:scale(.96)}
#apphdr .bar{margin:0 14px 9px}
#hpanel{display:none;border-top:1px solid var(--line);padding:12px 14px 14px;background:var(--card)}
#hpanel.on{display:block}
#hpanel .grp{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px}
#hpanel a.mi,#hpanel button.mi{display:block;background:var(--card2);border:1px solid var(--line);
  color:var(--text);text-decoration:none;border-radius:10px;padding:9px 12px;font-size:15px;
  cursor:pointer;font-family:inherit;white-space:nowrap}
#hpanel button.mi{width:100%;text-align:left}
#hpanel .rows{display:flex;flex-direction:column;gap:8px;margin-bottom:12px}
#hpanel .mi.warn{border-color:var(--ng);color:var(--ng)}
#hpanel .note{font-size:12px;color:var(--sub);line-height:1.6}
#hpanel .lbl{font-size:12px;color:var(--sub);margin-bottom:6px}
`;

  function el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  // ヘッダーの枠だけ先に作る。
  // 🔴 中身（ページ移動・道具・版）は ☰ を押した時点で作る。
  //    menu.js は header の直後で読むので、ver.js / speak.js / jumon.js / __resetAll より
  //    先に走ることがある。この時点でそれらを見に行くと「版なし・道具ゼロ」になる。
  function build() {
    const hdr = document.getElementById("apphdr");
    if (!hdr) return;
    document.head.appendChild(el("style", null, CSS));

    const bar = el("div", "hbar");
    bar.appendChild(el("div", "htitle", hdr.dataset.title || "英文法ドリル"));
    const stat = el("div", "hstat");
    stat.id = "hstat";
    bar.appendChild(stat);
    const hv = el("div", "hver", "…");
    hv.id = "hver";
    bar.appendChild(hv);
    const btn = el("button", "hbtn", "☰");
    btn.setAttribute("aria-label", "メニュー");
    btn.onclick = function () { window.Menu.toggle(); };
    bar.appendChild(btn);
    hdr.appendChild(bar);

    // data-bar="1" のページは進捗バーを1本出す（診断ページが使う。CSSはページ側にある）
    if (hdr.dataset.bar) hdr.appendChild(el("div", "bar", '<i id="hbar"></i>'));

    const pan = el("div");
    pan.id = "hpanel";
    hdr.appendChild(pan);
  }

  // 版は読み込みが済んだあとに入れる（出ない＝古いファイル、の切り分けに使う）
  function fillVer() {
    const hv = document.getElementById("hver");
    if (!hv) return;
    const ver = (typeof APP_VER === "string") ? APP_VER : "";
    hv.textContent = ver ? (ver.split(" ")[0]) : "版なし";
  }

  // パネルの中身。開くときに1回だけ作る。
  function fillPanel() {
    const pan = document.getElementById("hpanel");
    if (!pan || pan.dataset.built) return;
    pan.dataset.built = "1";

    // ページ移動（いま開いているページは出さない）
    pan.appendChild(el("div", "lbl", "ページ"));
    const grp = el("div", "grp");
    PAGES.forEach(p => {
      if (p.f.toLowerCase() === cur) return;
      const a = el("a", "mi", p.t);
      a.href = p.f;
      grp.appendChild(a);
    });
    pan.appendChild(grp);

    // 道具（読み上げ・じゅもん・リセット）
    const rows = el("div", "rows");
    if (window.Speak) {
      const b = el("button", "mi", "🔊 読み上げの設定");
      b.onclick = function () { window.Menu.close(); window.Speak.openPanel(); };
      rows.appendChild(b);
    }
    if (window.Jumon) {
      const b = el("button", "mi", "📜 ふっかつのじゅもん（進捗を持ち運ぶ）");
      b.onclick = function () { window.Menu.close(); window.Jumon.open(); };
      rows.appendChild(b);
    }
    if (typeof window.__resetAll === "function") {
      const b = el("button", "mi warn", "🗑 このページの記録を消す");
      b.onclick = function () { window.Menu.close(); window.__resetAll(); };
      rows.appendChild(b);
    }
    pan.appendChild(rows);

    const ver = (typeof APP_VER === "string") ? APP_VER : "";
    const how = (location.protocol === "file:") ? "ファイルを直接開いている" : location.host;
    pan.appendChild(el("div", "note", "版 " + (ver || "（出ない＝古いファイル）") + "<br>開き方: " + how));
  }

  window.Menu = {
    open: function () {
      fillPanel();
      const p = document.getElementById("hpanel"); if (p) p.className = "on";
    },
    close: function () { const p = document.getElementById("hpanel"); if (p) p.className = ""; },
    toggle: function () {
      const p = document.getElementById("hpanel");
      if (!p) return;
      if (p.className === "on") p.className = "";
      else window.Menu.open();
    }
  };

  // header のあとに読まれていれば即作る。ページ側のスクリプトが #hstat を触るので待てない。
  if (document.getElementById("apphdr")) build();
  else if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
  else build();

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fillVer);
  else fillVer();
})();
