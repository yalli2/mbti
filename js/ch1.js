/* Chapter 1 · 유형이란 무엇인가 */
(function () {
  const ST = window.ST, S = ST.store, { h, P, H3, callout, ul, figure, card, grid, empty, esc, charts: C } = ST;

  const MYTHS = [
    { t: 'MBTI는 지능이나 기술, 전문성의 수준을 재는 도구다.', a: 0, why: '능력을 재는 검사가 아닙니다. 사람이 세상을 보고 일하는 “선호”의 방향을 보여 줍니다.' },
    { t: '정답과 오답이 없다. 나에게 맞는 답만 있을 뿐이다.', a: 1, why: '좋은·나쁜 유형은 없습니다. 압박이 없을 때의 나에게 자연스러운 쪽을 고르면 됩니다.' },
    { t: '결과는 내가 할 수 있는 일과 없는 일을 알려 준다.', a: 0, why: '유형은 가능·불가능을 정하지 않습니다. 같은 일도 접근하는 방식이 다를 뿐이에요.' },
    { t: '이 도구는 정상적인 사람들 사이의 차이를 이해하려는 것이다.', a: 1, why: '병리가 아니라 “정상적인 차이”를 다룹니다. 차이를 알면 협력이 쉬워져요.' },
    { t: '유형이 같으면 성격과 행동이 모두 똑같다.', a: 0, why: '선호가 같아도 경험·가치관·환경에 따라 사람은 크게 다릅니다.' },
    { t: '사람은 자신의 심리 유형보다 훨씬 더 큰 존재다.', a: 1, why: '유형은 한 장의 지도일 뿐, 그 사람 전부가 아닙니다.' },
    { t: '네 가지 선호가 조합되어 16가지 유형이 만들어진다.', a: 1, why: 'E/I · S/N · T/F · J/P 네 쌍을 조합하면 2×2×2×2 = 16가지가 됩니다.' },
    { t: '어떤 유형은 다른 유형보다 일을 더 잘한다.', a: 0, why: '모든 유형이 각자의 강점을 가집니다. 팀에서는 다양성이 힘이 됩니다.' }
  ];
  const KW = ['나를 더 깊이 이해하기', '동료와의 소통 개선', '갈등 줄이기', '리더십 키우기', '팀 구성·역할 배치', '진로·커리어 탐색', '스트레스 관리', '다양성 존중'];
  ST.CH1 = { MYTHS, KW };

  const timeline = () => ST.fromSvg(`<svg viewBox="0 0 680 190" role="img" aria-label="융, 브릭스, 마이어스로 이어지는 유형 이론의 발전 시간선"><style>.tt{font:700 14px 'Noto Serif KR',serif;fill:var(--ink)}.ts{font:500 12px 'Noto Sans KR',sans-serif;fill:var(--ink2)}.ty{font:700 12px 'IBM Plex Mono',monospace;fill:var(--brand-d)}</style>
    <line x1="40" y1="78" x2="640" y2="78" style="stroke:var(--line)" stroke-width="4" stroke-linecap="round"/>
    ${[['1875', '칼 융', '“사람의 차이는 무작위가 아니라 패턴(유형)을 이룬다”', 80, '#8A5CD6'], ['1923', '캐서린 브릭스', '융의 『심리 유형』을 읽고 20년간 연구·적용', 240, '#D1457B'], ['1943', '이사벨 브릭스 마이어스', '융의 이론을 문항으로 옮기기 시작', 420, '#E8743B'], ['오늘', '30개 이상의 언어', '전 세계 조직에서 소통·팀·리더십 개발에 활용', 590, '#1F9D74']].map(([y, n, d, x, c]) => `<circle cx="${x}" cy="78" r="15" style="fill:${c}"/><text class="ty" x="${x}" y="48" text-anchor="middle">${y}</text><text class="tt" x="${x}" y="116" text-anchor="middle">${n}</text>${ST.wrapSvg(d, x, 136, 17)}`).join('')}
    </svg>`);
  ST.wrapSvg = (t, x, y, n) => { const words = t.split(' '), lines = []; let cur = ''; words.forEach((w) => { if ((cur + ' ' + w).trim().length > n) { lines.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); }); if (cur) lines.push(cur); return lines.map((l, i) => `<text class="ts" x="${x}" y="${y + i * 15}" text-anchor="middle">${esc(l)}</text>`).join(''); };

  ST.chapters.push({
    n: 1, key: 'c1', title: '유형이란 무엇인가', en: 'What Type Is — and Is Not', pages: '슬라이드 1–11',
    tagline: '능력이 아니라 ‘선호’ — MBTI의 목적과 한계, 그리고 융에서 마이어스까지의 이야기.',
    chips: ['정상적 차이', '정답은 없다', '오해 바로잡기'],
    goal: 'MBTI는 사람의 우열을 가르는 검사가 아닙니다. 정상적인 차이를 이해하고 더 효과적으로 함께 일하기 위한 도구라는 출발점을 확인합니다.',

    learn() {
      const is = h('div', { class: 'vs' },
        h('div', { style: { '--c': 'var(--brand)' } }, h('h4', {}, '이것이에요', h('small', {}, 'IS')), h('p', {}, '선호를 확인하는 성격 도구'),
          ul(['정상적인 사람들 사이의 <b>차이</b>를 찾아내는 도구', '<b>정답과 오답이 없고</b>, 나에게 맞는 답만 있다', '나와 타인을 이해하고 협력하는 <b>공통 언어</b>'])),
        h('div', { style: { '--c': 'var(--coral)' } }, h('h4', {}, '이것이 아니에요', h('small', {}, 'IS NOT')), h('p', {}, '능력·한계를 정하는 검사가 아님'),
          ul(['기술·지능·능력·<b>전문성</b>을 재는 것이 아니다', '내가 <b>할 수 있는 일/없는 일</b>을 알려 주지 않는다', '사람은 심리 유형보다 <b>훨씬 더 큰 존재</b>임을 전제한다'])));
      return [
        P('MBTI®(Myers-Briggs Type Indicator®)는 세계에서 가장 널리 쓰이는 성격 도구 중 하나로, 30개가 넘는 언어로 옮겨져 여러 나라의 기업·학교·공공기관에서 쓰입니다. 교재의 발표자(Nancy Barger)는 조직개발·HR 컨설턴트로서 이 도구를 팀 분석, 리더십 개발, 다문화 환경에서 활용해 왔습니다.'),
        figure(timeline(), '그림. 유형 이론의 계보 — 교재 9~11쪽의 흐름을 새로 그린 시간선'),
        H3('이 도구는 무엇이고, 무엇이 아닌가'),
        is,
        H3('네 쌍의 선호, 열여섯 가지 유형'),
        P('MBTI는 네 개의 “양 끝” 중 어느 쪽이 나에게 더 자연스러운지를 묻습니다. 네 쌍이 만나면 2×2×2×2 = <b>16가지 정상적인 방식</b>이 됩니다. 다음 2장에서 “선호”가 정확히 무엇인지 몸으로 확인합니다.'),
        h('div', { class: 'grid g4' }, ST.D.PAIRS.map((p) => h('div', { class: 'card', style: { borderTop: `5px solid ${ST.D.letterColor(p.a)}` } },
          h('div', { class: 'chips' }, ST.pole(p.a), ST.pole(p.b)), h('h3', { class: 'card-t', style: { marginTop: '10px' } }, p.title), h('p', { class: 'muted', style: { margin: 0 } }, p.q)))),
        callout('key', '이 프로그램의 진행 원칙', '① 먼저 <b>스스로 추정</b>하고 → ② 문항으로 <b>확인</b>한 뒤 → ③ 설명을 읽고 <b>내가 최종 결정</b>합니다. 결과는 출발점이고, “나에게 가장 잘 맞는 유형(Best Fit)”을 정하는 사람은 항상 나입니다.'),
        callout('info', '안내', '이 사이트는 교재를 바탕으로 만든 <b>학습·실습 도구</b>입니다. 문항은 새로 작성한 연습용이며 <b>공식 MBTI® 검사가 아닙니다</b>. 공식 검사와 해석은 자격을 갖춘 전문가를 통해 받으세요.')
      ];
    },

    practice(ctx) {
      const root = h('div');
      ctx.ready(`c1/${ctx.me.id}`, (mine) => {
        const picked = Object.assign({}, mine.myth || {});
        const kw = new Set(ST.arr(mine.kw).length ? Object.keys(mine.kw || {}).filter((k) => mine.kw[k]) : []);
        /* A */
        const A = card('A. 사실일까, 오해일까?', h('p', { class: 'card-sub' }, '8개의 문장을 읽고 “사실/오해”를 고르면 바로 해설이 나옵니다.'));
        const score = h('p', { class: 'p', style: { fontWeight: 700 } });
        const items = MYTHS.map((m, i) => {
          const fb = h('div', { class: 'why', hidden: true });
          const bT = h('button', { type: 'button', class: 'fc-opt' }, '✔ 사실이에요');
          const bF = h('button', { type: 'button', class: 'fc-opt' }, '✖ 오해예요');
          const paint = () => {
            const v = picked[i];
            [bT, bF].forEach((b, k) => { const val = k === 0 ? 1 : 0; b.classList.toggle('on', v === val); b.disabled = v != null; });
            if (v != null) { fb.hidden = false; fb.textContent = (v === m.a ? '✅ 정답! ' : '❌ 아쉬워요. ') + m.why; }
          };
          const pick = (val) => { picked[i] = val; ctx.put(`${ctx.me.id}/myth/${i}`, val); paint(); upd(); };
          bT.onclick = () => pick(1); bF.onclick = () => pick(0);
          paint();
          return h('div', { class: 'fc' + (picked[i] != null ? ' answered' : '') }, h('p', { class: 'fc-q' }, h('span', { class: 'qn' }, String(i + 1)), m.t), h('div', { class: 'fc-opts' }, bT, bF), fb);
        });
        function upd() {
          const n = Object.keys(picked).length, ok = MYTHS.filter((m, i) => picked[i] === m.a).length;
          score.textContent = n ? `지금까지 ${n}문항 중 ${ok}개를 맞혔어요.` : '';
          if (n === MYTHS.length) ctx.done();
        }
        ST.add(A, [items, score]); upd();
        /* B */
        const goal = ST.text({ maxlength: 80, placeholder: '예) 팀원들과 회의에서 덜 부딪히는 방법을 알고 싶다', value: mine.goal || '' });
        const kwBox = h('div', { class: 'chips', style: { marginBottom: '12px' } });
        const paintKw = () => { ST.clear(kwBox); KW.forEach((k, i) => kwBox.appendChild(h('button', { type: 'button', class: 'chip x' + (kw.has(String(i)) ? ' on' : ''), style: { cursor: 'pointer', fontSize: '13.5px', padding: '7px 13px', '--c': 'var(--brand)', borderWidth: kw.has(String(i)) ? '2px' : '1px', fontWeight: kw.has(String(i)) ? 700 : 400 }, onclick: () => { const s = String(i); if (kw.has(s)) kw.delete(s); else if (kw.size < 3) kw.add(s); else ST.toast('최대 3개까지 고를 수 있어요'); paintKw(); } }, (kw.has(String(i)) ? '✓ ' : '') + k))); };
        paintKw();
        const B = card('B. 이 프로그램에서 얻고 싶은 것', h('p', { class: 'card-sub' }, '가장 기대하는 키워드를 최대 3개 고르고, 한 줄 목표를 남겨 주세요.'), kwBox, ST.field('나의 한 줄 목표', goal),
          ST.btn('저장하고 함께 보기', { kind: 'primary', onclick: () => { const o = {}; kw.forEach((k) => (o[k] = 1)); ctx.putMine('kw', Object.keys(o).length ? o : null); ctx.putMine('goal', goal.value.trim() || null); ST.toast('저장했어요 ✓'); } }));
        ST.add(root, [A, B]);
      });
      return root;
    },

    together(ctx) {
      const root = h('div'), box = h('div'); root.appendChild(box);
      ctx.watch('c1', (d) => {
        ST.clear(box);
        const ids = ST.people(d);
        const withM = ids.filter((u) => d[u].myth);
        const rows = MYTHS.map((m, i) => { const v = withM.map((u) => d[u].myth[i]).filter((x) => x != null); const ok = v.filter((x) => +x === m.a).length; return { label: `${i + 1}. ${m.t.replace(/[.]$/, '').slice(0, 26)}…`, value: v.length ? ok / v.length : 0, text: v.length ? `${Math.round((ok / v.length) * 100)}%` : '–', n: v.length }; });
        const mine = d[ctx.me.id] && d[ctx.me.id].myth, myOk = mine ? MYTHS.filter((m, i) => mine[i] != null && +mine[i] === m.a).length : null;
        const kwc = KW.map((k, i) => ({ label: k, value: ids.filter((u) => d[u].kw && d[u].kw[i]).length }));
        const avgOk = withM.length ? ST.mean(withM.map((u) => MYTHS.filter((m, i) => d[u].myth[i] != null && +d[u].myth[i] === m.a).length)) : null;
        ST.add(box, [
          ST.metrics([[ids.length, '실습에 참여한 사람'], [myOk == null ? '–' : `${myOk} / ${MYTHS.length}`, '내 정답 수'], [avgOk == null ? '–' : ST.fmt(avgOk, 1), '모두의 평균 정답 수'], [kwc.reduce((a, b) => a + b.value, 0), '선택된 기대 키워드']]),
          grid(2,
            card('문장별 정답률', h('p', { class: 'card-sub' }, '가장 많이 헷갈린 오해는 무엇일까요? 막대가 짧을수록 많이 틀린 문장입니다.'), withM.length ? C.bars({ items: rows.map((r) => ({ label: r.label, value: r.value, text: r.text, color: r.value < 0.6 ? 'var(--coral)' : 'var(--brand)' })), max: 1 }) : empty()),
            card('우리가 기대하는 것', h('p', { class: 'card-sub' }, '모두가 고른 키워드를 합쳤어요.'), kwc.some((k) => k.value) ? C.bars({ items: kwc.sort((a, b) => b.value - a.value).map((k) => ({ label: k.label, value: k.value, color: ST.D.letterColor('N') })) }) : empty())),
          card('한 줄 목표 월', h('div', { class: 'wall' }, ids.filter((u) => d[u].goal).map((u) => h('div', { class: 'note' + (ST.isMe(u) ? ' me' : '') }, d[u].goal, h('span', { class: 'who' }, '— ', ST.nameTag(u))))), ids.some((u) => d[u].goal) ? null : empty('아직 남겨진 목표가 없어요.'))
        ]);
      });
      return root;
    },

    quiz: [
      { q: 'MBTI 결과가 알려 주는 것으로 가장 알맞은 것은?', opts: ['내가 할 수 있는 일과 없는 일', '내가 자연스럽게 선호하는 방식', '나의 지능과 기술 수준', '맡아야 할 직무의 확정'], a: 1, why: '결과는 능력이 아니라 “선호하는 방식”을 보여 줍니다. 가능·불가능을 정하지 않아요.' },
      { q: '융의 『심리 유형』을 읽고 20년 넘게 연구·적용한 뒤, 딸과 함께 문항 개발로 이어 간 사람은?', opts: ['칼 융', '캐서린 브릭스', '이사벨 브릭스 마이어스', '낸시 바저'], a: 1, why: '캐서린 브릭스가 1923년 융의 책을 읽고 연구했고, 이사벨 마이어스가 1943년부터 문항을 개발했습니다.' },
      { q: '네 쌍의 선호가 만들어 내는 “정상적인 방식”의 수는?', opts: ['4가지', '8가지', '16가지', '32가지'], a: 2, why: '2×2×2×2 = 16. 어느 쪽이 더 좋다는 의미가 아니라 서로 다른 패턴일 뿐입니다.' }
    ]
  });
})();
