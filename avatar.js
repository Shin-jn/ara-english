/* ================= 아바타 아트 & 상점 카탈로그 =================
   3D풍(2.5D): 그라데이션 + 하이라이트 + 부드러운 그림자
   캔버스 200x240 / 얼굴 중심 (100,116)
   =============================================================== */
'use strict';

/* ---------- 색상 팔레트 ---------- */
const HAIR_COLORS = {
  hc_brown:   { name:'갈색',     l:'#a9713f', d:'#6d4322' },
  hc_dark:    { name:'진갈색',   l:'#6f4a33', d:'#3d2718' },
  hc_black:   { name:'검정',     l:'#4a4258', d:'#221d2e' },
  hc_blonde:  { name:'금발',     l:'#ffd884', d:'#d99f31' },
  hc_honey:   { name:'허니',     l:'#e8b46a', d:'#b57c2e' },
  hc_pink:    { name:'핑크',     l:'#ffb0d0', d:'#e05f96' },
  hc_lavender:{ name:'라벤더',   l:'#c9aef5', d:'#8b62d6' },
  hc_mint:    { name:'민트',     l:'#9fe3cf', d:'#46a98d' },
  hc_blue:    { name:'하늘',     l:'#a8d4ff', d:'#4e8fd4' },
  hc_red:     { name:'레드',     l:'#ff9a7a', d:'#d1502f' },
};
const SKIN_COLORS = {
  sk_light:  { name:'밝은',   l:'#ffe8d8', d:'#f6cbae' },
  sk_fair:   { name:'보통',   l:'#ffdcc4', d:'#eeb794' },
  sk_warm:   { name:'따뜻한', l:'#f6cba6', d:'#dda77c' },
  sk_tan:    { name:'태닝',   l:'#e7b088', d:'#c98a5e' },
  sk_deep:   { name:'진한',   l:'#b97a53', d:'#8d5433' },
};

/* ---------- 머리 (뒤/앞 두 겹) ---------- */
const H = 'url(#hr)';
const HAIR = {
  hair_bob: { name:'단발머리',
    back:`<path d="M42 116 q0 -68 58 -68 q58 0 58 68 l0 56 q-16 12 -30 3 l0 -32 q-28 11 -56 0 l0 32 q-14 9 -30 -3z" fill="${H}"/>`,
    front:`<path d="M46 114 q0 -66 54 -66 q54 0 54 66 q-14 -27 -32 -25 q-8 -12 -22 -10 q-14 -2 -22 10 q-18 -2 -32 25z" fill="${H}"/>` },
  hair_long: { name:'긴 생머리',
    back:`<path d="M40 114 q0 -68 60 -68 q60 0 60 68 l0 106 q-20 12 -34 2 l0 -88 q-26 11 -52 0 l0 88 q-14 10 -34 -2z" fill="${H}"/>`,
    front:`<path d="M46 114 q0 -66 54 -66 q54 0 54 66 q-14 -27 -32 -25 q-8 -12 -22 -10 q-14 -2 -22 10 q-18 -2 -32 25z" fill="${H}"/>` },
  hair_wave: { name:'웨이브',
    back:`<path d="M38 114 q0 -70 62 -70 q62 0 62 70 l0 62 q4 16 -6 24 q-10 -8 -16 4 q-8 -10 -16 0 l0 -70 q-24 10 -48 0 l0 70 q-8 -10 -16 0 q-6 -12 -16 -4 q-10 -8 -6 -24z" fill="${H}"/>`,
    front:`<path d="M46 114 q0 -66 54 -66 q54 0 54 66 q-10 -22 -26 -24 q-10 -10 -22 -6 q-14 -4 -24 8 q-20 0 -36 22z" fill="${H}"/>` },
  hair_twin: { name:'양갈래',
    back:`<path d="M42 116 q0 -68 58 -68 q58 0 58 68 l0 42 q-16 10 -30 2 l0 -22 q-28 10 -56 0 l0 22 q-14 8 -30 -2z" fill="${H}"/>
          <ellipse cx="34" cy="150" rx="17" ry="34" fill="${H}"/><ellipse cx="166" cy="150" rx="17" ry="34" fill="${H}"/>`,
    front:`<path d="M46 114 q0 -66 54 -66 q54 0 54 66 q-14 -27 -32 -25 q-8 -12 -22 -10 q-14 -2 -22 10 q-18 -2 -32 25z" fill="${H}"/>` },
  hair_pony: { name:'포니테일',
    back:`<path d="M42 116 q0 -68 58 -68 q58 0 58 68 l0 50 q-16 11 -30 2 l0 -28 q-28 10 -56 0 l0 28 q-14 9 -30 -2z" fill="${H}"/>
          <path d="M150 86 q44 20 30 76 q-5 18 -22 14 q14 -46 -22 -74z" fill="${H}"/>`,
    front:`<path d="M46 114 q0 -66 54 -66 q54 0 54 66 q-18 -28 -42 -20 q-10 -10 -24 -6 q-16 2 -42 26z" fill="${H}"/>` },
  hair_bun: { name:'올림머리',
    back:`<path d="M44 116 q0 -66 56 -66 q56 0 56 66 l0 40 q-16 10 -28 2 l0 -20 q-28 9 -56 0 l0 20 q-12 8 -28 -2z" fill="${H}"/>
          <circle cx="100" cy="36" r="22" fill="${H}"/>`,
    front:`<path d="M46 112 q0 -64 54 -64 q54 0 54 64 q-16 -24 -34 -22 q-8 -12 -20 -10 q-14 -2 -22 12 q-18 0 -32 20z" fill="${H}"/>` },
  hair_dbun: { name:'만두머리',
    back:`<path d="M44 116 q0 -66 56 -66 q56 0 56 66 l0 44 q-16 10 -28 2 l0 -24 q-28 9 -56 0 l0 24 q-12 8 -28 -2z" fill="${H}"/>
          <circle cx="44" cy="62" r="20" fill="${H}"/><circle cx="156" cy="62" r="20" fill="${H}"/>`,
    front:`<path d="M46 114 q0 -66 54 -66 q54 0 54 66 q-14 -27 -32 -25 q-8 -12 -22 -10 q-14 -2 -22 10 q-18 -2 -32 25z" fill="${H}"/>` },
  hair_braid: { name:'땋은 머리',
    back:`<path d="M42 116 q0 -68 58 -68 q58 0 58 68 l0 48 q-16 11 -30 2 l0 -26 q-28 10 -56 0 l0 26 q-14 9 -30 -2z" fill="${H}"/>
          <path d="M40 140 q-14 30 -4 60 q10 -6 18 2 q6 -32 -2 -60z" fill="${H}"/>
          <path d="M160 140 q14 30 4 60 q-10 -6 -18 2 q-6 -32 2 -60z" fill="${H}"/>`,
    front:`<path d="M46 114 q0 -66 54 -66 q54 0 54 66 q-14 -27 -32 -25 q-8 -12 -22 -10 q-14 -2 -22 10 q-18 -2 -32 25z" fill="${H}"/>` },
  hair_hime: { name:'히메컷',
    back:`<path d="M40 114 q0 -68 60 -68 q60 0 60 68 l0 100 q-18 12 -32 2 l0 -84 q-28 11 -56 0 l0 84 q-14 10 -32 -2z" fill="${H}"/>`,
    front:`<path d="M44 116 q0 -68 56 -68 q56 0 56 68 q-6 -28 -22 -30 l0 -6 q-34 8 -68 0 l0 6 q-16 2 -22 30z" fill="${H}"/>
           <path d="M44 106 l0 52 q10 6 18 0 l0 -52z" fill="${H}"/><path d="M156 106 l0 52 q-10 6 -18 0 l0 -52z" fill="${H}"/>` },
  hair_curly: { name:'곱슬머리',
    back:`<circle cx="60" cy="80" r="26" fill="${H}"/><circle cx="140" cy="80" r="26" fill="${H}"/>
          <circle cx="100" cy="58" r="30" fill="${H}"/><circle cx="48" cy="128" r="24" fill="${H}"/>
          <circle cx="152" cy="128" r="24" fill="${H}"/><circle cx="58" cy="164" r="20" fill="${H}"/>
          <circle cx="142" cy="164" r="20" fill="${H}"/>`,
    front:`<path d="M48 112 q0 -62 52 -62 q52 0 52 62 q-12 -18 -24 -16 q-6 -14 -20 -12 q-16 -2 -22 14 q-20 -4 -38 14z" fill="${H}"/>` },
  hair_short: { name:'숏컷',
    back:`<path d="M46 116 q0 -66 54 -66 q54 0 54 66 l0 20 q-14 10 -26 2 l0 -8 q-28 9 -56 0 l0 8 q-12 8 -26 -2z" fill="${H}"/>`,
    front:`<path d="M48 112 q0 -64 52 -64 q52 0 52 64 q-12 -24 -30 -22 q-10 -14 -26 -8 q-16 -6 -26 8 q-16 0 -22 22z" fill="${H}"/>` },
  hair_bangs: { name:'앞머리 단발',
    back:`<path d="M42 116 q0 -68 58 -68 q58 0 58 68 l0 60 q-16 12 -30 3 l0 -34 q-28 11 -56 0 l0 34 q-14 9 -30 -3z" fill="${H}"/>`,
    front:`<path d="M44 116 q0 -68 56 -68 q56 0 56 68 q-4 -32 -20 -34 q-36 12 -72 0 q-16 2 -20 34z" fill="${H}"/>` },
};

/* ---------- 눈 ---------- */
const iris = (cx, c1, c2) => `<ellipse cx="${cx}" cy="120" rx="11" ry="14" fill="#3f2a4d"/>
  <ellipse cx="${cx}" cy="123" rx="9" ry="10.5" fill="${c1}"/><ellipse cx="${cx}" cy="126" rx="6" ry="6" fill="${c2}" opacity=".8"/>
  <circle cx="${cx+4}" cy="115" r="4.2" fill="#fff"/><circle cx="${cx-4}" cy="126" r="2.2" fill="#fff" opacity=".9"/>`;
const brows = `<path d="M66 104 q13 -7 26 -1 M108 103 q13 -6 26 1" stroke="#5a3f52" stroke-width="3.2" fill="none" stroke-linecap="round" opacity=".85"/>`;
const EYES = {
  eyes_round:   { name:'동그란 눈', svg:iris(79,'#7b4fa8','#a97fd6') + iris(121,'#7b4fa8','#a97fd6') + brows },
  eyes_sparkle: { name:'반짝 눈',   svg:iris(79,'#4f7fd6','#82b4f5') + iris(121,'#4f7fd6','#82b4f5') + brows +
                  `<path d="M62 98 l2 6 6 2 -6 2 -2 6 -2 -6 -6 -2 6 -2z" fill="#fff3b0"/><path d="M138 98 l2 6 6 2 -6 2 -2 6 -2 -6 -6 -2 6 -2z" fill="#fff3b0"/>` },
  eyes_emerald: { name:'초록 눈',   svg:iris(79,'#3fa98a','#7fd6bc') + iris(121,'#3fa98a','#7fd6bc') + brows },
  eyes_amber:   { name:'호박 눈',   svg:iris(79,'#c98a2e','#f0c268') + iris(121,'#c98a2e','#f0c268') + brows },
  eyes_happy:   { name:'웃는 눈',   svg:`<g fill="none" stroke="#4a2f57" stroke-width="4.5" stroke-linecap="round"><path d="M69 124 q10 -13 20 0"/><path d="M111 124 q10 -13 20 0"/></g>` + brows },
  eyes_wink:    { name:'윙크',      svg:`<path d="M69 122 q10 -13 20 0" fill="none" stroke="#4a2f57" stroke-width="4.5" stroke-linecap="round"/>` + iris(121,'#7b4fa8','#a97fd6') + brows },
  eyes_star:    { name:'별 눈',     svg:`<g fill="#ff7ab0"><path d="M79 106 l4 10 11 1 -8 8 3 11 -10 -6 -10 6 3 -11 -8 -8 11 -1z"/><path d="M121 106 l4 10 11 1 -8 8 3 11 -10 -6 -10 6 3 -11 -8 -8 11 -1z"/></g>` + brows },
  eyes_heart:   { name:'하트 눈',   svg:`<g fill="#ff5e8a"><path d="M79 114 q-8 -10 -14 -3 q-6 7 14 18 q20 -11 14 -18 q-6 -7 -14 3z"/><path d="M121 114 q-8 -10 -14 -3 q-6 7 14 18 q20 -11 14 -18 q-6 -7 -14 3z"/></g>` + brows },
  eyes_sleepy:  { name:'졸린 눈',   svg:`<g fill="none" stroke="#4a2f57" stroke-width="4" stroke-linecap="round"><path d="M69 120 q10 9 20 0"/><path d="M111 120 q10 9 20 0"/></g>` + brows },
  eyes_shy:     { name:'수줍은 눈', svg:iris(79,'#b06fa8','#d9a3d0') + iris(121,'#b06fa8','#d9a3d0') +
                  `<path d="M66 100 q13 -4 26 2 M108 102 q13 -6 26 -2" stroke="#5a3f52" stroke-width="3.2" fill="none" stroke-linecap="round"/>` },
};
const MOOD_EYES = {
  celebrate:`<g fill="none" stroke="#4a2f57" stroke-width="4.5" stroke-linecap="round"><path d="M69 124 q10 -14 20 0"/><path d="M111 124 q10 -14 20 0"/></g>`,
  sad:`<g><ellipse cx="79" cy="122" rx="10" ry="11" fill="#3f2a4d"/><circle cx="82" cy="118" r="3.4" fill="#fff"/>
       <ellipse cx="121" cy="122" rx="10" ry="11" fill="#3f2a4d"/><circle cx="124" cy="118" r="3.4" fill="#fff"/>
       <path d="M66 100 q13 6 26 4 M108 104 q13 2 26 -4" stroke="#5a3f52" stroke-width="3.2" fill="none" stroke-linecap="round"/></g>`,
};

/* ---------- 입 ---------- */
const MOUTH = {
  mouth_smile: { name:'미소',     svg:`<path d="M89 146 q11 11 22 0" fill="none" stroke="#c0567a" stroke-width="3.4" stroke-linecap="round"/>` },
  mouth_grin:  { name:'활짝',     svg:`<path d="M87 144 q13 17 26 0z" fill="#ff6f95" stroke="#c0567a" stroke-width="2"/><path d="M90 145 q10 3 20 0z" fill="#fff"/>` },
  mouth_cat:   { name:'고양이 입', svg:`<path d="M88 145 q6 8 12 0 q6 8 12 0" fill="none" stroke="#c0567a" stroke-width="3.4" stroke-linecap="round"/>` },
  mouth_o:     { name:'오!',      svg:`<ellipse cx="100" cy="147" rx="6" ry="8" fill="#ff6f95" stroke="#c0567a" stroke-width="2"/>` },
  mouth_tiny:  { name:'작은 입',   svg:`<path d="M95 146 q5 6 10 0" fill="none" stroke="#c0567a" stroke-width="3.2" stroke-linecap="round"/>` },
  mouth_tongue:{ name:'메롱',     svg:`<path d="M88 144 q12 14 24 0z" fill="#ff6f95" stroke="#c0567a" stroke-width="2"/><ellipse cx="104" cy="154" rx="7" ry="6" fill="#ff9ab5"/>` },
  mouth_pout:  { name:'뾰로통',   svg:`<path d="M92 150 q8 -8 16 0" fill="none" stroke="#c0567a" stroke-width="3.4" stroke-linecap="round"/>` },
  mouth_teeth: { name:'이 보이기', svg:`<path d="M87 143 q13 16 26 0z" fill="#c0567a"/><path d="M90 144 h20 v5 h-20z" fill="#fff"/>` },
};
const MOOD_MOUTH = {
  celebrate:`<path d="M85 143 q15 20 30 0z" fill="#ff6f95" stroke="#c0567a" stroke-width="2"/><path d="M89 144 q11 4 22 0z" fill="#fff"/>`,
  sad:`<path d="M91 152 q9 -9 18 0" fill="none" stroke="#c0567a" stroke-width="3.4" stroke-linecap="round"/>`,
};

/* ---------- 옷 (모양 + 색 + 장식) ---------- */
const SHAPES = {
  dress: `<path d="M60 196 q40 -24 80 0 l18 46 q-58 16 -116 0z" fill="url(#dr)"/>
          <ellipse cx="64" cy="200" rx="14" ry="15" fill="url(#dr)"/><ellipse cx="136" cy="200" rx="14" ry="15" fill="url(#dr)"/>
          <path d="M60 196 q40 -24 80 0 l4 11 q-44 -18 -88 0z" fill="#fff" opacity=".3"/>`,
  hoodie:`<path d="M62 196 q38 -22 76 0 l14 46 q-52 14 -104 0z" fill="url(#dr)"/>
          <ellipse cx="64" cy="202" rx="15" ry="16" fill="url(#dr)"/><ellipse cx="136" cy="202" rx="15" ry="16" fill="url(#dr)"/>
          <path d="M84 194 q16 18 32 0 q-16 8 -32 0z" fill="#000" opacity=".16"/>
          <rect x="93" y="200" width="14" height="30" rx="6" fill="#000" opacity=".12"/>`,
  tee:   `<path d="M62 196 q38 -20 76 0 l12 46 q-50 14 -100 0z" fill="url(#dr)"/>
          <ellipse cx="66" cy="200" rx="13" ry="14" fill="url(#dr)"/><ellipse cx="134" cy="200" rx="13" ry="14" fill="url(#dr)"/>
          <path d="M62 196 q38 -20 76 0 l3 10 q-42 -16 -82 0z" fill="#fff" opacity=".28"/>`,
};
const OUTFIT = {
  outfit_pink:   { name:'핑크 원피스', shape:'dress', c1:'#ffa8c8', c2:'#f0568f', deco:'' },
  outfit_purple: { name:'보라 원피스', shape:'dress', c1:'#c3a9ff', c2:'#8b62d6', deco:'' },
  outfit_mint:   { name:'민트 원피스', shape:'dress', c1:'#9fe3cf', c2:'#3fa98a', deco:'' },
  outfit_hoodie: { name:'후드티',     shape:'hoodie', c1:'#b7a2ff', c2:'#7d5ce0', deco:'' },
  outfit_hoodpk: { name:'핑크 후드',  shape:'hoodie', c1:'#ffb8d4', c2:'#e8629b', deco:'' },
  outfit_tee:    { name:'하늘 티셔츠', shape:'tee', c1:'#a8d8ff', c2:'#5a9fd8', deco:'' },
  outfit_stripe: { name:'줄무늬 티',  shape:'tee', c1:'#ffffff', c2:'#e8e2ee',
                   deco:`<path d="M58 208 h84 M58 220 h88 M58 232 h88" stroke="#7ed7c1" stroke-width="7" opacity=".9"/>` },
  outfit_star:   { name:'별 원피스',  shape:'dress', c1:'#8fd0ff', c2:'#4a86d0',
                   deco:`<path d="M100 212 l5 13 14 1 -11 9 4 14 -12 -8 -12 8 4 -14 -11 -9 14 -1z" fill="#fff3b0"/>` },
  outfit_heart:  { name:'하트 티',    shape:'tee', c1:'#fff0f6', c2:'#ffc9de',
                   deco:`<path d="M100 214 q-9 -11 -17 -3 q-7 8 17 22 q24 -14 17 -22 q-8 -8 -17 3z" fill="#ff5e8a"/>` },
  outfit_gown:   { name:'공주 드레스', shape:'dress', c1:'#fff6fb', c2:'#ffd0e6',
                   deco:`<path d="M60 210 q40 12 80 0 l2 8 q-42 12 -84 0z" fill="#ffd34a" opacity=".9"/>
                         <circle cx="100" cy="200" r="6" fill="#ffd34a"/>` },
  outfit_sailor: { name:'세일러복',   shape:'tee', c1:'#ffffff', c2:'#e6ecf5',
                   deco:`<path d="M78 194 q22 26 44 0 l6 12 q-28 22 -56 0z" fill="#5a9fd8"/>
                         <path d="M96 208 l8 0 -4 16z" fill="#ff5e8a"/>` },
  outfit_cardi:  { name:'가디건',     shape:'hoodie', c1:'#ffe0a8', c2:'#e0a53a',
                   deco:`<path d="M100 196 l0 46" stroke="#fff" stroke-width="4" opacity=".7"/>` },
};

/* ---------- 동물 귀 ---------- */
const EARS = {
  none:      { name:'없음', svg:'' },
  ear_cat:   { name:'고양이 귀', svg:`<path d="M54 60 l8 -34 30 20z" fill="url(#hr)"/><path d="M146 60 l-8 -34 -30 20z" fill="url(#hr)"/>
               <path d="M62 54 l4 -19 15 10z" fill="#ffb3c6"/><path d="M138 54 l-4 -19 -15 10z" fill="#ffb3c6"/>` },
  ear_rabbit:{ name:'토끼 귀', svg:`<ellipse cx="72" cy="26" rx="12" ry="34" transform="rotate(-14 72 26)" fill="url(#hr)"/>
               <ellipse cx="128" cy="26" rx="12" ry="34" transform="rotate(14 128 26)" fill="url(#hr)"/>
               <ellipse cx="72" cy="28" rx="6" ry="22" transform="rotate(-14 72 28)" fill="#ffb3c6"/>
               <ellipse cx="128" cy="28" rx="6" ry="22" transform="rotate(14 128 28)" fill="#ffb3c6"/>` },
  ear_bear:  { name:'곰 귀',   svg:`<circle cx="58" cy="48" r="19" fill="url(#hr)"/><circle cx="142" cy="48" r="19" fill="url(#hr)"/>
               <circle cx="58" cy="48" r="10" fill="#ffb3c6"/><circle cx="142" cy="48" r="10" fill="#ffb3c6"/>` },
  ear_puppy: { name:'강아지 귀', svg:`<ellipse cx="46" cy="106" rx="15" ry="32" transform="rotate(12 46 106)" fill="url(#hr)"/>
               <ellipse cx="154" cy="106" rx="15" ry="32" transform="rotate(-12 154 106)" fill="url(#hr)"/>` },
  ear_fox:   { name:'여우 귀', svg:`<path d="M52 62 l4 -40 36 24z" fill="#ff9a5a"/><path d="M148 62 l-4 -40 -36 24z" fill="#ff9a5a"/>
               <path d="M60 56 l3 -22 18 13z" fill="#fff0e0"/><path d="M140 56 l-3 -22 -18 13z" fill="#fff0e0"/>` },
  ear_mouse: { name:'생쥐 귀', svg:`<circle cx="56" cy="52" r="22" fill="url(#hr)"/><circle cx="144" cy="52" r="22" fill="url(#hr)"/>
               <circle cx="56" cy="52" r="13" fill="#ffc2d4"/><circle cx="144" cy="52" r="13" fill="#ffc2d4"/>` },
  ear_uni:   { name:'유니콘 뿔', svg:`<path d="M100 12 l10 44 -20 0z" fill="#ffd34a" stroke="#e2a400" stroke-width="2"/>
               <path d="M94 50 l12 0 M95 42 l11 0 M96 34 l9 0" stroke="#e2a400" stroke-width="2.4"/>
               <path d="M62 56 l6 -26 24 16z" fill="url(#hr)"/><path d="M138 56 l-6 -26 -24 16z" fill="url(#hr)"/>` },
  ear_devil: { name:'악마 뿔', svg:`<path d="M64 46 q-6 -26 12 -30 q-4 14 4 28z" fill="#ff6f95"/><path d="M136 46 q6 -26 -12 -30 q4 14 -4 28z" fill="#ff6f95"/>` },
};

/* ---------- 모자 · 머리장식 ---------- */
const HAT = {
  none:       { name:'없음', svg:'' },
  hat_bow:    { name:'리본',  svg:`<g transform="translate(140 72)"><path d="M0 0 l-25 -13 q-7 13 0 26z" fill="#ff6fa5"/><path d="M0 0 l25 -13 q7 13 0 26z" fill="#ff6fa5"/><circle r="7.5" fill="#ff3d82"/></g>` },
  hat_bigbow: { name:'큰 리본', svg:`<g transform="translate(100 46)"><path d="M0 0 l-34 -18 q-9 18 0 36z" fill="#ff6fa5"/><path d="M0 0 l34 -18 q9 18 0 36z" fill="#ff6fa5"/><circle r="10" fill="#ff3d82"/><path d="M-30 -14 q10 14 0 28" fill="none" stroke="#fff" stroke-width="2" opacity=".5"/></g>` },
  hat_flower: { name:'꽃핀',   svg:`<g transform="translate(62 62)">${[0,72,144,216,288].map(a=>`<ellipse cx="${13*Math.cos(a*Math.PI/180)}" cy="${13*Math.sin(a*Math.PI/180)}" rx="9" ry="9" fill="#ff9ec4"/>`).join('')}<circle r="7" fill="#ffe08a"/></g>` },
  hat_band:   { name:'머리띠', svg:`<path d="M48 96 q52 -52 104 0 q-52 -34 -104 0z" fill="#ff9ec4"/><circle cx="100" cy="62" r="8" fill="#ff5e8a"/>` },
  hat_star:   { name:'별 핀',  svg:`<path d="M64 58 l5 12 13 1 -10 9 3 13 -11 -7 -11 7 3 -13 -10 -9 13 -1z" fill="#ffd34a" stroke="#e2a400" stroke-width="1.5"/>` },
  hat_tiara:  { name:'티아라', svg:`<path d="M64 70 q36 -22 72 0 l-6 10 q-30 -14 -60 0z" fill="#ffe9a8" stroke="#e2a400" stroke-width="2"/>
               <path d="M100 46 l6 18 -12 0z" fill="#8fd0ff" stroke="#4a86d0" stroke-width="1.5"/><circle cx="78" cy="62" r="4" fill="#ff7ab0"/><circle cx="122" cy="62" r="4" fill="#ff7ab0"/>` },
  hat_crown:  { name:'왕관',   svg:`<path d="M68 62 l9 -32 14 19 9 -25 9 25 14 -19 9 32z" fill="#ffd34a" stroke="#e2a400" stroke-width="2.5" stroke-linejoin="round"/>
               <circle cx="100" cy="40" r="4.5" fill="#ff5e8a"/><circle cx="77" cy="46" r="3.5" fill="#7ec8ff"/><circle cx="123" cy="46" r="3.5" fill="#7ec8ff"/>
               <path d="M68 62 h64 l0 8 h-64z" fill="#f0b820"/>` },
  hat_halo:   { name:'천사 고리', svg:`<ellipse cx="100" cy="28" rx="30" ry="9" fill="none" stroke="#ffe07a" stroke-width="7"/><ellipse cx="100" cy="28" rx="30" ry="9" fill="none" stroke="#fff8d0" stroke-width="2.5"/>` },
  hat_beanie: { name:'비니',   svg:`<path d="M46 82 q54 -52 108 0 q-54 -20 -108 0z" fill="#9be7d3"/><rect x="44" y="76" width="112" height="12" rx="6" fill="#6fd0b8"/><circle cx="100" cy="26" r="9" fill="#fff"/>` },
  hat_party:  { name:'파티 모자', svg:`<path d="M100 12 l24 52 -48 0z" fill="#ff8ab5" stroke="#e0568f" stroke-width="2"/>
               <path d="M84 48 l32 0 M88 36 l24 0" stroke="#fff3b0" stroke-width="4"/><circle cx="100" cy="10" r="7" fill="#ffd34a"/>` },
  hat_witch:  { name:'마녀 모자', svg:`<path d="M100 4 q22 40 34 62 q-34 12 -68 0 q12 -22 34 -62z" fill="#7d5ce0"/>
               <ellipse cx="100" cy="68" rx="46" ry="11" fill="#6a49cc"/><rect x="76" y="52" width="48" height="10" rx="4" fill="#ffd34a"/>` },
  hat_cap:    { name:'야구모자', svg:`<path d="M48 78 q52 -54 104 0z" fill="#ff8ab5"/><path d="M46 78 q-14 4 -8 14 q40 6 60 -14z" fill="#e0568f"/><circle cx="100" cy="26" r="7" fill="#fff"/>` },
};

/* ---------- 안경 · 얼굴 액세서리 ---------- */
const GLASSES = {
  none:          { name:'없음', svg:'' },
  glasses_round: { name:'동그란 안경', svg:`<g fill="rgba(255,255,255,.28)" stroke="#6b4a63" stroke-width="3"><circle cx="79" cy="120" r="15"/><circle cx="121" cy="120" r="15"/></g><path d="M94 120 h12" stroke="#6b4a63" stroke-width="3"/>` },
  glasses_heart: { name:'하트 안경', svg:`<g fill="#ff6fa5" opacity=".85"><path d="M79 114 q-8 -10 -15 -3 q-6 7 15 19 q21 -12 15 -19 q-7 -7 -15 3z"/><path d="M121 114 q-8 -10 -15 -3 q-6 7 15 19 q21 -12 15 -19 q-7 -7 -15 3z"/></g>` },
  glasses_star:  { name:'별 선글라스', svg:`<g fill="#7d5ce0"><path d="M79 106 l5 11 12 1 -9 8 3 12 -11 -6 -11 6 3 -12 -9 -8 12 -1z"/><path d="M121 106 l5 11 12 1 -9 8 3 12 -11 -6 -11 6 3 -12 -9 -8 12 -1z"/></g>` },
  glasses_sun:   { name:'선글라스', svg:`<path d="M62 112 h76 l-4 6 q-6 16 -26 14 q-8 -1 -10 -10 q-2 9 -10 10 q-20 2 -26 -14z" fill="#4a3f5a" opacity=".9"/><path d="M66 116 q6 10 16 10" stroke="#fff" stroke-width="2" fill="none" opacity=".5"/>` },
  glasses_cat:   { name:'캣아이 안경', svg:`<g fill="none" stroke="#ff5e8a" stroke-width="3.4"><path d="M62 114 q10 -10 24 -2 q4 12 -10 14 q-16 2 -14 -12z"/><path d="M138 114 q-10 -10 -24 -2 q-4 12 10 14 q16 2 14 -12z"/><path d="M94 118 h12"/></g>` },
  glasses_mask:  { name:'눈가리개', svg:`<path d="M58 110 q42 -12 84 0 l0 16 q-42 12 -84 0z" fill="#ff9ec4"/><path d="M58 110 q42 -12 84 0 l0 4 q-42 -10 -84 0z" fill="#fff" opacity=".4"/>` },
  glasses_frec:  { name:'주근깨',   svg:`<g fill="#e08a6a" opacity=".75"><circle cx="72" cy="136" r="2"/><circle cx="80" cy="140" r="2"/><circle cx="64" cy="141" r="2"/><circle cx="128" cy="136" r="2"/><circle cx="120" cy="140" r="2"/><circle cx="136" cy="141" r="2"/></g>` },
};

/* ---------- 배경 ---------- */
const dots = (pts, svg) => pts.map(([x,y])=>svg(x,y)).join('');
const BG = {
  bg_plain:   { name:'기본',   c1:'#fff2f8', c2:'#ffd0e4', pattern:'' },
  bg_purple:  { name:'보라',   c1:'#f5efff', c2:'#d9c9ff', pattern:'' },
  bg_mint:    { name:'민트',   c1:'#eefaf6', c2:'#b9ecdb', pattern:'' },
  bg_hearts:  { name:'하트',   c1:'#fff0f6', c2:'#ffc9de',
    pattern:dots([[30,44],[166,58],[46,158],[158,176],[100,206]], (x,y)=>`<path d="M${x} ${y+5} q-8 -10 -16 -2 q-6 6 16 16 q22 -10 16 -16 q-8 -8 -16 2z" fill="#ff9ec4" opacity=".5"/>`) },
  bg_stars:   { name:'별',     c1:'#f2eeff', c2:'#cdbcff',
    pattern:dots([[30,44],[168,52],[46,154],[156,178],[96,208],[122,112]], (x,y)=>`<path d="M${x} ${y-9} l3.5 9 9 1 -7 7 2 9 -7.5 -4.5 -7.5 4.5 2 -9 -7 -7 9 -1z" fill="#b79cff" opacity=".65"/>`) },
  bg_flower:  { name:'꽃밭',   c1:'#fffbf0', c2:'#ffe6b8',
    pattern:dots([[32,50],[168,64],[44,164],[160,182]], (x,y)=>`<g transform="translate(${x} ${y})">${[0,72,144,216,288].map(a=>`<ellipse cx="${9*Math.cos(a*Math.PI/180)}" cy="${9*Math.sin(a*Math.PI/180)}" rx="6" ry="6" fill="#ffb3d1" opacity=".7"/>`).join('')}<circle r="5" fill="#ffe08a"/></g>`) },
  bg_bubble:  { name:'물방울', c1:'#eef8ff', c2:'#bfe2ff',
    pattern:dots([[36,54],[164,44],[52,170],[150,166],[100,200]], (x,y)=>`<circle cx="${x}" cy="${y}" r="13" fill="#fff" opacity=".55"/><circle cx="${x-4}" cy="${y-4}" r="4" fill="#fff" opacity=".8"/>`) },
  bg_rainbow: { name:'무지개', c1:'#fff8fb', c2:'#ffe9f4',
    pattern:['#ff9ec4','#ffcf8a','#ffe08a','#9be7d3','#9bc5ff','#b79cff'].map((c,i)=>`<path d="M-24 260 A ${140-i*17} ${140-i*17} 0 0 1 224 260" fill="none" stroke="${c}" stroke-width="13" opacity=".85"/>`).join('') },
  bg_night:   { name:'밤하늘', c1:'#4c4278', c2:'#2b2547',
    pattern:`<circle cx="152" cy="46" r="22" fill="#fff3b0"/><circle cx="142" cy="41" r="22" fill="#3a3560"/>` +
      dots([[30,40],[62,84],[100,28],[172,112],[40,160],[122,182],[80,150]], (x,y)=>`<circle cx="${x}" cy="${y}" r="2.2" fill="#fff" opacity=".9"/>`) },
  bg_sunset:  { name:'노을',   c1:'#ffd9a8', c2:'#ff9ec4', pattern:`<circle cx="100" cy="150" r="42" fill="#fff0c0" opacity=".55"/>` },
  bg_candy:   { name:'사탕',   c1:'#fff0fa', c2:'#ffc2ec',
    pattern:dots([[34,52],[166,60],[44,160],[158,172]], (x,y)=>`<circle cx="${x}" cy="${y}" r="11" fill="#fff" opacity=".7"/><path d="M${x-11} ${y} a11 11 0 0 1 22 0z" fill="#ff8ab5" opacity=".8"/>`) },
  bg_sparkle: { name:'반짝반짝', c1:'#fffdf2', c2:'#ffe7f2',
    pattern:dots([[34,46],[164,54],[50,150],[152,168],[100,196],[128,100],[70,110]], (x,y)=>`<path d="M${x} ${y-11} q2 9 11 11 q-9 2 -11 11 q-2 -9 -11 -11 q9 -2 11 -11z" fill="#ffd34a" opacity=".8"/>`) },
};

/* ---------- 상점 카탈로그 (알뜰 가격) ---------- */
const WARDROBE = {
  hair:      { label:'머리', items:[
    { id:'hair_bob', price:0 }, { id:'hair_long', price:30 }, { id:'hair_bangs', price:30 },
    { id:'hair_twin', price:45 }, { id:'hair_pony', price:45 }, { id:'hair_wave', price:60 },
    { id:'hair_bun', price:60 }, { id:'hair_dbun', price:70 }, { id:'hair_braid', price:70 },
    { id:'hair_hime', price:85 }, { id:'hair_curly', price:85 }, { id:'hair_short', price:40 },
  ]},
  hairColor: { label:'머리색', items:[
    { id:'hc_brown', price:0 }, { id:'hc_dark', price:20 }, { id:'hc_black', price:20 },
    { id:'hc_blonde', price:35 }, { id:'hc_honey', price:35 }, { id:'hc_red', price:45 },
    { id:'hc_pink', price:60 }, { id:'hc_lavender', price:60 }, { id:'hc_mint', price:70 }, { id:'hc_blue', price:70 },
  ]},
  skinColor: { label:'피부색', items:[
    { id:'sk_light', price:0 }, { id:'sk_fair', price:0 }, { id:'sk_warm', price:0 },
    { id:'sk_tan', price:0 }, { id:'sk_deep', price:0 },
  ]},
  eyes:      { label:'눈', items:[
    { id:'eyes_round', price:0 }, { id:'eyes_happy', price:20 }, { id:'eyes_wink', price:30 },
    { id:'eyes_sleepy', price:25 }, { id:'eyes_shy', price:35 }, { id:'eyes_emerald', price:45 },
    { id:'eyes_amber', price:45 }, { id:'eyes_sparkle', price:65 }, { id:'eyes_star', price:80 }, { id:'eyes_heart', price:90 },
  ]},
  mouth:     { label:'입', items:[
    { id:'mouth_smile', price:0 }, { id:'mouth_grin', price:20 }, { id:'mouth_tiny', price:20 },
    { id:'mouth_cat', price:30 }, { id:'mouth_o', price:25 }, { id:'mouth_pout', price:30 },
    { id:'mouth_teeth', price:35 }, { id:'mouth_tongue', price:45 },
  ]},
  outfit:    { label:'옷', items:[
    { id:'outfit_pink', price:0 }, { id:'outfit_purple', price:30 }, { id:'outfit_mint', price:30 },
    { id:'outfit_tee', price:35 }, { id:'outfit_stripe', price:45 }, { id:'outfit_hoodie', price:50 },
    { id:'outfit_hoodpk', price:50 }, { id:'outfit_heart', price:60 }, { id:'outfit_cardi', price:60 },
    { id:'outfit_star', price:75 }, { id:'outfit_sailor', price:90 }, { id:'outfit_gown', price:120 },
  ]},
  ears:      { label:'동물 귀', items:[
    { id:'none', price:0 }, { id:'ear_cat', price:50 }, { id:'ear_rabbit', price:55 },
    { id:'ear_bear', price:55 }, { id:'ear_mouse', price:60 }, { id:'ear_puppy', price:60 },
    { id:'ear_fox', price:75 }, { id:'ear_devil', price:80 }, { id:'ear_uni', price:130 },
  ]},
  hat:       { label:'모자', items:[
    { id:'none', price:0 }, { id:'hat_bow', price:25 }, { id:'hat_star', price:30 },
    { id:'hat_flower', price:35 }, { id:'hat_band', price:35 }, { id:'hat_bigbow', price:45 },
    { id:'hat_cap', price:45 }, { id:'hat_beanie', price:50 }, { id:'hat_party', price:55 },
    { id:'hat_halo', price:80 }, { id:'hat_witch', price:90 }, { id:'hat_tiara', price:110 },
    { id:'hat_crown', price:150 },
  ]},
  glasses:   { label:'액세서리', items:[
    { id:'none', price:0 }, { id:'glasses_frec', price:20 }, { id:'glasses_round', price:35 },
    { id:'glasses_cat', price:45 }, { id:'glasses_sun', price:50 }, { id:'glasses_mask', price:55 },
    { id:'glasses_heart', price:65 }, { id:'glasses_star', price:75 },
  ]},
  bg:        { label:'배경', items:[
    { id:'bg_plain', price:0 }, { id:'bg_purple', price:25 }, { id:'bg_mint', price:25 },
    { id:'bg_hearts', price:40 }, { id:'bg_stars', price:40 }, { id:'bg_bubble', price:45 },
    { id:'bg_flower', price:50 }, { id:'bg_candy', price:55 }, { id:'bg_sparkle', price:60 },
    { id:'bg_sunset', price:70 }, { id:'bg_rainbow', price:85 }, { id:'bg_night', price:85 },
  ]},
};
const CAT_ORDER = ['hair','hairColor','eyes','mouth','outfit','ears','hat','glasses','skinColor','bg'];

/* 아이템 이름 찾기 */
const NAME_MAPS = { hair:HAIR, hairColor:HAIR_COLORS, skinColor:SKIN_COLORS, eyes:EYES,
                    mouth:MOUTH, outfit:OUTFIT, ears:EARS, hat:HAT, glasses:GLASSES, bg:BG };
function itemName(cat, id){
  if (id === 'none') return '없음';
  const m = NAME_MAPS[cat];
  return (m && m[id] && m[id].name) || id;
}

/* ---------- 기본 착용 ---------- */
const DEFAULT_EQUIP = {
  bg:'bg_plain', hair:'hair_bob', hairColor:'hc_brown', skinColor:'sk_light',
  eyes:'eyes_round', mouth:'mouth_smile', outfit:'outfit_pink', ears:'none', hat:'none', glasses:'none',
};

/* ---------- SVG 합성 ---------- */
/* 한 페이지에 아바타 SVG가 여러 개 들어가므로 defs의 id가 겹치면
   브라우저가 엉뚱한(또는 숨겨진) 정의를 참조해 그림이 안 그려진다.
   → SVG 하나마다 고유 접미사를 붙여 준다. */
let __avatarUid = 0;
const DEF_IDS = ['bgG','soft','sh','sk','hr','dr','ch'];
function uniquifyIds(svg){
  const u = '_' + (++__avatarUid).toString(36);
  const re = new RegExp('(id="|url\\(#)(' + DEF_IDS.join('|') + ')(?=["\\)])', 'g');
  return svg.replace(re, (m, pre, id) => pre + id + u);
}

function avatarSVG(eq, mood){
  eq = Object.assign({}, DEFAULT_EQUIP, eq || {});
  const hc  = HAIR_COLORS[eq.hairColor] || HAIR_COLORS.hc_brown;
  const sk  = SKIN_COLORS[eq.skinColor] || SKIN_COLORS.sk_light;
  const hair= HAIR[eq.hair] || HAIR.hair_bob;
  const of  = OUTFIT[eq.outfit] || OUTFIT.outfit_pink;
  const bg  = BG[eq.bg] || BG.bg_plain;

  let eyesSvg  = (EYES[eq.eyes] || EYES.eyes_round).svg;
  let mouthSvg = (MOUTH[eq.mouth] || MOUTH.mouth_smile).svg;
  if (mood === 'celebrate'){ eyesSvg = MOOD_EYES.celebrate; mouthSvg = MOOD_MOUTH.celebrate; }
  else if (mood === 'sad'){ eyesSvg = MOOD_EYES.sad; mouthSvg = MOOD_MOUTH.sad; }

  return uniquifyIds(`<svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
<defs>
 <linearGradient id="bgG" x1="0%" y1="0%" x2="60%" y2="100%"><stop offset="0" stop-color="${bg.c1}"/><stop offset="1" stop-color="${bg.c2}"/></linearGradient>
 <radialGradient id="sk" cx="38%" cy="30%" r="76%"><stop offset="0" stop-color="${sk.l}"/><stop offset="1" stop-color="${sk.d}"/></radialGradient>
 <linearGradient id="hr" x1="18%" y1="0%" x2="86%" y2="100%"><stop offset="0" stop-color="${hc.l}"/><stop offset="1" stop-color="${hc.d}"/></linearGradient>
 <linearGradient id="dr" x1="15%" y1="0%" x2="90%" y2="100%"><stop offset="0" stop-color="${of.c1}"/><stop offset="1" stop-color="${of.c2}"/></linearGradient>
 <radialGradient id="ch" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ff8fae" stop-opacity=".7"/><stop offset="1" stop-color="#ff8fae" stop-opacity="0"/></radialGradient>
 <filter id="sh" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#6b3a5a" flood-opacity=".26"/></filter>
 <filter id="soft" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="6"/></filter>
</defs>
<rect width="200" height="240" fill="url(#bgG)"/>
${bg.pattern}
<ellipse cx="100" cy="230" rx="60" ry="11" fill="#000" opacity=".13" filter="url(#soft)"/>
<g filter="url(#sh)">
  ${hair.back}
  ${SHAPES[of.shape] || SHAPES.dress}
  ${of.deco}
  <rect x="91" y="158" width="18" height="26" rx="9" fill="url(#sk)"/>
  <ellipse cx="100" cy="116" rx="53" ry="56" fill="url(#sk)"/>
  <ellipse cx="80" cy="94" rx="26" ry="18" fill="#fff" opacity=".2"/>
  ${hair.front}
  <path d="M72 60 q26 -13 54 2 q-24 -5 -54 -2z" fill="#fff" opacity=".33"/>
  <ellipse cx="72" cy="140" rx="13" ry="9" fill="url(#ch)"/>
  <ellipse cx="128" cy="140" rx="13" ry="9" fill="url(#ch)"/>
  ${eyesSvg}
  <path d="M97 132 q3 3 6 0" fill="none" stroke="${sk.d}" stroke-width="2.2" stroke-linecap="round"/>
  ${mouthSvg}
  ${(EARS[eq.ears] || EARS.none).svg}
  ${(GLASSES[eq.glasses] || GLASSES.none).svg}
  ${(HAT[eq.hat] || HAT.none).svg}
</g></svg>`);
}
