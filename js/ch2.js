/* Chapter 2 · 선호의 발견 */
(function () {
  const ST = window.ST, S = ST.store, { h, P, H3, callout, ul, figure, card, grid, empty, esc, charts: C } = ST;
  const AX = [{ k: 'ease', l: '편안함', d: '얼마나 자연스럽고 편했나요?' }, { k: 'speed', l: '속도', d: '얼마나 빠르게 쓸 수 있었나요?' }, { k: 'sat', l: '결과 만족', d: '완성된 서명에 만족하나요?' }, { k: 'focus', l: '집중에 든 에너지', d: '얼마나 신경을 써야 했나요? (높을수록 힘듦)' }];
  ST.CH2 = { AX };

  function builder() {
    const D = ST.D, sel = { EI: 'E', SN: 'S', TF: 'T', JP: 'J' };
    const out = h('div'), segs = h('div', { class: 'grid g2' });
    const paint = () => {
      const code = D.PAIRS.map((p) => sel[p.k]).join('');
      ST.clear(out);
      out.appendChild(h('div', { class: 'row', style: { alignItems: 'center', gap: '16px', margin: '10px 0' } },
        h('div', { style: { fontSize: '44px' } }, ST.letters(code)),
        h('div', {}, h('b', { style: { fontFamily: 'var(--serif)', fontSize: '20px' } }, D.TYPES[code].nick), h('p', { class: 'muted', style: { margin: '2px 0 0' } }, D.TYPES[code].sum))));
      out.appendChild(C.typegrid({ cells: {}, sel: code, shade: false, nick: true, compact: true, label: '16유형 중 내가 고른 칸' }));
    };
    D.PAIRS.forEach((p) => segs.appendChild(h('div', {}, h('div', { class: 'muted', style: { marginBottom: '4px' } }, p.title), ST.seg([{ v: p.a, l: `${p.a} ${D.LET[p.a].ko}` }, { v: p.b, l: `${p.b} ${D.LET[p.b].ko}` }], sel[p.k], (v) => { sel[p.k] = v; paint(); }))));
    paint();
    return card('직접 조합해 보기 — 네 쌍을 고르면 16칸 중 어디일까요?', segs, out);
  }

  ST.chapters.push({
    n: 2, key: 'c2', title: '선호의 발견', en: 'Discovering Preferences', pages: '슬라이드 12–16',
    tagline: '왼손으로 서명해 보면 알게 되는 것 — 선호는 능력이 아니라 ‘에너지가 덜 드는 쪽’.',
    chips: ['서명 실험', '4쌍 · 16유형', '정상적인 차이'],
    goal: '“선호(preference)”가 무엇인지 몸으로 확인합니다. 선호하지 않는 손으로도 쓸 수 있지만 더 느리고 힘이 듭니다. 일터의 선호도 똑같습니다.',

    learn() {
      return [
        P('MBTI®는 네 쌍의 “반대편” 중 어느 쪽이 나에게 더 자연스러운지를 묻습니다. <b>E</b>xtraversion–<b>I</b>ntroversion, <b>S</b>ensing–i<b>N</b>tuition, <b>T</b>hinking–<b>F</b>eeling, <b>J</b>udging–<b>P</b>erceiving. 교재는 이 “선호” 개념을 <b>서명 실험</b>으로 보여 줍니다.'),
        figure(ST.dia.Hands(), '그림. 선호하는 손과 그렇지 않은 손 — 둘 다 쓸 수 있지만 느낌이 전혀 다르다(교재 13~15쪽의 실험을 도해로 재구성)'),
        ul(['평소 쓰는 손으로 서명하면 <b>자연스럽고 빠르며</b> 신경을 덜 써도 됩니다.', '반대 손으로도 쓸 수 있지만 <b>어색하고 느리며</b> 집중 에너지가 더 듭니다.', '이 차이가 곧 “선호”입니다. 못하는 것이 아니라 <b>덜 힘든 쪽</b>이 있다는 뜻이에요.']),
        callout('key', '일터로 옮기면', '발표를 즉흥으로 해야 하는 내향형, 하루 종일 혼자 보고서만 써야 하는 외향형, 계획 없이 움직여야 하는 판단형… 비선호 방식으로도 <b>해낼 수는 있지만 오래 하면 지칩니다.</b> 선호를 알면 에너지를 아끼는 방법을 설계할 수 있습니다.'),
        H3('네 쌍이 만나면 16가지 정상적인 방식'),
        P('네 선호가 서로 어떤 조합으로든 만나기 때문에 사람의 차이는 무작위가 아니라 <b>16개의 패턴(유형)</b>으로 정리됩니다. 어떤 조합도 정상이고, 각각 고유한 강점을 가집니다.'),
        builder()
      ];
    },

    practice(ctx) {
      const root = h('div');
      ctx.ready(`c2/${ctx.me.id}`, (mine) => {
        const st = { hand: mine.hand || 'R', p: Object.assign({ ease: 5, speed: 5, sat: 4, focus: 1 }, mine.p), n: Object.assign({ ease: 2, speed: 2, sat: 2, focus: 4 }, mine.n) };
        const mk = (who, label) => AX.map((a) => ST.slider({ label: a.l, min: 1, max: 5, step: 1, value: st[who][a.k], onInput: (v) => { st[who][a.k] = v; } }));
        const note = ST.area({ rows: 2, maxlength: 140, placeholder: '예) 즉흥 발표, 낯선 사람들 앞에서 먼저 말 걸기, 마감 직전까지 계획 없이 일하기…', value: mine.note || '' });
        const how = card('A. 서명 실험', ST.ul(['종이에 평소 쓰는 손으로 <b>서명</b>하세요.', '펜을 반대 손으로 옮겨 <b>다시 한 번</b> 서명하세요.', '두 번의 느낌을 아래 슬라이더에 1~5점으로 남겨 주세요.']),
          h('div', { class: 'row', style: { margin: '10px 0 4px' } }, h('span', { class: 'fld-l' }, '내가 주로 쓰는 손'), ST.seg([{ v: 'R', l: '오른손' }, { v: 'L', l: '왼손' }, { v: 'B', l: '양손' }], st.hand, (v) => { st.hand = v; })));
        const two = h('div', { class: 'grid g2' },
          card('선호하는 손(평소 쓰는 손)', h('p', { class: 'card-sub' }, '1 = 매우 낮음 · 5 = 매우 높음'), mk('p')),
          card('선호하지 않는 손(반대 손)', h('p', { class: 'card-sub' }, '1 = 매우 낮음 · 5 = 매우 높음'), mk('n')));
        const B = card('B. 일터에서의 “반대 손” 순간', h('p', { class: 'card-sub' }, '내가 비선호 방식으로 일해야 했던 장면을 떠올려 보세요.'), ST.field('그때의 나', note),
          ST.btn('저장하고 함께 보기', { kind: 'primary', onclick: () => { ctx.putMine('', { hand: st.hand, p: st.p, n: st.n, note: note.value.trim() || null }); ctx.done(); ST.toast('저장했어요 ✓'); } }));
        ST.add(root, [how, two, B]);
      });
      return root;
    },

    together(ctx) {
      const root = h('div'), box = h('div'); root.appendChild(box);
      ctx.watch('c2', (d) => {
        ST.clear(box);
        const ids = ST.people(d).filter((u) => d[u].p && d[u].n);
        if (!ids.length) { box.appendChild(empty()); return; }
        const avg = (who, k) => ST.mean(ids.map((u) => +d[u][who][k]));
        const gap = (u) => +d[u].n.focus - +d[u].p.focus;
        const mine = d[ctx.me.id] && d[ctx.me.id].p ? d[ctx.me.id] : null;
        const radar = C.radar({ axes: AX.map((a) => a.l.replace('집중에 든 에너지', '집중에 든\n에너지')), max: 5, series: [{ name: '선호하는 손(모두 평균)', color: ST.D.letterColor('N'), vals: AX.map((a) => avg('p', a.k)) }, { name: '선호하지 않는 손(모두 평균)', color: 'var(--coral)', vals: AX.map((a) => avg('n', a.k)), dash: '6 4' }].concat(mine ? [{ name: '나의 선호하는 손', color: 'var(--ink)', vals: AX.map((a) => +mine.p[a.k]), fill: 0, width: 1.6, dash: '2 3' }] : []), label: '선호하는 손과 비선호 손 비교' });
        const hands = { R: 0, L: 0, B: 0 }; ids.forEach((u) => { if (hands[d[u].hand] != null) hands[d[u].hand]++; });
        ST.add(box, [
          ST.metrics([[ids.length, '실험에 참여한 사람'], [ST.fmt(avg('p', 'ease') - avg('n', 'ease'), 1), '편안함 격차(선호 − 비선호)'], [ST.fmt(avg('n', 'focus') - avg('p', 'focus'), 1), '추가로 든 집중 에너지'], [ST.pct(ids.filter((u) => gap(u) > 0).length / ids.length), '비선호 손이 더 힘들었다는 비율']]),
          grid(2,
            card('두 손의 평균 모양', h('p', { class: 'card-sub' }, '모양이 이렇게 다르다는 것 자체가 “선호”의 증거입니다.'), radar),
            card('집중 에너지 격차 분포', h('p', { class: 'card-sub' }, '점 하나가 한 사람. 오른쪽일수록 반대 손이 더 힘들었어요.'), C.dots({ min: -4, max: 4, values: ids.map((u) => ({ v: gap(u), color: ST.isMe(u) ? 'var(--ink)' : ST.D.letterColor('N'), title: ST.nameOf(u) + ' · ' + gap(u) })), markers: [{ v: 0, label: '차이 없음', color: 'var(--ink3)' }], fmt: (v) => (v > 0 ? '+' : '') + v }),
              ST.D.PAIRS.length ? h('div', { class: 'pill-row', style: { marginTop: '8px' } }, h('span', { class: 'chip g' }, `오른손 ${hands.R}`), h('span', { class: 'chip g' }, `왼손 ${hands.L}`), h('span', { class: 'chip g' }, `양손 ${hands.B}`)) : null)),
          card('우리의 “반대 손” 순간들', h('div', { class: 'wall' }, ids.filter((u) => d[u].note).map((u) => h('div', { class: 'note' + (ST.isMe(u) ? ' me' : '') }, d[u].note, h('span', { class: 'who' }, '— ', ST.nameTag(u))))), ids.some((u) => d[u].note) ? null : empty('아직 남겨진 장면이 없어요.'))
        ]);
      });
      return root;
    },

    quiz: [
      { q: '서명 실험이 보여 주려는 핵심은?', opts: ['반대 손은 전혀 쓸 수 없다', '선호하는 쪽이 더 자연스럽고 에너지가 덜 든다', '훈련하면 두 손의 차이는 사라진다', '오른손잡이가 더 우수하다'], a: 1, why: '둘 다 쓸 수 있지만 선호하는 쪽이 덜 힘듭니다. 선호는 “덜 힘든 쪽”을 말해요.' },
      { q: '네 쌍의 선호가 조합되어 만들어지는 유형은 모두 몇 가지?', opts: ['8가지', '12가지', '16가지', '24가지'], a: 2, why: '2×2×2×2 = 16가지입니다.' },
      { q: '일터에서 비선호 방식으로 일할 때의 설명으로 가장 알맞은 것은?', opts: ['절대 할 수 없다', '할 수는 있지만 오래 하면 더 지친다', '선호 방식보다 항상 더 좋은 성과가 난다', '누구에게나 똑같이 쉽다'], a: 1, why: '비선호 방식도 쓸 수 있지만 더 많은 에너지가 들어요. 그래서 일의 방식을 설계할 때 선호를 고려합니다.' }
    ]
  });
})();
