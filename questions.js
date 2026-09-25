// 英文法診断ドリル 問題データ
// UNITS = カリキュラム順の単元（この順序が診断の「崩れの起点」判定に使われる）
// QUESTIONS = 各単元3問。a=正解index(0始まり)。why=決め手。elim=他の選択肢がなぜダメか
const UNITS = [
  {id:"m1be",   g:"中1", name:"be動詞と一般動詞", desc:"amとdrinkを並べない"},
  {id:"m1s",    g:"中1", name:"三単現のs・do/does", desc:"he/sheの時のs"},
  {id:"m1pro",  g:"中1", name:"代名詞の格", desc:"I/my/me/mine"},
  {id:"m1ing",  g:"中1", name:"現在進行形", desc:"be+〜ing"},
  {id:"m1can",  g:"中1", name:"can・命令文", desc:"助動詞の後ろは原形"},
  {id:"m2past", g:"中2", name:"過去形・過去進行形", desc:"went / was 〜ing"},
  {id:"m2fut",  g:"中2", name:"未来（will / be going to）", desc:"その場で決めた? 前から予定?"},
  {id:"m2aux",  g:"中2", name:"助動詞（must/have to/may）", desc:"must not と don't have to"},
  {id:"m2inf",  g:"中2", name:"不定詞の3用法", desc:"〜すること/ために/ための"},
  {id:"m2ger",  g:"中2", name:"動名詞と不定詞の使い分け", desc:"enjoy 〜ing / stop の意味変化"},
  {id:"m2comp", g:"中2", name:"比較", desc:"-er / more / as 〜 as"},
  {id:"m2conj", g:"中2", name:"接続詞（when/if/that）", desc:"if節の中は未来でも現在形"},
  {id:"m2svoc", g:"中2", name:"文型（give 人 物 / call A B）", desc:"語順とThere is"},
  {id:"m3pass", g:"中3", name:"受動態", desc:"be+過去分詞"},
  {id:"m3perf", g:"中3", name:"現在完了", desc:"経験・継続・完了"},
  {id:"m3inf2", g:"中3", name:"不定詞の応用", desc:"It is...to / want 人 to / how to"},
  {id:"m3part", g:"中3", name:"分詞の後置修飾", desc:"running boy / made in Japan"},
  {id:"m3rel",  g:"中3", name:"関係代名詞", desc:"who / which / 省略"},
  {id:"m3indq", g:"中3", name:"間接疑問文", desc:"語順を普通の文に戻す"},
  {id:"h1tense",g:"高校", name:"過去完了・完了進行形", desc:"had done / have been 〜ing"},
  {id:"h1subj", g:"高校", name:"仮定法", desc:"If I were / If I had done"},
  {id:"h1auxp", g:"高校", name:"助動詞+have+過去分詞", desc:"should have done"},
  {id:"h1partc",g:"高校", name:"分詞構文", desc:"Walking in the park, ..."},
  {id:"h1rel2", g:"高校", name:"関係副詞・前置詞+関係代名詞", desc:"where / in which"},
];
const QUESTIONS = [
// ===== 中1: be動詞と一般動詞 =====
{id:1,u:"m1be",jp:"私は毎朝コーヒーを飲む。",en:"I ___ coffee every morning.",o:["am drink","drink","am","drinking"],a:1,why:"「飲む」は一般動詞。be動詞は「〜です・〜にいる」の時だけで、動詞は1文に1つ。",elim:"A=be動詞と一般動詞は並べられない（最頻出ミス）。C=amだけだと「私はコーヒーです」。D=〜ingだけでは文にならない（be動詞が要る）。"},
{id:2,u:"m1be",jp:"彼は先生ではない。",en:"He ___ a teacher.",o:["doesn't","isn't","doesn't be","not is"],a:1,why:"「先生です」はbe動詞の文。否定はbe動詞にnotを付けるだけ＝isn't。",elim:"A=doesn'tは一般動詞の否定用。C=doesn't beという形は存在しない。D=notはbe動詞の後ろに置く。"},
{id:3,u:"m1be",jp:"あなたは犬が好きですか。",en:"___ you like dogs?",o:["Are","Do","Does","Is"],a:1,why:"likeは一般動詞。一般動詞の疑問文はDoを文頭に。Are you like...?が一番多い間違い。",elim:"A/D=be動詞はlikeと一緒に使えない。C=youにdoesは使わない（三人称単数専用）。"},
// ===== 中1: 三単現 =====
{id:4,u:"m1s",jp:"彼女は東京に住んでいる。",en:"She ___ in Tokyo.",o:["live","lives","living","is live"],a:1,why:"主語がhe/she/it（三人称単数）で現在の文なら動詞にsが付く。",elim:"A=sが抜けている。C=〜ing単独では文にならない。D=be動詞と一般動詞は並べない。"},
{id:5,u:"m1s",jp:"彼は肉を食べない。",en:"He ___ eat meat.",o:["don't","doesn't","isn't","not"],a:1,why:"三人称単数の否定はdoesn't。sの分はdoesが吸収するので後ろの動詞は原形（eatsにしない）。",elim:"A=heにはdoesn't。C=eatは一般動詞なのでbe動詞で否定しない。D=notだけでは否定文を作れない。"},
{id:6,u:"m1s",jp:"あなたのお父さんは車を運転しますか。",en:"___ your father drive a car?",o:["Do","Does","Is","Drives"],a:1,why:"主語your father=三人称単数→Does。Doesを使ったら動詞は原形に戻す（drivesにしない）。",elim:"A=三人称単数にはDoes。C=driveは一般動詞なのでbe動詞で聞かない。D=動詞を文頭に出す疑問文は英語にない。"},
// ===== 中1: 代名詞 =====
{id:7,u:"m1pro",jp:"私は彼を知っている。",en:"I know ___.",o:["he","his","him","he's"],a:2,why:"動詞の後ろ（〜を）に来るのは目的格him。「は・が=主格 / の=所有格 / を・に=目的格」。",elim:"A=heは主語の位置専用。B=hisは後ろに名詞が要る（his bagなど）。D=he'sはhe isの短縮で代名詞ではない。"},
{id:8,u:"m1pro",jp:"これは彼女のかばんです。",en:"This is ___ bag.",o:["she","her","hers","she's"],a:1,why:"名詞（bag）の前に置く「〜の」は所有格her。",elim:"A=sheは主語専用。C=hersは「彼女のもの」で後ろに名詞を置けない。D=she'sはshe isの短縮。"},
{id:9,u:"m1pro",jp:"このかばんは私のものです。",en:"This bag is ___.",o:["my","I","mine","me"],a:2,why:"後ろに名詞がない「私のもの」=mine（所有代名詞）。my＝後ろに名詞が必要。",elim:"A=myは後ろに名詞が要る。B=Iは主語専用。D=meは「私を・私に」。"},
// ===== 中1: 現在進行形 =====
{id:10,u:"m1ing",jp:"彼女は今、走っている。",en:"She ___ now.",o:["runs","is running","running","is run"],a:1,why:"「今まさにしている最中」=be動詞+〜ing。〜ingだけではダメでbe動詞が必須。",elim:"A=runsは習慣（いつも走る）。C=be動詞が抜けている。D=is+原形という形はない。"},
{id:11,u:"m1ing",jp:"彼らは今テレビを見ていますか。",en:"___ they watching TV now?",o:["Do","Are","Is","Does"],a:1,why:"進行形の疑問文はbe動詞を前に出すだけ。Do they watching...はdoとbeの混線。",elim:"A/D=〜ingの文にdo/doesは使わない。C=theyにはare。"},
{id:12,u:"m1ing",jp:"私は彼を知っている。",en:"I ___ him.",o:["am knowing","know","knowing","am know"],a:1,why:"know・like・have（持つ）などの状態動詞は進行形にしない。「〜している」と訳せても現在形。",elim:"A=knowは進行形にできない代表。C=〜ing単独は文にならない。D=beと原形は並ばない。"},
// ===== 中1: can・命令文 =====
{id:13,u:"m1can",jp:"彼女は速く泳げる。",en:"She can ___ fast.",o:["swims","swim","swimming","to swim"],a:1,why:"助動詞の後ろは必ず原形。主語が三人称単数でもcan swims にはしない。",elim:"A=canの後ろにsは付けない。C/D=canの直後は〜ingやto〜でなく裸の原形。"},
{id:14,u:"m1can",jp:"彼はピアノが弾けますか。",en:"___ he play the piano?",o:["Does","Can","Is","Does can"],a:1,why:"「できますか」はCanを文頭に。canがある文にdo/doesは使わない（助動詞は1つだけ）。",elim:"A=Does he play?だと「弾きますか（習慣）」で「弾けますか」にならない。C=playは一般動詞。D=助動詞を2つ並べる形はない。"},
{id:15,u:"m1can",jp:"（指示して）窓を開けなさい。",en:"___ the window.",o:["Open","Opens","Opening","You open to"],a:0,why:"命令文は主語を省いて動詞の原形から始める。",elim:"B=命令文にsは付けない。C=〜ing始まりは命令にならない。D=語順が崩れている。"},
// ===== 中2: 過去形・過去進行形 =====
{id:16,u:"m2past",jp:"私は昨日、図書館へ行った。",en:"I ___ to the library yesterday.",o:["go","went","have gone","was going"],a:1,why:"yesterday=はっきりした過去の一点→過去形。goは不規則変化でwent。",elim:"A=現在形のまま。C=現在完了はyesterdayなど過去の一点を表す語と一緒に使えない（高校まで引きずる重要ルール）。D=過去進行形だと「向かっている最中だった」。"},
{id:17,u:"m2past",jp:"彼は昨夜、勉強しなかった。",en:"He ___ study last night.",o:["didn't","doesn't","wasn't","not"],a:0,why:"一般動詞の過去の否定=didn't+原形。didが過去を背負うので動詞はstudiedにしない。",elim:"B=doesn'tは現在。C=studyは一般動詞なのでbe動詞で否定しない。D=notだけでは否定文を作れない。"},
{id:18,u:"m2past",jp:"私が電話した時、彼女はお風呂に入っていた。",en:"She ___ a bath when I called.",o:["takes","was taking","took","is taking"],a:1,why:"過去のある瞬間に進行中だった動作=過去進行形（was/were+〜ing）。",elim:"A=現在形。C=tookだと「電話の後に入った」ような前後関係に聞こえる。D=is takingは今の話になる。"},
// ===== 中2: 未来 =====
{id:19,u:"m2fut",jp:"（今その場で決めて）じゃあ、私がドアを開けるよ。",en:"OK, I ___ the door.",o:["am going to open","will open","open","opened"],a:1,why:"その場で決めたこと=will。be going toは前から決めていた予定に使う。",elim:"A=「開けるつもりだった（前から予定）」のニュアンスになる。C=現在形は習慣。D=過去形。"},
{id:20,u:"m2fut",jp:"（空の黒い雲を見て）雨が降りそうだ。",en:"Look at those clouds. It ___ rain.",o:["will","is going to","shall","would"],a:1,why:"目の前の兆候から「〜しそう」=be going to。willは根拠のない予想・その場の決断。",elim:"A=文法的には可だが、兆候があるときの定番はbe going to（試験で問われる対比）。C=shallは現代ではほぼ提案専用。D=wouldは過去や仮定の話。"},
{id:21,u:"m2fut",jp:"彼は明日忙しいだろう。",en:"He ___ busy tomorrow.",o:["will is","will be","is will","will"],a:1,why:"willの後ろは原形。isの原形はbe→will be。will isが定番ミス。",elim:"A=助動詞の後ろにisは置けない。C=語順が逆。D=busyの前に動詞がなくなる。"},
// ===== 中2: 助動詞 =====
{id:22,u:"m2aux",jp:"あなたは今日、働かなくてもよい。",en:"You ___ work today.",o:["must not","don't have to","should not","cannot"],a:1,why:"don't have to=しなくてもよい（不要）。must not=してはいけない（禁止）。この対比が助動詞の最頻出問題。",elim:"A=「働いてはいけない」と禁止になってしまう。C=「働くべきでない」。D=「働けない」。"},
{id:23,u:"m2aux",jp:"彼は病気に違いない。",en:"He ___ be sick.",o:["may","must","can","should"],a:1,why:"must=〜に違いない（強い推量）。mustには「義務」と「推量」の2つの顔がある。",elim:"A=mayは「かもしれない」で確信が弱い。C=canは能力・可能性。D=shouldは「〜のはずだ」でmustより弱い。"},
{id:24,u:"m2aux",jp:"ここで写真を撮ってもいいですか。",en:"___ I take a picture here?",o:["May","Must","Should","Will"],a:0,why:"許可を求める=May I 〜?（Can I も口語では可）。",elim:"B=「撮らなければいけませんか」。C=「撮るべきですか」。D=「撮るつもりですか」。"},
// ===== 中2: 不定詞の3用法 =====
{id:25,u:"m2inf",jp:"私はサッカーをするのが好きだ。",en:"I like ___ soccer.",o:["play","to play","plays","played"],a:1,why:"「〜すること」=to+原形（名詞的用法）。like playing も可だがこの選択肢ではto play。",elim:"A=like play と動詞を2つ並べられない。C/D=形が変わったものはtoの後ろに置けない。"},
{id:26,u:"m2inf",jp:"彼は本を買うために店へ行った。",en:"He went to the store ___ a book.",o:["to buy","for buy","buying","for buying"],a:0,why:"「〜するために」（目的）=to+原形（副詞的用法）。for+動詞は日本人の最頻出ミス。",elim:"B=forの直後に動詞の原形は置けない。C=buyingだけでは目的の意味にならない。D=for buyingは「買うことに対して」でここでは不自然。"},
{id:27,u:"m2inf",jp:"何か飲むものが欲しい。",en:"I want something ___.",o:["to drink","drinking","drink","for drink"],a:0,why:"名詞を後ろから「〜するための」と修飾=形容詞的用法。something to drinkで丸ごと覚える。",elim:"B=something drinkingは「飲んでいる何か」で変。C=動詞をそのまま置けない。D=for drinkという形はない。"},
// ===== 中2: 動名詞 =====
{id:28,u:"m2ger",jp:"彼は歌うのをやめた。",en:"He stopped ___.",o:["to sing","singing","sing","sang"],a:1,why:"stop+動名詞=〜するのをやめる。stop to sing だと「歌うために立ち止まった」で意味が変わる代表ペア。",elim:"A=意味が変わる（〜するために立ち止まる）。C/D=stopの直後に原形・過去形は置けない。"},
{id:29,u:"m2ger",jp:"私は彼女に会うのを楽しみにしている。",en:"I'm looking forward to ___ her.",o:["see","seeing","saw","be seen"],a:1,why:"look forward toのtoは前置詞→後ろは動名詞。「to=原形」と思い込むと引っかかる。",elim:"A=このtoは不定詞のtoではないので原形はダメ。C=過去形は置けない。D=受け身にする理由がない。"},
{id:30,u:"m2ger",jp:"彼はテニスをすることを楽しんだ。",en:"He enjoyed ___ tennis.",o:["to play","playing","play","played"],a:1,why:"enjoy・finish・stopは動名詞だけを取る動詞。enjoy to playとは言えない。",elim:"A=enjoyはto不定詞を取らない。C/D=動詞をそのまま・過去形では置けない。"},
// ===== 中2: 比較 =====
{id:31,u:"m2comp",jp:"この橋はあの橋より長い。",en:"This bridge is ___ than that one.",o:["long","longer","more long","the longest"],a:1,why:"短い形容詞は-erを付ける。thanとセット。",elim:"A=原級のままではthanと繋がらない。C=longにmoreは付けない。D=最上級は「一番」の時。"},
{id:32,u:"m2comp",jp:"この問題はあの問題より難しい。",en:"This question is ___ than that one.",o:["difficulter","more difficult","most difficult","difficult"],a:1,why:"長い形容詞（difficult/beautiful/interesting等）はmoreを前に置く。difficulterという単語は存在しない。",elim:"A=存在しない形。C=mostは最上級。D=原級のまま。"},
{id:33,u:"m2comp",jp:"彼は私と同じくらい背が高い。",en:"He is as ___ as me.",o:["tall","taller","tallest","more tall"],a:0,why:"as 〜 as の間は原級（元の形）。as taller as が定番ミス。",elim:"B/C/D=as〜asに比較級・最上級は入れない。"},
// ===== 中2: 接続詞 =====
{id:34,u:"m2conj",jp:"もし明日雨が降ったら、家にいます。",en:"If it ___ tomorrow, I will stay home.",o:["will rain","rains","rain","rained"],a:1,why:"時・条件（if/when）の節の中は、未来の話でも現在形。中2最大の罠のひとつ。",elim:"A=if節の中にwillは入れない（主節のI will stayには入る）。C=itが主語なので三単現のs。D=過去の話ではない。"},
{id:35,u:"m2conj",jp:"私は彼が正直だと思う。",en:"I think ___ he is honest.",o:["that","what","if","because"],a:0,why:"「〜ということ」を繋ぐthat。省略も可（I think he is honest.）。",elim:"B=whatは「何」か「〜するもの」。C=ifだと「正直かどうか」。D=becauseだと「正直だから思う」で理由になってしまう。"},
{id:36,u:"m2conj",jp:"帰宅した時、母は料理をしていた。",en:"___ I came home, my mother was cooking.",o:["When","During","That","If"],a:0,why:"「〜した時」=When+文。",elim:"B=Duringは前置詞なので後ろに文（主語+動詞）を置けない（during dinnerはOK）。C=Thatは時を表せない。D=Ifは条件「もし」。"},
// ===== 中2: 文型 =====
{id:37,u:"m2svoc",jp:"父は私に腕時計をくれた。",en:"My father gave ___.",o:["me a watch","a watch me","to me a watch","me to a watch"],a:0,why:"give+人+物の語順。物を先に言うならgive a watch to me（toが必要）。",elim:"B=物・人の順にするならtoが要る。C/D=toの位置が違う。"},
{id:38,u:"m2svoc",jp:"私たちはその犬をポチと呼ぶ。",en:"We call ___.",o:["the dog Pochi","Pochi the dog","the dog is Pochi","to the dog Pochi"],a:0,why:"call A B=「AをBと呼ぶ」。AとBの順序が命。",elim:"B=「ポチをその犬と呼ぶ」で逆。C=callの後ろにisは置けない。D=toは不要。"},
{id:39,u:"m2svoc",jp:"机の上に本が3冊ある。",en:"There ___ three books on the desk.",o:["is","are","have","has"],a:1,why:"There is/areは後ろの名詞に合わせる。three books=複数→are。",elim:"A=複数にisは使えない。C/D=「ある」をhaveと考えるのが定番ミス。There have という形はない。"},
// ===== 中3: 受動態 =====
{id:40,u:"m3pass",jp:"この部屋は毎日掃除される。",en:"This room ___ every day.",o:["cleans","is cleaned","is cleaning","cleaned"],a:1,why:"受け身=be動詞+過去分詞。「〜される」側が主語。",elim:"A=部屋が掃除する側になってしまう。C=is cleaning（進行形）との見分けが最頻出。〜ing=する側、過去分詞=される側。D=過去形単独だと「掃除した」。"},
{id:41,u:"m3pass",jp:"この本は多くの人に読まれている。",en:"This book ___ by many people.",o:["reads","is read","is reading","was reading"],a:1,why:"be+過去分詞。readの過去分詞はread（形が同じ・発音はレッド）。by 〜=「〜によって」。",elim:"A=本が読む側になる。C=進行形は「読んでいる最中」でする側。D=過去進行形も同じくする側。"},
{id:42,u:"m3pass",jp:"その窓は昨日、彼によって割られた。",en:"The window ___ by him yesterday.",o:["broke","was broken","was breaking","is broken"],a:1,why:"過去の受け身=was/were+過去分詞。時制はbe動詞側で変える。",elim:"A=窓が割る側になる。C=「割っている最中だった」。D=現在の受け身でyesterdayと合わない。"},
// ===== 中3: 現在完了 =====
{id:43,u:"m3perf",jp:"私は3年間ずっと東京に住んでいる。",en:"I ___ in Tokyo for three years.",o:["live","have lived","lived","am living"],a:1,why:"過去に始まって今も続く=現在完了（継続）。for/sinceが目印。",elim:"A=現在形は「今住んでいる」だけで3年間の幅が出ない。C=過去形だと「昔住んでいた（今は違う）」。D=進行形も幅の表現が弱い。"},
{id:44,u:"m3perf",jp:"私は一度、京都に行ったことがある。",en:"I ___ to Kyoto once.",o:["have gone","have been","went","have being"],a:1,why:"「行ったことがある」=have been to。have gone to=「行ってしまって今ここにいない」。",elim:"A=have goneだと今京都にいることになる（最頻出の引っかけ）。C=過去形+onceも通じるが「経験がある」のニュアンスはhave been。D=have beingという形はない。"},
{id:45,u:"m3perf",jp:"彼はちょうど宿題を終えたところだ。",en:"He ___ his homework.",o:["has just finished","just finished now","is just finishing","has just finish"],a:0,why:"「ちょうど〜したところ」=現在完了（完了）。justはhasと過去分詞の間に入る。",elim:"B=過去形+nowは矛盾。C=「終えかけている最中」。D=hasの後ろは過去分詞（finish→finished）。"},
// ===== 中3: 不定詞の応用 =====
{id:46,u:"m3inf2",jp:"英語を話すことは私にとって難しい。",en:"It is difficult ___ to speak English.",o:["for me","of me","to me","me"],a:0,why:"It is 形容詞 for 人 to 〜=「人にとって〜することは…だ」。Itは仮の主語。",elim:"B=ofはkind/niceなど人の性質を表す形容詞の時だけ（It is kind of you）。C=to meは「私に対して」で型が違う。D=前置詞が要る。"},
{id:47,u:"m3inf2",jp:"私はあなたにこの本を読んでほしい。",en:"I want ___ this book.",o:["you to read","you read","to you read","that you read"],a:0,why:"want 人 to 原形=「人に〜してほしい」。自分が読むならwant to read、人にさせたいなら間に人を挟む。",elim:"B=want you read という形はない。C=toの位置が違う。D=wantはthat節を取らない。"},
{id:48,u:"m3inf2",jp:"私は駅への行き方を知らない。",en:"I don't know ___ to the station.",o:["how to get","how get","what to get","to get how"],a:0,why:"how to 〜=「〜のしかた」。疑問詞+to+原形のセット（what to do / when to startも同じ型）。",elim:"B=howの後ろにtoが要る。C=whatだと「何を手に入れるか」。D=語順が崩れている。"},
// ===== 中3: 分詞の後置修飾 =====
{id:49,u:"m3part",jp:"向こうで走っている少年は私の弟だ。",en:"The boy ___ over there is my brother.",o:["running","run","is running","who runs"],a:0,why:"名詞を後ろから修飾する現在分詞（走っている→する側=〜ing）。文の動詞はisなので、ここに動詞を入れると動詞が2つになる。",elim:"B=原形は修飾に使えない。C=is runningを入れると動詞が2つで文が壊れる。D=who runsだと「（習慣的に）走る少年」で「今走っている」と少しずれる＋関係代名詞を使わなくても言える。"},
{id:50,u:"m3part",jp:"これは日本で作られた車だ。",en:"This is a car ___ in Japan.",o:["making","made","makes","to make"],a:1,why:"車は「作られる」側→過去分詞。する側=〜ing / される側=過去分詞、の使い分けが全て。",elim:"A=makingだと車が作る側になる。C=動詞をそのまま置けない。D=to makeは「作るための」で意味がずれる。"},
{id:51,u:"m3part",jp:"あの眠っている赤ちゃんを見て。",en:"Look at that ___ baby.",o:["sleeping","slept","sleep","to sleep"],a:0,why:"赤ちゃんは「眠っている」側（能動）→現在分詞。1語なら名詞の前に置く。",elim:"B=sleptは「眠られた」で受け身になり変。C=原形は修飾できない。D=to sleepは「眠るための」。"},
// ===== 中3: 関係代名詞 =====
{id:52,u:"m3rel",jp:"私にはニューヨークに住んでいるおじがいる。",en:"I have an uncle ___ lives in New York.",o:["who","which","whose","whom"],a:0,why:"先行詞が人＋後ろの文の主語が欠けている→主格who。",elim:"B=whichは物・動物用。C=whoseは「〜の」（whose car等）。D=whomは目的格で、直後に動詞livesは続かない。"},
{id:53,u:"m3rel",jp:"これは彼が書いた本だ。",en:"This is the book ___ he wrote.",o:["which","who","what","whose"],a:0,why:"先行詞が物→which（thatも可）。後ろの文はwroteの目的語が欠けた形。",elim:"B=whoは人用。C=whatは先行詞を中に含む（the bookの後ろには置けない）。D=whoseは所有。"},
{id:54,u:"m3rel",jp:"彼女が撮った写真は美しかった。",en:"The pictures ___ were beautiful.",o:["she took","which she took them","who she took","she took them"],a:0,why:"目的格の関係代名詞は省略できる。The pictures (which) she took。",elim:"B/D=themを残すと目的語が二重になる（whichがthemの代わりなので）。C=whoは人用。"},
// ===== 中3: 間接疑問文 =====
{id:55,u:"m3indq",jp:"彼がどこに住んでいるか知っていますか。",en:"Do you know where ___?",o:["does he live","he lives","is he live","lives he"],a:1,why:"疑問文を文の中に埋め込むと語順は普通の文（主語+動詞）に戻る。疑問文の語順のまま入れるのが最頻出ミス。",elim:"A=does he liveは独立した疑問文の語順。C=liveは一般動詞なのでisと並べない。D=動詞を前に出す語順は英語にない。"},
{id:56,u:"m3indq",jp:"私は彼女が何が好きなのか知らない。",en:"I don't know what ___.",o:["does she like","she likes","is she like","she like"],a:1,why:"間接疑問は普通の語順+三単現のs。doesが消える分、sが動詞に戻ってくる。",elim:"A=疑問文の語順のまま。C=likeとbe動詞は並べない。D=sheなのでsが要る。"},
{id:57,u:"m3indq",jp:"彼がいつ来るのか教えて。",en:"Tell me when ___.",o:["will he come","he will come","does he come","he comes"],a:1,why:"間接疑問は語順を戻すだけでwillはそのまま使える。※「if/when節は現在形」のルールは時・条件の副詞節の話。ここのwhen節は「いつ来るか」という名詞のカタマリなので別物。",elim:"A=疑問文の語順のまま。C=語順が疑問文型。D=he comesにすると「彼が来る時に教えて」（副詞節）と読めてしまい「いつ来るのか」を聞く文にならない。"},
// ===== 高校: 過去完了・完了進行形 =====
{id:58,u:"h1tense",jp:"駅に着いた時には、電車はすでに出発していた。",en:"When I got to the station, the train ___.",o:["has already left","had already left","was already leaving","already left"],a:1,why:"過去（駅に着いた）よりさらに前の出来事=過去完了had+過去分詞。時間が2段階あるのが目印。",elim:"A=現在完了は過去の文の中で「それより前」を表せない。C=「出発しかけていた」。D=過去形だと2つの出来事の前後が曖昧になる。"},
{id:59,u:"h1tense",jp:"彼女は2時間ずっとテニスをし続けている。",en:"She ___ tennis for two hours.",o:["has been playing","is playing","plays","was playing"],a:0,why:"動作が今も続いている継続=現在完了進行形have been 〜ing。状態動詞ならhave livedのような現在完了（中3）でよいが、動作動詞の継続は進行形を重ねる。",elim:"B=is playingは「今この瞬間」でfor two hoursの幅が弱い。C=習慣。D=過去の話になる。"},
{id:60,u:"h1tense",jp:"日本に来る前、彼は中国語を5年間勉強していた。",en:"Before he came to Japan, he ___ Chinese for five years.",o:["studied","had studied","has studied","was studying"],a:1,why:"「日本に来た（過去）」より前の5年間=過去完了。基準になる過去があるかを探す。",elim:"A=過去形でも通じるが「来る前までの5年」の前後関係はhadが明確にする。C=現在完了は過去の基準点と併用できない。D=過去進行形は5年の幅に不向き。"},
// ===== 高校: 仮定法 =====
{id:61,u:"h1subj",jp:"もしお金があれば、その車を買うのに。（今はないから買えない）",en:"If I ___ money, I would buy the car.",o:["have","had","would have","will have"],a:1,why:"今の現実に反する妄想=仮定法過去。if節は過去形・主節はwould+原形。形は過去でも意味は現在。",elim:"A=現在形だと「本当にあるかもしれない」普通の条件文（中2のif）になる。C=wouldはif節でなく主節に置く。D=willはif節に入れない。"},
{id:62,u:"h1subj",jp:"もしあの時もっと勉強していたら、試験に受かっていたのに。",en:"If I ___ harder, I would have passed the exam.",o:["studied","had studied","have studied","would study"],a:1,why:"過去の現実に反する妄想=仮定法過去完了。if節はhad+過去分詞・主節はwould have+過去分詞。1段ずつ時制を過去にずらすのがルール。",elim:"A=仮定法過去（今の妄想）の形で、主節のwould have passedと段が合わない。C=have studiedはifの中で使わない。D=wouldは主節用。"},
{id:63,u:"h1subj",jp:"私があなたなら、そんなことは言わない。",en:"If I ___ you, I wouldn't say that.",o:["am","was","were","be"],a:2,why:"仮定法のbe動詞は主語が何でもwere。If I were youは丸ごと決まり文句。",elim:"A=現在形は仮定法にならない。B=口語ではwasも通じるが試験はwere。D=原形は置けない。"},
// ===== 高校: 助動詞+have+過去分詞 =====
{id:64,u:"h1auxp",jp:"君は医者に行くべきだった（のに行かなかった）。",en:"You ___ to the doctor.",o:["should go","should have gone","must go","had to go"],a:1,why:"should have+過去分詞=「〜すべきだったのに（しなかった）」。過去への後悔・非難。助動詞+have doneで時間が過去に飛ぶ。",elim:"A=「行くべきだ」で今の話。C=「行かなければならない」も今。D=「行かなければならなかった（そして行った）」で後悔の意味が出ない。"},
{id:65,u:"h1auxp",jp:"彼は疲れていたに違いない。",en:"He ___ tired.",o:["must be","must have been","should be","cannot be"],a:1,why:"must have+過去分詞=「〜だったに違いない」（過去への推量）。must be なら「今疲れているに違いない」。",elim:"A=今の推量。C=「疲れているはずだ」で今。D=「疲れているはずがない」。"},
{id:66,u:"h1auxp",jp:"彼女がそんなことを言ったはずがない。",en:"She ___ such a thing.",o:["cannot have said","must not have say","should not say","may not said"],a:0,why:"can't(cannot) have+過去分詞=「〜したはずがない」。過去への強い否定の推量。mustの反対はmust notでなくcan'tになるのがポイント。",elim:"B=haveの後ろは過去分詞（say→said）＋そもそも「言わなかったに違いない」は英語ではcan't haveで言う。C=「言うべきでない」で今の話。D=may notの後ろに過去分詞を直接置けない（may not have saidなら形は正しいが「言わなかったかもしれない」で弱い）。"},
// ===== 高校: 分詞構文 =====
{id:67,u:"h1partc",jp:"公園を歩いている時、私は旧友に会った。",en:"___ in the park, I met an old friend.",o:["Walking","Walked","To walk","Walk"],a:0,why:"接続詞と主語を省いて分詞で始める=分詞構文。主語のIが「歩く」側（能動）→現在分詞。",elim:"B=Walkedだと「歩かれた」で受け身になり、Iと合わない。C=To walkは「歩くために」で目的の意味になる。D=原形では始められない。"},
{id:68,u:"h1partc",jp:"山の頂上から見ると、その湖は海のように見える。",en:"___ from the top of the mountain, the lake looks like the sea.",o:["Seeing","Seen","To see","Saw"],a:1,why:"主語はthe lake=「見られる」側（受動）→過去分詞。分詞構文は文の主語とセットで能動/受動を判定する。",elim:"A=Seeingだと湖が見る側になってしまう（最頻出の引っかけ）。C=目的の意味になる。D=過去形では始められない。"},
{id:69,u:"h1partc",jp:"何を言えばいいか分からなかったので、私は黙っていた。",en:"Not ___ what to say, I kept silent.",o:["knowing","known","to know","knew"],a:0,why:"分詞構文の否定はNotを分詞の直前に置く。I=知らない側（能動）→現在分詞。",elim:"B=knownだと受け身。C=Not to knowは「知らないために」で不自然。D=過去形は置けない。"},
// ===== 高校: 関係副詞 =====
{id:70,u:"h1rel2",jp:"ここは私が生まれた町だ。",en:"This is the town ___ I was born.",o:["which","where","that","what"],a:1,why:"後ろの文（I was born）が完全な形→関係副詞where。whichを使うなら前置詞が要る（in which）。「後ろの文に穴があるか」で代名詞/副詞を見分ける。",elim:"A=whichだとI was born ___ の穴がなく繋がらない。C=thatも代名詞なので同じ理由でダメ。D=whatは先行詞を含む。"},
{id:71,u:"h1rel2",jp:"これは私が住んでいた家だ。",en:"This is the house in ___ I lived.",o:["which","where","that","what"],a:0,why:"前置詞の直後に置けるのはwhichだけ。in where / in that は形として存在しない。",elim:"B=whereは前置詞を含んだ副詞なのでinと重複する。C=前置詞+thatは不可（関係代名詞の中で唯一の弱点）。D=whatは先行詞を含む。"},
{id:72,u:"h1rel2",jp:"彼が遅刻した理由を知っていますか。",en:"Do you know the reason ___ he was late?",o:["why","which","where","how"],a:0,why:"先行詞the reason+完全な文→関係副詞why。the reason why 〜で「〜の理由」。",elim:"B=後ろの文に穴がないのでwhichは使えない。C=whereは場所。D=howはthe wayと一緒に使えない（the way howは×）逆に単独ならOK。"},

// ============================================================
// ここから lv:2 ＝ 追加の2問。
// その単元で1問でも間違えると解放され、以後その単元は5問になる。
// 誤答の選択肢には、実際に選んでしまった答えを入れている。
// ============================================================

// ===== 中1: 現在進行形（状態動詞を進行形にしてしまう） =====
{id:101,u:"m1ing",lv:2,jp:"私は新しい車が欲しい。",en:"I ___ a new car.",o:["am wanting","want","wanting","am want"],a:1,why:"wantもknowと同じで、頭の中の状態を表す動詞。「欲しがっている」と訳せても進行形にしない。",elim:"A=wantは進行形にしない代表。C=〜ing単独では文にならない。D=be動詞と原形は並ばない。"},
{id:102,u:"m1ing",lv:2,jp:"彼は車を2台持っている。",en:"He ___ two cars.",o:["is having","has","having","is have"],a:1,why:"have（持っている）も状態動詞なので進行形にしない。※「食事をする」のhaveは進行形にできる（is having lunch）。",elim:"A=「持っている」のhaveは進行形にしない。C=be動詞が抜けている。D=be動詞と原形は並ばない。"},

// ===== 中2: 動名詞と不定詞（崩れの起点） =====
{id:103,u:"m2ger",lv:2,jp:"彼は本を読み終えた。",en:"He finished ___ the book.",o:["to read","reading","read","reads"],a:1,why:"finishは「やったから終わる」。終えるには先にやっている必要があるので、もう手をつけた形のing。",elim:"A=finishのうしろにtoは付かない。C/D=動詞のままでは置けない。"},
{id:104,u:"m2ger",lv:2,jp:"手伝ってくれてありがとう。",en:"Thank you for ___ me.",o:["to help","helping","help","helped"],a:1,why:"forのような前置詞のうしろはing。look forward to のように「toの前に単語がくっついている」形も同じ仲間。",elim:"A=前置詞のうしろにtoは置けない。C/D=動詞のままでは置けない。"},

// ===== 中2: 比較 =====
{id:105,u:"m2comp",lv:2,jp:"この本はあの本より面白い。",en:"This book is ___ than that one.",o:["interestinger","more interesting","most interesting","interesting"],a:1,why:"長い語（-ing/-ful/-ousなど）は-erを付けず、前にmoreを置く。",elim:"A=長い語にerは付けない。C=mostは3つ以上で一番のとき。D=thanがあるのに比較級になっていない。"},
{id:106,u:"m2comp",lv:2,jp:"彼は私と同じくらい速く走る。",en:"He runs ___ fast as I do.",o:["as","more","than","very"],a:0,why:"「同じくらい」はas 〜 as。間に入る語は元の形（fast）のままで、比較級にしない。",elim:"B/C=比較級の形。D=veryは比較の形を作れない。"},

// ===== 中2: 接続詞 =====
{id:107,u:"m2conj",lv:2,jp:"彼が来たら始めます。",en:"We will start when he ___.",o:["will come","comes","came","is coming"],a:1,why:"「〜したら」を表すwhenの中は、未来のことでも現在形。ifと同じルール。",elim:"A=時・条件を表す節の中にwillは入れない。C=過去形では話が変わる。D=進行形にする必要がない。"},
{id:108,u:"m2conj",lv:2,jp:"彼が忙しいことは知っている。",en:"I know ___ he is busy.",o:["that","if","what","which"],a:0,why:"「〜ということ」をひとまとめにするのはthat。省略もできる。",elim:"B=ifは「〜かどうか」。C/D=うしろの文に欠けがないので関係詞は使えない。"},

// ===== 中3: 不定詞の応用 =====
{id:109,u:"m3inf2",lv:2,jp:"部長は私に残るように言った。",en:"My boss told ___ late.",o:["me stay","me to stay","to me stay","me staying"],a:1,why:"tell・ask・wantは「人 + to + 動詞」。make・letのときだけtoが消える。",elim:"A=tellにはtoが必要。C=tellのうしろにtoは付けない。D=ingにはしない。"},
{id:110,u:"m3inf2",lv:2,jp:"彼は疲れすぎて歩けなかった。",en:"He was ___ walk.",o:["too tired to","so tired to","too tired that","tired too to"],a:0,why:"too 〜 to … で「〜すぎて…できない」。notを使わずに打ち消しの意味になる。",elim:"B=so…thatの形ならthat節が必要。C=too…thatという形はない。D=語順が崩れている。"},

// ===== 中3: 分詞の後置修飾 =====
{id:111,u:"m3part",lv:2,jp:"これは日本で作られた車です。",en:"This is a car ___ in Japan.",o:["making","made","makes","is made"],a:1,why:"車は「作られた」側なので過去分詞。文の動詞はisなので、is madeにすると動詞が2つになる。",elim:"A=ingだと車が何かを作っていることになる。C=動詞のままでは飾れない。D=動詞が2つになる。"},
{id:112,u:"m3part",lv:2,jp:"窓の近くに座っている女性は私の母です。",en:"The woman ___ near the window is my mother.",o:["who sits","sitting","sits","is sitting"],a:1,why:"文の動詞はis。「座っている」は女性を飾るだけなのでingを置く。",elim:"A=who sitsだと「いつも座る人」という意味になる。C/D=動詞が2つになる。"},

// ===== 中3: 関係代名詞 =====
{id:113,u:"m3rel",lv:2,jp:"私が昨日会った人は医者だ。",en:"The man ___ yesterday is a doctor.",o:["I met him","I met","which I met","what I met"],a:1,why:"会った相手（man）が前に出ているので、metのうしろにhimは置かない。thatやwhomは入れても省略してもよい。",elim:"A=目的語が二重になる。C=人にwhichは使わない。D=whatは先行詞と一緒に使えない。"},
{id:114,u:"m3rel",lv:2,jp:"屋根が赤い家が私の家です。",en:"The house ___ roof is red is mine.",o:["which","whose","who","that"],a:1,why:"「家の屋根」は所有の関係なのでwhose。whoseのうしろには名詞（roof）が続くのが見分け方。",elim:"A/D=うしろに名詞が続く形では使えない。C=whoは人に使う。"},

// ===== 中3: 間接疑問文 =====
{id:115,u:"m3indq",lv:2,jp:"彼がどこに住んでいるか知っていますか。",en:"Do you know ___?",o:["where does he live","where he lives","where he live","where is he living"],a:1,why:"疑問文が文の一部になると、does he liveの語順がhe livesに戻る。",elim:"A=疑問文の語順のまま。C=三単現のsが抜けている。D=「住んでいる」に引かれて進行形にしている。"},
{id:116,u:"m3indq",lv:2,jp:"彼が何を言ったか教えてください。",en:"Please tell me ___.",o:["what did he say","what he said","what he say","what was he saying"],a:1,why:"did he sayではなくhe said。過去形はそのまま動詞に残る。",elim:"A=疑問文の語順のまま。C=過去形になっていない。D=進行形にする必要がない。"},

// ===== 高校: 過去完了・完了進行形 =====
{id:117,u:"h1tense",lv:2,jp:"私が電話した時、彼はもう出かけていた。",en:"When I called, he ___.",o:["was already leaving","had already left","has already left","already left"],a:1,why:"過去の一点（電話した時）より前の話なので had + 過去分詞。",elim:"A=進行形だと「出かけている最中だった」。C=hasにすると基準が今になる。D=どちらが先かを示せない。"},
{id:118,u:"h1tense",lv:2,jp:"彼は3年間ずっとここで働いている。",en:"He ___ here for three years.",o:["is working","has been working","was working","works"],a:1,why:"for three years＝期間が付いているので、前から今まで続いている形 have been + ing。",elim:"A=進行形だけでは期間を表せない。C=過去進行形は今と切れる。D=現在形は習慣を表す。"},

// ===== 高校: 仮定法 =====
{id:119,u:"h1subj",lv:2,jp:"もっと時間があれば手伝えるのに。",en:"If I ___ more time, I could help you.",o:["have","had","will have","would have"],a:1,why:"今は時間がないという前提なので、時間を1つ後ろにずらして過去形にする。",elim:"A=本当にあり得る話のときの形。C=if節にwillは入れない。D=would haveは過去のことを言う形。"},
{id:120,u:"h1subj",lv:2,jp:"もっと早く出発していれば間に合ったのに。",en:"If we ___ earlier, we could have made it.",o:["left","had left","have left","would leave"],a:1,why:"過去にそうしなかった話なので had + 過去分詞。うしろが could have なのが合図。",elim:"A=1段しかずらしていない（今の話になる）。C=haveの形は今が基準。D=would leaveはこれからの話。"},

// ===== 高校: 助動詞+have+過去分詞 =====
{id:121,u:"h1auxp",lv:2,jp:"彼は鍵を忘れたのかもしれない。",en:"He ___ his key.",o:["may forget","may have forgotten","may forgot","may be forgotten"],a:1,why:"過去のことへの推量は 助動詞 + have + 過去分詞。",elim:"A=今のことになる。C=助動詞のうしろは原形。D=受け身になってしまう。"},
{id:122,u:"h1auxp",lv:2,jp:"彼女はそれを知っていたはずだ。",en:"She ___ it.",o:["must know","must have known","must knew","must be known"],a:1,why:"「〜だったはずだ」は must have + 過去分詞。今のことなら must know。",elim:"A=今のことになる。C=助動詞のうしろは原形。D=受け身になってしまう。"},

// ===== 高校: 分詞構文 =====
{id:123,u:"h1partc",lv:2,jp:"公園を歩いていると、彼に会った。",en:"___ in the park, I met him.",o:["To walk","Walking","Walked","I walking"],a:1,why:"主語が同じ2つの文をまとめるとき、前の文の動詞をingにして繋げる。主語（I）は残さない。",elim:"A=toは「〜するために」。C=される側の形。D=主語は残さない。"},
{id:124,u:"h1partc",lv:2,jp:"英語で書かれているので、私には読めなかった。",en:"___ in English, it was hard for me.",o:["Writing","Written","To write","It written"],a:1,why:"それは「書かれた」側なので過去分詞から始める。",elim:"A=ingだと「書きながら」になる。C=toは目的を表す。D=主語は残さない。"},

// ===== 高校: 関係副詞・前置詞+関係代名詞 =====
{id:125,u:"h1rel2",lv:2,jp:"これが私が働いている会社です。",en:"This is the company ___ I work.",o:["which","where","that","what"],a:1,why:"うしろのI workは主語も動詞も揃って欠けがない。だから場所を指すwhere。whichは主語か目的語が抜けていないと使えない。",elim:"A/C=うしろに欠けがないと使えない。D=whatは先行詞と一緒に使えない。"},
{id:126,u:"h1rel2",lv:2,jp:"彼が生まれた日を覚えている。",en:"I remember the day ___ he was born.",o:["which","when","where","what"],a:1,why:"説明されるのが時（day）で、うしろの文に欠けがないのでwhen。",elim:"A=欠けがないと使えない。C=whereは場所。D=whatは先行詞と使えない。"},
];
