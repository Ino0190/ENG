// 全ページ共通の設定。ここだけ書き換えれば5ページ全部に反映される。
//
// APP_VER   版の表示。スマホとパソコンで違うファイルを見ていないかの切り分けに使う
//           （画面の右上に出る。出ない＝古いファイル）
// PAGES_URL 公開URL。パソコンでファイルを直接開いているときは自分のURLが使えないので、
//           復元リンクをこのURLで組み立てる。
//           🔴 リポジトリ名を変えたらここを直す。直さないとリンクが404になる。
const APP_VER = "v8 (2026-09-23)";
const PAGES_BASE = "https://ino0190.github.io/ENG/";

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".appver").forEach(function (el) {
    el.textContent = APP_VER;
  });
});
