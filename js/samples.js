/* 단독 모드용 샘플 참가자(12명) 데이터 — 실시간 공유가 켜지면 사용되지 않습니다 */
(function () {
  const ST = window.ST;
  const D = () => ST.D;
  const NAMES = ['지수', '민준', '서연', '도윤', '하은', '시우', '유나', '준서', '채원', '예준', '소율', '건우'];
  const TYPES = ['ENFP', 'ISTJ', 'INFJ', 'ENTJ', 'ISFP', 'ESTP', 'ESFJ', 'INTP', 'ENFJ', 'ISFJ', 'INFP', 'ESTJ'];
  const ids = NAMES.map((_, i) => 's' + String(i + 1).padStart(2, '0'));
  let tree = null;

  function build() {
    const R = ST.rng(20261021), rnd = () => R();
    const pick = (a) => a[Math.floor(rnd() * a.length)];
    const ri = (a, b) => a + Math.floor(rnd() * (b - a + 1));
    const shuffle = (a) => { const x = a.slice(); for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; } return x; };
    const d = D();
    const T = { users: {}, prog: {} };
    ids.forEach((u, i) => {
      T.users[u] = { name: NAMES[i], t: 1 };
      T.prog[u] = {}; const n = i === 11 ? 6 : i === 10 ? 7 : 9;
      for (let c = 1; c <= n; c++) T.prog[u]['c' + c] = 1;
    });
    const quiz = (qs) => { const o = {}; ids.forEach((u) => { o[u] = {}; qs.forEach((a, k) => { if (rnd() < 0.92) o[u][k] = rnd() < 0.78 ? a : (a + 1 + ri(0, 2)) % 4; }); }); return o; };
    const CH = ST.chapters, qa = (n) => CH.find((c) => c.n === n).quiz.map((q) => q.a);

    /* 각 사람의 문항 결과 글자(7장의 ‘결과’), 최적합 글자 */
    const REP = {}, FIT = {};
    ids.forEach((u, i) => {
      const t = TYPES[i]; FIT[u] = t;
      REP[u] = t.split('');
      if (i === 2) REP[u][3] = 'P';   // 서연: 문항 결과는 P, 최적합은 J
      if (i === 5) REP[u][3] = 'J';   // 시우: 문항 결과는 J, 최적합은 P
      if (i === 10) REP[u][2] = 'T';  // 소율: 문항 결과는 T, 최적합은 F
    });
    const DOMS = [5, 6, 6, 7, 7, 8];
    const dom = {};
    ids.forEach((u, i) => { dom[u] = d.PAIRS.map(() => pick(DOMS)); });
    ids.forEach((u, i) => { if (i === 2) dom[u][3] = 5; if (i === 5) dom[u][3] = 5; if (i === 10) dom[u][2] = 5; if (i === 9) dom[u][0] = 4; /* 예준: 동점 */ });

    /* c1 */
    const MY = ST.CH1.MYTHS;
    const GOALS = ['회의에서 덜 부딪히는 방법을 알고 싶다', '팀원의 성향을 존중하는 소통법을 배우고 싶다', '리더로서 구성원에 맞게 말하고 싶다', '내가 지치는 순간을 알아차리고 싶다', '협업 갈등을 줄이는 팁을 얻고 싶다', '진로를 다시 생각해 보고 싶다', '신규 팀원 온보딩에 활용하고 싶다', '스트레스 대처법을 찾고 싶다'];
    const c1 = { q: quiz(qa(1)) };
    ids.forEach((u, i) => {
      const myth = {}; MY.forEach((m, k) => { myth[k] = rnd() < (k === 4 ? 0.55 : 0.82) ? m.a : 1 - m.a; });
      const kw = {}; const n = ri(1, 3); while (Object.keys(kw).length < n) kw[ri(0, ST.CH1.KW.length - 1)] = 1;
      c1[u] = { myth, kw }; if (i < 8) c1[u].goal = GOALS[i];
    });
    T.c1 = c1;

    /* c2 */
    const c2 = { q: quiz(qa(2)) };
    const NOTES = ['즉흥 발표를 요청받았을 때', '하루 종일 혼자 보고서만 쓸 때', '계획 없이 바로 현장에 투입될 때', '낯선 사람들 앞에서 먼저 말을 걸어야 할 때', '자잘한 세부 확인을 몇 시간 계속할 때'];
    ids.forEach((u, i) => {
      const p = { ease: ri(4, 5), speed: ri(4, 5), sat: ri(3, 5), focus: ri(1, 2) };
      const n = { ease: ri(1, 3), speed: ri(1, 3), sat: ri(1, 3), focus: ri(3, 5) };
      c2[u] = { hand: i === 4 ? 'L' : i === 8 ? 'B' : 'R', p, n }; if (i < 5) c2[u].note = NOTES[i];
    });
    T.c2 = c2;

    /* c3~c6 */
    const WSROWS = d.PAIRS.map((p) => d.WS[p.k].length);
    d.PAIRS.forEach((p, pi) => {
      const doc = { q: quiz(qa(3 + pi)) };
      ids.forEach((u, i) => {
        const L = REP[u][pi], other = L === p.a ? p.b : p.a, n = d.N_ITEMS;
        let a = dom[u][pi], tie = a === 4;
        const arr = [];
        for (let k = 0; k < n; k++) arr.push(k < a ? L : other);
        const ans = {}; shuffle(arr).forEach((x, k) => (ans[k] = x));
        /* 동점이면 보고 글자는 b(I/N/F/P)이므로 위 L(=type[pi])과 같게 맞춘다 */
        const est = rnd() < 0.82 ? FIT[u][pi] : (rnd() < 0.5 ? '?' : (FIT[u][pi] === p.a ? p.b : p.a));
        const ws = {}; for (let k = 0; k < WSROWS[pi]; k++) ws[k] = rnd() < 0.8 ? FIT[u][pi] : (FIT[u][pi] === p.a ? p.b : p.a);
        doc[u] = { est, ans, ws };
      });
      T['c' + (3 + pi)] = doc;
    });

    /* c7 */
    const c7 = { q: quiz(qa(7)) };
    const WHY = { 2: 'J/P는 근소해서 두 설명을 읽고 J로 정했다', 5: '문항은 J였지만 즉흥적으로 움직이는 내 모습이 P에 더 가깝다', 10: '결과는 T였지만 사람의 마음이 먼저 보여 F로 결정했다' };
    ids.forEach((u, i) => {
      const r = d.PAIRS.map((p, pi) => { const s = d.score(p.k, ST.arr(T['c' + (3 + pi)][u].ans)); return s; });
      c7[u] = { fit: FIT[u], rep: r.map((s) => s.letter).join(''), est: T.c3[u].est + T.c4[u].est + T.c5[u].est + T.c6[u].est, clar: r.map((s) => (s.tie ? 0 : s.clarity)) };
      if (WHY[i]) c7[u].why = WHY[i];
    });
    T.c7 = c7;

    /* c8 */
    const c8 = { q: quiz(qa(8)) };
    const STR = ['사람들 이야기를 끌어내 아이디어를 모아요', '일정과 세부를 놓치지 않고 정리해요', '복잡한 상황에서도 사람 마음을 먼저 살펴요', '큰 그림을 그리고 결정을 빠르게 내려요', '조용히 곁에서 팀을 돕는 일을 잘해요', '위기 상황에서 바로 움직여 해결해요', '모두가 편안하게 일하도록 분위기를 챙겨요', '논리의 허점을 찾아 정확도를 높여요', '사람들의 성장 가능성을 알아봐요', '약속한 일은 끝까지 책임져요', '의미 있는 일에 깊이 몰입해요', '목표와 절차를 분명히 세워 실행해요'];
    const CARE = ['결정 전에 하루만 생각할 시간을 주세요', '변경 사항은 미리 알려 주세요', '비판은 구체적으로, 따뜻하게요', '결론과 근거를 먼저 말해 주세요', '재촉보다 신뢰를 보여 주세요', '세부 계획은 유연하게 열어 둬요', '고마움을 말로 표현해 주세요', '가설은 근거와 함께 제안해 주세요', '갈등은 일찍 꺼내서 이야기해요', '준비할 수 있게 안건을 미리 공유해요', '가치가 존중받는 느낌이 필요해요', '역할과 기대를 분명하게 말해 주세요'];
    ids.forEach((u, i) => {
      const code = i === 3 ? 'ENTJ' : FIT[u];
      const t = d.TYPES[code];
      const like = {}, watch = {};
      t.like.forEach((_, k) => { if (rnd() < 0.72) like[`${code}-${k}`] = 1; });
      t.watch.forEach((_, k) => { if (rnd() < 0.5) watch[`${code}-${k}`] = 1; });
      c8[u] = { type: code, like, watch, mine: 1 };
      if (i < 10) { c8[u].str = STR[i]; c8[u].care = CARE[i]; }
    });
    c8.s05.type = 'INFP'; c8.s05.mine = 0; c8.s05.like = { 'INFP-0': 1, 'INFP-2': 1 }; c8.s05.watch = {}; // 하은은 INFP도 탐색
    T.c8 = c8;

    /* c9 */
    const c9 = { q: quiz(qa(9)) };
    const COMP = [{ ISTJ: 2, ESTJ: 1, ENTJ: 1, ESFJ: 1, ISFJ: 1 }, { ENFP: 2, INFP: 1, ENTP: 1, ESFP: 1, INTJ: 1 }, { ISTJ: 1, INFJ: 1, ENFP: 1, ESTJ: 1, ISFP: 1, ENTJ: 1 }, { ENTJ: 1, ESTJ: 1, ESTP: 1, ISTJ: 2 }, { INFP: 1, ISFP: 1, INFJ: 1, ENFP: 1 }, { ENTJ: 1, INTJ: 1, ENTP: 1, ISTP: 1 }];
    const PLEDGE = [
      { aware: '내가 먼저 말하면 조용한 동료의 의견이 묻히는 걸 알았다', value: '천천히 생각하는 동료 덕분에 위험을 먼저 발견했다', try: '회의 전날 안건을 먼저 공유한다', blend: '아이디어는 자유 토론, 결정은 기준표로 정리한다' },
      { aware: '세부 근거를 먼저 달라는 요청이 내게는 답답했다', value: '꼼꼼한 확인이 우리 팀의 실수를 막았다', try: '아이디어 앞에 구체적 사례를 하나 붙인다', blend: '큰 그림 설명 + 단계별 체크리스트를 같이 쓴다' },
      { aware: '피드백이 내게는 공격처럼 들릴 때가 있다', value: '직설적인 동료 덕분에 문제를 빨리 고쳤다', try: '피드백을 사실·영향·제안 순서로 정리해 달라고 요청한다' },
      { aware: '결정을 서두르면 팀의 반대가 늦게 터진다', value: '신중한 의견이 후속 비용을 줄여 줬다', blend: '결정 시점을 정하고 직전에 이견을 한 번 묻는다' }
    ];
    const TACT = [{ pole: 'I', i: 0 }, { pole: 'S', i: 0 }, { pole: 'F', i: 1 }, { pole: 'P', i: 1 }, { pole: 'T', i: 2 }, { pole: 'N', i: 3 }, { pole: 'E', i: 0 }, { pole: 'I', i: 1 }];
    ids.forEach((u, i) => {
      const comp = Object.assign({}, COMP[i % COMP.length]);
      if (!comp[FIT[u]]) comp[FIT[u]] = 1;
      const lead = Object.keys(comp).find((c) => c === 'ENTJ' || c === 'ESTJ') || Object.keys(comp)[0];
      c9[u] = { team: comp, leader: lead, tact: TACT[i % TACT.length], me: FIT[u] };
      if (i < 8) c9[u].pledge = PLEDGE[i % PLEDGE.length];
    });
    T.c9 = c9;
    return T;
  }

  const getAt = (o, path) => { const seg = String(path).split('/').filter(Boolean); for (const s of seg) { if (o == null || typeof o !== 'object') return undefined; o = o[s]; } return o; };
  ST.store.sampleProvider = (base) => { try { if (!tree) tree = build(); return getAt(tree, base); } catch (e) { console.error('sample build failed', e); return undefined; } };
})();
