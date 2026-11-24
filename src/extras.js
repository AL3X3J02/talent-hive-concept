/* ---------- Notifications ---------- */
function seedNotifs(){
  return {
    intern:[
      {id:'n1',text:'Ouse Valley Housing invited you to an interview on 3 December',href:'#/intern/applications',t:'20 Nov',unread:true},
      {id:'n2',text:'Fenlight Digital shortlisted you for Junior Web Developer Intern',href:'#/intern/applications',t:'21 Nov',unread:true},
      {id:'n3',text:'4 new roles match the skills on your CV',href:'#/intern/jobs',t:'22 Nov',unread:false},
      {id:'n4',text:'You have a place at Profile Power Up on 9 December',href:'#/intern/events',t:'18 Nov',unread:false}],
    employer:[
      {id:'n5',text:'Callum Reid applied for Junior Web Developer Intern',href:'#/employer/pipeline/j1',t:'23 Nov',unread:true},
      {id:'n6',text:'Ben Okoro sent you a message',href:'#/employer/messages',t:'23 Nov',unread:true},
      {id:'n7',text:'Ella Brooks submitted her week 4 check-in',href:'#/employer/placements',t:'22 Nov',unread:false},
      {id:'n8',text:'Data and AI Intern is now live',href:'#/employer/listings',t:'20 Nov',unread:false}],
    cpca:[
      {id:'n9',text:'Cambridge Sports Hub submitted Marketing Assistant Intern for approval',href:'#/cpca/approvals/j15',t:'23 Nov',unread:true},
      {id:'n10',text:'Fen Edge Farms registered as a new employer',href:'#/cpca/approvals',t:'22 Nov',unread:true},
      {id:'n11',text:'3 new interns are waiting for eligibility checks',href:'#/cpca/approvals',t:'22 Nov',unread:true},
      {id:'n12',text:'Weekly programme report is ready',href:'#/cpca/reports',t:'23 Nov',unread:false}]
  };
}
S.notifs = seedNotifs();
const _reset = resetState;
resetState = function(){ _reset(); S.notifs = seedNotifs(); seedExtras(); };
function notify(role, text, href){ S.notifs[role].unshift({id:uid('n'), text, href, t:'Just now', unread:true}); }

function topbar(role){
  const unread = S.notifs[role].filter(n => n.unread).length;
  return `<div class="topbar">
    <button class="searchtrigger" data-act="palette"><span class="st-icon">${icon('search')}</span><span class="st-label">Search jobs, people and pages</span><kbd>Ctrl K</kbd></button>
    <div class="tb-actions">
      <button class="icon-btn tb-btn" data-act="display" aria-label="Display and accessibility settings"><span class="aa" aria-hidden="true">Aa</span></button>
      <button class="icon-btn tb-btn bell" data-act="notifs" aria-haspopup="true" aria-label="Notifications${unread ? `, ${unread} unread` : ''}">${icon('bell')}${unread ? `<span class="badge-dot">${unread}</span>` : ''}</button>
    </div>
  </div>`;
}
ACT.notifs = el => {
  const role = route().role; const list = S.notifs[role];
  togglePop(el, `<div class="pop-head"><b>Notifications</b>${list.some(n => n.unread) ? '<button class="btn btn-quiet btn-sm" data-act="notifs-read">Mark all as read</button>' : ''}</div>
    <ul class="notif-list">${list.map(n => `<li><a href="${n.href}" data-act="notif-go" data-id="${n.id}" class="${n.unread ? 'unread' : ''}">${n.unread ? '<span class="nd" aria-label="Unread"></span>' : '<span class="nd off"></span>'}<span><span class="nt">${esc(n.text)}</span><span class="small muted">${esc(n.t)}</span></span></a></li>`).join('')}</ul>`, 'Notifications');
};
ACT['notifs-read'] = () => { S.notifs[route().role].forEach(n => n.unread = false); closePop(); render({keepScroll:true, keepFocus:true}); };
ACT['notif-go'] = el => { const n = S.notifs[route().role].find(x => x.id === el.dataset.id); if (n) n.unread = false; closePop(); go(el.getAttribute('href')); };

/* Popover */
let popAnchor = null;
function togglePop(anchor, html, label){
  if (popAnchor === anchor){ closePop(); return; }
  closePop();
  popAnchor = anchor;
  const r = anchor.getBoundingClientRect();
  const p = document.createElement('div');
  p.className = 'pop'; p.id = 'pop'; p.setAttribute('role', 'dialog'); p.setAttribute('aria-label', label);
  p.innerHTML = html;
  document.body.appendChild(p);
  const w = p.offsetWidth;
  p.style.top = (r.bottom + window.scrollY + 8) + 'px';
  p.style.left = Math.max(12, Math.min(window.innerWidth - w - 12, r.right - w)) + 'px';
  anchor.setAttribute('aria-expanded', 'true');
  const f = p.querySelector('a,button'); if (f) f.focus();
}
function closePop(){ const p = $('#pop'); if (p) p.remove(); if (popAnchor){ popAnchor.setAttribute('aria-expanded', 'false'); popAnchor = null; } }
document.addEventListener('click', e => { if ($('#pop') && !e.target.closest('#pop') && !e.target.closest('[data-act=notifs]')) closePop(); }, true);
document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('#pop')){ const a = popAnchor; closePop(); if (a) a.focus(); } });
window.addEventListener('hashchange', closePop);

/* ---------- Command palette ---------- */
function paletteItems(){
  const role = route().role;
  const items = [];
  const nav = role === 'intern' ? internNav() : role === 'employer' ? empNav() : role === 'cpca' ? cpcaNav() : [{href:'#/',label:'Home'},{href:'#/jobs',label:'Find a role'},{href:'#/employers',label:'For employers'},{href:'#/events',label:'Events'},{href:'#/join',label:'Join Talent Hive'}];
  nav.forEach(n => items.push({group:'Pages', label:n.label, href:n.href, hint:''}));
  const jb = role === 'intern' ? '#/intern/jobs/' : role === 'visitor' ? '#/jobs/' : null;
  if (jb) liveJobs().forEach(j => items.push({group:'Roles', label:j.title, href:jb + j.id, hint:emp(j.emp).name + ', ' + j.area}));
  if (role === 'employer') empJobs().forEach(j => items.push({group:'Your listings', label:j.title, href:j.status === 'live' ? '#/employer/pipeline/' + j.id : '#/employer/listings', hint:empStatusLabel(j.status)}));
  if (role === 'employer' || role === 'cpca') Object.values(S.interns).filter(i => role === 'cpca' || i.talent).forEach(i => items.push({group:'People', label:i.name, href:role === 'cpca' ? '#/cpca/interns' : '#/employer/talent', hint:i.headline}));
  if (role === 'cpca') Object.values(S.employers).forEach(e => items.push({group:'Employers', label:e.name, href:'#/cpca/employers', hint:e.town}));
  if (role === 'intern' || role === 'visitor') Object.values(S.employers).filter(e => e.verified).forEach(e => items.push({group:'Employers', label:e.name, href:(role === 'intern' ? '#/intern/company/' : '#/company/') + e.id, hint:sectorName(e.sector)}));
  return items;
}
let palSel = 0;
ACT.palette = () => {
  palSel = 0;
  openModal(`<div class="palette"><label class="sr-only" for="palq">Search</label><div class="pal-input">${icon('search')}<input id="palq" type="search" placeholder="Search jobs, people and pages" autocomplete="off" data-input="palq" role="combobox" aria-expanded="true" aria-controls="palres"><kbd>Esc</kbd></div><div id="palres" role="listbox">${paletteResults('')}</div></div>`, {label:'Search'});
  $('#modal-root .modal').classList.add('modal-palette');
  $('#modal-root .overlay').classList.add('ov-top');
};
function paletteResults(q){
  q = q.toLowerCase().trim();
  const all = paletteItems().filter(i => !q || (i.label + ' ' + i.hint).toLowerCase().includes(q)).slice(0, 12);
  if (!all.length) return `<p class="muted" style="padding:16px">Nothing found for "${esc(q)}". Try a job title, skill or name.</p>`;
  let html = '', g = '';
  all.forEach((i, k) => { if (i.group !== g){ g = i.group; html += `<div class="pal-group">${esc(g)}</div>`; } html += `<a class="pal-item" role="option" id="pal-${k}" aria-selected="${k === palSel}" href="${i.href}" data-act="pal-go"><b>${esc(i.label)}</b>${i.hint ? `<span class="small muted">${esc(i.hint)}</span>` : ''}</a>`; });
  return html;
}
INPUT.palq = el => { palSel = 0; $('#palres').innerHTML = paletteResults(el.value); };
ACT['pal-go'] = el => { closeModal(); go(el.getAttribute('href')); };
document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k'){ e.preventDefault(); if (!$('#palres')) ACT.palette(); return; }
  const res = $('#palres'); if (!res) return;
  const items = $$('.pal-item', res);
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp'){ e.preventDefault(); palSel = (palSel + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length; items.forEach((x, k) => x.setAttribute('aria-selected', k === palSel)); items[palSel] && items[palSel].scrollIntoView({block:'nearest'}); $('#palq').setAttribute('aria-activedescendant', 'pal-' + palSel); }
  if (e.key === 'Enter' && document.activeElement && document.activeElement.id === 'palq' && items[palSel]){ e.preventDefault(); const h = items[palSel].getAttribute('href'); closeModal(); go(h); }
});

/* ---------- Display and accessibility ---------- */
const A11Y_DEFAULT = {size:0, spacing:false, contrast:false, motion:false};
let A11Y = {...A11Y_DEFAULT};
try { A11Y = {...A11Y_DEFAULT, ...JSON.parse(localStorage.getItem('th-a11y') || '{}')}; } catch (e) {}
function applyA11y(){
  const h = document.documentElement;
  h.classList.toggle('fs-1', A11Y.size === 1); h.classList.toggle('fs-2', A11Y.size === 2);
  h.classList.toggle('a11y-spacing', A11Y.spacing); h.classList.toggle('a11y-contrast', A11Y.contrast); h.classList.toggle('a11y-motion', A11Y.motion);
  try { localStorage.setItem('th-a11y', JSON.stringify(A11Y)); } catch (e) {}
}
applyA11y();
const reducedMotion = () => A11Y.motion || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function displayPanel(){
  const sw = (k, label, hint) => `<label class="switch"><input type="checkbox" data-change="a11y" data-k="${k}" ${A11Y[k] ? 'checked' : ''}><span class="sw" aria-hidden="true"></span><span><b>${label}</b><span class="hint">${hint}</span></span></label>`;
  return `<header><h2>Display and accessibility</h2><button class="icon-btn" data-act="close" aria-label="Close">${icon('x')}</button></header>
    <fieldset class="seg"><legend>Text size</legend>${['Standard','Large','Extra large'].map((l, i) => `<label><input type="radio" name="fs" value="${i}" data-change="a11ysize" ${A11Y.size === i ? 'checked' : ''}><span style="font-size:${1 + i * .15}rem">${l}</span></label>`).join('')}</fieldset>
    ${sw('spacing','Easier reading','More space between letters, words and lines')}
    ${sw('contrast','Higher contrast','Darker text and stronger borders')}
    ${sw('motion','Reduce motion','Turns off animations and moving effects')}
    <p class="small muted" style="margin:16px 0 0">Settings are saved on this device.</p>`;
}
ACT.display = () => openModal(displayPanel(), {label:'Display and accessibility'});
INPUT.a11y = el => { A11Y[el.dataset.k] = el.checked; applyA11y(); };
INPUT.a11ysize = el => { A11Y.size = +el.value; applyA11y(); };

/* ---------- Motion: page enter, counters, confetti ---------- */
let lastRouteKey = '';
AFTER.push(r => {
  const key = r.parts.join('/');
  const changed = key !== lastRouteKey; lastRouteKey = key;
  if (!changed || reducedMotion()) return;
  const m = $('#main'); if (m){ m.classList.remove('page-enter'); void m.offsetWidth; m.classList.add('page-enter'); }
  $$('[data-count]').forEach(el => {
    const end = +el.dataset.count; if (!end) return; const t0 = performance.now(), dur = 700;
    const step = t => { const k = Math.min(1, (t - t0) / dur); el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3))).toLocaleString('en-GB'); if (k < 1) requestAnimationFrame(step); };
    el.textContent = '0'; requestAnimationFrame(step);
  });
  $$('.meter i').forEach(el => { const w = el.style.width; el.style.width = '0'; requestAnimationFrame(() => requestAnimationFrame(() => { el.style.width = w; })); });
});
function confetti(){
  if (reducedMotion()) return;
  const c = document.createElement('canvas'); c.className = 'confetti'; document.body.appendChild(c);
  const dpr = window.devicePixelRatio || 1; c.width = innerWidth * dpr; c.height = innerHeight * dpr;
  const x = c.getContext('2d'); x.scale(dpr, dpr);
  const cols = ['#F2A93B','#1E9BD7','#2F9E6E','#0E2A47','#E8604C'];
  const P = Array.from({length:140}, () => ({x:innerWidth / 2 + (Math.random() - .5) * 160, y:innerHeight * .35, vx:(Math.random() - .5) * 13, vy:-Math.random() * 12 - 4, s:Math.random() * 7 + 4, r:Math.random() * 6, vr:(Math.random() - .5) * .3, c:cols[Math.floor(Math.random() * cols.length)]}));
  const t0 = performance.now();
  const tick = t => {
    x.clearRect(0, 0, innerWidth, innerHeight);
    P.forEach(p => { p.vy += .35; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.r += p.vr; x.save(); x.translate(p.x, p.y); x.rotate(p.r); x.fillStyle = p.c; x.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); x.restore(); });
    if (t - t0 < 2200) requestAnimationFrame(tick); else c.remove();
  };
  requestAnimationFrame(tick);
}

/* ---------- Guided tour ---------- */
const TOUR = [
  {r:'#/', sel:'.comb', t:'Browse by sector', b:'Visitors start from the jobs, not a news feed. Each sector shows how many roles are open right now.'},
  {r:'#/jobs/j1', sel:'.facts', t:'The facts up front', b:'Pay, hours, location and dates are required fields, so every listing answers the questions interns ask first.'},
  {r:'#/intern', sel:'.nextstep', t:'One clear next step', b:'Interns see the most important thing first. Here it is an interview, with help to prepare.'},
  {r:'#/intern/applications', sel:'.appcard', t:'Every application tracked', b:'No more emailing to ask what happened. Each status change shows here and sends a notification.'},
  {r:'#/intern/placement', sel:'.placement-hero', t:'Support during the placement', b:'Once placed, interns log hours, set weekly goals and check in with their mentor.'},
  {r:'#/intern/boost', sel:'.gamecards', t:'A reason to come back daily', b:'Short daily games build workplace knowledge, keep a streak going and surface new roles.'},
  {r:'#/employer/pipeline', sel:'.kanban', t:'Employers get a real pipeline', b:'Drag applicants between stages. They are told automatically, and interview times can be offered in one step.'},
  {r:'#/employer/post', sel:'.stepper', t:'Posting in ten minutes', b:'A guided form with a live preview. It refuses pay below the National Living Wage before CPCA ever sees it.'},
  {r:'#/cpca/approvals/j15', sel:'.checklist', t:'Automatic checks for CPCA', b:'Listings are checked before they go live. This one is blocked because the pay is too low.'},
  {r:'#/cpca', sel:'.kpis', t:'The whole programme at a glance', b:'Live numbers, stalled applications and where placements are happening across the region.'}
];
let tourI = -1;
ACT.tour = () => { closeModal(); tourI = 0; tourStep(); };
function tourStep(){
  const s = TOUR[tourI];
  if (location.hash !== s.r && !(s.r === '#/' && (location.hash === '' || location.hash === '#/'))) location.hash = s.r;
  setTimeout(() => {
    $('#tour') && $('#tour').remove();
    const el = $(s.sel);
    if (el) el.scrollIntoView({block:'center', behavior:reducedMotion() ? 'auto' : 'smooth'});
    setTimeout(() => drawTour(el, s), reducedMotion() ? 0 : 350);
  }, 120);
}
function drawTour(el, s){
  $('#tour') && $('#tour').remove();
  const r = el ? el.getBoundingClientRect() : {top:innerHeight / 2 - 40, left:innerWidth / 2 - 160, width:320, height:80};
  const pad = 8;
  const t = document.createElement('div'); t.id = 'tour';
  t.innerHTML = `<div class="tour-hole" style="top:${r.top - pad}px;left:${r.left - pad}px;width:${r.width + pad * 2}px;height:${r.height + pad * 2}px"></div>
    <div class="tour-card" role="dialog" aria-modal="true" aria-labelledby="tour-t"><div class="small muted">Step ${tourI + 1} of ${TOUR.length}</div><h2 id="tour-t">${esc(s.t)}</h2><p>${esc(s.b)}</p>
      <div class="tour-dots" aria-hidden="true">${TOUR.map((_, i) => `<i class="${i === tourI ? 'on' : ''}"></i>`).join('')}</div>
      <div class="tour-btns"><button class="btn btn-quiet btn-sm" data-act="tour-end">End tour</button><span>${tourI ? '<button class="btn btn-ghost btn-sm" data-act="tour-back">Back</button>' : ''} <button class="btn btn-primary btn-sm" data-act="tour-next">${tourI === TOUR.length - 1 ? 'Finish' : 'Next'}</button></span></div></div>`;
  document.body.appendChild(t);
  const card = $('.tour-card', t); const cw = card.offsetWidth, ch = card.offsetHeight;
  let top = r.top + r.height + pad + 14; if (top + ch > innerHeight - 12) top = Math.max(12, r.top - pad - ch - 14);
  if (top < 12) top = innerHeight - ch - 16;
  card.style.top = top + 'px'; card.style.left = Math.max(12, Math.min(innerWidth - cw - 12, r.left)) + 'px';
  $('[data-act=tour-next]', t).focus();
}
ACT['tour-next'] = () => { if (tourI === TOUR.length - 1){ ACT['tour-end'](); toast('Tour finished. Explore any view from the bar at the top.'); return; } tourI++; tourStep(); };
ACT['tour-back'] = () => { tourI = Math.max(0, tourI - 1); tourStep(); };
ACT['tour-end'] = () => { tourI = -1; $('#tour') && $('#tour').remove(); };
document.addEventListener('keydown', e => { if (tourI > -1 && e.key === 'Escape') ACT['tour-end'](); });
window.addEventListener('resize', () => { if (tourI > -1) drawTour($(TOUR[tourI].sel), TOUR[tourI]); });
window.addEventListener('scroll', () => { if (tourI > -1 && $('#tour')){ const el = $(TOUR[tourI].sel); if (!el) return; const r = el.getBoundingClientRect(); const h = $('.tour-hole'); h.style.top = (r.top - 8) + 'px'; h.style.left = (r.left - 8) + 'px'; } }, {passive:true});

/* ---------- Extra seed data used by later features ---------- */
function seedExtras(){
  S.compare = new Set();
  S.mapView = false;
  S.ratings = {a1:4, a6:4, a8:3, a5:3};
  S.candCompare = new Set();
  S.signups = [
    {id:'s1',name:'Maya Patel',postcode:'PE1',area:'Peterborough',joined:'2026-11-22',docs:'Right to work checked'},
    {id:'s2',name:'Oliver Grant',postcode:'CB4',area:'Cambridge',joined:'2026-11-23',docs:'Waiting for proof of address'},
    {id:'s3',name:'Hana Kowalski',postcode:'PE29',area:'Huntingdon',joined:'2026-11-23',docs:'Right to work checked'}
  ];
  S.audit = [
    {t:'24 Nov, 08:52',who:'Sam Okafor',what:'Signed in'},
    {t:'23 Nov, 16:10',who:'Sam Okafor',what:'Confirmed placement: Sofia Marques at Lynchwood Engineering'},
    {t:'23 Nov, 11:31',who:'Leah Morgan (Brightmark Media)',what:'Moved Amira Haddad to Interview'},
    {t:'22 Nov, 15:02',who:'Sam Okafor',what:'Approved listing: Fundraising and Events Intern'},
    {t:'22 Nov, 09:45',who:'System',what:'Sent closing-soon reminders to 38 interns'},
    {t:'21 Nov, 14:20',who:'Ade Mensah',what:'Verified employer: Isle of Ely Learning Trust'}
  ];
  S.broadcasts = [{subject:'Welcome to the winter 2026 cohort',aud:'All interns',n:527,t:'2 Nov'}];
  S.placementPreview = false;
  S.myPlacement = {week:4, goals:[{t:'Ship the accessible footer component',done:true},{t:'Pair with Sam on code review',done:true},{t:'Write up what you learned about screen readers',done:false}], hours:[{wk:1,h:30,ok:true},{wk:2,h:30,ok:true},{wk:3,h:28,ok:true},{wk:4,h:12,ok:false}], checkins:[{wk:3,mood:4,text:'Really enjoying the client work. Code review was scary at first but helpful.',reply:'Great progress this week. Your footer fix went live for the council site.'}]};
  S.empPlacement = {intern:'Ella Brooks', role:'Front-end Intern', week:4, mentor:'Sam Hughes', start:'2026-10-26', hours:[{wk:1,h:30,ok:true},{wk:2,h:30,ok:true},{wk:3,h:30,ok:true},{wk:4,h:28,ok:false}], checkin:{mood:4,text:'This week I rebuilt the search filters and learned how to write tests. I would like more feedback on my CSS.'}, reply:'', reference:null};
}
seedExtras();
