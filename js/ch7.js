/* Chapter 7 · 내 유형 찾기 */
(function () {
  const ST = window.ST, { h, P, H3, callout, ul, table, figure, card, grid, empty, esc, charts: C } = ST;
  const D = ST.D;

  /* 학습용 예시 채점표(가상의 한 사람) */
  const EXAMPLE = { EI: { a: 6, b: 2 }, SN: { a: 3, b: 5 }, TF: { a: 4, b: 4 }, JP: { a: 2, b: 6 } };
  const exampleRes = () => { const r = {}; D.PAIRS.forEach((p) => { const e = EXAMPLE[p.k], tie = e.a === e.b, letter = tie ? p.b : e.a > e.b ? p.a : p.b, dom = Math.max(e.a, e.b); r[p.k] = { a: e.a, b: e.b, tie, letter, clarity: tie ? 0 : dom - 5 < 0 ? 0 : dom - 5 }; }); return r; };

  ST.chapters.push({
    n: 7, key: 'c7', title: '내 유형 찾기', en: 'Finding Your Best-Fit Type', pages: '슬라이드 33–42',
    tagline: '가설 → 채점 → 명확도 → 최적합 결정. 그리고 우리 방의 16유형 지도.',
    chips: ['자기 추정 vs 결과', '선호 명확도', '최적합 유형'],
    goal: '앞선 네 장의 결과를 모아 “보고된 유형”을 만들고, 처음 가설과 비교한 뒤 나에게 가장 잘 맞는 유형(Best Fit)을 스스로 결정합니다. 그리고 우리 방의 분포를 성인 인구와 비교합니다.',

    learn() {
      const flow = h('div', { class: 'flow' }, [['① 첫 가설', '자기 추정'], ['② 채점', '원점수 계산'], ['③ 보고된 유형', '4글자 + 동점 규칙'], ['④ 명확도', '얼마나 뚜렷한가'], ['⑤ 최적합', '내가 결정']].map(([a, b]) => h('div', { class: 'st' }, h('span', {}, a, h('small', {}, b)))));
      return [
        P('교재는 유형을 찾는 과정을 이렇게 안내합니다. 먼저 <b>스스로 네 글자를 추정</b>(첫 번째 가설)하고, 문항을 채점해 <b>보고된 유형</b>과 <b>선호의 명확도</b>를 얻은 다음, 둘을 비교해 <b>최적합 유형</b>을 결정합니다.'),
        figure(flow, '그림. 최적합 유형을 찾는 다섯 단계 (교재 33~40쪽)'),
        H3('채점표 읽는 법'),
        figure(C.scoresheet({ res: exampleRes() }), '그림. 학습용 예시 채점표 — ① 원점수 ② 보고된 유형(동점은 점선 칸) ③ 명확도 (실제 교재의 채점표 모양을 새로 구성)'),
        table(['명확도', '뜻', '이 프로그램의 8문항 기준'], [
          ['약간 (Slight)', '그 방향을 살짝 더 선호', '5 : 3 (동점이면 4 : 4)'],
          ['보통 (Moderate)', '어느 정도 분명한 선호', '6 : 2'],
          ['뚜렷 (Clear)', '분명하게 한쪽을 선호', '7 : 1'],
          ['매우 뚜렷 (Very Clear)', '아주 일관되게 한쪽을 선호', '8 : 0']
        ]),
        callout('info', '공식 검사와의 차이', '교재의 공식 Form M은 93문항의 원점수 구간으로 명확도를 정합니다. 이 프로그램은 8문항짜리 <b>학습용 간이 도구</b>이므로 기준을 위처럼 단순화했습니다. 숫자보다 “얼마나 한쪽으로 기울었나”를 이해하는 데 초점을 두세요.'),
        H3('최적합(Best Fit)은 내가 결정한다'),
        ul(['<b>두 가설이 같다면</b> 그 유형의 설명을 읽어 봅니다.', '<b>한 글자만 다르다면</b> 두 유형의 설명을 모두 읽고, “나와 같은 점 / 같지 않은 점”을 표시합니다.', '결정할 때는 <b>검사 결과 · 자기 추정 · 유형 설명</b>을 함께 놓고 판단합니다. 질문 몇 개가 내가 아는 나를 전부 담을 수는 없으니까요.']),
        callout('key', '교재의 핵심 메시지', '“좋은 도구이지만 결정은 당신의 몫.” 최적합 유형을 정하는 사람은 검사 결과가 아니라 <b>나 자신</b>입니다.'),
        H3('성인 인구 속의 16유형'),
        P('아래는 교재가 보여 주는 미국 성인 대표 표본(N = 3,009)의 유형 분포입니다. 어떤 유형은 흔하고 어떤 유형은 드뭅니다. 이 숫자는 우열이 아니라 <b>“팀에서 내 유형을 만날 확률”</b>을 알려 줄 뿐이에요.'),
        figure(C.typegrid({ cells: Object.fromEntries(D.ALL.map((k) => [k, { n: D.US[k], text: D.US[k].toFixed(1) + '%' }])), mode: 'text', nick: true, max: 14, label: '미국 성인 16유형 분포' }), '그림. 미국 성인 유형 분포(MBTI Manual 3판, 1998, p.379 — 교재 41쪽의 수치). 영국 성인 분포는 글자별로 함께 보기에서 비교합니다.')
      ];
    },

    practice(ctx) {
      const root = h('div');
      ST.loadMine(ctx, (docs) => {
        const R = D.myResult(docs);
        ctx.ready(`c7/${ctx.me.id}`, (mine) => {
          const fit = (D.isType(mine.fit) ? mine.fit : (R.type.includes('?') ? '' : R.type)).split('');
          while (fit.length < 4) fit.push('');
          const res = {}; D.PAIRS.forEach((p, i) => { if (docs[i] && docs[i].ans && ST.arr(docs[i].ans).length >= D.N_ITEMS) res[p.k] = D.score(p.k, docs[i].ans); });
          const missing = D.PAIRS.map((p, i) => ({ p, i, n: 3 + i })).filter((x) => !res[x.p.k]);

          /* ① 채점표 */
          const A = card('① 나의 채점표', missing.length
            ? h('div', {}, callout('warn', '아직 끝내지 않은 선호가 있어요', missing.map((x) => `<a href="#/ch/${x.n}/1">${x.n}장 · ${x.p.title}</a>`).join(' · ') + ' — 해당 장의 “실습하기”에서 8문항을 끝내면 채점표가 완성돼요.'), C.scoresheet({ res }))
            : C.scoresheet({ res }));

          /* ② 두 가설 비교 */
          const estT = R.est.map((x) => x || '?');
          const cmp = h('div', { class: 'tbl-wrap' }, h('table', { class: 'tbl' },
            h('thead', {}, h('tr', {}, ['선호 쌍', '① 첫 가설', '② 문항 결과', '일치', '명확도'].map((t) => h('th', { scope: 'col' }, t)))),
            h('tbody', {}, D.PAIRS.map((p, i) => { const r = res[p.k], e = estT[i]; return h('tr', {}, h('th', { scope: 'row' }, p.title), h('td', {}, e === '?' ? '?' : ST.letters(e)), h('td', {}, r ? ST.letters(r.letter) : '–'), h('td', {}, r && e !== '?' ? (r.letter === e ? '✓ 같음' : '✗ 다름') : '–'), h('td', {}, r ? (r.tie ? '동점' : D.CLARITY[r.clarity]) : '–')); }))));
          const diff = D.PAIRS.filter((p, i) => res[p.k] && estT[i] !== '?' && res[p.k].letter !== estT[i]).length;
          const unk = D.PAIRS.filter((p, i) => estT[i] === '?').length;
          const advice = !Object.keys(res).length ? '' : diff === 0 ? (unk ? '확인된 글자는 모두 같아요. “?”로 남긴 글자는 결과를 가설로 삼아 설명을 읽어 보세요.' : '두 가설이 같아요! 해당 유형의 설명을 읽고 “나 같은 점”을 확인해 보세요.') : diff === 1 ? '한 글자만 달라요. 두 유형의 설명을 모두 읽고 “나와 같은 점 / 같지 않은 점”을 표시해 보세요.' : `${diff}개의 글자가 달라요. 틀린 게 아니라, 설명을 충분히 읽어 보고 직접 결정하라는 신호입니다.`;
          const Bc = card('② 첫 가설과 문항 결과 비교', cmp, advice ? callout('tip', '다음 단계', advice) : null);

          /* ③ 최적합 결정 */
          const sel = fit.slice();
          const preview = h('div'), why = ST.area({ rows: 3, maxlength: 200, placeholder: '예) E/I는 결과와 같지만 T/F는 근소해서 두 설명을 모두 읽고 F로 정했다', value: mine.why || '' });
          const segs = h('div', { class: 'grid g2' });
          const paintPrev = () => {
            ST.clear(preview);
            const code = sel.join('');
            if (!D.isType(code)) { preview.appendChild(h('p', { class: 'muted' }, '네 쌍을 모두 고르면 유형 미리보기가 나타나요.')); return; }
            const t = D.TYPES[code];
            preview.appendChild(h('div', { class: 'mycard' }, h('span', { class: 'big-code' }, ST.letters(code)), h('h3', {}, t.nick), h('p', { class: 'p', style: { margin: '4px 0 8px' } }, t.sum), h('div', { class: 'chips' }, t.st.map((x) => h('span', { class: 'chip x', style: { '--c': 'var(--brand)' } }, x))),
              h('p', { class: 'tm-note' }, `미국 성인의 약 ${D.US[code]}%가 이 유형으로 보고되었어요(교재 41쪽).`)));
          };
          const segEls = D.PAIRS.map((p, i) => ST.seg([{ v: p.a, l: `${p.a} ${D.LET[p.a].ko}` }, { v: p.b, l: `${p.b} ${D.LET[p.b].ko}` }], sel[i] || null, (v) => { sel[i] = v; paintPrev(); }));
          D.PAIRS.forEach((p, i) => segs.appendChild(h('div', {}, h('div', { class: 'muted', style: { marginBottom: '4px' } }, p.title + (res[p.k] ? ` · 결과 ${res[p.k].letter}(${res[p.k].tie ? '동점' : D.CLARITY[res[p.k].clarity]})` : '')), segEls[i])));
          paintPrev();
          const save = ST.btn('이 유형을 나의 최적합으로 정하기', { kind: 'primary', onclick: () => {
            const code = sel.join('');
            if (!D.isType(code)) { ST.toast('네 쌍을 모두 골라 주세요'); return; }
            const rep = D.PAIRS.map((p) => (res[p.k] ? res[p.k].letter : '?')).join('');
            ctx.putMine('', { fit: code, rep, est: estT.join(''), clar: D.PAIRS.map((p) => (res[p.k] ? (res[p.k].tie ? 0 : res[p.k].clarity) : null)), why: why.value.trim() || null });
            ctx.done(); ST.toast('최적합 유형을 저장했어요 ✓');
          } });
          const Cc = card('③ 나의 최적합(Best Fit) 유형 정하기', h('p', { class: 'card-sub' }, '결과를 기본값으로 채워 두었어요. 8~9장의 설명을 읽은 뒤 언제든 이 화면으로 돌아와 바꿀 수 있습니다.'), segs, preview, ST.field('그렇게 결정한 이유(선택)', why), save);
          ST.add(root, [A, Bc, Cc]);
        });
      });
      return root;
    },

    together(ctx) {
      const root = h('div'), box = h('div'); root.appendChild(box);
      let mode = 'x';
      const render = (d) => {
        ST.clear(box);
        const ids = ST.people(d).filter((u) => D.isType(d[u].fit));
        if (!ids.length) { box.appendChild(empty('아직 최적합 유형을 정한 사람이 없어요. 실습하기 ③에서 정해 보세요.')); return; }
        const cnt = {}; D.ALL.forEach((k) => (cnt[k] = 0)); ids.forEach((u) => cnt[d[u].fit]++);
        const total = ids.length;
        const myFit = d[ctx.me.id] && D.isType(d[ctx.me.id].fit) ? d[ctx.me.id].fit : null;
        const top = Object.keys(cnt).sort((a, b) => cnt[b] - cnt[a])[0];
        const same = ids.filter((u) => d[u].rep && d[u].rep === d[u].fit).length;
        const cells = {}; D.ALL.forEach((k) => (cells[k] = mode === 'us' ? { n: cnt[k], text: D.US[k].toFixed(1) + '%' } : mode === 'pct' ? { n: cnt[k], text: cnt[k] ? Math.round((cnt[k] / total) * 100) + '%' : '' } : { n: cnt[k] }));
        const seg = ST.seg([{ v: 'x', l: 'X 표시 (교재 팀표)' }, { v: 'pct', l: '우리 방 비율' }, { v: 'us', l: '미국 성인 비율(교재)' }], mode, (v) => { mode = v; render(d); });
        const letterCount = (l) => ids.filter((u) => d[u].fit.includes(l)).length;
        const duelCard = (p) => card(p.title, C.duel({ a: p.a, b: p.b, rows: [{ label: '우리 방', a: letterCount(p.a), b: letterCount(p.b), hl: true }, { label: '미국 성인', a: D.USL[p.a], b: D.USL[p.b] }, { label: '영국 성인', a: D.UKL[p.a], b: D.UKL[p.b] }] }));
        const temp = (code) => (code[2] === 'T' ? 'T' : 'F') + code[3];
        const tcnt = { TJ: 0, TP: 0, FJ: 0, FP: 0 }; ids.forEach((u) => tcnt[temp(d[u].fit)]++);
        const diffPair = D.PAIRS.map((p, i) => ({ label: p.title, value: ids.filter((u) => d[u].rep && d[u].rep[i] !== '?' && d[u].rep[i] !== d[u].fit[i]).length / Math.max(1, ids.filter((u) => d[u].rep && d[u].rep[i] !== '?').length), n: ids.filter((u) => d[u].rep && d[u].rep[i] !== '?').length }));
        ST.add(box, [
          ST.metrics([[total, '최적합을 정한 사람'], [h('span', { class: 'lt' }, ST.letters(top)), `가장 많은 유형 (${cnt[top]}명)`], [myFit ? ST.letters(myFit) : '–', '나의 최적합'], [`${same}/${total}`, '결과와 최적합이 같은 사람']]),
          card('우리 방의 16유형 지도', h('p', { class: 'card-sub' }, '교재의 Team 표처럼 한 사람이 X 하나입니다. 보기 방식을 바꿔 보세요.'), seg, C.typegrid({ cells, mode: mode === 'x' ? 'x' : 'text', nick: true, me: myFit, max: Math.max(1, ...Object.values(cnt)), label: '우리 방의 16유형 표' }), mode === 'us' ? h('p', { class: 'tm-note' }, '숫자는 미국 성인 비율, 칸의 진하기는 우리 방 인원입니다.') : null),
          h('div', { class: 'grid g2' }, D.PAIRS.map(duelCard)),
          grid(2,
            card('기질 조합 비교 (T/F × J/P)', h('p', { class: 'card-sub' }, '교재 41~42쪽의 TJ · TP · FJ · FP 비율과 나란히.'), C.stack({ items: [{ label: '우리 방', hl: true, parts: ['TJ', 'TP', 'FJ', 'FP'].map((k, i) => ({ name: k, v: tcnt[k], color: ST.PAL[i], show: Math.round((tcnt[k] / total) * 100) + '%' })) }, { label: '미국 성인', parts: ['TJ', 'TP', 'FJ', 'FP'].map((k, i) => ({ name: k, v: D.USC[k], color: ST.PAL[i], show: D.USC[k] + '%' })) }, { label: '영국 성인', parts: ['TJ', 'TP', 'FJ', 'FP'].map((k, i) => ({ name: k, v: D.UKC[k], color: ST.PAL[i], show: D.UKC[k] + '%' })) }], legend: ['TJ', 'TP', 'FJ', 'FP'].map((k, i) => ({ name: k, color: ST.PAL[i] })) })),
            card('결과와 최적합이 달라진 비율', h('p', { class: 'card-sub' }, '문항 결과를 그대로 쓰지 않고 “내가 정한” 글자로 바꾼 사람의 비율. 결정은 내 몫!'), C.bars({ items: diffPair.map((x) => ({ label: x.label, value: x.value, text: x.n ? Math.round(x.value * 100) + '%' : '–', color: 'var(--amber)' })), max: 1 }))),
          card('우리 모두의 유형', h('div', { class: 'ppl' }, ids.sort((a, b) => D.ALL.indexOf(d[a].fit) - D.ALL.indexOf(d[b].fit)).map((u) => h('div', { class: 'pp' + (ST.isMe(u) ? ' me' : '') }, ST.avatar(u), h('div', {}, h('span', { class: 'nm' }, ST.nameOf(u)), ST.letters(d[u].fit), h('span', { class: 'muted' }, ' ' + D.TYPES[d[u].fit].nick))))))
        ]);
      };
      ctx.watch('c7', render);
      return root;
    },

    quiz: [
      { q: '두 점수가 같아 동점일 때, 교재의 규칙에 따라 적는 글자는?', opts: ['E · S · T · J', 'I · N · F · P', '아무 글자나 선택', '다시 검사한다'], a: 1, why: '동점이면 I, N, F, P로 보고합니다. 이는 “그 방향이 더 뚜렷하다”는 뜻이 아니라 동점을 처리하는 약속이에요.' },
      { q: '자기 추정과 문항 결과가 한 글자만 다를 때 가장 알맞은 행동은?', opts: ['결과가 무조건 맞으니 따른다', '두 유형의 설명을 모두 읽고 나와 같은/다른 점을 표시한다', '추정이 무조건 맞다고 본다', '그 글자를 무시한다'], a: 1, why: '교재는 두 유형을 모두 읽어 보고 나와 같은 점과 다른 점을 표시하라고 안내합니다.' },
      { q: '최적합(Best Fit) 유형을 최종 결정하는 사람은?', opts: ['검사 결과', '전문가', '나 자신 — 결과·자기 추정·유형 설명을 함께 고려해서', '동료들의 투표'], a: 2, why: '질문 몇 개가 나에 대한 모든 정보를 담을 수는 없어요. 결과는 출발점이고 최종 판단은 내가 합니다.' }
    ]
  });
})();
