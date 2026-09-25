// ENG_Drill データ検証: node ENG_Drill/_check.js
const fs=require("fs"),path=require("path");
const src=fs.readFileSync(path.join(__dirname,"questions.js"),"utf8");
const ctx={};new Function("with(this){"+src+"; this.UNITS=UNITS; this.QUESTIONS=QUESTIONS;}").call(ctx);
const {UNITS,QUESTIONS}=ctx;
let errs=[];
const uids=new Set(UNITS.map(u=>u.id));
if(uids.size!==UNITS.length)errs.push("UNITS idに重複");
const ids=new Set();
const perUnit={};
for(const q of QUESTIONS){
  if(ids.has(q.id))errs.push("id重複: "+q.id);ids.add(q.id);
  if(!uids.has(q.u))errs.push("id"+q.id+": 未定義unit "+q.u);
  perUnit[q.u]=(perUnit[q.u]||0)+1;
  for(const k of["jp","en","o","why","elim"])if(!q[k])errs.push("id"+q.id+": "+k+"欠落");
  if(!q.en.includes("___"))errs.push("id"+q.id+": 空所___なし");
  if(!Array.isArray(q.o)||q.o.length!==4)errs.push("id"+q.id+": 選択肢が4つでない");
  if(typeof q.a!=="number"||q.a<0||q.a>3)errs.push("id"+q.id+": answer範囲外 "+q.a);
  const set=new Set(q.o.map(s=>s.trim()));
  if(set.size!==q.o.length)errs.push("id"+q.id+": 選択肢に重複");
}
// 基本(lv未指定=1)は単元ごと3問。追加(lv:2＝間違えたら解放)は 0問 か 2問
const dLv1={},dLv2={};
for(const q of QUESTIONS){
  if((q.lv||1)===1)dLv1[q.u]=(dLv1[q.u]||0)+1;
  else if(q.lv===2)dLv2[q.u]=(dLv2[q.u]||0)+1;
  else errs.push("id"+q.id+": 未知のlv "+q.lv);
}
for(const u of UNITS){
  if((dLv1[u.id]||0)!==3)errs.push("unit "+u.id+": 基本の問題数"+(dLv1[u.id]||0)+"（3であるべき）");
  const n2=dLv2[u.id]||0;
  if(n2!==0&&n2!==2)errs.push("unit "+u.id+": 追加の問題数"+n2+"（0か2であるべき）");
}
// 正解位置の偏りチェック（情報表示のみ・アプリ側で表示時シャッフルする）
const dist=[0,0,0,0];QUESTIONS.forEach(q=>dist[q.a]++);
const nLv1=QUESTIONS.filter(q=>(q.lv||1)===1).length;
const nLv2=QUESTIONS.filter(q=>q.lv===2).length;
console.log("単元数:",UNITS.length," 問題数:",QUESTIONS.length,
  "（診断"+nLv1+" ＋間違えたら解放"+nLv2+"／追加つき単元"+Object.keys(dLv2).length+"）",
  " 正解位置 A/B/C/D =",dist.join("/"));

// ===== words.js（単語amida） =====
const wsrc=fs.readFileSync(path.join(__dirname,"words.js"),"utf8");
const wctx={};new Function("with(this){"+wsrc+"; this.WORD_DECKS=WORD_DECKS; this.WORDS=WORDS;}").call(wctx);
const {WORD_DECKS,WORDS}=wctx;
const dids=new Set(WORD_DECKS.map(d=>d.id));
const wset=new Set();
for(const w of WORDS){
  if(wset.has(w.w))errs.push("単語重複: "+w.w);wset.add(w.w);
  if(!dids.has(w.deck))errs.push(w.w+": 未定義deck "+w.deck);
  for(const k of["jp","hook","ex","exjp"])if(!w[k])errs.push(w.w+": "+k+"欠落");
  // 例文中に単語（またはexwの形）が含まれるか＝ハイライトが効くか
  const base=(w.exw||w.w).toLowerCase();
  if(!w.ex.toLowerCase().includes(base))errs.push(w.w+": 例文に語形 "+base+" が見つからない（exw指定が必要）");
}
for(const d of WORD_DECKS){
  const n=WORDS.filter(w=>w.deck===d.id).length;
  if(n<2)errs.push("deck "+d.id+": 単語"+n+"語（2択が作れない）");
}
console.log("単語デッキ:",WORD_DECKS.length," 単語数:",WORDS.length);

// ===== bunpo.html（BUNPO配列と単元の対応） =====
const bhtml=fs.readFileSync(path.join(__dirname,"bunpo.html"),"utf8");
const bm=bhtml.match(/const BUNPO=(\[[\s\S]*?\n\]);/);
if(!bm){errs.push("bunpo.html: BUNPO配列が見つからない");}
else{
  const BUNPO=new Function("return "+bm[1])();
  const bset=new Set(BUNPO.map(b=>b.u));
  for(const u of ctx.UNITS)if(!bset.has(u.id))errs.push("bunpo: 単元 "+u.id+" の解説がない");
  for(const b of BUNPO){
    if(!uids.has(b.u))errs.push("bunpo: 未定義unit "+b.u);
    for(const k of["t","term","core","ex","trap"])if(!b[k])errs.push("bunpo "+b.u+": "+k+"欠落");
  }
  console.log("解説:",BUNPO.length+"単元");
}

// ===== kanryo.js（現在完了ドリル） =====
const ksrc=fs.readFileSync(path.join(__dirname,"kanryo.js"),"utf8");
const kctx={};new Function("with(this){"+ksrc+"; this.KTYPES=KTYPES; this.KSENTS=KSENTS;}").call(kctx);
const {KTYPES,KSENTS}=kctx;
const ktids=new Set(KTYPES.map(t=>t.id));
if(ktids.size!==KTYPES.length)errs.push("KTYPES idに重複");
for(const t of KTYPES)for(const k of["name","form","cue","core","ng"])if(!t[k])errs.push("KTYPE "+t.id+": "+k+"欠落");
const kids=new Set(),perType={};
for(const s of KSENTS){
  if(kids.has(s.id))errs.push("KSENTS id重複: "+s.id);kids.add(s.id);
  if(!ktids.has(s.t))errs.push("文"+s.id+": 未定義type "+s.t);
  perType[s.t]=(perType[s.t]||0)+1;
  for(const k of["jp","en","blank","why"])if(!s[k])errs.push("文"+s.id+": "+k+"欠落");
  if(!Array.isArray(s.o)||s.o.length!==4)errs.push("文"+s.id+": 選択肢が4つでない");
  if(s.o&&s.o[0]!==s.blank)errs.push("文"+s.id+": o[0]がblankと不一致（o[0]が正解の約束）");
  if(s.en&&s.blank&&!s.en.includes(s.blank))errs.push("文"+s.id+": blank「"+s.blank+"」が英文にない＝空所を作れない");
  if(s.o){const st=new Set(s.o.map(x=>x.trim()));if(st.size!==s.o.length)errs.push("文"+s.id+": 選択肢に重複");}
  if(s.cue&&!s.en.includes(s.cue))errs.push("文"+s.id+": cue「"+s.cue+"」が英文にない＝ハイライトできない");
  // 空所を抜いた英文が「1箇所だけ」置換されるか（同じ語が複数あると空所が2つできる）
  if(s.en&&s.blank){
    const n=s.en.split(s.blank).length-1;
    if(n!==1)errs.push("文"+s.id+": blankが英文に"+n+"箇所ある（1箇所であるべき）");
  }
}
for(const t of KTYPES)if((perType[t.id]||0)!==5)errs.push("type "+t.id+": 文数"+(perType[t.id]||0)+"（5であるべき）");
console.log("完了形の型:",KTYPES.length," 文数:",KSENTS.length);

// ===== saigakushu.js（現在完了の次から高校まで） =====
const gsrc=fs.readFileSync(path.join(__dirname,"saigakushu.js"),"utf8");
const gctx={};new Function("with(this){"+gsrc+"; this.SSTAGES=SSTAGES; this.STYPES=STYPES; this.SSENTS=SSENTS;}").call(gctx);
const {SSTAGES,STYPES,SSENTS}=gctx;
const gsids=new Set(SSTAGES.map(s=>s.id));
if(gsids.size!==SSTAGES.length)errs.push("SSTAGES idに重複");
for(const s of SSTAGES)for(const k of["name","lead"])if(!s[k])errs.push("SSTAGE "+s.id+": "+k+"欠落");
const gtids=new Set(STYPES.map(t=>t.id));
if(gtids.size!==STYPES.length)errs.push("STYPES idに重複");
const perStage={};
for(const t of STYPES){
  for(const k of["s","name","form","cue","core","ng"])if(!t[k])errs.push("STYPE "+t.id+": "+k+"欠落");
  if(!gsids.has(t.s))errs.push("STYPE "+t.id+": 未定義stage "+t.s);
  perStage[t.s]=(perStage[t.s]||0)+1;
}
for(const s of SSTAGES)if(!perStage[s.id])errs.push("stage "+s.id+": 型が0個");
const gids=new Set(),perGType={};
for(const s of SSENTS){
  if(gids.has(s.id))errs.push("SSENTS id重複: "+s.id);gids.add(s.id);
  if(!gtids.has(s.t))errs.push("文"+s.id+": 未定義type "+s.t);
  perGType[s.t]=(perGType[s.t]||0)+1;
  for(const k of["jp","en","blank","why"])if(!s[k])errs.push("文"+s.id+": "+k+"欠落");
  if(!Array.isArray(s.o)||s.o.length!==4)errs.push("文"+s.id+": 選択肢が4つでない");
  if(s.o&&s.o[0]!==s.blank)errs.push("文"+s.id+": o[0]がblankと不一致（o[0]が正解の約束）");
  if(s.o){const st=new Set(s.o.map(x=>x.trim()));if(st.size!==s.o.length)errs.push("文"+s.id+": 選択肢に重複");}
  if(s.en&&s.blank){
    const n=s.en.split(s.blank).length-1;
    if(n!==1)errs.push("文"+s.id+": blank「"+s.blank+"」が英文に"+n+"箇所（1箇所であるべき）");
  }
  if(s.cue&&!s.en.includes(s.cue))errs.push("文"+s.id+": cue「"+s.cue+"」が英文にない＝ハイライトできない");
  // cueがblankの中に隠れていると下線が出ない（markEnはblankを先に退避するため）
  if(s.cue&&s.blank&&s.blank.includes(s.cue))errs.push("文"+s.id+": cueがblankの中にある＝下線が出ない");
}
// 基本(lv未指定=1)は型ごと5文、追加(lv:2＝間違えると解放)は型ごと3文
const lv1={},lv2={};
for(const s of SSENTS){
  if((s.lv||1)===1)lv1[s.t]=(lv1[s.t]||0)+1;
  else if(s.lv===2)lv2[s.t]=(lv2[s.t]||0)+1;
  else errs.push("文"+s.id+": 未知のlv "+s.lv);
}
for(const t of STYPES){
  if((lv1[t.id]||0)!==5)errs.push("type "+t.id+": 基本の文数"+(lv1[t.id]||0)+"（5であるべき）");
  if((lv2[t.id]||0)!==3)errs.push("type "+t.id+": 追加の文数"+(lv2[t.id]||0)+"（3であるべき）");
}
// kanryo と id体系が別なので重複は問題ないが、扱う型が重ならないかだけ見る
for(const t of STYPES)if(ktids.has(t.id))errs.push("STYPE "+t.id+": kanryoと型idが衝突");
console.log("再学習のステージ:",SSTAGES.length," 型:",STYPES.length,
  " 文数:",SSENTS.length,"（基本",SSENTS.filter(s=>(s.lv||1)===1).length,
  "＋間違えたら解放",SSENTS.filter(s=>s.lv===2).length,"）");

// 暗唱セット: 型ごとに代表文が1本ずつ、差し替え例が2つ以上
const perKey={};
for(const s of SSENTS){
  if(!s.key)continue;
  if((s.lv||1)!==1)errs.push("文"+s.id+": 追加の文を暗唱の代表文にしている（基本の文から選ぶ）");
  if(!Array.isArray(s.swap)||s.swap.length<2)errs.push("文"+s.id+": swap（差し替え例）が2つ未満");
  perKey[s.t]=(perKey[s.t]||0)+1;
}
for(const t of STYPES)if((perKey[t.id]||0)!==1)errs.push("type "+t.id+": 暗唱の代表文が"+(perKey[t.id]||0)+"本（1本であるべき）");
console.log("暗唱セット:",SSENTS.filter(s=>s.key).length+"文");

if(errs.length){console.error("NG:\n"+errs.join("\n"));process.exit(1);}
console.log("OK: 全チェック緑");
