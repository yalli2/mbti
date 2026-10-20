/* Chapter 3~6 · 네 가지 선호 — 같은 구조(배우기·실습·함께 보기)로 한 쌍씩 */
(function () {
  const ST = window.ST, { h, P, H3, callout, ul, table, figure, card, grid, empty, esc, charts: C } = ST;
  const D = ST.D;

  const CFG = {
    EI: {
      n: 3, key: 'c3', pages: '슬라이드 17–20',
      tagline: '에너지는 어디서 차오를까? 말하며 생각하는 사람, 생각하고 말하는 사람.',
      chips: ['외향 E', '내향 I', '에너지의 방향'],
      goal: '이 선호는 “정신적 에너지”에 대한 것입니다. 에너지를 어디서 얻고, 주의를 어디로 쏟는지 — 회의와 협업에서 드러나는 차이를 확인합니다.',
      intro: '이 선호는 <b>정신적 에너지</b>에 관한 것입니다 — 에너지를 어떻게 얻고, 에너지와 주의를 어디에 집중하는가. 외향이 사교적이고 내향이 소심하다는 뜻이 아니라 <b>에너지가 흐르는 방향</b>의 차이예요.',
      aHead: '에너지가 바깥으로', aDesc: '사람·활동·외부 세계와 상호작용할 때 충전되고 주의가 바깥으로 향합니다.',
      aList: ['<b>말하면서</b> 생각이 정리된다', '직접 <b>행동하며</b> 배운다', '사람과 활동 속에서 에너지가 오른다', '표현이 풍부하고 접근하기 쉬워 보인다'],
      bHead: '에너지가 안으로', bDesc: '혼자 생각하고 성찰하는 시간에 충전되고 주의가 안쪽으로 향합니다.',
      bList: ['<b>생각을 정리한 뒤</b> 말한다', '행동하기 전에 숙고한다', '혼자 있는 시간에 에너지가 차오른다', '말수가 적고 깊이 있는 대화를 좋아한다'],
      wsHead: ['', '외향 E', '내향 I'], wsLab: ['생각 정리', '행동', '참여 방식', '소통 채널'],
      misread: '내향형의 침묵은 <b>무관심이 아니라 “처리 중”</b>일 수 있고, 외향형의 즉각적인 발언은 <b>결론이 아니라 “생각하는 과정”</b>일 수 있습니다. 서로의 방식을 오해하면 “말이 너무 많다 / 참여를 안 한다”는 갈등이 생깁니다.',
      tip: '회의 <b>전에 안건과 자료를 미리 공유</b>하고(내향형), 회의 중에는 <b>충분히 이야기할 시간</b>을 주세요(외향형). 두 방식을 모두 열어 두면 팀이 가장 좋은 생각을 얻습니다.',
      quiz: [
        { q: '회의에서 한 동료가 말없이 메모만 하고 있습니다. 가장 가능성 있는 해석은?', opts: ['회의에 관심이 없다', '생각을 정리하며 처리하고 있을 수 있다', '능력이 부족하다', '팀에 불만이 있다'], a: 1, why: '내향 선호는 말하기 전에 충분히 생각하는 경향이 있어, 침묵이 곧 무관심은 아닙니다.' },
        { q: '다음 중 외향(E) 선호를 가장 잘 설명하는 것은?', opts: ['말하지 않아도 에너지가 가장 잘 찬다', '말하며 생각을 정리하고 사람·활동에서 에너지를 얻는다', '혼자 보내는 시간을 가장 좋아한다', '글로만 소통하길 원한다'], a: 1, why: '외향은 에너지와 주의가 바깥 세계로 향하는 선호입니다.' },
        { q: '교재의 업무 스타일 표에서 내향(I)이 더 선호하는 소통 방식은?', opts: ['얼굴을 마주 보는 즉석 토론', '글이나 1:1 대화', '대규모 브레인스토밍', '즉흥 발표'], a: 1, why: '내향형은 글이나 일대일 대화에서 생각을 더 잘 전달하는 경향이 있습니다.' }
      ]
    },
    SN: {
      n: 4, key: 'c4', pages: '슬라이드 21–24',
      tagline: '눈앞의 사실인가, 그 너머의 가능성인가 — 정보를 받아들이는 두 가지 렌즈.',
      chips: ['감각 S', '직관 N', '정보 수집'],
      goal: '이 선호는 “지각(perception)”, 즉 어떤 종류의 정보를 눈여겨보고 신뢰하는가에 대한 것입니다. 같은 자료를 보고도 서로 다른 것을 보는 이유를 확인합니다.',
      intro: '이 선호는 <b>지각</b>에 관한 것입니다 — 정보를 어떻게 받아들이고, 어떤 종류의 정보를 좋아하고 신뢰하는가. 같은 보고서를 읽고도 한 사람은 <b>숫자</b>를, 다른 사람은 <b>흐름</b>을 먼저 봅니다.',
      aHead: '지금 여기의 사실', aDesc: '오감으로 확인할 수 있는 구체적이고 검증 가능한 정보를 신뢰합니다.',
      aList: ['실제로 <b>있는 것(what is)</b>에 집중한다', '<b>단계별로</b> 쌓아 가며 결론에 이른다', '경험과 검증된 방법을 존중한다', '실용적이고 구체적인 자료를 원한다'],
      bHead: '연결과 가능성', bDesc: '정보 사이의 연결·패턴·의미, 그리고 통찰을 신뢰합니다.',
      bList: ['<b>연결과 의미</b>, 앞으로의 가능성에 집중한다', '큰 그림을 <b>한눈에</b> 보고 건너뛰어 연결한다', '새로운 방식과 아이디어에 끌린다', '직감과 통찰로 설명되는 패턴을 따른다'],
      wsHead: ['', '감각 S', '직관 N'], wsLab: ['시간 초점', '원하는 자료', '결론에 이르는 길', '변화에 대한 태도'],
      misread: '감각형은 직관형을 <b>“현실감이 없다”</b>, 직관형은 감각형을 <b>“세부에 갇혀 큰 그림을 못 본다”</b>고 느끼기 쉽습니다. 사실은 서로가 상대의 사각지대를 채워 주는 관계예요.',
      tip: '감각형에게는 <b>구체적 사례·수치·순서</b>를, 직관형에게는 <b>목적과 전체 그림</b>을 먼저 전해 보세요. 같은 내용을 두 방식으로 말하면 팀 전체가 이해합니다.',
      quiz: [
        { q: '“고장 나지 않았다면 고치지 말자”에 가장 가까운 태도는?', opts: ['직관(N)', '감각(S)', '두 선호 모두 아니다', '판단(J)만 해당'], a: 1, why: '감각 선호는 경험과 검증된 방법을 존중하는 경향이 있습니다. 반대편은 “새로운 걸 해 보자”예요.' },
        { q: '감각(S) 선호가 가장 신뢰하는 정보는?', opts: ['떠오르는 직감', '구체적이고 확인 가능한 사실', '미래의 가능성', '다른 사람의 감정'], a: 1, why: '감각형은 “실제로 있는 것”, 즉 검증 가능한 현실 정보를 믿습니다.' },
        { q: '직관(N)형 동료에게 새 제안을 설명할 때 효과적인 시작은?', opts: ['세부 절차를 먼저 나열한다', '전체 그림과 목적, 가능성을 먼저 보여 준다', '과거 데이터만 제시한다', '결론 없이 질문만 한다'], a: 1, why: '직관형은 큰 그림에서 출발해 세부로 내려올 때 이해가 빠릅니다.' }
      ]
    },
    TF: {
      n: 5, key: 'c5', pages: '슬라이드 25–28',
      tagline: '한 발 물러서 분석할까, 한 발 들어가 공감할까 — 결정의 기준은 서로 다르다.',
      chips: ['사고 T', '감정 F', '의사결정'],
      goal: '이 선호는 “판단(decision-making)” — 정보를 어떻게 정리하고 우선순위를 정하며 결정에 이르는가에 대한 것입니다. 사고가 차갑고 감정이 비논리적이라는 뜻이 아닙니다.',
      intro: '이 선호는 <b>의사결정</b>에 관한 것입니다 — 정보를 정리하고 우선순위를 정하는 방식, 결정에 이르는 과정. <b>누가 더 똑똑한가, 누가 더 따뜻한가</b>의 문제가 아니라 결정의 <b>기준점</b>이 어디인가의 문제입니다.',
      aHead: '한 발 물러선 객관성', aDesc: '상황에서 물러나 거리를 두고, 분석·논리·원칙으로 판단합니다.',
      aList: ['장단점을 <b>분석</b>해 객관적으로 본다', '<b>과제</b>와 결과에 초점을 둔다', '역량과 합리성을 높이 평가한다', '공정함 = <b>같은 원칙을 일관되게</b> 적용'],
      bHead: '한 발 들어간 공감', bDesc: '상황 속으로 들어가 관련된 사람의 입장에서 가치와 영향을 헤아립니다.',
      bList: ['결정이 <b>사람에게 미칠 영향</b>을 따진다', '<b>관계</b>와 조화에 초점을 둔다', '조화와 서로에 대한 지지를 중시한다', '공정함 = <b>각자의 상황과 사람</b>을 고려'],
      wsHead: ['', '사고 T', '감정 F'], wsLab: ['관점', '검토 방식', '초점', '공정함의 의미'],
      misread: '두 선호 모두 스스로를 <b>“공정하다”</b>고 생각하지만 기준이 다릅니다. 사고형이 보기에 감정형은 원칙이 흔들리는 사람, 감정형이 보기에 사고형은 사람을 외면하는 사람처럼 보일 수 있어요.',
      tip: '사고형에게 피드백할 때는 <b>사실과 기준</b>을 중심으로 간결하게, 감정형에게는 <b>노력과 의도를 먼저 인정</b>한 뒤 구체적으로 전하세요. 중요한 결정은 두 렌즈로 <b>한 번씩</b> 점검해 보세요.',
      quiz: [
        { q: '사고(T)와 감정(F)에 모두 해당하는 설명은?', opts: ['사고형만 공정함을 중시한다', '둘 다 스스로를 공정하다고 보지만 기준이 다르다', '감정형은 논리를 쓰지 못한다', '사고형은 사람에게 관심이 없다'], a: 1, why: '교재도 두 선호 모두 “공정(fair)”하다고 표시합니다. 공정의 기준이 다를 뿐이에요.' },
        { q: '결정을 내릴 때 감정(F) 선호가 특히 점검하는 것은?', opts: ['가장 빠른 방법', '관련된 사람들에게 미칠 영향', '비용 절감액', '과거 사례의 수'], a: 1, why: '감정형은 상황 속으로 들어가 영향을 받는 사람들의 입장을 평가합니다.' },
        { q: '사고(T)형 동료에게 피드백할 때 효과적인 방식은?', opts: ['감정 상태를 길게 물어본다', '사실과 기준을 중심으로 논리적이고 간결하게', '돌려서 암시한다', '다른 사람과 비교한다'], a: 1, why: '사고형은 객관적 근거와 기준이 분명할 때 피드백을 받아들이기 쉽습니다.' }
      ]
    },
    JP: {
      n: 6, key: 'c6', pages: '슬라이드 29–32',
      tagline: '계획표를 채울까, 가능성을 열어 둘까 — 일과 환경을 마주하는 태도.',
      chips: ['판단 J', '인식 P', '계획과 마감'],
      goal: '이 선호는 “외부 세계를 대하는 태도”입니다. 환경과 일정을 어떻게 조직하고 계획해 마무리하는가 — 마감 앞에서 드러나는 차이를 확인합니다.',
      intro: '이 마지막 선호는 <b>외부 생활을 대하는 태도</b>입니다 — 환경을 어떻게 조직하고, 일을 어떻게 계획해 마무리하는가. 부지런함과 게으름이 아니라 <b>구조</b>를 선호하는가 <b>개방</b>을 선호하는가의 차이예요.',
      aHead: '구조와 마무리', aDesc: '일상에서 질서와 구조를 찾고, 계획하고 일정을 잡아 완료를 향해 움직입니다.',
      aList: ['<b>분명한 목표</b>가 있을 때 힘이 난다', '계획을 세우고 <b>그대로 따른다</b>', '일정과 시간 틀을 만든다', '결정하고 <b>“마무리”</b>하려는 추진력'],
      bHead: '개방과 유연성', bDesc: '일상에서 개방성과 다양함을 찾고, 유연하게 정보와 경험을 모읍니다.',
      bList: ['목표는 <b>움직이는 과녁</b>으로 본다', '<b>유연한 계획</b>과 선택지를 원한다', '큰 방향과 느슨한 시간 틀이면 충분하다', '결정은 무르익을 때까지 <b>기다린다</b>'],
      wsHead: ['', '판단 J', '인식 P'], wsLab: ['목표', '계획', '일정', '결정'],
      misread: '판단형에게 인식형이 <b>“책임감 없다”</b>로, 인식형에게 판단형이 <b>“융통성 없다”</b>로 보이기 쉽습니다. 사실은 <b>같은 마감</b>을 서로 다른 경로(일정 분할 vs 막판 몰입)로 달리고 있는 것일 수 있어요.',
      tip: '<b>최종 마감과 중간 점검일</b>을 함께 정하고(판단형), 방법과 순서에는 <b>선택지를 열어 둘 범위</b>를 합의하세요(인식형). 마감을 지키는 길은 여러 갈래임을 인정하면 충돌이 줄어듭니다.',
      quiz: [
        { q: '판단(J) 선호의 특징으로 가장 알맞은 것은?', opts: ['목표는 움직이는 과녁이다', '분명한 목표와 일정을 세우고 빨리 마무리하려 한다', '결정은 최대한 늦춘다', '계획 없이 움직이길 좋아한다'], a: 1, why: '판단형은 구조와 질서, 분명한 일정과 마무리를 선호합니다.' },
        { q: '인식(P)형이 마감을 대하는 경향으로 알맞은 것은?', opts: ['항상 가장 먼저 끝낸다', '선택지를 열어 두며 정보를 모으다가 막판에 집중한다', '마감 자체를 무시한다', '일정을 가장 엄격히 쪼갠다'], a: 1, why: '인식형은 유연하게 탐색하다가 마감 가까이에 몰입하는 경우가 많습니다. 마감을 어긴다는 뜻은 아니에요.' },
        { q: 'J형과 P형이 한 팀에서 충돌을 줄이는 방법은?', opts: ['한쪽 방식으로 통일한다', '최종 마감과 중간 점검일을 합의하고, 열어 둘 범위도 정한다', '서로 업무를 완전히 분리한다', '마감을 없앤다'], a: 1, why: '구조(J)와 유연성(P)을 모두 존중하는 약속을 만들면 두 방식이 함께 작동합니다.' }
      ]
    }
  };

  /* ── 공통 도해 설명 행(교재 ‘Work Styles’를 표로) ── */
  const wsTable = (c, p) => table(c.wsHead, D.WS[p.k].map((r, i) => [c.wsLab[i], r.a, r.b]));

  function makeChapter(pairKey) {
    const c = CFG[pairKey], p = D.pairOf(pairKey), ca = D.letterColor(p.a), cb = D.letterColor(p.b);

    return {
      n: c.n, key: c.key, title: p.title, en: p.en, pages: c.pages, tagline: c.tagline, chips: c.chips, goal: c.goal,

      learn() {
        const vs = h('div', { class: 'vs' },
          h('div', { style: { '--c': ca } }, h('h4', {}, `${p.a} ${D.LET[p.a].ko}`, h('small', {}, D.LET[p.a].en)), h('b', {}, c.aHead), h('p', {}, c.aDesc), ul(c.aList)),
          h('div', { style: { '--c': cb } }, h('h4', {}, `${p.b} ${D.LET[p.b].ko}`, h('small', {}, D.LET[p.b].en)), h('b', {}, c.bHead), h('p', {}, c.bDesc), ul(c.bList)));
        return [
          P(c.intro),
          figure(ST.dia[pairKey](), `그림. ${p.en} — 교재의 도해를 바탕으로 새로 그린 개념도`),
          vs,
          H3('일터에서 드러나는 업무 스타일'),
          wsTable(c, p),
          callout('warn', '자주 일어나는 오해', c.misread),
          callout('tip', '함께 일하는 팁', c.tip),
          callout('info', '다음은 실습', '“배우기”를 마쳤다면 <b>실습하기</b>로 넘어가 ① 내가 어느 쪽일지 먼저 추정하고 ② 8개의 문항에 답한 뒤 ③ 결과와 자기 추정을 비교해 보세요.')
        ];
      },

      practice(ctx) {
        const root = h('div');
        ctx.ready(`${c.key}/${ctx.me.id}`, (mine) => {
          const ans = Object.assign({}, mine.ans || {}), ws = Object.assign({}, mine.ws || {});
          let est = mine.est || null;
          const N = D.N_ITEMS;
          const resBox = h('div'), pg = h('div', { class: 'pgbar' }, h('i')), pgT = h('p', { class: 'muted', style: { margin: '0 0 8px' } });
          const count = () => Object.keys(ans).length;
          const paintRes = () => {
            const n = count();
            pg.firstChild.style.width = (n / N) * 100 + '%';
            pgT.textContent = n < N ? `${n} / ${N} 문항 — 끝까지 답하면 결과가 나타나요.` : `${N} / ${N} 문항 완료!`;
            ST.clear(resBox);
            if (n >= N) resBox.appendChild(card('나의 결과', ST.pairResult(pairKey, ans, est)));
          };

          /* 1) 자기 추정 */
          const estBox = h('div', { class: 'est' });
          const estBtns = [[p.a, `${p.a} ${D.LET[p.a].ko}`, D.LET[p.a].d], [p.b, `${p.b} ${D.LET[p.b].ko}`, D.LET[p.b].d], ['?', '?  잘 모르겠어요', '아직 선택하기 어려워요']].map(([v, t, s]) => {
            const b = h('button', { type: 'button', class: est === v ? 'on' : '', onclick: () => { est = v; estBtns.forEach((x) => x.b.classList.toggle('on', x.v === v)); ctx.putMine('est', v); paintRes(); } }, t, h('small', {}, s));
            return { v, b };
          });
          estBtns.forEach((x) => estBox.appendChild(x.b));
          const A = card('A. 첫 번째 가설 — 나는 어느 쪽일까?', h('p', { class: 'card-sub' }, '문항에 답하기 전에, 지금의 직감으로 먼저 골라 보세요. (교재의 “1st Hypothesis — Self Estimate”)'), estBox);

          /* 2) 문항 */
          const itemEls = D.ITEMS[pairKey].map((it, i) => {
            const flip = i % 2 === 1;
            const mkb = (letter, text) => h('button', { type: 'button', class: 'fc-opt' + (ans[i] === letter ? ' on' : ''), 'data-l': letter, onclick: () => pick(i, letter, wrap) }, text);
            const opts = flip ? [mkb(p.b, it.b), mkb(p.a, it.a)] : [mkb(p.a, it.a), mkb(p.b, it.b)];
            const wrap = h('div', { class: 'fc' + (ans[i] ? ' answered' : '') }, h('p', { class: 'fc-q' }, h('span', { class: 'qn' }, String(i + 1)), it.q), h('div', { class: 'fc-opts' }, opts));
            return wrap;
          });
          function pick(i, letter, wrap) {
            ans[i] = letter;
            wrap.classList.add('answered');
            wrap.querySelectorAll('.fc-opt').forEach((b) => b.classList.toggle('on', b.dataset.l === letter));
            ctx.put(`${ctx.me.id}/ans/${i}`, letter);
            paintRes();
            if (count() >= N) { ctx.done(); }
          }
          const B = card(`B. ${N}개의 문항 — 더 “나다운” 쪽을 고르세요`, h('p', { class: 'card-sub' }, '정답은 없어요. 일터에서 긴장하거나 연기하지 않을 때의 나를 떠올려 답하세요.'), pg, pgT, itemEls);

          /* 3) 업무 스타일 */
          const wsRows = D.WS[pairKey].map((r, i) => {
            const bA = h('button', { type: 'button', class: 'ws' + (ws[i] === p.a ? ' on' : ''), style: { '--c': ca }, onclick: () => set(p.a) }, r.a);
            const bB = h('button', { type: 'button', class: 'ws' + (ws[i] === p.b ? ' on' : ''), style: { '--c': cb }, onclick: () => set(p.b) }, r.b);
            function set(l) { ws[i] = l; bA.classList.toggle('on', l === p.a); bB.classList.toggle('on', l === p.b); ctx.put(`${ctx.me.id}/ws/${i}`, l); }
            return h('div', { class: 'wsrow' }, bA, bB);
          });
          const W = card('C. 교재의 업무 스타일 — 나에게 더 가까운 쪽', h('p', { class: 'card-sub' }, '이 4줄은 점수에는 들어가지 않고, 함께 보기에서 서로의 업무 스타일을 비교하는 데 쓰입니다.'), wsRows);
          paintRes();
          ST.add(root, [A, B, resBox, W]);
        });
        return root;
      },

      together(ctx) {
        const root = h('div'), box = h('div'); root.appendChild(box);
        ctx.watch(c.key, (d) => {
          ST.clear(box);
          const all = ST.people(d);
          const done = all.filter((u) => d[u].ans && ST.arr(d[u].ans).length >= D.N_ITEMS);
          if (!done.length) { box.appendChild(empty('아직 8문항을 끝낸 사람이 없어요. 실습하기에서 먼저 답해 보세요.')); return; }
          const R = done.map((u) => ({ u, r: D.score(pairKey, d[u].ans), est: d[u].est }));
          const na = R.filter((x) => x.r.letter === p.a).length, nb = R.length - na;
          const mine = R.find((x) => ST.isMe(x.u));
          const avgClar = ST.mean(R.map((x) => x.r.clarity));
          /* 자기 추정 일치율 */
          const E = R.filter((x) => x.est === p.a || x.est === p.b);
          const okE = E.filter((x) => x.est === x.r.letter).length;
          const byC = [0, 1, 2, 3].map((k) => { const g = E.filter((x) => x.r.clarity === k); return { k, n: g.length, ok: g.filter((x) => x.est === x.r.letter).length }; });
          const wsRowsData = D.WS[pairKey].map((r, i) => { const v = all.map((u) => d[u].ws && d[u].ws[i]).filter(Boolean); return { label: c.wsLab[i], a: v.filter((x) => x === p.a).length, b: v.filter((x) => x === p.b).length }; });
          ST.add(box, [
            ST.metrics([[R.length, '결과가 나온 사람'], [`${p.a} ${na} · ${p.b} ${nb}`, '선호 분포'], [mine ? ST.letters(mine.r.letter) : '–', mine ? '나의 선호' : '내 결과는 아직'], [ST.fmt(avgClar + 1, 1) + ' / 4', '평균 선호 명확도']]),
            card('우리 방의 스펙트럼', h('p', { class: 'card-sub' }, `점 하나가 한 사람. 가운데(점선)에서 멀수록 선호가 뚜렷합니다. 왼쪽은 ${p.a}, 오른쪽은 ${p.b}.`),
              C.spectrum({ pair: pairKey, values: R.map((x) => ({ pos: x.r.pos, me: ST.isMe(x.u), title: `${ST.nameOf(x.u)} · ${x.r.letter} (${D.CLARITY[x.r.clarity]}${x.r.tie ? ', 동점' : ''})` })) })),
            grid(2,
              card('우리 방과 성인 인구 비교', h('p', { class: 'card-sub' }, '교재 41~42쪽: 성인 표본(MBTI Manual, 1998) 분포와 나란히 놓았어요.'),
                C.duel({ a: p.a, b: p.b, rows: [{ label: '우리 방', a: na, b: nb, hl: true }, { label: '미국 성인 (N=3,009)', a: D.USL[p.a], b: D.USL[p.b] }, { label: '영국 성인 (N=1,634)', a: D.UKL[p.a], b: D.UKL[p.b] }] })),
              card('교재 업무 스타일, 우리는?', h('p', { class: 'card-sub' }, '4가지 행동 중 어느 쪽에 더 많은 사람이 손을 들었는지 보여 줘요.'), C.duel({ a: p.a, b: p.b, rows: wsRowsData }))),
            grid(2,
              card('자기 추정은 얼마나 맞았을까?', h('p', { class: 'card-sub' }, '처음 고른 글자와 문항 결과가 같았던 비율입니다.'),
                E.length ? C.donut({ parts: [{ name: '추정과 결과가 같음', v: okE, color: 'var(--brand)', text: okE + '명' }, { name: '달랐음', v: E.length - okE, color: 'var(--coral)', text: E.length - okE + '명' }], center: Math.round((okE / E.length) * 100) + '%', sub: '일치', label: '자기 추정 일치율' }) : empty('자기 추정을 고른 사람이 아직 없어요.')),
              card('선호가 뚜렷할수록 더 잘 맞을까?', h('p', { class: 'card-sub' }, '명확도별로 추정과 결과가 같았던 사람 수.'),
                E.length ? C.bars({ items: byC.map((x) => ({ label: D.CLARITY[x.k], value: x.n ? x.ok / x.n : 0, text: x.n ? `${x.ok}/${x.n}명` : '–', color: ST.D.letterColor(p.a) })), max: 1 }) : empty())),
            card('함께한 사람들', h('div', { class: 'ppl' }, R.sort((a, b) => b.r.pos - a.r.pos).map((x) => h('div', { class: 'pp' + (ST.isMe(x.u) ? ' me' : '') }, ST.avatar(x.u), h('div', {}, h('span', { class: 'nm' }, ST.nameOf(x.u)), ST.letters(x.r.letter), h('span', { class: 'muted' }, ' · ' + (x.r.tie ? '동점' : D.CLARITY[x.r.clarity]))))))),
            callout('key', '기억해 두세요', '이 8문항은 학습용으로 간단히 만든 것이라 오차가 있을 수 있습니다. 점수가 근소하거나 자기 추정과 다르면 <b>7장에서 설명을 읽고 직접 결정</b>합니다.')
          ]);
        });
        return root;
      },

      quiz: c.quiz
    };
  }

  ['EI', 'SN', 'TF', 'JP'].forEach((k) => ST.chapters.push(makeChapter(k)));
})();
