/* 공용 UI 도우미 */
(function () {
  const ST = (window.ST = window.ST || {});
  ST.chapters = [];
  ST.names = {};          // uid -> 이름 (실시간)

  /* ── DOM ── */
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  function h(tag, attrs, ...kids) {
    const el = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      const v = attrs[k];
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k === 'html') el.innerHTML = v;
      else if (k === 'style' && typeof v === 'object') { for (const s in v) { if (s.startsWith('--')) el.style.setProperty(s, v[s]); else el.style[s] = v[s]; } }
      else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
      else if (k === 'value') el.value = v;
      else if (v === true) el.setAttribute(k, '');
      else el.setAttribute(k, v);
    }
    add(el, kids);
    return el;
  }
  function add(el, kids) {
    if (!Array.isArray(kids)) kids = [kids];
    for (const k of kids) {
      if (k == null || k === false) continue;
      if (Array.isArray(k)) add(el, k);
      else if (k instanceof Node) el.appendChild(k);
      else el.appendChild(document.createTextNode(String(k)));
    }
  }
  const clear = (el) => { while (el.firstChild) el.removeChild(el.firstChild); return el; };
  const fromSvg = (str) => { const t = document.createElement('template'); t.innerHTML = str.trim(); return t.content.firstElementChild; };
  const fromHtml = (str) => { const t = document.createElement('template'); t.innerHTML = str.trim(); return t.content; };

  /* ── 수치/난수 ── */
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const fmt = (n, d = 0) => (n == null || isNaN(n) ? '–' : Number(n).toLocaleString('ko-KR', { minimumFractionDigits: d, maximumFractionDigits: d }));
  const pct = (n, d = 0) => (n == null || isNaN(n) ? '–' : fmt(n * 100, d) + '%');
  const mean = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0);
  function rng(seed) { let s = seed >>> 0 || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }
  const uid = () => Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4);
  const nameOf = (id) => (ST.names[id] && ST.names[id].name) || (id === ST.store.me.id ? ST.store.me.name : '참가자');
  const vals = (o) => (o ? Object.keys(o).map((k) => Object.assign({ _id: k }, typeof o[k] === 'object' && o[k] ? o[k] : { _v: o[k] })) : []);
  const arr = (x) => (Array.isArray(x) ? x : x && typeof x === 'object' ? Object.keys(x).sort((a, b) => a - b).map((k) => x[k]) : []);

  /* ── 토스트 ── */
  let tt;
  function toast(msg) {
    const t = document.getElementById('toast'); if (!t) return;
    t.textContent = msg; t.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('on'), 2400);
  }

  /* ── 컨트롤 ── */
  function slider({ label, min = 0, max = 10, step = 1, value = 5, fmt: f, onInput, cls }) {
    const out = h('output', { class: 'sl-out' }, f ? f(value) : value);
    const inp = h('input', { type: 'range', min, max, step, value, 'aria-label': label });
    inp.addEventListener('input', () => { const v = +inp.value; out.textContent = f ? f(v) : v; onInput && onInput(v); });
    const wrap = h('label', { class: 'sl ' + (cls || '') }, h('span', { class: 'sl-l' }, label), inp, out);
    wrap.set = (v) => { inp.value = v; out.textContent = f ? f(+v) : v; };
    wrap.get = () => +inp.value;
    return wrap;
  }
  function seg(options, value, onChange, cls) {
    const wrap = h('div', { class: 'seg ' + (cls || ''), role: 'radiogroup' });
    const btns = options.map((o) => {
      const b = h('button', { type: 'button', role: 'radio', 'aria-checked': String(o.v === value), class: o.v === value ? 'on' : '', onclick: () => { set(o.v); onChange && onChange(o.v); } }, o.l);
      return b;
    });
    function set(v) { value = v; options.forEach((o, i) => { btns[i].classList.toggle('on', o.v === v); btns[i].setAttribute('aria-checked', String(o.v === v)); }); }
    add(wrap, btns);
    wrap.set = set; wrap.get = () => value;
    return wrap;
  }
  function btn(label, opts = {}) {
    return h('button', { type: 'button', class: 'btn ' + (opts.kind || ''), onclick: opts.onclick, disabled: opts.disabled }, label);
  }
  function field(label, input, hint) {
    return h('label', { class: 'fld' }, h('span', { class: 'fld-l' }, label), input, hint ? h('span', { class: 'fld-h' }, hint) : null);
  }
  const text = (o = {}) => h('input', Object.assign({ type: 'text', maxlength: 80 }, o));
  const area = (o = {}) => h('textarea', Object.assign({ rows: 3, maxlength: 280 }, o));
  function select(options, value, onChange, attrs) {
    const s = h('select', attrs || {}, options.map((o) => h('option', { value: o.v != null ? o.v : o, selected: (o.v != null ? o.v : o) === value }, o.l != null ? o.l : o)));
    s.addEventListener('change', () => onChange && onChange(s.value));
    return s;
  }

  /* ── 콘텐츠 블록 ── */
  const P = (html) => h('p', { class: 'p', html });
  const H3 = (t) => h('h3', { class: 'h3' }, t);
  const callout = (kind, title, html) => h('aside', { class: 'callout ' + kind }, title ? h('strong', {}, title) : null, h('div', { html }));
  const ul = (items, cls) => h('ul', { class: 'ul ' + (cls || '') }, items.map((i) => h('li', { html: i })));
  function table(head, rows, cls) {
    return h('div', { class: 'tbl-wrap' }, h('table', { class: 'tbl ' + (cls || '') },
      h('thead', {}, h('tr', {}, head.map((x) => h('th', { scope: 'col', html: x })))),
      h('tbody', {}, rows.map((r) => h('tr', {}, r.map((c, i) => (i === 0 ? h('th', { scope: 'row', html: c }) : h('td', { html: c }))))))));
  }
  function figure(node, caption) { return h('figure', { class: 'fig' }, node, caption ? h('figcaption', {}, caption) : null); }
  function card(title, ...kids) { return h('section', { class: 'card' }, title ? h('h3', { class: 'card-t' }, title) : null, ...kids); }
  function grid(cols, ...kids) { return h('div', { class: 'grid g' + cols }, ...kids); }
  const empty = (msg) => h('p', { class: 'empty' }, msg || '아직 아무도 제출하지 않았어요. 첫 번째가 되어 보세요!');

  /* ── 팔레트 ── */
  ST.PAL = ['#4B47C9', '#E8553A', '#118AB2', '#E9A417', '#1F9D74', '#D1457B', '#8A5CD6', '#6B7A8F'];

  Object.assign(ST, { esc, h, add, clear, fromSvg, fromHtml, clamp, fmt, pct, mean, rng, uid, nameOf, vals, arr, toast, slider, seg, btn, field, text, area, select, P, H3, callout, ul, table, figure, card, grid, empty });
})();
