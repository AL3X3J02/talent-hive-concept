/* ---------- Employer area ---------- */
const ME_EMP = () => emp(DEMO_PEOPLE.employer);
const empJobs = () => S.jobs.filter(j => j.emp === DEMO_PEOPLE.employer);
const appsFor = jid => S.apps.filter(a => a.job === jid);
const COLS = [
  {id:'new', label:'New', has:s => s === 'applied' || s === 'viewed'},
  {id:'shortlisted', label:'Shortlisted', has:s => s === 'shortlisted'},
  {id:'interview', label:'Interview', has:s => s === 'interview'},
  {id:'offer', label:'Offer', has:s => s === 'offer' || s === 'placed'},
  {id:'notprogressed', label:'Not progressed', has:s => s === 'notprogressed'}
];
function empNav(){
  const unread = S.threads.filter(t => t.role === 'employer' && t.unread).length;
  const fresh = empJobs().flatMap(j => appsFor(j.id)).filter(a => a.status === 'applied').length;
  return [
    {id:'home',href:'#/employer',icon:'home',label:'Dashboard'},
    {id:'post',href:'#/employer/post',icon:'plus',label:'Post a role'},
    {id:'listings',href:'#/employer/listings',icon:'list',label:'My listings'},
    {id:'pipeline',href:'#/employer/pipeline',icon:'kanban',label:'Applicants',count:fresh},
    {id:'interviews',href:'#/employer/interviews',icon:'calendar',label:'Interviews'},
    {id:'placements',href:'#/employer/placements',icon:'graduation',label:'Placements'},
    {id:'talent',href:'#/employer/talent',icon:'search',label:'Talent search'},
    {id:'messages',href:'#/employer/messages',icon:'mail',label:'Messages',count:unread},
    {id:'profile',href:'#/employer/profile',icon:'building',label:'Company profile'},
    {id:'settings',href:'#/employer/settings',icon:'cog',label:'Settings'}
  ];
}
function renderEmployer(r){
  const v = r.parts[1] || 'home';
  let body;
  if (v === 'home') body = empHome();
  else if (v === 'post') body = postView();
  else if (v === 'listings' && r.parts[2]) body = insightsView(r.parts[2]);
  else if (v === 'listings') body = listingsView();
  else if (v === 'placements') body = empPlacementsView();
  else if (v === 'interviews') body = interviewsView();
  else if (v === 'settings') body = settingsView('employer');
  else if (v === 'pipeline'){ if (r.parts[2]) S.pipelineJob = r.parts[2]; body = pipelineView(); }
  else if (v === 'talent') body = talentView();
  else if (v === 'messages') body = messagesView('employer');
  else if (v === 'profile') body = profileView();
  else body = '<h1>Page not found</h1>';
  const e = ME_EMP();
  return `<a class="skip" href="#main">Skip to content</a>` + shell('employer', v, empNav(), `${avatar({name:DEMO_PEOPLE.employerUser,color:'#B4552E'})}<div><b>${DEMO_PEOPLE.employerUser}</b><span>${esc(e.name)}</span></div>`, body);
}
const empStatusLabel = s => ({live:'Live',pending:'Waiting for approval',draft:'Draft',returned:'Returned for edits',closed:'Closed'}[s]);

function empHome(){
  const jobs = empJobs();
  const live = jobs.filter(j => j.status === 'live');
  const apps = jobs.flatMap(j => appsFor(j.id));
  const fresh = apps.filter(a => a.status === 'applied');
  const interviews = apps.filter(a => a.status === 'interview');
  const draft = jobs.find(j => j.status === 'draft' || j.status === 'returned');
  const top = live.map(j => ({j, n:appsFor(j.id).filter(a => a.status === 'applied').length})).sort((a,b) => b.n - a.n)[0];
  return `<div class="pagehead"><div><h1>Hello, Priya</h1><p>${esc(ME_EMP().name)}. Here is how your roles are doing.</p></div><a class="btn btn-primary" href="#/employer/post">${icon('plus')}Post a role</a></div>
  ${top && top.n ? `<section class="nextstep"><div class="hexdeco hex">${icon('users')}</div><div><h2>${top.n} new ${top.n === 1 ? 'applicant' : 'applicants'} for ${esc(top.j.title)}</h2><p>Applicants hear back faster when you review within five working days.</p></div><a class="btn btn-honey" href="#/employer/pipeline/${top.j.id}">Review applicants</a></section>` : ''}
  <div class="kpis">
    <div class="kpi"><div class="v" data-count="${live.length}">${live.length}</div><div class="l">Live roles</div></div>
    <div class="kpi"><div class="v" data-count="${fresh.length}">${fresh.length}</div><div class="l">New applicants</div></div>
    <div class="kpi"><div class="v" data-count="${interviews.length}">${interviews.length}</div><div class="l">Interviews arranged</div></div>
    <div class="kpi"><div class="v" data-count="${live.reduce((s,j) => s + j.views, 0)}">${live.reduce((s,j) => s + j.views, 0)}</div><div class="l">Listing views</div></div>
  </div>
  <div class="grid-main">
    <section class="panel"><div class="section-head" style="margin-bottom:8px"><h2 style="margin:0">Your listings</h2><a href="#/employer/listings">Manage listings</a></div>${listingsTable(jobs)}</section>
    <div class="stack">
      ${draft ? `<section class="panel draftpanel"><h2>Finish your draft</h2><p class="small">${esc(draft.title)} is saved but not yet submitted for approval.</p><button class="btn btn-primary btn-sm" data-act="editdraft" data-id="${draft.id}">Finish and submit</button></section>` : ''}
      <section class="panel"><h2>Latest applicants</h2>${apps.sort((a,b) => d(b.history[0][1]) - d(a.history[0][1])).slice(0,4).map(a => { const i = intern(a.intern); return `<div class="listitem">${avatar(i)}<div class="grow"><b>${esc(i.name)}</b><div class="small muted">${esc(job(a.job).title)}. Applied ${fmt(a.history[0][1])}</div></div>${status(a.status)}</div>`; }).join('')}
      <a class="btn btn-quiet btn-sm" href="#/employer/pipeline">Open pipeline</a></section>
    </div>
  </div>`;
}
function listingsTable(jobs){
  return `<div class="table-wrap"><table class="table"><thead><tr><th>Role</th><th>Status</th><th class="num">Applicants</th><th class="num">Views</th><th>Closes</th><th><span class="sr-only">Actions</span></th></tr></thead><tbody>
    ${jobs.map(j => { const n = appsFor(j.id).length; return `<tr><td><b>${esc(j.title)}</b>${j.status === 'returned' && S.returned[j.id] ? `<div class="small" style="color:var(--red)">CPCA: ${esc(S.returned[j.id])}</div>` : ''}</td><td>${status(j.status, empStatusLabel(j.status))}</td><td class="num">${n}</td><td class="num">${j.views}</td><td class="nowrap">${j.closes ? fmt(j.closes) : ''}</td>
      <td class="nowrap">${j.status === 'live' ? `<a class="btn btn-ghost btn-sm" href="#/employer/listings/${j.id}">Insights</a> <a class="btn btn-ghost btn-sm" href="#/employer/pipeline/${j.id}">Applicants</a>` : (j.status === 'draft' || j.status === 'returned') ? `<button class="btn btn-ghost btn-sm" data-act="editdraft" data-id="${j.id}">${j.status === 'returned' ? 'Edit and resubmit' : 'Finish draft'}</button>` : j.status === 'pending' ? '<span class="small muted">Usually 2 working days</span>' : ''}</td></tr>`; }).join('')}
  </tbody></table></div>`;
}
function listingsView(){
  const jobs = empJobs();
  return `<div class="pagehead"><div><h1>My listings</h1><p>Every role you have posted, and how many people have applied.</p></div><a class="btn btn-primary" href="#/employer/post">${icon('plus')}Post a role</a></div>
  <section class="panel">${listingsTable(jobs)}</section>
  <p class="small muted" style="margin-top:14px">Live roles close automatically at midnight on their closing date. Applicants are told the outcome either way.</p>`;
}

/* ---------- Post a role ---------- */
const STEPS = ['The role','Details','Duties and skills','Questions and submit'];
function blankDraft(){ return {id:null,title:'',sector:'',programme:'Internship',summary:'',area:'',mode:'On-site',hours:'',pay:'',weeks:6,starts:'',closes:'',duties:'',needs:'',skills:'',q1:'',q2:'',q3:''}; }
function draftFromJob(j){ return {id:j.id,title:j.title,sector:j.sector,programme:j.programme,summary:j.summary,area:j.area,mode:j.mode,hours:j.hours,pay:j.pay,weeks:j.weeks,starts:j.starts,closes:j.closes,duties:j.duties.join('\n'),needs:j.needs.join('\n'),skills:j.skills.join(', '),q1:j.questions[0] || '',q2:j.questions[1] || '',q3:j.questions[2] || ''}; }
ACT.editdraft = el => { S.draft = draftFromJob(job(el.dataset.id)); S.postStep = 0; go('#/employer/post'); };
ACT['post-example'] = () => {
  S.draft = {id:S.draft && S.draft.id, title:'Digital Marketing Intern',sector:'marketing',programme:'Internship',summary:'Help plan and run campaigns that bring new clients to our studio, from email to LinkedIn.',area:'Cambridge',mode:'Hybrid',hours:30,pay:13.20,weeks:6,starts:'2027-01-18',closes:'2026-12-18',
    duties:'Write and schedule posts for LinkedIn and our newsletter\nTrack what works and report back each Friday\nHelp plan a webinar for local charities',needs:'Good written English\nSome experience of social media, personal or for a club\nOrganised and happy to learn',skills:'Copywriting, Social media, Content creation',q1:'Share a link to something you have written or made.',q2:'',q3:''};
  render({keepScroll:true, keepFocus:true}); toast('Example filled in');
};
function draftAsJob(D){
  const lines = s => String(s || '').split('\n').map(x => x.trim()).filter(Boolean);
  return {id:'preview',emp:DEMO_PEOPLE.employer,title:D.title || 'Role title',sector:D.sector || 'digital',area:D.area || 'Area',mode:D.mode,hours:+D.hours || 0,pay:+D.pay || 0,weeks:6,programme:D.programme,posted:todayISO(),closes:D.closes || '2026-12-31',starts:D.starts || '2027-01-11',summary:D.summary,duties:lines(D.duties),needs:lines(D.needs),skills:String(D.skills).split(',').map(x => x.trim()).filter(Boolean),questions:[D.q1,D.q2,D.q3].filter(x => x && x.trim())};
}
function postPreview(){
  const D = S.draft; const j = draftAsJob(D); const e = ME_EMP();
  return `<p class="preview-label">How interns will see it</p><div class="preview-frame">
    <div style="display:flex;gap:12px;align-items:flex-start;margin-bottom:12px">${logo(e)}<div><b style="font-family:var(--display);font-size:1.15rem">${esc(j.title)}</b><div class="small muted">${esc(e.name)}, ${esc(j.area)}</div></div></div>
    <div class="chips" style="margin-bottom:10px"><span class="chip">${icon('pin')}${esc(j.area)}, ${esc(j.mode.toLowerCase())}</span><span class="chip">${icon('pound')}${j.pay ? money(j.pay) + ' an hour' : 'Pay'}</span><span class="chip">${icon('clock')}${j.hours || '?'} hours a week, 6 weeks</span></div>
    ${j.summary ? `<p class="small">${esc(j.summary)}</p>` : '<p class="small muted">Your summary appears here.</p>'}
    ${j.duties.length ? `<b class="small">What you will do</b><ul class="small" style="margin-top:4px">${j.duties.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
    ${j.skills.length ? `<div class="chips">${j.skills.map(s => `<span class="chip">${esc(s)}</span>`).join('')}</div>` : ''}
    <p class="small muted" style="margin:10px 0 0">${D.closes ? 'Closes ' + fmtLong(D.closes) : 'Closing date'}</p>
  </div>`;
}
function postView(){
  if (!S.draft) S.draft = blankDraft();
  const D = S.draft, st = S.postStep;
  const inp = (k, label, opts = {}) => `<div class="field"><label for="d-${k}">${label}${opts.hint ? `<span class="hint">${opts.hint}</span>` : ''}</label>
    ${opts.area ? `<textarea id="d-${k}" data-input="draft" data-k="${k}" aria-describedby="d-${k}-err">${esc(D[k])}</textarea>` :
      opts.select ? `<select id="d-${k}" data-change="draft" data-k="${k}" aria-describedby="d-${k}-err"><option value="">Choose</option>${opts.select.map(([v,l]) => `<option value="${v}" ${String(D[k]) === v ? 'selected' : ''}>${l}</option>`).join('')}</select>` :
      `<input id="d-${k}" type="${opts.type || 'text'}" ${opts.step ? `step="${opts.step}"` : ''} data-input="draft" data-k="${k}" value="${esc(D[k])}" aria-describedby="d-${k}-err" ${opts.ph ? `placeholder="${opts.ph}"` : ''}>`}
    <div class="err" id="d-${k}-err" hidden></div></div>`;
  const steps = [
    () => inp('title','Job title',{hint:'Keep it plain, for example "Marketing Intern"'}) + `<div class="row">${inp('sector','Sector',{select:SECTORS.map(s => [s.id,s.name])})}${inp('programme','Type',{select:PROGRAMMES.map(p => [p,p])})}</div>` + inp('summary','Summary',{area:true,hint:'One or two sentences. This shows in search results.'}),
    () => `<div class="row">${inp('area','Area',{select:AREAS.map(a => [a,a])})}${inp('mode','Where they will work',{select:[['On-site','On-site'],['Hybrid','Hybrid'],['Remote','Remote']]})}</div>
      <div class="row">${inp('hours','Hours a week',{type:'number',hint:'Between 15 and 37.5'})}${inp('pay','Pay per hour (£)',{type:'number',step:'0.01',hint:`At least £${minPay().toFixed(2)}, ${minPayLabel()}`})}</div>
      <div class="row">${inp('starts','Start date',{type:'date'})}${inp('closes','Closing date',{type:'date'})}</div>`,
    () => inp('duties','What they will do',{area:true,hint:'One task per line'}) + inp('needs','What they need',{area:true,hint:'One requirement per line. Only include what is essential.'}) + inp('skills','Skills they will use',{hint:'Separate with commas. We use these to match candidates.'}),
    () => `<p class="muted">Ask up to three short questions. Applicants answer them when they apply. Optional.</p>${inp('q1','Question 1')}${inp('q2','Question 2')}${inp('q3','Question 3')}
      <div class="panel" style="background:var(--surface);margin-top:8px"><h3 style="font-size:1rem">Before you submit</h3><ul class="checklist small">
      ${[[`Pay is at least ${minPayLabel()}`, +D.pay >= minPay()],['Hours, location and dates are filled in', D.hours && D.area && D.starts && D.closes],['At least one duty and one requirement', D.duties.trim() && D.needs.trim()]].map(([t,ok]) => `<li class="${ok ? 'ok' : 'bad'}">${icon(ok ? 'check' : 'alert')}<span>${t}${ok ? '' : ' <b>(check this)</b>'}</span></li>`).join('')}</ul></div>`
  ];
  return `<div class="pagehead"><div><h1>${D.id ? 'Edit role' : 'Post a role'}</h1><p>About ten minutes. The CPCA team checks every listing before it goes live.</p></div><button class="btn btn-quiet" data-act="post-example">Fill with an example</button></div>
  <ol class="stepper">${STEPS.map((s,i) => `<li class="${i < st ? 'done' : i === st ? 'now' : ''}" ${i === st ? 'aria-current="step"' : ''}>Step ${i + 1}<br>${s}</li>`).join('')}</ol>
  <div class="grid-main">
    <form class="panel" data-form="post" novalidate><h2>${STEPS[st]}</h2>${steps[st]()}
      <div style="display:flex;gap:10px;justify-content:space-between;margin-top:8px;flex-wrap:wrap">
        ${st ? `<button type="button" class="btn btn-ghost" data-act="post-back">Back</button>` : `<button type="button" class="btn btn-ghost" data-act="post-save">Save as draft</button>`}
        <button class="btn btn-primary">${st === 3 ? 'Submit for approval' : 'Continue'}</button>
      </div></form>
    <aside id="post-preview">${postPreview()}</aside>
  </div>`;
}
INPUT.draft = el => { S.draft[el.dataset.k] = el.value; const p = $('#post-preview'); if (p) p.innerHTML = postPreview(); };
ACT['post-back'] = () => { S.postStep--; render(); };
ACT['post-save'] = () => { saveDraft('draft'); toast('Draft saved'); go('#/employer/listings'); };
function saveDraft(statusVal){
  const D = S.draft; const j = draftAsJob(D);
  const existing = D.id ? job(D.id) : null;
  const rec = {...j, id:existing ? existing.id : uid('j'), status:statusVal, views:existing ? existing.views : 0, posted:'', submitted:todayISO()};
  if (existing) Object.assign(existing, rec); else S.jobs.push(rec);
  delete S.returned[rec.id];
  S.draft = null; S.postStep = 0;
  return rec;
}
FORM.post = f => {
  const D = S.draft; const st = S.postStep;
  const need = [['title','sector','summary'],['area','mode','hours','pay','starts','closes'],['duties','needs','skills'],[]][st];
  let first = null;
  const fail = (k, msg) => { const e = $('#d-' + k + '-err'); if (e){ e.textContent = msg; e.hidden = false; } const i = $('#d-' + k); if (i){ i.setAttribute('aria-invalid','true'); first = first || i; } };
  $$('.err', f).forEach(e => e.hidden = true); $$('[aria-invalid]', f).forEach(e => e.removeAttribute('aria-invalid'));
  need.forEach(k => { if (!String(D[k]).trim()) fail(k, 'Fill in this field'); });
  if (st === 1){
    if (D.pay && +D.pay < minPay()) fail('pay', `Pay must be at least £${minPay().toFixed(2)} an hour, ${minPayLabel()}`);
    if (D.hours && (+D.hours < 15 || +D.hours > 37.5)) fail('hours', 'Enter between 15 and 37.5 hours');
    if (D.closes && d(D.closes) <= TODAY) fail('closes', 'The closing date must be in the future');
    if (D.starts && D.closes && d(D.starts) <= d(D.closes)) fail('starts', 'The start date must be after the closing date');
  }
  if (first){ first.focus(); return; }
  if (st < 3){ S.postStep++; render(); return; }
  const rec = saveDraft('pending');
  notify('cpca', `${ME_EMP().name} submitted ${rec.title} for approval`, '#/cpca/approvals/' + rec.id);
  toast('Submitted for approval. We will review it within two working days.');
  go('#/employer/listings');
};

/* ---------- Pipeline ---------- */
function candCard(a){
  const i = intern(a.intern), j = job(a.job);
  const fit = j.skills.filter(s => i.skills.map(x => x.toLowerCase()).includes(s.toLowerCase())).length;
  return `<article class="cand" draggable="true" data-app="${a.id}">
    <div class="nm">${avatar(i)}<div><b>${esc(i.name)}</b><div class="small muted">${esc(i.area)}</div></div></div>
    <div class="small">Matches ${fit} of ${j.skills.length} skills</div><div class="small muted">Applied ${fmt(a.history[0][1])}</div>
    ${S.ratings[a.id] ? `<div class="minirate">${stars(S.ratings[a.id])}</div>` : ''}
    ${a.status === 'interview' ? `<div class="small" style="margin-top:4px">${a.slots ? 'Waiting for them to pick a time' : esc((a.interview || '').split('.')[0])}</div>` : ''}
    ${a.status === 'applied' ? '<span class="tag-new" style="display:inline-block;margin-top:6px">Not yet viewed</span>' : ''}
    <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-top:6px"><button class="open" data-act="cand" data-id="${a.id}">View application<span class="sr-only"> from ${esc(i.name)}</span></button></div>
    <label class="cmpbox small"><input type="checkbox" data-change="ccmp" data-id="${a.id}" ${S.candCompare.has(a.id) ? 'checked' : ''}> Compare</label>
    <label class="sr-only" for="mv-${a.id}">Move ${esc(i.name)} to</label>
    <select id="mv-${a.id}" data-change="move" data-id="${a.id}"><option value="">Move to</option>${COLS.filter(c => !c.has(a.status)).map(c => `<option value="${c.id}">${c.label}</option>`).join('')}</select>
  </article>`;
}
function pipelineView(){
  const jobs = empJobs().filter(j => j.status === 'live');
  const j = job(S.pipelineJob) && job(S.pipelineJob).emp === DEMO_PEOPLE.employer ? job(S.pipelineJob) : jobs[0];
  const apps = appsFor(j.id);
  return `<div class="pagehead"><div><h1>Applicants</h1><p>Drag a card, or use its menu, to move someone to the next stage. They are told automatically.</p></div>
    <div><label for="pj" class="small">Role</label><select id="pj" data-change="pjob" style="min-width:260px">${jobs.map(x => `<option value="${x.id}" ${x.id === j.id ? 'selected' : ''}>${esc(x.title)} (${appsFor(x.id).length})</option>`).join('')}</select></div></div>
  <div class="kanban">${COLS.map(c => { const list = apps.filter(a => c.has(a.status)); return `<section class="col" data-col="${c.id}" aria-label="${c.label}, ${list.length}"><h3><span>${c.label}</span><span class="muted">${list.length}</span></h3>${list.map(candCard).join('') || '<p class="small muted">Drop applicants here</p>'}</section>`; }).join('')}</div>`;
}
INPUT.pjob = el => go('#/employer/pipeline/' + el.value);
function moveApp(id, col, slotsDone){
  const a = S.apps.find(x => x.id === id); if (!a) return;
  const map = {new:'viewed', shortlisted:'shortlisted', interview:'interview', offer:'offer', notprogressed:'notprogressed'};
  const s = map[col]; if (!s || a.status === s) return;
  if (s === 'interview' && !slotsDone){ offerSlots(id); return; }
  if (a.intern === DEMO_PEOPLE.intern){ const j = job(a.job); notify('intern', s === 'interview' ? `${emp(j.emp).name} invited you to interview for ${j.title}. Pick a time.` : s === 'offer' ? `${emp(j.emp).name} offered you the ${j.title} placement` : `Your application for ${j.title} is now: ${STATUS_LABEL[s]}`, '#/intern/applications'); }
  a.status = s; a.history.push([s, todayISO()]);
  if (s === 'interview' && !a.interview && !a.slots) a.interview = 'Date to be confirmed by the employer';
  if (s === 'notprogressed' && !a.feedback) a.feedback = 'Thank you for applying. We had a very strong field for this role.';
  toast(`${intern(a.intern).name} moved to ${COLS.find(c => c.id === col).label}. We have let them know.`);
  render({keepScroll:true, keepFocus:true});
}
INPUT.move = el => { const v = el.value; el.value = ''; moveApp(el.dataset.id, v); };
AFTER.push(r => {
  if (r.role !== 'employer' || r.parts[1] !== 'pipeline') return;
  $$('.cand').forEach(c => c.addEventListener('dragstart', e => { e.dataTransfer.setData('text/plain', c.dataset.app); c.style.opacity = '.5'; }));
  $$('.cand').forEach(c => c.addEventListener('dragend', () => { c.style.opacity = ''; }));
  $$('.col').forEach(col => {
    col.addEventListener('dragover', e => { e.preventDefault(); col.classList.add('over'); });
    col.addEventListener('dragleave', () => col.classList.remove('over'));
    col.addEventListener('drop', e => { e.preventDefault(); col.classList.remove('over'); moveApp(e.dataTransfer.getData('text/plain'), col.dataset.col); });
  });
});
ACT.cand = el => {
  const a = S.apps.find(x => x.id === el.dataset.id); const i = intern(a.intern), j = job(a.job);
  if (a.status === 'applied'){ a.status = 'viewed'; a.history.push(['viewed', todayISO()]); render({keepScroll:true, keepFocus:true}); const b = $(`[data-act=cand][data-id="${a.id}"]`); if (b) b.focus(); }
  const isJordan = a.intern === DEMO_PEOPLE.intern;
  openModal(`<header><div style="display:flex;gap:14px;align-items:center">${avatar(i, 'lg')}<div><h2>${esc(i.name)}</h2><div class="muted">${esc(i.area)}. ${esc(avail(i.availability))}</div></div></div><button class="icon-btn" data-act="close" aria-label="Close">${icon('x')}</button></header>
    <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:12px"><span>${status(a.status)} for <b>${esc(j.title)}</b></span>${rateWidget(a)}</div>
    <p style="font-size:1.05rem">${esc(isJordan ? S.cv.headline : i.headline)}</p>
    <h3>Skills</h3><div class="chips">${(isJordan ? S.cv.skills : i.skills).map(s => `<span class="chip" ${j.skills.map(x => x.toLowerCase()).includes(s.toLowerCase()) ? 'style="background:var(--mint-50);color:var(--mint-ink);font-weight:700"' : ''}>${esc(s)}</span>`).join('')}</div>
    <p class="small muted" style="margin-top:6px">Skills in green match this role.</p>
    ${isJordan ? `<h3>Experience</h3>${S.cv.exp.map(x => `<p class="small"><b>${esc(x.role)}</b>, ${esc(x.org)} (${esc(x.dates)})<br>${esc(x.desc)}</p>`).join('')}` : ''}
    <h3>Why they want this role</h3><p>${a.note ? esc(a.note) : '<span class="muted">No note added.</span>'}</p>
    ${j.questions.length ? `<h3>Answers to your questions</h3>${j.questions.map((q,k) => `<p class="small"><b>${esc(q)}</b><br>${esc((a.answers || [])[k] || 'No answer')}</p>`).join('')}` : ''}
    <h3>Badges</h3><p class="small">${i.badges} verified badges, including Digital CV Creator.</p>
    <div class="field" style="margin-top:16px"><label for="enotes">Private notes<span class="hint">Only your team can see these</span></label><textarea id="enotes" data-input="enotes" data-id="${a.id}">${esc(a.empNotes || '')}</textarea></div>
    <footer style="justify-content:space-between"><button class="btn btn-danger" data-act="dmove" data-id="${a.id}" data-col="notprogressed">Not progressing</button>
      <span style="display:flex;gap:8px;flex-wrap:wrap">${a.status === 'viewed' || a.status === 'applied' ? `<button class="btn btn-primary" data-act="dmove" data-id="${a.id}" data-col="shortlisted">Shortlist</button>` : a.status === 'shortlisted' ? `<button class="btn btn-primary" data-act="dmove" data-id="${a.id}" data-col="interview">Invite to interview</button>` : a.status === 'interview' ? `<button class="btn btn-primary" data-act="dmove" data-id="${a.id}" data-col="offer">Make an offer</button>` : ''}</span></footer>`, {drawer:true, label:'Application from ' + i.name});
};
INPUT.enotes = el => { S.apps.find(x => x.id === el.dataset.id).empNotes = el.value; };
ACT.dmove = el => { closeModal(); moveApp(el.dataset.id, el.dataset.col); };

/* ---------- Talent search ---------- */
function talentView(){
  const q = S.talentQ.toLowerCase();
  const list = Object.values(S.interns).filter(i => i.talent && (!q || (i.name + ' ' + i.headline + ' ' + i.skills.join(' ') + ' ' + i.area).toLowerCase().includes(q)));
  return `<div class="pagehead"><div><h1>Talent search</h1><p>Interns who have chosen to be found by employers. Invite them to apply for a live role.</p></div></div>
  <form class="boardsearch" data-form="talent" role="search"><label class="sr-only" for="tq">Search by skill, area or name</label><input id="tq" name="q" type="search" value="${esc(S.talentQ)}" placeholder="Search by skill, area or name, for example JavaScript"><button class="btn btn-primary">Search</button></form>
  <div class="chips" style="margin-bottom:16px">${['JavaScript','Python','Content creation','CAD','Excel','Accessibility'].map(s => `<button class="chip" style="border:0;cursor:pointer" data-act="tskill" data-s="${s}">${s}</button>`).join('')}</div>
  <p class="muted" role="status">${list.length} ${list.length === 1 ? 'person' : 'people'} found</p>
  <div class="grid-2">${list.map(i => `<article class="panel" style="margin:0"><div style="display:flex;gap:12px;align-items:center;margin-bottom:10px">${avatar(i)}<div><h3 style="margin:0">${esc(i.name)}</h3><div class="small muted">${esc(i.area)}. ${esc(avail(i.availability))}</div></div></div>
    <p class="small">${esc(i.headline)}</p><div class="chips" style="margin-bottom:14px">${i.skills.map(s => `<span class="chip">${esc(s)}</span>`).join('')}</div>
    <button class="btn btn-ghost btn-sm" data-act="invite" data-id="${i.id}">Invite to apply</button></article>`).join('')}</div>`;
}
FORM.talent = f => { S.talentQ = f.q.value.trim(); render({keepFocus:true}); };
ACT.tskill = el => { S.talentQ = el.dataset.s; render({keepScroll:true, keepFocus:true}); };
ACT.invite = el => {
  const i = intern(el.dataset.id);
  openModal(`<form data-form="invite" data-id="${i.id}"><header><h2>Invite ${esc(i.name)} to apply</h2><button type="button" class="icon-btn" data-act="close" aria-label="Close">${icon('x')}</button></header>
    <div class="field"><label for="inv-job">Role</label><select id="inv-job" name="job">${empJobs().filter(j => j.status === 'live').map(j => `<option value="${j.id}">${esc(j.title)}</option>`).join('')}</select></div>
    <div class="field"><label for="inv-msg">Message</label><textarea id="inv-msg" name="msg">Hi ${esc(i.name.split(' ')[0])}, we think you would be a great fit for this role and would love to see your application.</textarea></div>
    <footer><button type="button" class="btn btn-ghost" data-act="close">Cancel</button><button class="btn btn-primary">${icon('send')}Send invitation</button></footer></form>`, {label:'Invite to apply'});
};
FORM.invite = f => { const i = intern(f.dataset.id); closeModal(); toast(`Invitation sent to ${i.name}`); };

/* ---------- Company profile ---------- */
function profileView(){
  const e = ME_EMP();
  return `<div class="pagehead"><div><h1>Company profile</h1><p>Shown on every role you post.</p></div></div>
  <div class="grid-main">
    <form class="panel" data-form="profile"><h2>Details</h2>
      <div class="field"><label for="p-name">Organisation name</label><input id="p-name" name="name" type="text" value="${esc(e.name)}"></div>
      <div class="field"><label for="p-about">What you do<span class="hint">Two sentences in plain English</span></label><textarea id="p-about" name="about">${esc(e.about)}</textarea></div>
      <div class="row"><div class="field"><label for="p-town">Main location</label><input id="p-town" name="town" type="text" value="${esc(e.town)}"></div><div class="field"><label for="p-size">Size</label><input id="p-size" name="size" type="text" value="${esc(e.size)}"></div></div>
      <button class="btn btn-primary">Save changes</button></form>
    <aside class="panel"><div style="display:flex;gap:14px;align-items:center;margin-bottom:12px">${logo(e,'lg')}<div><h2 style="margin:0">${esc(e.name)}</h2><span class="chip" style="margin-top:6px">${icon('shield')}Checked by CPCA</span></div></div><p>${esc(e.about)}</p><p class="small muted">${esc(e.size)}, ${esc(e.town)}</p>
      <h3 style="font-size:1rem">Placements through Talent Hive</h3><p class="small" style="margin:0">3 interns placed since 2025. 2 stayed on in paid roles.</p></aside>
  </div>`;
}
FORM.profile = f => { const e = ME_EMP(); e.name = f.name.value; e.about = f.about.value; e.town = f.town.value; e.size = f.size.value; toast('Profile saved'); render({keepScroll:true}); };
