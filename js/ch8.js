/* Chapter 8 · 일터에서 보는 16유형 */
(function () {
  const ST = window.ST, { h, P, H3, callout, ul, table, figure, card, grid, empty, charts: C } = ST;
  const D = ST.D;
  const TABS = [['ov', '개요'], ['work', '일하는 방식'], ['team', '팀에서'], ['lead', '리더십'], ['comm', '소통'], ['dec', '의사결정'], ['stress', '스트레스'], ['career', '커리어']];

  const typeOptions = () => D.ALL.map((c) => ({ v: c, l: `${c} · ${D.TYPES[c].nick}` }));

  ST.chapters.push({
    n: 8, key: 'c8', title: '일터에서 보는 16유형', en: 'Types at Work', pages: '슬라이드 43–60',
    tagline: '같은 일도 유형마다 다르게 풀어요 — 강점, 소통, 리더십, 스트레스, 커리어.',
    chips: ['유형 탐색기', '공감 체크', '두 유형 비교'],
    goal: '16유형의 일터 프로필을 읽고, 나에게 맞는 문장과 맞지 않는 문장을 표시합니다. 프로필은 “이럴 수 있다”는 가설이지, 나를 규정하는 라벨이 아닙니다.',

    learn() {
      const wheel = C.typegrid({ cells: {}, nick: true, shade: false, label: '16유형 별명 표' });
      return [
        P('교재 후반부는 16유형마다 <b>일터에서의 모습</b>을 한 장씩 정리합니다: 업무 스타일, 팀에서의 역할, 리더십, 소통, 의사결정, 스트레스 반응, 어울리는 직무. 이 프로그램도 같은 틀로 16개 프로필을 새로 썼어요.'),
        figure(wheel, '그림. 16유형과 별명 — 열은 I/E 와 N/S 조합(ST·SF·NF·NT)의 흐름을 따라 배치'),
        H3('프로필을 읽는 네 가지 태도'),
        ul(['<b>가설로 읽기</b> — “나는 이렇다”가 아니라 “이럴 수 있다”.', '<b>같은 점과 다른 점을 함께 표시</b> — 맞지 않는 문장도 소중한 정보예요.', '<b>유형 안의 개인차</b> — 같은 유형이라도 경험과 가치관에 따라 크게 달라집니다.', '<b>비선호도 쓸 수 있음</b> — 프로필의 “주의할 점”은 약점이 아니라 연습할 지점.']),
        callout('warn', '이렇게 쓰면 안 돼요', '채용·승진·배치의 근거로 유형을 쓰거나, 동료를 “그 유형이니까”라고 단정하지 마세요. 유형은 <b>자기 이해와 대화의 출발점</b>일 때 가장 쓸모 있습니다.'),
        H3('이번 장의 실습'),
        ul(['<b>1)</b> 유형 탐색기에서 내 최적합 유형(또는 궁금한 유형)의 여덟 면을 읽습니다.', '<b>2)</b> “일하는 방식”의 문장에 <i>나 같아요 / 주의가 필요해요</i>를 체크합니다.', '<b>3)</b> 나의 강점 한 줄과 동료에게 바라는 점을 남깁니다.'])
      ];
    },

    practice(ctx) {
      const root = h('div');
      ST.loadFit(ctx, (fit) => ctx.ready(`c8/${ctx.me.id}`, (mine) => {
        let code = D.isType(mine.type) ? mine.type : (fit || 'ISTJ');
        let tab = 'ov';
        const like = Object.assign({}, mine.like), watch = Object.assign({}, mine.watch);
        const body = h('div'), tabs = h('div', { class: 'seg wrap', role: 'tablist' });
        const str = ST.text({ maxlength: 80, placeholder: '예) 복잡한 일정도 차분히 정리해 팀을 안정시켜요', value: mine.str || '' });
        const care = ST.text({ maxlength: 80, placeholder: '예) 결정 전에 하루만 생각할 시간을 주세요', value: mine.care || '' });

        const checkList = (items, store, title, kind) => h('div', {}, h('h4', { class: 'h4' }, title), h('div', { class: 'chk-list' }, items.map((t, i) => {
          const id = `${code}-${kind}${i}`;
          const cb = h('input', { type: 'checkbox', id, checked: store[`${code}-${i}`] ? true : null });
          cb.addEventListener('change', () => { if (cb.checked) store[`${code}-${i}`] = 1; else delete store[`${code}-${i}`]; });
          return h('label', { class: 'chk', for: id }, cb, h('span', {}, t));
        })));

        const paint = () => {
          ST.clear(body);
          const t = D.TYPES[code];
          const head = h('div', { class: 'mycard' }, h('span', { class: 'big-code' }, ST.letters(code)), h('h3', {}, t.nick), h('p', { class: 'p', style: { margin: '4px 0 0' } }, t.sum));
          let pane;
          if (tab === 'ov') pane = h('div', {}, P(t.core), h('div', { class: 'chips' }, t.st.map((x) => h('span', { class: 'chip x', style: { '--c': 'var(--brand)' } }, x))), h('p', { class: 'tm-note' }, `미국 성인의 약 ${D.US[code]}%`), H3('함께 일하는 사람에게'), ul(t.mate));
          else if (tab === 'work') pane = h('div', {}, checkList(t.like, like, '일할 때 이런 걸 좋아해요 — 나 같은 문장에 체크', 'l'), checkList(t.watch, watch, '이럴 때 주의가 필요해요 — 나에게도 해당되면 체크', 'w'));
          else if (tab === 'team') pane = P(t.team);
          else if (tab === 'lead') pane = P(t.lead);
          else if (tab === 'comm') pane = P(t.comm);
          else if (tab === 'dec') pane = P(t.dec);
          else if (tab === 'stress') pane = h('div', {}, h('h4', { class: 'h4' }, '스트레스가 올라가는 순간'), ul(t.trig), h('h4', { class: 'h4' }, '다시 균형을 찾는 방법'), ul(t.cope));
          else pane = h('div', {}, P('아래는 <b>흔히 관심을 보이는 분야</b>의 예시입니다. 어떤 유형도 모든 직무에서 성공할 수 있어요.'), h('div', { class: 'chips' }, t.jobs.map((x) => h('span', { class: 'chip x', style: { '--c': 'var(--teal)' } }, x))));
          ST.add(body, [head, h('div', { style: { height: '10px' } }), pane]);
        };
        const paintTabs = () => { ST.clear(tabs); TABS.forEach(([k, l]) => tabs.appendChild(h('button', { type: 'button', role: 'tab', 'aria-selected': String(k === tab), class: k === tab ? 'on' : '', onclick: () => { tab = k; paintTabs(); paint(); } }, l))); };
        const sel = ST.select(typeOptions(), code, (v) => { code = v; paint(); }, { 'aria-label': '탐색할 유형' });
        paintTabs(); paint();
        const count = () => Object.keys(like).length + Object.keys(watch).length;
        const save = ST.btn('저장하고 함께 보기', { kind: 'primary', onclick: () => {
          ctx.putMine('', { type: code, like: like, watch: watch, str: str.value.trim() || null, care: care.value.trim() || null, mine: D.isType(fit) ? (fit === code ? 1 : 0) : null });
          ctx.done(); ST.toast(`저장했어요 ✓ (체크 ${count()}개)`); } });
        ST.add(root, [
          card('유형 탐색기', h('p', { class: 'card-sub' }, fit ? `내 최적합 유형(${fit})이 기본으로 열렸어요. 다른 유형도 골라 보세요.` : '7장에서 최적합을 정하면 내 유형이 기본으로 열립니다. 우선 궁금한 유형을 골라 보세요.'), ST.field('유형 선택', sel), tabs, body),
          card('나의 한 줄', ST.field('일터에서 나의 강점 한 줄', str), ST.field('동료에게 바라는 점 한 줄', care), save)
        ]);
      }));
      return root;
    },

    together(ctx) {
      const root = h('div'), box = h('div'); root.appendChild(box);
      let a = null, b = null;
      let data = {};
      const render = () => {
        const d = data;
        ST.clear(box);
        const ids = ST.people(d).filter((u) => D.isType(d[u].type));
        if (!ids.length) { box.appendChild(empty('아직 유형 탐색을 저장한 사람이 없어요.')); return; }
        const tally = {}; ids.forEach((u) => { tally[d[u].type] = (tally[d[u].type] || 0) + 1; });
        const own = ids.filter((u) => d[u].mine === 1);
        const lc = {}, wc = {};
        ids.forEach((u) => { Object.keys(d[u].like || {}).forEach((k) => (lc[k] = (lc[k] || 0) + 1)); Object.keys(d[u].watch || {}).forEach((k) => (wc[k] = (wc[k] || 0) + 1)); });
        const label = (k, kind) => { const [c, i] = k.split('-'); return `${c} · ${D.TYPES[c][kind][+i]}`; };
        const topOf = (o) => Object.keys(o).sort((x, y) => o[y] - o[x]).slice(0, 6);
        const avgLike = ST.mean(own.map((u) => Object.keys(d[u].like || {}).length / 5));
        const avgWatch = ST.mean(own.map((u) => Object.keys(d[u].watch || {}).length / 3));
        const opts = typeOptions();
        a = a || Object.keys(tally)[0]; b = b || (Object.keys(tally)[1] || (a === 'ENFP' ? 'ISTJ' : 'ENFP'));
        const cmpBox = h('div');
        const paintCmp = () => {
          ST.clear(cmpBox);
          const ta = D.TYPES[a], tb = D.TYPES[b];
          cmpBox.appendChild(table(['', `${a} ${ta.nick}`, `${b} ${tb.nick}`], [['팀에서', ta.team, tb.team], ['리더십', ta.lead, tb.lead], ['소통', ta.comm, tb.comm], ['의사결정', ta.dec, tb.dec], ['스트레스', ta.trig.join(' · '), tb.trig.join(' · ')]]));
        };
        paintCmp();
        const sa = ST.select(opts, a, (v) => { a = v; paintCmp(); }, { 'aria-label': '첫 번째 유형' }), sb = ST.select(opts, b, (v) => { b = v; paintCmp(); }, { 'aria-label': '두 번째 유형' });
        ST.add(box, [
          ST.metrics([[ids.length, '유형을 탐색한 사람'], [Object.keys(tally).length, '탐색된 서로 다른 유형'], [own.length ? ST.pct(avgLike) : '–', '내 유형 문장에 “나 같아요” 체크율'], [own.length ? ST.pct(avgWatch) : '–', '“주의할 점”에도 해당된 비율']]),
          grid(2,
            card('어떤 유형을 가장 많이 들여다봤을까', C.typegrid({ cells: Object.fromEntries(Object.keys(tally).map((k) => [k, { n: tally[k] }])), mode: 'x', nick: true, compact: true, label: '탐색된 유형 분포' })),
            card('가장 공감받은 문장', h('p', { class: 'card-sub' }, '“나 같아요” 체크가 많은 순서'), Object.keys(lc).length ? C.bars({ items: topOf(lc).map((k) => ({ label: label(k, 'like'), value: lc[k], text: String(lc[k]) })), max: Math.max(...Object.values(lc)) }) : empty('아직 체크가 없어요.'))),
          card('“주의할 점”에 해당된다고 한 문장', Object.keys(wc).length ? C.bars({ items: topOf(wc).map((k) => ({ label: label(k, 'watch'), value: wc[k], text: String(wc[k]), color: 'var(--amber)' })), max: Math.max(...Object.values(wc)) }) : empty('아직 체크가 없어요.')),
          card('두 유형 나란히 비교', h('div', { class: 'row', style: { gap: '10px', flexWrap: 'wrap' } }, sa, h('span', { class: 'muted', style: { alignSelf: 'center' } }, 'vs'), sb), cmpBox),
          card('우리의 한 줄', h('div', { class: 'wall' }, ids.filter((u) => d[u].str || d[u].care).map((u) => h('div', { class: 'note' + (ST.isMe(u) ? ' me' : '') }, d[u].str ? h('div', {}, h('b', {}, '강점 '), d[u].str) : null, d[u].care ? h('div', {}, h('b', {}, '바라는 점 '), d[u].care) : null, h('span', { class: 'who' }, '— ', ST.nameTag(u), ' ', h('span', { class: 'lt' }, ST.letters(d[u].type)))))), ids.some((u) => d[u].str || d[u].care) ? null : empty('아직 남겨진 한 줄이 없어요.'))
        ]);
      };
      ctx.watch('c8', (d) => { data = d || {}; render(); });
      return root;
    },

    quiz: [
      { q: '유형 프로필을 읽는 가장 알맞은 태도는?', opts: ['나를 규정하는 확정 판결로 받아들인다', '가설로 읽고 맞는 점과 아닌 점을 함께 표시한다', '맞지 않으면 무시한다', '동료를 단정하는 근거로 쓴다'], a: 1, why: '프로필은 “이럴 수 있다”는 가설입니다. 아닌 문장도 나를 이해하는 정보예요.' },
      { q: '같은 유형의 두 사람에 대해 맞는 설명은?', opts: ['행동이 똑같다', '경험·가치관에 따라 차이가 크다', '직무가 같다', '서로 갈등하지 않는다'], a: 1, why: '선호가 같아도 사람은 크게 다릅니다. 유형은 한 장의 지도일 뿐이에요.' },
      { q: '유형 정보를 일터에서 쓰기에 가장 바람직한 것은?', opts: ['채용·승진의 근거', '팀 내 대화와 자기 이해의 출발점', '특정 유형을 배제하는 기준', '업무 능력 평가'], a: 1, why: '유형은 능력의 척도가 아닙니다. 서로의 방식을 이해하고 대화하는 데 쓸 때 가장 유용해요.' }
    ]
  });
})();
