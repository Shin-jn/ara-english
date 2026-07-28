/* ================= 영어 놀이터 (English Playground) =================
   - data.xlsx 를 브라우저에서 직접 읽어 퀴즈를 자동 생성합니다.
   - 엑셀만 교체하면 내용이 자동 반영됩니다.
   =================================================================== */

'use strict';

const DATA = { words: [], sentences: [] };
const state = {
  cat: null,          // 'words' | 'sentences'
  mode: null,         // 모드 id
  learnIdx: 0,
  quiz: null,         // { items, i, score, answered }
};

/* ---------- 마스코트 그리기 ---------- */
function buildMascots(){
  document.querySelectorAll('.cat-mascot').forEach(m=>{
    if (m.dataset.built) return;
    m.dataset.built = '1';
    m.innerHTML =
      '<span class="ear l"></span><span class="ear r"></span>' +
      '<span class="whisker l"></span><span class="whisker r"></span>' +
      '<span class="head"></span>' +
      '<span class="eye l"></span><span class="eye r"></span>' +
      '<span class="cheek l"></span><span class="cheek r"></span>' +
      '<span class="mouth"></span>';
  });
}
function setMood(el, mood){ if (el) el.dataset.mood = mood; }

/* ---------- 화면 전환 ---------- */
function show(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById('screen-'+id).classList.add('active');
  window.scrollTo(0,0);
}

/* ---------- 별(보상) 저장 ---------- */
const STAR_KEY = 'englishPlayground_stars';
function getStars(){ return parseInt(localStorage.getItem(STAR_KEY)||'0',10) || 0; }
function addStars(n){
  const t = getStars()+n;
  localStorage.setItem(STAR_KEY, String(t));
  updateStarUI();
}
function updateStarUI(){
  const s = getStars();
  ['home-stars','mode-stars'].forEach(id=>{ const e=document.getElementById(id); if(e) e.textContent=s; });
}

/* ---------- 코인(꾸미기 재화) ---------- */
const COIN_KEY = 'englishPlayground_coins';
function getCoins(){ return parseInt(localStorage.getItem(COIN_KEY)||'0',10) || 0; }
function setCoins(n){ localStorage.setItem(COIN_KEY, String(Math.max(0, n))); updateCoinUI(); }
function addCoins(n){ setCoins(getCoins()+n); }
function updateCoinUI(){
  const c = getCoins();
  ['home-coins','avatar-coins'].forEach(id=>{ const e=document.getElementById(id); if(e) e.textContent=c; });
}

/* ================= 아바타 상태 (아트/카탈로그는 avatar.js) ================= */
const AVATAR_KEY = 'englishPlayground_avatar_v1';

let AVATAR = loadAvatar();
function loadAvatar(){
  const owned = [];
  CAT_ORDER.forEach(cat=> WARDROBE[cat].items.forEach(it=>{ if (it.price===0) owned.push(it.id); }));
  try{
    const a = JSON.parse(localStorage.getItem(AVATAR_KEY));
    if (a && a.equipped){
      // 기본(무료) 아이템은 항상 소유 상태로 보정
      const set = new Set([...(a.owned||[]), ...owned]);
      return { owned:[...set], equipped: Object.assign({}, DEFAULT_EQUIP, a.equipped) };
    }
  }catch(e){}
  return { owned, equipped: Object.assign({}, DEFAULT_EQUIP) };
}
function saveAvatar(){ try{ localStorage.setItem(AVATAR_KEY, JSON.stringify(AVATAR)); }catch(e){} }
function isOwned(id){ return id==='none' || AVATAR.owned.includes(id); }

function renderAvatarInto(el, mood){ if (el) el.innerHTML = avatarSVG(AVATAR.equipped, mood); }
function refreshAvatars(){
  renderAvatarInto(document.getElementById('home-avatar'));
  renderAvatarInto(document.getElementById('avatar-preview'));
}
/* 퀴즈 화면 아바타 표정: happy | celebrate | sad */
function setQuizFace(mood){
  renderAvatarInto(document.getElementById('quiz-avatar'), mood);
}

/* --- 꾸미기 화면 --- */
let shopCat = 'hair';
function openAvatar(){
  updateCoinUI();
  refreshAvatars();
  renderTabs();
  renderShop();
  show('avatar');
}
function renderTabs(){
  const box = document.getElementById('cat-tabs');
  box.innerHTML = '';
  CAT_ORDER.forEach(cat=>{
    const b = document.createElement('button');
    b.className = 'cat-tab' + (cat===shopCat ? ' active' : '');
    b.textContent = WARDROBE[cat].label;
    b.onclick = ()=>{ shopCat = cat; renderTabs(); renderShop(); };
    box.appendChild(b);
  });
}
function renderShop(){
  const grid = document.getElementById('shop-grid');
  grid.innerHTML = '';
  WARDROBE[shopCat].items.forEach(it=>{
    const owned = isOwned(it.id);
    const equipped = AVATAR.equipped[shopCat] === it.id;
    const card = document.createElement('button');
    card.className = 'shop-item' + (equipped ? ' equipped' : '') + (owned ? '' : ' locked');
    // 이 아이템을 적용한 미리보기
    const preview = avatarSVG(Object.assign({}, AVATAR.equipped, { [shopCat]: it.id }));
    const tag = equipped ? '<span class="tag on">착용중 ✓</span>'
              : owned    ? '<span class="tag own">착용하기</span>'
              :            `<span class="tag buy">🪙 ${it.price}</span>`;
    card.innerHTML = `<span class="thumb">${preview}</span><span class="nm"></span>${tag}`;
    card.querySelector('.nm').textContent = itemName(shopCat, it.id);
    card.onclick = ()=>onShopTap(shopCat, it, owned, equipped);
    grid.appendChild(card);
  });
}
function onShopTap(cat, it, owned, equipped){
  if (equipped) return;
  if (owned){
    AVATAR.equipped[cat] = it.id; saveAvatar();
    refreshAvatars(); renderShop();
    return;
  }
  // 구매
  if (getCoins() < it.price){
    flashCoinShort(); return;
  }
  if (!confirm(`'${itemName(cat, it.id)}'을(를) 🪙${it.price} 코인에 살까요?`)) return;
  addCoins(-it.price);
  AVATAR.owned.push(it.id);
  AVATAR.equipped[cat] = it.id;
  saveAvatar();
  refreshAvatars(); renderShop();
  bigConfetti();
}
function flashCoinShort(){
  const el = document.getElementById('avatar-coins');
  if (!el) return;
  const p = el.parentElement;
  p.classList.remove('shake'); void p.offsetWidth; p.classList.add('shake');
  alert('코인이 모자라요! 퀴즈를 더 풀어서 코인을 모아요 🪙');
}

/* ---------- 숙련도(라이트너 3단계) ---------- */
/* 저장 키는 '영어 원문'  → 엑셀에 줄을 추가/삭제해도 기록이 유지됨 */
const PROG_KEY = 'englishPlayground_progress_v1';
const LEVELS = [
  { icon:'🌱', name:'새싹',      weight:6 },   // 아직 못 맞힘 → 자주 출제
  { icon:'🌿', name:'자라는 중', weight:3 },   // 1~2번 연속 정답
  { icon:'🌸', name:'마스터',    weight:1 },   // 3번 이상 연속 정답 → 가끔만
];

let PROGRESS = loadProgress();
function loadProgress(){
  try{
    const p = JSON.parse(localStorage.getItem(PROG_KEY));
    if (p && typeof p === 'object') return { words: p.words||{}, sentences: p.sentences||{} };
  }catch(e){}
  return { words:{}, sentences:{} };
}
function saveProgress(){
  try{ localStorage.setItem(PROG_KEY, JSON.stringify(PROGRESS)); }catch(e){}
}
function getRec(cat, en){ return (PROGRESS[cat] || {})[en]; }
function levelOf(rec){
  if (!rec || !rec.streak) return 0;
  return rec.streak >= 3 ? 2 : 1;
}
function levelOfItem(cat, en){ return levelOf(getRec(cat, en)); }

/* 정답/오답 기록 → 마스터로 승급했는지 반환 */
function record(cat, en, ok){
  if (!PROGRESS[cat]) PROGRESS[cat] = {};
  const r = PROGRESS[cat][en] || { streak:0, correct:0, wrong:0 };
  const before = levelOf(r);
  if (ok){ r.streak++; r.correct++; }
  else   { r.streak = 0; r.wrong++; }   // 틀리면 🌱로 강등
  PROGRESS[cat][en] = r;
  saveProgress();
  const after = levelOf(r);
  return { before, after, newlyMastered: before < 2 && after === 2 };
}
function masteredCount(cat){
  return DATA[cat].filter(it => levelOfItem(cat, it.en) === 2).length;
}
function resetProgress(){
  PROGRESS = { words:{}, sentences:{} };
  saveProgress();
}

/* 숙련도 가중치 랜덤 추출 (중복 없이 n개) — 약한 단어가 더 자주 뽑힘 */
function weightedSample(items, n, cat){
  const pool = items.slice();
  const out = [];
  while (out.length < n && pool.length){
    const weights = pool.map(it => LEVELS[levelOfItem(cat, it.en)].weight);
    const total = weights.reduce((a,b)=>a+b, 0);
    let r = Math.random() * total, idx = pool.length - 1;
    for (let i=0;i<pool.length;i++){ r -= weights[i]; if (r <= 0){ idx = i; break; } }
    out.push(pool.splice(idx, 1)[0]);
  }
  return out;
}

/* ---------- 발음 (Web Speech API) ---------- */
let voiceReady = false, enVoice = null;
function initVoices(){
  if (!('speechSynthesis' in window)) return;
  const pick = ()=>{
    const vs = speechSynthesis.getVoices().filter(v=>/en(-|_)?/i.test(v.lang));
    // 여성/자연스러운 영어 목소리 우선
    enVoice = vs.find(v=>/female|samantha|zira|google us/i.test(v.name))
           || vs.find(v=>/en-US/i.test(v.lang)) || vs[0] || null;
    voiceReady = true;
  };
  pick();
  speechSynthesis.onvoiceschanged = pick;
}
function speak(text, btn){
  if (!('speechSynthesis' in window) || !text) return;
  try{
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US'; u.rate = 0.85; u.pitch = 1.15;
    if (enVoice) u.voice = enVoice;
    if (btn){ btn.classList.add('playing'); u.onend = ()=>btn.classList.remove('playing'); u.onerror=()=>btn.classList.remove('playing'); }
    speechSynthesis.speak(u);
  }catch(e){/* 무시 */}
}

/* ---------- 유틸 ---------- */
function shuffle(a){ a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
function sample(arr, n, exclude){
  const pool = arr.filter(x=>x!==exclude);
  return shuffle(pool).slice(0, n);
}
function stripPunct(s){ return String(s).replace(/[.,!?;:"']/g,'').trim(); }
// 쓰기 정답 비교용: 대소문자·문장부호·여분 공백 무시
function normWrite(s){ return String(s).toLowerCase().replace(/[.,!?;:"']/g,'').replace(/\s+/g,' ').trim(); }

/* ================= 데이터 로딩 ================= */
async function loadData(){
  const res = await fetch('data.xlsx', { cache:'no-store' });
  if (!res.ok) throw new Error('data.xlsx 파일을 찾을 수 없어요 (' + res.status + ')');
  const buf = await res.arrayBuffer();
  const wb = XLSX.read(buf, { type:'array' });

  const findSheet = (keyword)=>{
    const name = wb.SheetNames.find(n=>n.replace(/\s/g,'').includes(keyword));
    return name ? wb.Sheets[name] : null;
  };
  const parse = (sheet, enKeyword)=>{
    if (!sheet) return [];
    const rows = XLSX.utils.sheet_to_json(sheet, { header:1, defval:'' });
    if (!rows.length) return [];
    const header = rows[0].map(h=>String(h).replace(/\s/g,''));
    let enCol = header.findIndex(h=>h.includes(enKeyword));
    let koCol = header.findIndex(h=>h.includes('뜻') || h.includes('의미'));
    if (enCol < 0) enCol = 1;      // 기본: 두번째 열
    if (koCol < 0) koCol = 2;      // 기본: 세번째 열
    const out = [];
    for (let i=1;i<rows.length;i++){
      const en = String(rows[i][enCol]??'').trim();
      const ko = String(rows[i][koCol]??'').trim();
      if (en && ko) out.push({ en, ko });
    }
    return out;
  };

  DATA.words     = parse(findSheet('단어'), '단어');
  DATA.sentences = parse(findSheet('문장'), '문장');

  if (!DATA.words.length && !DATA.sentences.length)
    throw new Error('엑셀에서 단어/문장을 읽지 못했어요. 시트 이름(단어/문장)과 열(단어/문장/뜻)을 확인해 주세요.');
}

/* ================= 홈 ================= */
function goHome(){
  state.cat = null; state.mode = null;
  ['words','sentences'].forEach(cat=>{
    document.getElementById('count-'+cat).textContent = DATA[cat].length + '개';
    document.getElementById('mastery-'+cat).textContent =
      '🌸 ' + masteredCount(cat) + '/' + DATA[cat].length;
  });
  updateStarUI();
  updateCoinUI();
  refreshAvatars();
  show('home');
}

/* ================= 단어 도감 ================= */
function openBook(){
  const box = document.getElementById('book-list');
  box.innerHTML = '';
  let totalMastered = 0, total = 0;

  [['words','🔤 단어'], ['sentences','📖 문장']].forEach(([cat, label])=>{
    if (!DATA[cat].length) return;
    const group = document.createElement('div'); group.className = 'book-group';
    const h = document.createElement('h3');
    h.textContent = `${label}  (🌸 ${masteredCount(cat)}/${DATA[cat].length})`;
    group.appendChild(h);

    const rows = document.createElement('div'); rows.className = 'book-rows';
    // 약한 것부터 보이도록 정렬
    const sorted = DATA[cat].slice().sort((a,b)=> levelOfItem(cat,a.en) - levelOfItem(cat,b.en));
    sorted.forEach(it=>{
      const lv = levelOfItem(cat, it.en);
      const rec = getRec(cat, it.en);
      total++; if (lv === 2) totalMastered++;
      const row = document.createElement('div');
      row.className = 'book-row'; row.dataset.lv = lv;
      row.innerHTML =
        `<span class="lv" title="${LEVELS[lv].name}">${LEVELS[lv].icon}</span>` +
        `<span class="en"></span><span class="ko"></span>` +
        `<span class="cnt">${rec ? '○'+rec.correct+' ✕'+rec.wrong : ''}</span>`;
      row.querySelector('.en').textContent = it.en;
      row.querySelector('.ko').textContent = it.ko;
      rows.appendChild(row);
    });
    group.appendChild(rows);
    box.appendChild(group);
  });

  document.getElementById('book-summary').textContent =
    total ? `전체 ${total}개 중 ${totalMastered}개 마스터! 🌸` : '데이터가 없어요';
  document.getElementById('book-stars').textContent = getStars();
  show('book');
}

/* ================= 모드 선택 ================= */
const MODES = {
  words: [
    { id:'learn',     emoji:'🃏', title:'낱말 카드', desc:'카드를 넘기며 단어와 뜻을 익혀요' },
    { id:'en2ko',     emoji:'🔤', title:'뜻 맞히기', desc:'영어 단어를 보고 뜻을 골라요' },
    { id:'ko2en',     emoji:'🇰🇷', title:'영어 맞히기', desc:'뜻을 보고 영어 단어를 골라요' },
    { id:'listen',    emoji:'👂', title:'듣고 맞히기', desc:'발음을 듣고 단어를 골라요' },
    { id:'w_write',   emoji:'✏️', title:'단어 쓰기', desc:'뜻을 보고 영어 단어를 직접 써요' },
    { id:'weak',      emoji:'🔥', title:'약한 단어만', desc:'아직 못 외운 단어만 집중 연습해요' },
  ],
  sentences: [
    { id:'learn',     emoji:'🃏', title:'문장 카드', desc:'문장과 뜻을 발음과 함께 익혀요' },
    { id:'s_mean',    emoji:'📖', title:'뜻 맞히기', desc:'영어 문장을 보고 뜻을 골라요' },
    { id:'s_order',   emoji:'🧩', title:'문장 만들기', desc:'단어를 순서대로 놓아 문장을 완성해요' },
    { id:'s_blank',   emoji:'🔎', title:'빈칸 채우기', desc:'문장의 빈칸에 알맞은 단어를 골라요' },
    { id:'s_write',   emoji:'✍️', title:'문장 쓰기', desc:'뜻을 보고 영어 문장을 직접 써요' },
    { id:'weak',      emoji:'🔥', title:'약한 문장만', desc:'아직 못 외운 문장만 집중 연습해요' },
  ],
};

function openMode(cat){
  state.cat = cat;
  const list = DATA[cat];
  document.getElementById('mode-title').textContent = cat==='words' ? '🔤 단어' : '📖 문장';
  const box = document.getElementById('mode-list');
  box.innerHTML = '';
  const enough = list.length >= 1;
  const noChoiceModes = ['learn','w_write','s_write'];
  const weakCount = list.filter(it => levelOfItem(cat, it.en) < 2).length;

  MODES[cat].forEach(m=>{
    const needsChoices = !noChoiceModes.includes(m.id);
    const disabled = !enough || (needsChoices && list.length < 2) || (m.id==='s_order' && !list.some(s=>stripPunct(s.en).split(/\s+/).length>=2));
    // 약한 단어 모드는 남은 개수를 안내에 표시
    const desc = (m.id === 'weak')
      ? (weakCount ? `아직 못 외운 ${weakCount}개만 집중 연습해요` : '전부 마스터했어요! 복습해볼까요? 🌸')
      : m.desc;

    const btn = document.createElement('button');
    btn.className = 'mode-btn';
    btn.innerHTML = `<span class="m-emoji">${m.emoji}</span><span class="m-text"><span class="m-title"></span><span class="m-desc"></span></span>`;
    btn.querySelector('.m-title').textContent = m.title;
    btn.querySelector('.m-desc').textContent = desc;
    if (disabled){ btn.style.opacity='.45'; btn.disabled=true; }
    else btn.onclick = ()=>startMode(m.id);
    box.appendChild(btn);
  });
  updateStarUI();
  show('mode');
}

function startMode(mode){
  state.mode = mode;
  if (mode==='learn') startLearn();
  else startQuiz(mode);
}

/* ================= 학습(플래시카드) ================= */
function startLearn(){
  state.learnIdx = 0;
  renderLearn();
  show('learn');
}
function renderLearn(){
  const list = DATA[state.cat];
  const item = list[state.learnIdx];
  const card = document.getElementById('flashcard');
  card.classList.remove('flipped');
  document.getElementById('flash-en').textContent = item.en;
  document.getElementById('flash-ko').textContent = item.ko;
  document.getElementById('flash-en-small').textContent = item.en;
  document.getElementById('learn-progress').textContent = (state.learnIdx+1)+' / '+list.length;
  document.getElementById('learn-prev').disabled = state.learnIdx===0;
  const nextBtn = document.getElementById('learn-next');
  nextBtn.textContent = state.learnIdx===list.length-1 ? '끝! 🎉' : '다음 ▶';
}

/* ================= 퀴즈 공통 ================= */
const QUIZ_LEN = 10; // 최대 문항 수 (데이터가 적으면 그만큼만)

function startQuiz(mode){
  const list = DATA[state.cat];
  let pool = list.slice();
  let renderType = mode;
  let weakOnly = false;

  // 🔥 약한 단어만: 아직 마스터하지 않은 것만 모아서 기본 유형으로 출제
  if (mode === 'weak'){
    renderType = (state.cat === 'words') ? 'en2ko' : 's_mean';
    weakOnly = true;
    pool = pool.filter(it => levelOfItem(state.cat, it.en) < 2);
    if (!pool.length) pool = list.slice();   // 전부 마스터했다면 전체에서 복습
  }

  if (renderType === 's_order') pool = pool.filter(s => stripPunct(s.en).split(/\s+/).length >= 2);

  const n = Math.min(QUIZ_LEN, pool.length);
  // 약한 단어만 모드는 이미 걸러졌으니 단순 셔플, 그 외엔 숙련도 가중치 추첨
  const items = weakOnly ? shuffle(pool).slice(0, n) : weightedSample(pool, n, state.cat);

  state.quiz = { mode: renderType, items, i:0, score:0, answered:false, newlyMastered:[] };
  renderQuestion();
  show('quiz');
}

function renderQuestion(){
  const q = state.quiz;
  q.answered = false;
  const item = q.items[q.i];
  const list = DATA[state.cat];

  // 진행바 / 점수
  document.getElementById('quiz-bar').style.width = ((q.i)/q.items.length*100)+'%';
  document.getElementById('quiz-score').textContent = q.score;
  document.getElementById('quiz-feedback').textContent = '';
  document.getElementById('quiz-feedback').className = 'feedback';
  setQuizFace('happy');

  const promptEl = document.getElementById('quiz-prompt');
  const optionsEl = document.getElementById('quiz-options');
  const orderEl = document.getElementById('quiz-order');
  const soundBtn = document.getElementById('quiz-sound');
  const instr = document.getElementById('quiz-instruction');

  promptEl.className = 'quiz-prompt';
  optionsEl.innerHTML = ''; optionsEl.style.display='grid';
  orderEl.className = 'order-area'; orderEl.innerHTML='';
  const writeEl = document.getElementById('quiz-write');
  writeEl.className = 'write-area'; writeEl.innerHTML='';
  soundBtn.style.display = 'none';
  soundBtn.onclick = null;

  const mkChoices = (correct, getText)=>{
    const distract = sample(list, 3, correct).map(getText);
    // 중복 제거 후 부족하면 채우기
    const set = new Set([getText(correct), ...distract]);
    let guard=0;
    while(set.size<Math.min(4,list.length) && guard++<50){ const r=list[Math.floor(Math.random()*list.length)]; set.add(getText(r)); }
    return shuffle([...set]);
  };

  switch(q.mode){
    /* --- 단어: 영어 → 뜻 --- */
    case 'en2ko': {
      instr.textContent = '이 단어의 뜻은?';
      promptEl.textContent = item.en;
      soundBtn.style.display='inline-block';
      soundBtn.onclick = ()=>speak(item.en, soundBtn);
      speak(item.en, soundBtn);
      renderOptions(mkChoices(item, x=>x.ko), item.ko);
      break;
    }
    /* --- 단어: 뜻 → 영어 --- */
    case 'ko2en': {
      instr.textContent = '이 뜻의 영어 단어는?';
      promptEl.textContent = item.ko; promptEl.classList.add('ko');
      renderOptions(mkChoices(item, x=>x.en), item.en, /*speakOnPick*/true);
      break;
    }
    /* --- 단어: 듣고 맞히기 --- */
    case 'listen': {
      instr.textContent = '잘 듣고 단어를 골라요 👂';
      promptEl.innerHTML = '🔊';
      soundBtn.style.display='inline-block';
      soundBtn.onclick = ()=>speak(item.en, soundBtn);
      speak(item.en, soundBtn);
      renderOptions(mkChoices(item, x=>x.en), item.en, true);
      break;
    }
    /* --- 문장: 뜻 맞히기 --- */
    case 's_mean': {
      instr.textContent = '이 문장의 뜻은?';
      promptEl.textContent = item.en;
      soundBtn.style.display='inline-block';
      soundBtn.onclick = ()=>speak(item.en, soundBtn);
      speak(item.en, soundBtn);
      renderOptions(mkChoices(item, x=>x.ko), item.ko);
      break;
    }
    /* --- 문장: 빈칸 채우기 --- */
    case 's_blank': {
      instr.textContent = '빈칸에 알맞은 단어는?';
      const words = item.en.split(/\s+/);
      const idx = pickBlankIndex(words);
      const answer = stripPunct(words[idx]);
      const shown = words.map((w,k)=> k===idx ? '<span class="blank">?</span>' : w).join(' ');
      promptEl.innerHTML = shown;
      soundBtn.style.display='inline-block';
      soundBtn.onclick = ()=>speak(item.en, soundBtn);
      // 오답: 다른 문장의 단어들에서
      const bank = [];
      list.forEach(s=> s.en.split(/\s+/).forEach(w=>{ const c=stripPunct(w); if(c && c.toLowerCase()!==answer.toLowerCase()) bank.push(c); }));
      const distract = sample([...new Set(bank)], 3, answer);
      renderOptions(shuffle([answer, ...distract]), answer, false, ()=>speak(item.en, soundBtn));
      break;
    }
    /* --- 문장: 단어 순서 배열 --- */
    case 's_order': {
      instr.textContent = '단어를 순서대로 놓아 문장을 만들어요 🧩';
      promptEl.textContent = item.ko; promptEl.classList.add('ko');
      soundBtn.style.display='inline-block';
      soundBtn.onclick = ()=>speak(item.en, soundBtn);
      optionsEl.style.display='none';
      renderOrder(item);
      break;
    }
    /* --- 단어 쓰기 --- */
    case 'w_write': {
      instr.textContent = '뜻을 보고 영어 단어를 써 보세요 ✏️';
      promptEl.textContent = item.ko; promptEl.classList.add('ko');
      soundBtn.style.display='inline-block';
      soundBtn.onclick = ()=>speak(item.en, soundBtn);
      optionsEl.style.display='none';
      renderWrite(item, false);
      break;
    }
    /* --- 문장 쓰기 --- */
    case 's_write': {
      instr.textContent = '뜻을 보고 영어 문장을 써 보세요 ✍️';
      promptEl.textContent = item.ko; promptEl.classList.add('ko');
      soundBtn.style.display='inline-block';
      soundBtn.onclick = ()=>speak(item.en, soundBtn);
      optionsEl.style.display='none';
      renderWrite(item, true);
      break;
    }
  }
}

/* --- 쓰기(타이핑) 문제 렌더링 --- */
function renderWrite(item, isSentence){
  const area = document.getElementById('quiz-write');
  area.className = 'write-area active';
  area.innerHTML = '';
  const answer = item.en;

  // 글자 수 힌트 (밑줄), 💡 누르면 앞에서부터 한 글자씩 공개
  const hint = document.createElement('div'); hint.className = 'write-hint';
  let revealed = 0;
  const draw = ()=>{
    let count = 0, html = '';
    for (const ch of answer){
      if (ch === ' '){ html += '&nbsp;&nbsp;&nbsp;'; continue; }
      if (/[.,!?;:"']/.test(ch)){ html += ch; continue; }
      count++;
      html += (count <= revealed) ? ch : '_';
      html += '&thinsp;';
    }
    hint.innerHTML = html;
  };
  draw();

  const input = document.createElement('input');
  input.type = 'text'; input.className = 'write-input';
  input.autocomplete = 'off'; input.autocapitalize = 'off'; input.spellcheck = false;
  input.setAttribute('lang','en');
  input.placeholder = isSentence ? '여기에 영어 문장을 써요' : '여기에 영어로 써요';

  const btns = document.createElement('div'); btns.className = 'write-buttons';
  const hintBtn = document.createElement('button'); hintBtn.className = 'btn-hint'; hintBtn.textContent = '💡 힌트';
  const checkBtn = document.createElement('button'); checkBtn.className = 'btn-primary'; checkBtn.textContent = '확인 ✅';
  btns.appendChild(hintBtn); btns.appendChild(checkBtn);

  const totalLetters = answer.replace(/[^A-Za-z]/g,'').length;
  hintBtn.onclick = ()=>{
    if (state.quiz.answered) return;
    if (revealed < totalLetters){ revealed++; draw(); }
    input.focus();
  };

  const check = ()=>{
    if (state.quiz.answered) return;
    const val = normWrite(input.value);
    if (!val){ flash('먼저 답을 써 보세요!','bad'); return; }
    state.quiz.answered = true;
    input.disabled = true; hintBtn.disabled = true;
    const ok = (val === normWrite(answer));
    if (ok){
      input.classList.add('correct'); speak(answer); onCorrect();
    } else {
      input.classList.add('wrong'); onWrong();
      revealed = totalLetters; draw();               // 정답 글자 모두 보여주기
      const ans = document.createElement('div'); ans.className = 'write-answer';
      ans.innerHTML = '정답은 <b>' + answer + '</b> 예요';
      area.appendChild(ans);
      speak(answer);
    }
    setTimeout(nextQuestion, ok ? 1200 : 2600);
  };
  checkBtn.onclick = check;
  input.addEventListener('keydown', e=>{ if (e.key === 'Enter') check(); });

  area.appendChild(hint); area.appendChild(input); area.appendChild(btns);
  setTimeout(()=>input.focus(), 60);
}

function pickBlankIndex(words){
  // 너무 짧은 관사 등도 포함하되, 가능하면 의미있는 단어 선택
  const idxs = words.map((_,i)=>i);
  const good = idxs.filter(i=>stripPunct(words[i]).length>=2);
  const pickFrom = good.length ? good : idxs;
  return pickFrom[Math.floor(Math.random()*pickFrom.length)];
}

function renderOptions(choices, correct, speakOnPick, onReveal){
  const optionsEl = document.getElementById('quiz-options');
  optionsEl.innerHTML='';
  choices.forEach(text=>{
    const b = document.createElement('button');
    b.className='opt-btn'; b.textContent=text;
    b.onclick = ()=>{
      if (state.quiz.answered) return;
      const ok = (text===correct);
      if (speakOnPick) speak(text);
      handleAnswer(ok, b, optionsEl, correct);
      if (onReveal) onReveal();
    };
    optionsEl.appendChild(b);
  });
}

function renderOrder(item){
  const orderEl = document.getElementById('quiz-order');
  orderEl.className='order-area active';
  const answerWords = item.en.split(/\s+/);
  const slots = document.createElement('div'); slots.className='order-slots';
  const bank = document.createElement('div'); bank.className='order-bank';
  const checkWrap = document.createElement('div'); checkWrap.className='order-check';
  const checkBtn = document.createElement('button'); checkBtn.className='btn-primary'; checkBtn.textContent='확인 ✅';
  checkWrap.appendChild(checkBtn);

  const placed = [];
  const refresh = ()=>{
    slots.innerHTML='';
    placed.forEach((w,pos)=>{
      const c=document.createElement('button'); c.className='word-chip pink'; c.textContent=w;
      c.onclick=()=>{ if(state.quiz.answered)return; placed.splice(pos,1); addChip(w); refresh(); };
      slots.appendChild(c);
    });
  };
  const addChip = (w)=>{
    const c=document.createElement('button'); c.className='word-chip'; c.textContent=w;
    c.onclick=()=>{ if(state.quiz.answered)return; c.remove(); placed.push(w); refresh(); };
    bank.appendChild(c);
  };
  shuffle(answerWords).forEach(addChip);

  checkBtn.onclick=()=>{
    if (state.quiz.answered) return;
    if (placed.length < answerWords.length){ flash('단어를 모두 놓아요!','bad',false); return; }
    const ok = placed.join(' ') === answerWords.join(' ');
    state.quiz.answered = true;
    if (ok){ speak(item.en); onCorrect(); }
    else {
      onWrong();
      // 정답 문장 보여주기
      slots.innerHTML='';
      answerWords.forEach(w=>{ const c=document.createElement('button'); c.className='word-chip'; c.textContent=w; c.style.background='var(--good)'; c.style.boxShadow='0 4px 0 #3fae70'; slots.appendChild(c); });
    }
    setTimeout(nextQuestion, ok?1200:2100);
  };

  orderEl.appendChild(slots); orderEl.appendChild(bank); orderEl.appendChild(checkWrap);
  refresh();
}

function handleAnswer(ok, btn, optionsEl, correct){
  state.quiz.answered = true;
  optionsEl.querySelectorAll('.opt-btn').forEach(b=>{
    b.classList.add('disabled');
    if (b.textContent===correct) b.classList.add('correct');
  });
  if (ok){ btn.classList.add('correct'); onCorrect(); }
  else { btn.classList.add('wrong'); onWrong(); }
  setTimeout(nextQuestion, ok?1100:1900);
}

function onCorrect(){
  state.quiz.score++;
  document.getElementById('quiz-score').textContent = state.quiz.score;
  addStars(1);
  addCoins(1);                         // 정답마다 코인 1개
  setQuizFace('celebrate');

  const item = state.quiz.items[state.quiz.i];
  const res = record(state.cat, item.en, true);
  if (res.newlyMastered){
    state.quiz.newlyMastered.push(item.en);
    addCoins(5);                       // 새로 마스터 보너스
    flash('🌸 마스터! +🪙5','good');
    miniConfetti(30);
    return;
  }
  flash(pick(['잘했어요! 🎉','정답이에요! ⭐','최고예요! 💖','멋져요! 🌟']),'good');
  miniConfetti(18);
}
function onWrong(){
  setQuizFace('sad');
  const item = state.quiz.items[state.quiz.i];
  record(state.cat, item.en, false);   // 🌱로 강등 → 다시 자주 출제
  flash(pick(['괜찮아요, 다시 해봐요! 💪','아쉬워요! 다음엔 맞힐 거예요 🌈']),'bad');
}
function flash(msg, kind){
  const f=document.getElementById('quiz-feedback');
  f.textContent=msg; f.className='feedback '+kind;
}
function pick(a){ return a[Math.floor(Math.random()*a.length)]; }

function nextQuestion(){
  const q=state.quiz;
  q.i++;
  if (q.i >= q.items.length){ showResult(); return; }
  renderQuestion();
}

/* ================= 결과 ================= */
function showResult(){
  const q=state.quiz;
  const total=q.items.length, score=q.score;
  const ratio = score/total;
  const stars = ratio>=0.9?3 : ratio>=0.6?2 : ratio>=0.3?1 : 0;
  document.getElementById('quiz-bar').style.width='100%';

  document.getElementById('result-stars').textContent = '⭐'.repeat(stars) + '☆'.repeat(3-stars);
  document.getElementById('result-detail').textContent = `${total}문제 중 ${score}개 정답!`;

  addCoins(3);   // 퀴즈 완료 보너스
  const mastered = q.newlyMastered || [];
  document.getElementById('result-mastered').textContent =
    mastered.length ? `🌸 새로 마스터했어요: ${mastered.join(', ')}` : '';
  const title = document.getElementById('result-title');
  const cat = document.getElementById('result-cat');
  if (ratio>=0.9){ title.textContent='완벽해요! 🏆'; setMood(cat,'celebrate'); bigConfetti(); }
  else if (ratio>=0.6){ title.textContent='정말 잘했어요! 💖'; setMood(cat,'celebrate'); bigConfetti(); }
  else if (ratio>=0.3){ title.textContent='좋아요! 조금만 더 💪'; setMood(cat,'happy'); }
  else { title.textContent='다시 해볼까요? 🌈'; setMood(cat,'happy'); }

  addStars(stars); // 보너스 별
  show('result');
}

/* ================= 폭죽 ================= */
const COLORS=['#ff9ec4','#b79cff','#9be7d3','#ffe08a','#ff6fa5','#ffffff'];
function makeConfetti(count, spread){
  const layer=document.getElementById('confetti-layer');
  for(let i=0;i<count;i++){
    const c=document.createElement('div'); c.className='confetti';
    c.style.left=(Math.random()*100)+'vw';
    c.style.background=COLORS[Math.floor(Math.random()*COLORS.length)];
    c.style.animationDuration=(1.4+Math.random()*1.6)+'s';
    c.style.transform=`rotate(${Math.random()*360}deg)`;
    if (Math.random()<.5) c.style.borderRadius='50%';
    layer.appendChild(c);
    setTimeout(()=>c.remove(), 3200);
  }
}
function miniConfetti(n){ makeConfetti(n); }
function bigConfetti(){ makeConfetti(80); setTimeout(()=>makeConfetti(50),300); }

/* ================= 이벤트 연결 ================= */
function wire(){
  // 홈 카테고리
  document.querySelectorAll('.choice-card').forEach(c=> c.onclick=()=>openMode(c.dataset.cat));
  // 화면 이동
  document.querySelectorAll('[data-go]').forEach(b=> b.onclick=()=>{
    const t=b.dataset.go;
    if (t==='home') goHome();
    else if (t==='mode') openMode(state.cat);
    else if (t==='book') openBook();
    else if (t==='avatar') openAvatar();
  });

  // 도감: 기록 초기화
  document.getElementById('book-reset').onclick=()=>{
    if (!confirm('정말 모든 숙련도 기록을 지울까요?\n(모은 별은 그대로 남아요)')) return;
    resetProgress();
    openBook();
  };
  // 플래시카드
  const card=document.getElementById('flashcard');
  card.onclick=(e)=>{ if(e.target.closest('.btn-sound')) return; card.classList.toggle('flipped'); };
  document.getElementById('flash-sound').onclick=(e)=>{ e.stopPropagation(); speak(DATA[state.cat][state.learnIdx].en, e.currentTarget); };
  document.getElementById('learn-prev').onclick=()=>{ if(state.learnIdx>0){state.learnIdx--; renderLearn();} };
  document.getElementById('learn-next').onclick=()=>{
    const list=DATA[state.cat];
    if (state.learnIdx < list.length-1){ state.learnIdx++; renderLearn(); }
    else { bigConfetti(); openMode(state.cat); }
  };
  // 결과: 다시 하기
  document.getElementById('result-again').onclick=()=>{
    if (state.mode==='learn') startLearn(); else startQuiz(state.mode);
  };
}

/* ================= 시작 ================= */
async function main(){
  buildMascots();
  initVoices();
  wire();
  try{
    await loadData();
    goHome();
  }catch(err){
    document.getElementById('error-detail').textContent = err.message || String(err);
    setMood(document.querySelector('#screen-error .cat-mascot'),'sad');
    show('error');
  }
}
document.addEventListener('DOMContentLoaded', main);
