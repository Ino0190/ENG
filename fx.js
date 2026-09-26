// 正解・不正解のエフェクト。全ページ共通（window.FX）。
//
// 方針
//   ・正解は派手に、不正解は控えめに。不正解で派手に揺らすと、選ぶのが怖くなって手が止まる
//   ・連続正解で段階的に大きくする（3 / 5 / 10連続）。1問ごとより「続けたくなる」方が効く
//   ・いちばん大きいのは「定着」（3回連続正解で消えた瞬間）。ここがドリルのゴール
//   ・音は出さない。答えた瞬間に英文の読み上げが鳴るので、効果音とぶつかる
//   ・演出は0.8秒以内。次の問題に進むテンポを落とさない
//   ・OSの「視差効果を減らす」がオンなら、粒は出さずに色と文字だけにする
//
// 使い方（各ページの answer() の中で）
//   FX.hit(ok, 押した要素, {master: 定着したか})
//   FX.hit(false, el, {quiet:true})  … 連続だけ切って演出は出さない（「言えなかった」の自己申告）
//
// 設定は localStorage の eng_fx_v1（"off" で止まる）。☰ メニューから切り替える。
(function () {
  const KEY = "eng_fx_v1";
  const COLORS = ["#2ecc71", "#f1c40f", "#5aa7ff", "#ffffff"];
  const GOLD = ["#f1c40f", "#ffd866", "#fff3b0", "#ffffff"];
  let streak = 0;
  let cv = null, ctx = null, parts = [], raf = 0;

  const reduce = () => window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const enabled = () => { try { return localStorage.getItem(KEY) !== "off"; } catch (e) { return true; } };

  const CSS = `
@keyframes fxPop{0%{transform:scale(1)}35%{transform:scale(1.045)}100%{transform:scale(1)}}
@keyframes fxRing{0%{box-shadow:0 0 0 0 rgba(46,204,113,.75)}100%{box-shadow:0 0 0 16px rgba(46,204,113,0)}}
@keyframes fxRingGold{0%{box-shadow:0 0 0 0 rgba(241,196,15,.9)}100%{box-shadow:0 0 0 26px rgba(241,196,15,0)}}
@keyframes fxShake{0%,100%{transform:translateX(0)}20%{transform:translateX(-6px)}40%{transform:translateX(5px)}60%{transform:translateX(-3px)}80%{transform:translateX(2px)}}
@keyframes fxHint{0%{box-shadow:0 0 0 0 rgba(46,204,113,.55)}100%{box-shadow:0 0 0 10px rgba(46,204,113,0)}}
@keyframes fxBadge{0%{opacity:0;transform:translate(-50%,8px) scale(.7)}18%{opacity:1;transform:translate(-50%,0) scale(1.08)}30%{transform:translate(-50%,0) scale(1)}78%{opacity:1}100%{opacity:0;transform:translate(-50%,-10px) scale(1)}}
@keyframes fxFlash{0%{opacity:0}25%{opacity:1}100%{opacity:0}}
.fx-pop{animation:fxPop .38s ease-out,fxRing .6s ease-out}
.fx-pop-gold{animation:fxPop .45s ease-out,fxRingGold .8s ease-out}
.fx-shake{animation:fxShake .32s ease-in-out}
.fx-hint{animation:fxHint .7s ease-out .15s}
#fxcv{position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:60}
#fxbadge{position:fixed;left:50%;top:84px;z-index:61;pointer-events:none;white-space:nowrap;
  font-weight:800;letter-spacing:.02em;border-radius:999px;padding:8px 18px;font-size:18px;
  background:rgba(15,20,32,.92);border:2px solid #2ecc71;color:#2ecc71;opacity:0;
  box-shadow:0 6px 24px rgba(0,0,0,.35)}
#fxbadge.on{animation:fxBadge 1.1s ease-out forwards}
#fxbadge.lv2{font-size:21px;border-color:#f1c40f;color:#f1c40f}
#fxbadge.lv3{font-size:24px;border-color:#f1c40f;color:#0f1420;background:#f1c40f}
#fxflash{position:fixed;inset:0;pointer-events:none;z-index:59;opacity:0}
#fxflash.ok{box-shadow:inset 0 0 90px rgba(46,204,113,.35)}
#fxflash.gold{box-shadow:inset 0 0 120px rgba(241,196,15,.45)}
#fxflash.ng{box-shadow:inset 0 0 70px rgba(231,76,60,.22)}
#fxflash.on{animation:fxFlash .55s ease-out}
`;

  function setup() {
    if (document.getElementById("fxcv")) return;
    const st = document.createElement("style");
    st.textContent = CSS;
    document.head.appendChild(st);
    cv = document.createElement("canvas");
    cv.id = "fxcv";
    document.body.appendChild(cv);
    ctx = cv.getContext("2d");
    const b = document.createElement("div"); b.id = "fxbadge"; document.body.appendChild(b);
    const f = document.createElement("div"); f.id = "fxflash"; document.body.appendChild(f);
    resize();
    window.addEventListener("resize", resize);
  }
  function resize() {
    if (!cv) return;
    const d = window.devicePixelRatio || 1;
    cv.width = Math.round(innerWidth * d);
    cv.height = Math.round(innerHeight * d);
    ctx.setTransform(d, 0, 0, d, 0, 0);
  }

  // アニメーションのクラスは付け直さないと2回目が再生されない
  function replay(el, cls) {
    if (!el) return;
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
    setTimeout(() => el.classList.remove(cls), 900);
  }

  // ===== 粒 =====
  function burst(x, y, n, colors, power) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const v = (2.2 + Math.random() * 3.6) * power;
      parts.push({
        x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 1.8 * power,
        w: 3 + Math.random() * 4, h: 7 + Math.random() * 7,
        r: Math.random() * Math.PI, vr: (Math.random() - .5) * .35,
        c: colors[(Math.random() * colors.length) | 0],
        life: 0, max: 42 + Math.random() * 20
      });
    }
    run();
  }
  // 画面の上から降らせる（10連続・定着の大きい演出）
  function rain(n, colors) {
    for (let i = 0; i < n; i++) {
      parts.push({
        x: Math.random() * innerWidth, y: -20 - Math.random() * innerHeight * .4,
        vx: (Math.random() - .5) * 2, vy: 2 + Math.random() * 3,
        w: 4 + Math.random() * 4, h: 8 + Math.random() * 8,
        r: Math.random() * Math.PI, vr: (Math.random() - .5) * .3,
        c: colors[(Math.random() * colors.length) | 0],
        life: 0, max: 80 + Math.random() * 30
      });
    }
    run();
  }
  function run() {
    if (raf) return;
    const step = () => {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      parts = parts.filter(p => p.life < p.max);
      for (const p of parts) {
        p.life++;
        p.vy += 0.16;            // 重力
        p.vx *= 0.985;
        p.x += p.vx; p.y += p.vy; p.r += p.vr;
        const t = p.life / p.max;
        ctx.globalAlpha = t < .7 ? 1 : 1 - (t - .7) / .3;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.r);
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      ctx.globalAlpha = 1;
      if (parts.length) raf = requestAnimationFrame(step);
      else { raf = 0; ctx.clearRect(0, 0, innerWidth, innerHeight); }
    };
    raf = requestAnimationFrame(step);
  }

  function badge(text, lv) {
    const b = document.getElementById("fxbadge");
    b.textContent = text;
    b.className = lv > 1 ? "lv" + lv : "";
    void b.offsetWidth;
    b.className += " on";
  }
  function flash(kind) {
    const f = document.getElementById("fxflash");
    f.className = kind;
    void f.offsetWidth;
    f.className = kind + " on";
  }
  function buzz(p) { try { if (navigator.vibrate) navigator.vibrate(p); } catch (e) {} }
  function center(el) {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  function hit(ok, el, opt) {
    opt = opt || {};
    if (!ok) streak = 0; else streak++;
    if (!enabled() || opt.quiet) return;
    setup();
    const calm = reduce();

    if (!ok) {
      // 不正解は控えめ。押した方を軽く揺らし、正解の方をそっと光らせる
      if (!calm) replay(el, "fx-shake");
      replay(document.querySelector(".opt.correct"), "fx-hint");
      flash("ng");
      return;
    }

    const c = el ? center(el) : { x: innerWidth / 2, y: innerHeight / 2 };

    if (opt.master) {
      // 定着＝いちばん大きい
      replay(el, "fx-pop-gold");
      flash("gold");
      badge("定着 ✓", 3);
      if (!calm) { burst(c.x, c.y, 46, GOLD, 1.35); rain(70, GOLD.concat(COLORS)); }
      buzz([18, 40, 18]);
      return;
    }

    replay(el, "fx-pop");
    if (streak >= 10 && streak % 5 === 0) {
      flash("gold");
      badge(streak + "連続", 3);
      if (!calm) { burst(c.x, c.y, 40, GOLD, 1.3); rain(55, COLORS); }
      buzz([15, 30, 15]);
    } else if (streak === 5) {
      flash("gold");
      badge("5連続", 2);
      if (!calm) burst(c.x, c.y, 36, GOLD.concat(COLORS), 1.2);
      buzz(15);
    } else if (streak >= 3) {
      flash("ok");
      badge(streak + "連続", streak >= 5 ? 2 : 1);
      if (!calm) burst(c.x, c.y, 26, COLORS, 1);
      buzz(10);
    } else {
      flash("ok");
      if (!calm) burst(c.x, c.y, 16, COLORS, .85);
      buzz(8);
    }
  }

  window.FX = {
    hit,
    streak: () => streak,
    reset: () => { streak = 0; },
    enabled,
    setEnabled: v => { try { localStorage.setItem(KEY, v ? "on" : "off"); } catch (e) {} }
  };
})();
