/* ---------- State ---------- */
let S;
function resetState(){
  S = {
    employers: seedEmployers(),
    jobs: seedJobs(),
    interns: seedInterns(),
    apps: seedApps(),
    threads: seedThreads(),
    cv: seedCV(),
    saved: new Set(['j2','j5']),
    booked: new Set(['ev2']),
    filters: {q:'', area:'', sectors:new Set(), modes:new Set(), programme:'', minPay:false, sort:'newest'},
    boost: {streak:4, points:120, played:{wordle:false, quiz:false, match:false}, counted:false},
    wordle: null, quiz: null, match: null,
    draft: null, postStep: 0,
    pipelineJob: 'j1',
    activeThread: {intern:'t1', employer:'t4'},
    peopleTab: 'interns', approvalsTab: 'listings',
    returned: {},
    events: EVENTS.map(e => ({...e})),
    talentQ: ''
  };
}
resetState();

/* ---------- Utilities ---------- */
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MONTHS_L = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS_L = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const fmt = s => { if(!s) return ''; const x = d(s); return `${x.getDate()} ${MONTHS[x.getMonth()]}`; };
const fmtLong = s => { const x = d(s); return `${DAYS_L[x.getDay()]} ${x.getDate()} ${MONTHS_L[x.getMonth()]} ${x.getFullYear()}`; };
const daysUntil = s => Math.round((d(s) - TODAY) / 864e5);
const daysSince = s => Math.round((TODAY - d(s)) / 864e5);
const money = p => `£${p.toFixed(2)}`;
const weekly = j => `£${Math.round(j.pay * j.hours)}`;
const sectorName = id => (SECTORS.find(s => s.id === id) || {}).name || id;
const emp = id => S.employers[id];
const job = id => S.jobs.find(j => j.id === id);
const intern = id => S.interns[id];
const todayISO = () => '2026-11-24';
const avail = s => s === 'Now' ? 'Available now' : 'Available ' + s[0].toLowerCase() + s.slice(1);
const uid = p => p + Math.random().toString(36).slice(2, 8);

function closingText(j){
  const n = daysUntil(j.closes);
  if (n < 0) return 'Closed';
  if (n === 0) return 'Closes today';
  if (n === 1) return 'Closes tomorrow';
  if (n <= 7) return `Closes in ${n} days`;
  return `Closes ${fmt(j.closes)}`;
}
function matchScore(j, i = intern(DEMO_PEOPLE.intern)){
  const sk = j.skills.filter(s => S.cv.skills.map(x => x.toLowerCase()).includes(s.toLowerCase())).length;
  let score = 40 + Math.round(40 * sk / Math.max(1, j.skills.length));
  if ((i.sectors || []).includes(j.sector)) score += 12;
  if (j.area === i.area) score += 8;
  return Math.min(98, score);
}
function liveJobs(){ return S.jobs.filter(j => j.status === 'live'); }

/* ---------- Icons ---------- */
const ICONS = {
  home:'<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
  briefcase:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/>',
  apps:'<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M9 10h6M9 14h6M9 18h3"/>',
  file:'<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
  hex:'<path d="M7 3.5h10l5 8.5-5 8.5H7L2 12z"/>',
  spark:'<path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4z"/>',
  mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  users:'<circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0M16 4a4 4 0 0 1 0 8M22 21a7 7 0 0 0-4-6.3"/>',
  chart:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  check:'<path d="M5 12l5 5L20 7"/>',
  x:'<path d="M6 6l12 12M18 6L6 18"/>',
  bookmark:'<path d="M6 3h12v18l-6-4-6 4z"/>',
  pin:'<path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  pound:'<path d="M16 6.5A4 4 0 0 0 9 9v11M6 20h11M6 13h7"/>',
  left:'<path d="M15 18l-6-6 6-6"/>',
  building:'<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M10 21v-3h4v3"/>',
  eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  alert:'<path d="M12 3l10 18H2z"/><path d="M12 10v4M12 17.5v.5"/>',
  download:'<path d="M12 4v11M7 10l5 5 5-5M4 20h16"/>',
  send:'<path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/>',
  list:'<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  shield:'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
  kanban:'<rect x="3" y="4" width="5" height="16" rx="1"/><rect x="10" y="4" width="5" height="10" rx="1"/><rect x="17" y="4" width="4" height="13" rx="1"/>',
  grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  quiz:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .8-1 1.5V14M12 17.5v.5"/>',
  link:'<path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/>',
  flame:'<path d="M12 22c4 0 7-2.7 7-7 0-4-3-6-4-10-2 2-3 4-3 6-1-1-2-2-2-4-2 2-5 5-5 8 0 4.3 3 7 7 7z"/>',
  edit:'<path d="M4 20h4L19 9l-4-4L4 16z"/>',
  code:'<path d="M8 8l-5 4 5 4M16 8l5 4-5 4M13.5 5l-3 14"/>',
  cog:'<circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v3M12 18.5v3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M2.5 12h3M18.5 12h3M4.6 19.4l2.1-2.1M17.3 6.7l2.1-2.1"/>',
  heart:'<path d="M12 20s-7-4.4-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.6-9 9-9 9z"/>',
  flask:'<path d="M9 3h6M10 3v6L4.5 18.5A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-2.5L14 9V3"/><path d="M7 15h10"/>',
  hardhat:'<path d="M3 17h18v2.5H3zM5 17a7 7 0 0 1 14 0"/><path d="M10 10.5V6h4v4.5"/>',
  wrench:'<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.5-.5-.5-2.5z"/>',
  arrowr:'<path d="M5 12h14M13 6l6 6-6 6"/>',
  plusx:'<path d="M12 5v14M5 12h14"/>',
  bell:'<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 21h4"/>',
  map:'<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>',
  star:'<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
  columns:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16M15 4v16"/>',
  play:'<path d="M7 4l13 8-13 8z"/>',
  target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  megaphone:'<path d="M3 11v2a2 2 0 0 0 2 2h2l5 4V5L7 9H5a2 2 0 0 0-2 2zM16 8a5 5 0 0 1 0 8M19 5a9 9 0 0 1 0 14"/>',
  log:'<path d="M4 4h16v16H4z"/><path d="M8 8h8M8 12h8M8 16h5"/>',
  trophy:'<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H4v1a4 4 0 0 0 4 4M16 6h4v1a4 4 0 0 1-4 4M12 13v4M8 21h8M9 17h6v4H9z"/>',
  graduation:'<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/>',
  news:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h10M7 12h10M7 16h6"/>'
};
const icon = (n, cls='') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n] || ''}</svg>`;

/* ---------- Bits ---------- */
const logo = (e, cls='') => `<span class="logo ${cls}" style="background:${e.color}" aria-hidden="true">${esc(e.initials)}</span>`;
const PASTELS = ['#DDE1FF','#FCE4F8','#EEFAD0','#FFE9DC','#D9F3E6','#ECEBFF','#FFF0CC','#DCF0FF'];
const pastel = n => PASTELS[[...n].reduce((a, c) => a + c.charCodeAt(0), 0) % PASTELS.length];
const avatar = (p, cls='') => `<span class="avatar ${cls}" style="--av:${pastel(p.name)}" aria-hidden="true">${esc(p.name.split(' ').map(x => x[0]).join('').slice(0,2))}</span>`;
const status = (s, label) => `<span class="status st-${s}">${esc(label || STATUS_LABEL[s] || s[0].toUpperCase() + s.slice(1))}</span>`;
const brand = (href='#/', sub=true) => `<a class="brand" href="${href}"><span class="mark" aria-hidden="true">th</span><span class="wm"><b>Talent Hive</b>${sub ? '<small>Cambridgeshire and Peterborough</small>' : ''}</span><span class="concept-tag">Demo</span></a>`;
const CPCA_NAME = 'Cambridgeshire and Peterborough Combined Authority';
/* CPCA logo: colour on light, white lettering in dark mode, all white (mono) on the blue hero */
function cpcaLogo(h = 32, mono = false){
  const w = Math.round(h * 746 / 214);
  if (mono) return `<img class="cpca-logo" src="assets/cpca-logo-mono.png" alt="${CPCA_NAME}" width="${w}" height="${h}">`;
  return `<span class="cpca-logo"><img class="lt" src="assets/cpca-logo.png" alt="${CPCA_NAME}" width="${w}" height="${h}"><img class="dk" src="assets/cpca-logo-white.png" alt="" aria-hidden="true" width="${w}" height="${h}"></span>`;
}

function jobRow(j, {base='#/jobs', showMatch=false} = {}){
  const e = emp(j.emp);
  const isNew = daysSince(j.posted) <= 3;
  const saved = S.saved.has(j.id);
  return `<article class="jobrow">
    ${logo(e)}
    <div>
      <h3><a href="${base}/${j.id}">${esc(j.title)}</a> ${isNew ? '<span class="tag-new">New</span>' : ''}</h3>
      <div class="emp">${esc(e.name)}</div>
      <div class="chips">
        <span class="chip">${icon('pin')}${esc(j.area)}, ${esc(j.mode.toLowerCase())}</span>
        <span class="chip">${icon('pound')}${money(j.pay)} an hour</span>
        <span class="chip">${icon('clock')}${j.hours} hours a week, ${j.weeks} weeks</span>
      </div>
    </div>
    <div class="jside">
      <div class="js-top">${showMatch ? `<span class="match">${matchScore(j)}% match</span>` : ''}<button class="icon-btn" data-act="save" data-id="${j.id}" aria-pressed="${saved}" aria-label="${saved ? 'Remove from saved jobs' : 'Save job'}: ${esc(j.title)}">${icon('bookmark')}</button></div>
      <span class="small ${daysUntil(j.closes) <= 7 ? '' : 'muted'}" style="${daysUntil(j.closes) <= 7 ? 'color:var(--peach-ink);font-weight:600' : ''}">${closingText(j)}</span>
      ${showMatch ? `<label class="cmpbox small"><input type="checkbox" data-change="cmp" data-id="${j.id}" ${S.compare && S.compare.has(j.id) ? 'checked' : ''}> Compare</label>` : ''}
    </div>
  </article>`;
}

/* ---------- Toast and modal ---------- */
function toast(msg){
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = `${icon('check')}<span>${esc(msg)}</span>`;
  const root = $('#toast-root'); root.appendChild(t); while (root.children.length > 2) root.firstChild.remove();
  setTimeout(() => t.remove(), 3200);
}
let lastFocus = null;
function openModal(html, {drawer=false, label='Dialog'} = {}){
  lastFocus = document.activeElement;
  $('#modal-root').innerHTML = `<div class="overlay ${drawer ? 'drawer-ov' : ''}" data-act="overlay"><div class="${drawer ? 'drawer' : 'modal'}" role="dialog" aria-modal="true" aria-label="${esc(label)}" tabindex="-1">${html}</div></div>`;
  const box = $('#modal-root [role=dialog]');
  const first = box.querySelector('input,textarea,select,button:not(.icon-btn)');
  (first || box).focus();
}
function closeModal(){
  $('#modal-root').innerHTML = '';
  if (lastFocus && document.body.contains(lastFocus)) lastFocus.focus();
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && $('#modal-root').innerHTML) closeModal();
  if (e.key === 'Tab' && $('#modal-root [role=dialog]')){
    const f = $$('#modal-root [role=dialog] a, #modal-root [role=dialog] button, #modal-root [role=dialog] input, #modal-root [role=dialog] textarea, #modal-root [role=dialog] select').filter(x => !x.disabled);
    if (!f.length) return;
    if (e.shiftKey && document.activeElement === f[0]){ e.preventDefault(); f.at(-1).focus(); }
    else if (!e.shiftKey && document.activeElement === f.at(-1)){ e.preventDefault(); f[0].focus(); }
  }
});

/* ---------- Router ---------- */
const ROUTES = {};
function route(){
  const parts = (location.hash.replace(/^#\/?/, '') || '').split('/').filter(Boolean);
  const top = parts[0] || '';
  let role = 'visitor';
  if (['intern','employer','cpca'].includes(top)) role = top;
  return {role, parts, top};
}
function go(hash){ if (location.hash === hash) render(); else location.hash = hash; }

function render(opts = {}){
  const r = route();
  let html;
  if (r.role === 'visitor') html = renderPublic(r);
  else if (r.role === 'intern') html = renderIntern(r);
  else if (r.role === 'employer') html = renderEmployer(r);
  else html = renderCpca(r);
  $('#app').innerHTML = html;
  $$('.demobar [data-role]').forEach(b => b.setAttribute('aria-pressed', b.dataset.role === r.role));
  document.title = (($('#app h1') || {}).textContent || 'Talent Hive') + ' | Talent Hive demo';
  if (!opts.keepScroll) window.scrollTo(0, 0);
  if (!opts.keepFocus){ const h = $('#app h1'); if (h){ h.setAttribute('tabindex','-1'); h.focus({preventScroll:true}); } }
  AFTER.forEach(fn => fn(r));
}
const AFTER = [];
window.addEventListener('hashchange', () => { closeModal(); render(); });

/* ---------- App shell for signed-in roles ---------- */
function shell(role, current, nav, who, body){
  const links = nav.map(n => `<a href="${n.href}" ${n.id === current ? 'aria-current="page"' : ''}>${icon(n.icon)}<span>${n.label}</span>${n.count ? `<span class="count" aria-label="${n.count} new">${n.count}</span>` : ''}</a>`).join('');
  const mob = nav.map(n => `<a href="${n.href}" ${n.id === current ? 'aria-current="page"' : ''}>${n.label}${n.count ? ` (${n.count})` : ''}</a>`).join('');
  return `<div class="shell">
    <aside class="side" aria-label="${role} menu">${brand('#/' + role)}<button class="side-search" data-act="palette">${icon('search')}<span>Search</span><kbd>/</kbd></button><nav>${links}</nav>
      <div class="side-cpca"><span>A programme from</span>${cpcaLogo(40)}</div><div class="who">${who}</div></aside>
    <div class="col-main">
      <nav class="mobnav" aria-label="${role} menu">${brand('#/' + role)}${mob}</nav>
      ${topbar(role)}
      <main class="main" id="main">${body}</main>
    </div>
  </div>`;
}

/* ---------- Events ---------- */
const ACT = {}, FORM = {}, INPUT = {};
document.addEventListener('click', e => {
  const a = e.target.closest('[data-act]');
  if (!a) return;
  if (a.dataset.act === 'overlay' && e.target !== a) return;
  const fn = ACT[a.dataset.act];
  if (fn){ e.preventDefault(); fn(a, e); }
});
document.addEventListener('submit', e => {
  const f = e.target.closest('[data-form]');
  if (!f) return;
  e.preventDefault();
  FORM[f.dataset.form] && FORM[f.dataset.form](f, e);
});
document.addEventListener('input', e => {
  const el = e.target.closest('[data-input]');
  if (el && INPUT[el.dataset.input]) INPUT[el.dataset.input](el, e);
});
document.addEventListener('change', e => {
  const el = e.target.closest('[data-change]');
  if (el && INPUT[el.dataset.change]) INPUT[el.dataset.change](el, e);
});

ACT.overlay = () => closeModal();
ACT.close = () => closeModal();
ACT.role = el => go({visitor:'#/', intern:'#/intern', employer:'#/employer', cpca:'#/cpca'}[el.dataset.role]);
ACT.reset = () => { resetState(); toast('Demo data reset'); render(); };
ACT.save = el => {
  const id = el.dataset.id;
  if (route().role === 'visitor'){ promptSignIn('save jobs'); return; }
  if (S.saved.has(id)){ S.saved.delete(id); toast('Removed from saved jobs'); }
  else { S.saved.add(id); toast('Job saved'); }
  render({keepScroll:true, keepFocus:true});
  const b = $(`[data-act=save][data-id="${id}"]`); if (b) b.focus();
};
ACT.go = el => go(el.dataset.href);

function promptSignIn(what){
  openModal(`<header><h2>Sign in to ${esc(what)}</h2><button class="icon-btn" data-act="close" aria-label="Close">${icon('x')}</button></header>
    <p>This is a demo, so there are no passwords. Choose who you want to continue as.</p>
    <div class="stack">
      <button class="btn btn-primary btn-lg" style="width:100%" data-act="signin-as" data-role="intern">Continue as Jordan, an intern</button>
      <button class="btn btn-ghost btn-lg" style="width:100%" data-act="signin-as" data-role="employer">Continue as Priya, an employer</button>
    </div>`, {label:'Sign in'});
}
ACT['signin-as'] = el => {
  closeModal();
  const r = route();
  if (el.dataset.role === 'intern' && r.parts[0] === 'jobs' && r.parts[1]) go('#/intern/jobs/' + r.parts[1]);
  else go('#/' + el.dataset.role);
};

/* ---------- First-visit notice ---------- */
function showIntro(){
  openModal(`<header><h2>A working demo, not a real job board</h2></header>
    <div class="intro-logo">${cpcaLogo(48)}</div>
    <p>This is a demo by <b>Alexej Zhukov</b> showing how the Talent Hive internship platform for Cambridgeshire and Peterborough could work for interns, employers and the CPCA team.</p>
    <ul><li>The employers, people and roles are invented.</li><li>Nothing you type is sent anywhere, and it all resets when you reload.</li><li>It is not an official Cambridgeshire and Peterborough Combined Authority website.</li></ul>
    <p class="small muted">Use the bar at the top to switch between Visitor, Intern, Employer and CPCA team views.</p>
    <footer><a class="btn btn-ghost" href="#/about-demo" data-act="intro-fixes">See what it fixes</a><button class="btn btn-primary" data-act="intro-ok">Explore the demo</button></footer>`, {label:'About this demo'});
}
ACT['intro-fixes'] = () => { try { localStorage.setItem('th-intro-seen', '1'); } catch (e) {} closeModal(); go('#/about-demo'); };
ACT['intro-ok'] = () => { try { localStorage.setItem('th-intro-seen', '1'); } catch (e) {} closeModal(); };
ACT.about = () => go('#/about-demo');
function maybeIntro(){ let seen = false; try { seen = localStorage.getItem('th-intro-seen') === '1'; } catch (e) {} if (!seen) showIntro(); }
