/* Chapter 9 · 팀과 차이의 건설적 활용 */
(function () {
  const ST = window.ST, { h, P, H3, callout, ul, table, figure, card, grid, empty, charts: C } = ST;
  const D = ST.D;
  const POLES = ['E', 'I', 'S', 'N', 'T', 'F', 'J', 'P'];
  const STEPS = [['aware', '① 알아차리기', '내 선호와 상대의 선호가 다르다는 것을 먼저 알아차립니다.', '예) 회의에서 내가 먼저 결론을 말하면 상대가 조용해진다는 걸 알았다'], ['value', '② 가치 인정하기', '다른 방식이 팀에 주는 강점을 구체적으로 인정합니다.', '예) 천천히 생각하는 동료 덕분에 놓친 위험을 발견했다'], ['try', '③ 시도하기', '내 비선호 방식을 한 번, 작게 써 봅니다.', '예) 이번 주 회의 전에 안건을 하루 먼저 공유해 보기'], ['blend', '④ 섞어 쓰기', '서로의 방식을 결합해 더 좋은 결과를 만듭니다.', '예) 아이디어는 자유 토론, 결정은 기준표로 정리']];

  /* 팀 통계(글자별 인원, 빠진 글자, 쏠림) */
  function teamStats(team) {
    const n = {}; POLES.forEach((l) => (n[l] = 0));
    let total = 0;
    Object.keys(team).forEach((c) => { const k = +team[c] || 0; if (!D.isType(c) || k <= 0) return; total += k; c.split('').forEach((l) => (n[l] += k)); });
    return { n, total };
  }
  function insight(st) {
    if (!st.total) return [];
    const out = [];
    D.PAIRS.forEach((p) => {
      const a = st.n[p.a], b = st.n[p.b], tot = a + b;
      if (!tot) return;
      if (a === 0 || b === 0) { const miss = a === 0 ? p.a : p.b; out.push({ pair: p, kind: 'missing', miss, text: `${p.title}: <b>${miss} ${D.LET[miss].ko}</b> 선호가 팀에 없어요. 의식적으로 그 관점을 불러오지 않으면 사각지대가 생길 수 있습니다.` }); }
      else if (Math.max(a, b) / tot >= 0.75) { const dom = a > b ? p.a : p.b, low = dom === p.a ? p.b : p.a; out.push({ pair: p, kind: 'skew', miss: low, text: `${p.title}: <b>${dom}</b> 쪽이 ${Math.round((Math.max(a, b) / tot) * 100)}%로 쏠려 있어요. <b>${low}</b> 관점을 일부러 묻는 시간을 두면 좋아요.` }); }
    });
    return out;
  }

  ST.chapters.push({
    n: 9, key: 'c9', title: '팀과 차이의 건설적 활용', en: 'Using Differences Constructively', pages: '슬라이드 61–72',
    tagline: '팀 지도 위에 X를 찍고, 빈 칸을 읽고, 다음 한 주의 작은 약속을 만듭니다.',
    chips: ['팀 유형 표', '사각지대', '소통 번역', '4단계 약속'],
    goal: '팀의 유형 분포를 표로 그려 보고, 빠져 있거나 쏠린 관점을 찾아 소통 방법을 정합니다. 마지막으로 “내일부터 할 수 있는” 4단계 약속을 남깁니다.',

    learn() {
      const four = h('div', { class: 'flow' }, STEPS.map(([k, t, d]) => h('div', { class: 'st' }, h('span', {}, t, h('small', {}, d)))));
      const demo = { ISTJ: 2, ESTJ: 1, ENTJ: 1, ESFJ: 1, ENFP: 1 };
      return [
        P('유형 이론의 가치는 “누가 어떤 유형인가”를 맞히는 데 있지 않고, <b>팀이 서로 다른 방식을 어떻게 건설적으로 쓰는가</b>에 있습니다. 교재는 팀원의 유형을 16칸 표에 X로 표시하고(리더에는 Leader 표시), 어떤 관점이 많고 적은지 보라고 안내합니다.'),
        figure(C.typegrid({ cells: Object.fromEntries(Object.keys(demo).map((k) => [k, { n: demo[k] }])), mode: 'x', leader: 'ENTJ', nick: false, label: '예시 팀 유형 표' }), '그림. 예시 팀의 유형 표 — 한 사람이 X 하나, 리더는 Leader 표시(교재의 팀 유형 표 형식을 새로 구성한 가상의 팀)'),
        H3('표를 읽는 세 가지 질문'),
        ul(['<b>어느 칸이 비었나?</b> 비어 있는 선호는 팀의 사각지대 후보입니다.', '<b>한쪽으로 쏠렸나?</b> 같은 관점끼리는 편하지만 같은 곳을 놓치기 쉬워요.', '<b>리더는 어디에 있나?</b> 리더의 선호가 팀의 기본 속도와 말투를 정합니다.']),
        callout('key', '핵심', '차이는 갈등의 원인이 아니라 <b>자원</b>입니다. 서로 다른 선호가 한 문제를 다른 각도에서 비춰 줄 때 결정의 질이 올라가요.'),
        H3('소통 번역표'),
        P('상대의 선호에 맞추어 내가 바꿔 볼 수 있는 방법입니다. 실습 ③에서 하나를 골라 이번 주에 시도해 보세요.'),
        table(['상대의 선호', '이렇게 말해 보세요'], POLES.map((l) => [`<b>${l}</b> ${D.LET[l].ko}`, D.TACTICS[l].slice(0, 2).join('<br>')])),
        H3('차이를 활용하는 4단계'),
        figure(four, '그림. 알아차리기 → 가치 인정 → 시도하기 → 섞어 쓰기 (교재 마지막 부분의 순서를 따름)')
      ];
    },

    practice(ctx) {
      const root = h('div');
      ST.loadFit(ctx, (fit) => ctx.ready(`c9/${ctx.me.id}`, (mine) => {
        const team = Object.assign({}, mine.team);
        if (!Object.keys(team).length && fit) team[fit] = 1;
        let leader = D.isType(mine.leader) ? mine.leader : '';
        let tact = Object.assign({ pole: 'I', i: 0 }, mine.tact);
        const pledge = Object.assign({}, mine.pledge);

        /* ① 팀 지도 */
        const gridEl = h('div', { class: 'tm' }), sum = h('div'), ins = h('div');
        const paintTeam = () => {
          ST.clear(gridEl);
          D.GRID.flat().forEach((c) => {
            const n = team[c] || 0;
            const minus = h('button', { type: 'button', class: 'btn sm', 'aria-label': `${c} 한 명 줄이기`, onclick: () => { if (team[c] > 0) { team[c]--; if (!team[c]) delete team[c]; if (leader === c && !team[c]) leader = ''; paintTeam(); } } }, '−');
            const plus = h('button', { type: 'button', class: 'btn sm', 'aria-label': `${c} 한 명 늘리기`, onclick: () => { team[c] = (team[c] || 0) + 1; paintTeam(); } }, '+');
            const lead = h('button', { type: 'button', class: 'btn sm' + (leader === c ? ' primary' : ''), disabled: n ? null : true, title: '이 칸에 리더가 있어요', 'aria-pressed': String(leader === c), onclick: () => { leader = leader === c ? '' : c; paintTeam(); } }, 'L');
            gridEl.appendChild(h('div', { class: 'tg-cell' + (n ? ' has' : '') + (leader === c ? ' lead-pick' : ''), style: { '--k': Math.min(40, n * 12) + '%' } },
              h('div', { class: 'tg-code' }, ST.letters(c)), h('div', { class: 'tg-x' }, n ? 'X'.repeat(Math.min(n, 9)) : ''), leader === c ? h('div', { class: 'tg-lead' }, 'Leader') : null,
              h('div', { class: 'stepper' }, minus, h('b', {}, String(n)), plus, lead)));
          });
          const st = teamStats(team);
          ST.clear(sum); ST.clear(ins);
          sum.appendChild(ST.metrics([[st.total, '팀 인원(X 개수)'], [leader ? ST.letters(leader) : '–', '리더 유형']]));
          if (st.total) {
            sum.appendChild(C.stack({ items: D.PAIRS.map((p) => ({ label: p.k.split('').join(' / '), parts: [{ name: p.a, v: st.n[p.a], color: D.letterColor(p.a), show: st.n[p.a] }, { name: p.b, v: st.n[p.b], color: D.letterColor(p.b), show: st.n[p.b] }] })) }));
            const list = insight(st);
            ins.appendChild(list.length ? callout('tip', '사각지대 힌트', '<ul class="ul">' + list.map((x) => `<li>${x.text}</li>`).join('') + '</ul>') : callout('info', '균형 잡힌 팀이에요', '네 쌍 모두에서 양쪽 선호가 고르게 있습니다. 그래도 목소리가 작은 쪽을 의식적으로 묻는 습관은 도움이 돼요.'));
          }
        };
        paintTeam();
        const A = card('① 우리 팀의 유형 표', h('p', { class: 'card-sub' }, '함께 일하는 팀(5~15명)을 떠올려 + 로 X를 찍어 보세요. 모르는 사람은 비워 둬도 됩니다. 리더가 있는 칸에는 L 버튼을 눌러요. 실제 이름이 아니라 유형 개수만 입력해요.'), gridEl, sum, ins);

        /* ② 소통 번역 */
        const tBox = h('div'), poleSeg = ST.seg(POLES.map((l) => ({ v: l, l: `${l} ${D.LET[l].ko}` })), tact.pole, (v) => { tact.pole = v; tact.i = 0; paintT(); });
        const paintT = () => {
          ST.clear(tBox);
          tBox.appendChild(h('div', { class: 'chk-list' }, D.TACTICS[tact.pole].map((t, i) => {
            const id = 'tc' + i, r = h('input', { type: 'radio', name: 'tact', id, checked: tact.i === i ? true : null });
            r.addEventListener('change', () => { tact.i = i; });
            return h('label', { class: 'chk', for: id }, r, h('span', {}, t));
          })));
        };
        paintT();
        const B = card('② 소통 번역 — 이번 주에 시도해 볼 한 가지', h('p', { class: 'card-sub' }, '소통하고 싶은 상대의 선호를 고르고, 해 볼 방법을 하나 고르세요.'), h('div', { class: 'tm-note' }, '상대의 선호'), poleSeg, tBox);

        /* ③ 4단계 약속 */
        const fields = STEPS.map(([k, t, d, ph]) => ({ k, el: ST.area({ rows: 2, maxlength: 160, placeholder: ph, value: pledge[k] || '' }), t, d }));
        const C3 = card('③ 차이를 활용하는 4단계 약속', fields.map((f) => ST.field(f.t + ' — ' + f.d, f.el)),
          ST.btn('저장하고 함께 보기', { kind: 'primary', onclick: () => {
            const t = {}; fields.forEach((f) => { const v = f.el.value.trim(); if (v) t[f.k] = v; });
            ctx.putMine('', { team: team, leader: leader || null, tact: tact, pledge: Object.keys(t).length ? t : null, me: fit || null });
            ctx.done(); ST.toast('저장했어요 ✓'); } }));
        ST.add(root, [A, B, C3,
          h('div', { class: 'notice' }, '이름이나 회사 기밀 대신 “유형 개수”와 “행동 약속”만 적어 주세요. 이 내용은 같은 방 사람들에게 보입니다.')]);
      }));
      return root;
    },

    together(ctx) {
      const root = h('div'), box = h('div'); root.appendChild(box);
      let c7 = {}, c9 = {};
      const render = () => {
        ST.clear(box);
        const d = c9, ids = ST.people(d);
        const fits = ST.people(c7).filter((u) => D.isType(c7[u].fit));
        if (!ids.length && !fits.length) { box.appendChild(empty('아직 팀 지도를 저장한 사람이 없어요.')); return; }

        /* 방 전체를 한 팀으로 */
        const room = {}; fits.forEach((u) => (room[c7[u].fit] = (room[c7[u].fit] || 0) + 1));
        const rst = teamStats(room);
        const rIns = insight(rst);
        /* 모두가 그린 팀 지도의 합 */
        const agg = {}, leaders = {};
        ids.forEach((u) => { const t = d[u].team || {}; Object.keys(t).forEach((c) => { if (D.isType(c)) agg[c] = (agg[c] || 0) + (+t[c] || 0); }); if (D.isType(d[u].leader)) leaders[d[u].leader] = (leaders[d[u].leader] || 0) + 1; });
        const topLeader = Object.keys(leaders).sort((a, b) => leaders[b] - leaders[a])[0];
        const aggTot = teamStats(agg);
        const tcount = {}; ids.forEach((u) => { const t = d[u].tact; if (t && POLES.includes(t.pole)) tcount[t.pole] = (tcount[t.pole] || 0) + 1; });
        const pledges = ids.filter((u) => d[u].pledge);

        ST.add(box, [
          ST.metrics([[fits.length, '최적합을 정한 사람 (우리 방)'], [ids.length, '팀 지도를 저장한 사람'], [aggTot.total, '모두가 찍은 X의 합'], [topLeader ? ST.letters(topLeader) : '–', '가장 많이 표시된 리더 유형']]),
          card('우리 방을 한 팀으로 본다면', h('p', { class: 'card-sub' }, '7장의 최적합 유형으로 그린 방 전체의 유형 표 — 우리는 어떤 팀일까요?'),
            fits.length ? C.typegrid({ cells: Object.fromEntries(Object.keys(room).map((k) => [k, { n: room[k] }])), mode: 'x', me: c7[ctx.me.id] && c7[ctx.me.id].fit, nick: true, compact: true, label: '우리 방의 팀 유형 표' }) : empty('7장에서 최적합 유형을 먼저 정해 주세요.'),
            fits.length ? C.stack({ items: D.PAIRS.map((p) => ({ label: p.k.split('').join(' / '), parts: [{ name: p.a, v: rst.n[p.a], color: D.letterColor(p.a), show: rst.n[p.a] }, { name: p.b, v: rst.n[p.b], color: D.letterColor(p.b), show: rst.n[p.b] }] })) }) : null,
            rIns.length ? callout('tip', '우리 방의 사각지대 힌트', '<ul class="ul">' + rIns.map((x) => `<li>${x.text}</li>`).join('') + '</ul>') : (fits.length ? callout('info', '균형이 좋아요', '네 쌍 모두 양쪽 선호가 고르게 섞여 있어요.') : null)),
          grid(2,
            card('모두가 그린 팀 지도의 합', aggTot.total ? C.typegrid({ cells: Object.fromEntries(Object.keys(agg).map((k) => [k, { n: agg[k] }])), mode: 'count', leader: topLeader, compact: true, label: '팀 지도 합계' }) : empty('팀 지도가 아직 없어요.')),
            card('가장 많이 고른 소통 번역 대상', Object.keys(tcount).length ? C.bars({ items: POLES.filter((l) => tcount[l]).map((l) => ({ label: `${l} ${D.LET[l].ko}`, value: tcount[l], text: String(tcount[l]), color: D.letterColor(l) })).sort((x, y) => y.value - x.value), max: Math.max(...Object.values(tcount)) }) : empty('아직 선택이 없어요.'))),
          card('우리의 4단계 약속', h('div', { class: 'wall' }, pledges.map((u) => {
            const p = d[u].pledge;
            return h('div', { class: 'pledge', style: { '--c': ST.colorOfId(u) } }, STEPS.filter(([k]) => p[k]).map(([k, t]) => h('div', {}, h('b', {}, t.slice(2) + ' '), p[k])), h('small', {}, ST.nameOf(u), d[u].me ? ' · ' + d[u].me : ''));
          })), pledges.length ? null : empty('아직 약속이 없어요.'))
        ]);
      };
      ctx.watch('c7', (x) => { c7 = x || {}; render(); });
      ctx.watch('c9', (x) => { c9 = x || {}; render(); });
      return root;
    },

    quiz: [
      { q: '팀 유형 표에서 한 선호가 팀에 아예 없을 때 가장 알맞은 해석은?', opts: ['그 선호는 필요 없다', '사각지대가 생기기 쉬우니 그 관점을 의식적으로 불러온다', '팀원을 바꿔야 한다', '표가 틀렸다'], a: 1, why: '빠진 선호는 팀이 놓치기 쉬운 관점입니다. 사람을 바꾸기보다 질문과 절차로 그 관점을 불러오세요.' },
      { q: 'I(내향) 선호의 동료와 일할 때 가장 도움이 되는 방법은?', opts: ['즉답을 요구한다', '안건을 미리 공유하고 생각할 시간을 준다', '회의에서 무조건 지목한다', '발표를 늘린다'], a: 1, why: 'I 선호는 생각을 정리한 뒤에 말할 때 편합니다. 미리 안건을 보내면 더 좋은 의견이 나와요.' },
      { q: '차이를 건설적으로 활용하는 4단계의 순서는?', opts: ['시도 → 섞어 쓰기 → 알아차리기 → 인정', '알아차리기 → 가치 인정 → 시도하기 → 섞어 쓰기', '비판 → 설득 → 통일 → 평가', '평가 → 배치 → 교육 → 확인'], a: 1, why: '먼저 알아차리고, 그 강점을 인정하고, 내 비선호를 작게 시도한 뒤, 서로의 방식을 결합합니다.' }
    ]
  });
})();
