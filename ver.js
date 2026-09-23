// 全ページ共通の版表示。ここだけ書き換えれば5ページ全部に反映される。
// スマホとパソコンで違うファイルを見ていないかの切り分けに使う（出ない＝古いファイル）。
const APP_VER = "v3 (2026-09-23)";

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".appver").forEach(function (el) {
    el.textContent = APP_VER;
  });
});
