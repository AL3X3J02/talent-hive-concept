/* =========================================================
   Round 3: presenter page, intern extras, employer and CPCA extras,
   help widget, dark mode
   ========================================================= */
function seedMore(){
  S.rules = {minPay:NLW, approvalDays:2, minOpenDays:7, weeks:6};
  S.prefs = {email:true, sms:false, inapp:true, matches:true, events:true, talent:true, leaderboard:true};
  S.alerts = [{id:'al1', q:'developer', area:'Cambridge', freq:'Daily'}, {id:'al2', q:'data', area:'', freq:'Weekly'}];
  S.team = [{name:'Priya Shah', role:'Studio Manager', perm:'Admin'}, {name:'Sam Hughes', role:'Senior Developer', perm:'Hiring manager'}];
  S.staff = [{name:'Sam Okafor', role:'Programme officer'}, {name:'Ade Mensah', role:'Employer liaison'}, {name:'Ruth Clarke', role:'Programme manager'}];
  S.cpcaNotes = {i1:['24 Nov: Interview booked with Ouse Valley Housing. Check in after 3 Dec.'], e1:['Strong employer. Two interns stayed on in paid roles after summer 2026.']};
  S.practice = null;
  S.empJoin = null;
  S.feed = [
    {t:'09:02', text:'Callum Reid applied for Junior Web Developer Intern'},
    {t:'08:47', text:'Granta Bioscience viewed 3 applications'},
    {t:'08:31', text:'Amira Haddad booked an interview with Brightmark Media'}
  ];
}
seedMore();
const _reset2 = resetState;
resetState = function(){ _reset2(); seedMore(); };
const minPay = () => S.rules.minPay;
const minPayLabel = () => S.rules.minPay === NLW ? 'the National Living Wage' : 'the programme minimum';

/* ---------- What this demo fixes ---------- */
const FIXES = [
  ['Jobs were hidden in a news feed in the sidebar, with no search or filters.', 'A proper jobs board with search, filters, sorting and a map view.', '#/jobs', 'Jobs board'],
  ['There was no apply button. Some roles had no way to apply at all.', 'Apply in a few clicks with a saved CV, short note and screening questions.', '#/intern/jobs/j2', 'Apply flow'],
  ['"My applications" listed badge requests, not job applications.', 'An applications tracker showing every stage, with feedback when a role closes.', '#/intern/applications', 'Tracker'],
  ['Employers had no space of their own and posted roles as news.', 'An employer portal: post roles, see insights, manage applicants in a pipeline.', '#/employer', 'Employer portal'],
  ['Messages had blank subject lines and previews showed a broken image.', 'One inbox with clear subjects, threads and replies.', '#/intern/messages', 'Inbox'],
  ['Opening a page address directly gave a "404 Not found" error.', 'Every page has its own link you can share or bookmark.', '#/jobs/j1', 'Shareable job page'],
  ['Two near-identical spaces, Starter and Connect, confused people.', 'One platform. Roles are filtered by type instead.', '#/jobs', 'One platform'],
  ['CVs were free-form pages, some titled "Untitled".', 'A guided CV builder with a live preview and completeness meter.', '#/intern/cv', 'CV builder'],
  ['Three competing columns and arrows pointing at other parts of the page.', 'One clear next step at the top of every dashboard.', '#/intern', 'Intern dashboard'],
  ['Onboarding asked people to search a news feed; video steps started at 2.', 'A three-step join flow with a postcode check.', '#/join', 'Join flow'],
  ['Listings showed raw code and missing details, with no checks.', 'Required fields and automatic checks before CPCA approves a listing.', '#/cpca/approvals/j15', 'Approval checks'],
  ['A world map for a regional programme.', 'A map of Cambridgeshire and Peterborough showing where roles and placements are.', '#/cpca', 'Region map']
];
function aboutDemoView(){
  return `<main id="main">
    <section class="hero hero-sm" data-hero><div class="frame" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
      <div class="inner" style="grid-template-columns:1fr;padding-bottom:64px"><div><div class="builtfor"><span>Built for</span>${cpcaLogo(50, true)}</div><div class="kicker"><b>+</b> About this demo</div>
        <h1 style="max-width:16ch">12 problems with today's site, and how this fixes them.</h1>
        <p class="lede" style="max-width:60ch">This is a working demo by Alexej Zhukov of a redesigned Talent Hive for Cambridgeshire and Peterborough. Every fix below links to the part of the demo that shows it. All data is invented.</p>
        <div class="ctas"><button class="btn btn-primary btn-lg" data-act="tour">Take the guided tour</button><a class="btn btn-dark btn-lg" href="#/">Start from the home page</a><a class="btn btn-dark btn-lg" href="docs/">Read the documentation</a></div></div></div>
    </section>
    <section class="section">
      <div class="fixgrid">${FIXES.map(([p, f, href, label], i) => `<article class="fix"><div class="fix-n">${String(i + 1).padStart(2, '0')}</div><div class="fix-was"><span class="small muted">Today</span><p>${esc(p)}</p></div><div class="fix-now"><span class="small" style="color:var(--blue);font-weight:600">In the demo</span><p>${esc(f)}</p></div><a class="btn btn-ghost btn-sm" href="${href}">Show me: ${esc(label)}${icon('arrowr')}</a></article>`).join('')}</div>
    </section>
    <section class="section" style="padding-top:0">
      <div class="split"><div><div class="eyebrow">And more</div><h2 class="bigtitle">Things the current site cannot do at all</h2></div><p>Features that make the programme easier to run and more likely to place people.</p></div>
      <div class="grid-3">${[
        ['spark','Daily Career Boost','Short daily games that build workplace skills and bring interns back.','#/intern/boost'],
        ['graduation','Placement tracker','Weekly goals, hours, check-ins and a completion certificate.','#/intern/placement'],
        ['calendar','Interview booking','Employers offer times, interns pick one and add it to their calendar.','#/employer/interviews'],
        ['chart','Listing insights','Employers see views, applications and where applicants came from.','#/employer/listings/j1'],
        ['shield','Programme rules','CPCA sets the rules once and every listing is checked against them.','#/cpca/settings'],
        ['users','Accessibility settings','Text size, easier reading, higher contrast, reduced motion and dark mode.','#/intern/settings']
      ].map(([ic, t, d, h]) => `<a class="panel featurecard" href="${h}"><span class="fc-ic">${icon(ic)}</span><h3>${t}</h3><p class="muted small" style="margin:0">${d}</p></a>`).join('')}</div>
    </section>
  </main>`;
}

/* ---------- Job match breakdown ---------- */
const LEARN = {Git:'Git basics, 2 hours online', Accessibility:'Web accessibility essentials, 3 hours online', 'AI tools':'Using AI tools at work, 90 minutes online', Data:'Data skills for beginners, 4 hours online', Research:'User research basics, 2 hours online', Presenting:'Presenting with confidence, Profile Power Up session', Figma:'Figma for beginners, 3 hours online', CAD:'Intro to CAD, 5 hours online', SolidWorks:'SolidWorks fundamentals, 6 hours online', 'Lab safety':'Lab safety awareness, 1 hour online', 'Health and safety':'Health and safety at work, 1 hour online', Copywriting:'Writing for the web, 2 hours online', 'Content creation':'Short-form video basics, 2 hours online', Bookkeeping:'Bookkeeping basics, 3 hours online'};
const miles = (a, b) => { const [la1, lo1] = TOWNS[a] || [0,0], [la2, lo2] = TOWNS[b] || [0,0]; const R = 3959, r = x => x * Math.PI / 180; const dLa = r(la2 - la1), dLo = r(lo2 - lo1); const h = Math.sin(dLa / 2) ** 2 + Math.cos(r(la1)) * Math.cos(r(la2)) * Math.sin(dLo / 2) ** 2; return Math.round(2 * R * Math.asin(Math.sqrt(h))); };
function matchPanel(j){
  const me = intern(DEMO_PEOPLE.intern); const mine = S.cv.skills.map(s => s.toLowerCase());
  const have = j.skills.filter(s => mine.includes(s.toLowerCase())), gap = j.skills.filter(s => !mine.includes(s.toLowerCase()));
  const dist = miles(me.area, j.area); const sc = matchScore(j);
  return `<section class="panel matchpanel" aria-labelledby="mp-h"><div class="mp-top">${ring(sc / 100, sc + '%').replace('of 6', 'match')}<div><h2 id="mp-h" style="margin:0 0 4px">Why this matches you</h2><p class="small muted" style="margin:0">Based on the skills on your CV, where you live and when you can start.</p></div></div>
    <ul class="checklist">
      <li class="${have.length ? 'ok' : 'bad'}">${icon(have.length ? 'check' : 'alert')}<span><b>${have.length} of ${j.skills.length} skills</b> on your CV${have.length ? `: ${have.map(esc).join(', ')}` : ''}</span></li>
      <li class="ok">${icon('pin')}<span><b>${dist ? `About ${dist} miles` : 'In your town'}</b> from ${esc(me.area)}${dist > 15 ? ', so check travel times before you apply' : ''}</span></li>
      <li class="ok">${icon('clock')}<span><b>${j.hours} hours a week</b> from ${fmt(j.starts)}, which fits your availability (${esc(me.availability.toLowerCase())})</span></li>
    </ul>
    ${gap.length ? `<div class="callout-ins"><b>Skills to build:</b> ${gap.map(s => `<span class="nowrap">${esc(s)}</span>`).join(', ')}<ul class="small" style="margin:6px 0 0;padding-left:1.1em">${gap.map(s => `<li>${esc(LEARN[s] || 'Free short course in the Talent Hive skills library')}</li>`).join('')}</ul></div>` : '<div class="okbox" style="margin-top:12px">' + icon('check') + '<div>You have every skill this role asks for.</div></div>'}
  </section>`;
}

/* ---------- Interview practice ---------- */
function practiceQuestions(j){
  return [
    `Tell me about yourself, and why you want to be a ${j.title.replace(/ Intern$/, '').toLowerCase()} intern.`,
    `This role involves "${j.duties[0].toLowerCase()}". Tell me about a time you did something similar.`,
    `Which of these skills is your strongest: ${j.skills.slice(0, 3).join(', ')}? Give an example.`,
    'Tell me about a time something went wrong. What did you do?',
    `What do you know about ${emp(j.emp).name}, and what would you like to learn here?`,
    'Do you have any questions for us?'
  ];
}
function practiceView(appId){
  const apps = myApps().filter(a => ['interview','shortlisted','applied','viewed'].includes(a.status));
  const a = S.apps.find(x => x.id === appId) || apps.find(x => x.status === 'interview') || apps[0];
  const j = job(a.job);
  if (!S.practice || S.practice.app !== a.id) S.practice = {app:a.id, i:0, notes:{}, t:0, running:false};
  const P = S.practice, qs = practiceQuestions(j), q = qs[P.i];
  const n = P.notes[P.i] || {s:'',t:'',a:'',r:''};
  return `<a class="back" href="#/intern/applications">${icon('left')}Applications</a>
  <div class="pagehead"><div><h1>Interview practice</h1><p>Practise answers for ${esc(j.title)} at ${esc(emp(j.emp).name)}. Aim for about two minutes each.</p></div>
    <div><label for="pr-app" class="small">Practise for</label><select id="pr-app" data-change="prapp">${apps.map(x => `<option value="${x.id}" ${x.id === a.id ? 'selected' : ''}>${esc(job(x.job).title)}</option>`).join('')}</select></div></div>
  <div class="grid-main">
    <section class="panel practice"><div class="pr-top"><span class="small muted">Question ${P.i + 1} of ${qs.length}</span><div class="pr-timer"><span id="pr-time" class="${P.t >= 120 ? 'over' : ''}">${String(Math.floor(P.t / 60)).padStart(1,'0')}:${String(P.t % 60).padStart(2,'0')}</span><button class="btn btn-ghost btn-sm" data-act="prtimer">${P.running ? 'Pause' : P.t ? 'Resume' : 'Start timer'}</button></div></div>
      <div class="meter" style="margin:10px 0 18px"><i style="width:${(P.i + 1) / qs.length * 100}%"></i></div>
      <h2 class="pr-q">${esc(q)}</h2>
      <p class="small muted">Plan your answer with STAR. A few words in each box is enough.</p>
      <div class="star">${[['s','Situation','Where were you, what was going on?'],['t','Task','What did you need to do?'],['a','Action','What did you do, step by step?'],['r','Result','What happened, and what did you learn?']].map(([k, l, h]) => `<div class="field"><label for="st-${k}">${l}<span class="hint">${h}</span></label><textarea id="st-${k}" data-input="star" data-k="${k}" style="min-height:70px">${esc(n[k])}</textarea></div>`).join('')}</div>
      <div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap"><button class="btn btn-ghost" data-act="prprev" ${P.i ? '' : 'disabled'}>Previous</button><button class="btn btn-primary" data-act="prnext">${P.i === qs.length - 1 ? 'Finish practice' : 'Next question'}</button></div>
    </section>
    <aside class="stack"><section class="panel"><h2>Tips for this question</h2><ul class="small" style="padding-left:1.1em;margin:0">${(P.i === 0 ? ['Keep it to your background, one strength and why this role.','End by linking back to the job.'] : P.i === qs.length - 1 ? ['Ask about the team, a typical week or how success is measured.','Avoid asking about pay in a first interview.'] : ['Pick a real example, even from study or volunteering.','Spend most of your time on the Action.','Say what you learned, not just what happened.']).map(t => `<li>${t}</li>`).join('')}</ul></section>
      <section class="panel"><h2>Your interview</h2><p class="small" style="margin:0">${esc(a.interview || 'Not booked yet. Practise now so you are ready.')}</p></section></aside>
  </div>`;
}
let prTick = null;
function stopTimer(){ clearInterval(prTick); prTick = null; if (S.practice) S.practice.running = false; }
ACT.prtimer = el => {
  const P = S.practice;
  if (P.running){ stopTimer(); el.textContent = 'Resume'; return; }
  P.running = true; el.textContent = 'Pause';
  prTick = setInterval(() => { P.t++; const t = $('#pr-time'); if (!t){ stopTimer(); return; } t.textContent = `${Math.floor(P.t / 60)}:${String(P.t % 60).padStart(2,'0')}`; t.classList.toggle('over', P.t >= 120); if (P.t === 120) toast('Two minutes. Start wrapping up your answer.'); }, 1000);
};
INPUT.star = el => { const P = S.practice; P.notes[P.i] = P.notes[P.i] || {s:'',t:'',a:'',r:''}; P.notes[P.i][el.dataset.k] = el.value; };
INPUT.prapp = el => { stopTimer(); S.practice = null; go('#/intern/practice/' + el.value); };
ACT.prnext = () => { const P = S.practice; const qs = practiceQuestions(job(S.apps.find(x => x.id === P.app).job)); stopTimer(); if (P.i === qs.length - 1){ toast('Practice saved. Your notes are kept for the day.'); confetti(); go('#/intern/applications'); return; } P.i++; P.t = 0; render({keepScroll:true}); };
ACT.prprev = () => { stopTimer(); S.practice.i--; S.practice.t = 0; render({keepScroll:true}); };
window.addEventListener('hashchange', stopTimer);

/* ---------- Certificate ---------- */
ACT.cert = () => {
  openModal(`<header><h2>Certificate preview</h2><button class="icon-btn" data-act="close" aria-label="Close">${icon('x')}</button></header>
    <div class="certificate" id="cv-preview"><div class="cert-top"><span class="brand"><span class="mark" aria-hidden="true">th</span><span class="wm"><b>Talent Hive</b><small>Cambridgeshire and Peterborough</small></span></span><span class="small muted">Demo certificate</span></div>
      <p class="small muted" style="margin:28px 0 4px">This certifies that</p><div class="cert-name">${esc(S.cv.name)}</div>
      <p>completed a six-week paid placement as a <b>Front-end Intern</b> at <b>Fenlight Digital</b>, from 26 October to 4 December 2026, logging ${S.myPlacement.hours.reduce((s, x) => s + x.h, 0)} hours.</p>
      <div class="cert-badges"><span class="chip">${icon('graduation')}Experience of Work badge</span><span class="chip">${icon('check')}Employer reference included</span></div>
      <div class="cert-sign"><div><div class="sig">Sam Hughes</div><span class="small muted">Mentor, Fenlight Digital</span></div><div><div class="sig">Ruth Clarke</div><span class="small muted">Programme manager, Talent Hive</span></div></div></div>
    <footer><button class="btn btn-ghost" data-act="close">Close</button><button class="btn btn-primary" data-act="printcv">${icon('download')}Download as PDF</button></footer>`, {label:'Certificate preview'});
  $('#modal-root .modal').style.width = 'min(760px,100%)';
};

/* ---------- Settings (all roles) ---------- */
const sw2 = (k, label, hint, act = 'pref') => `<label class="switch"><input type="checkbox" data-change="${act}" data-k="${k}" ${S.prefs[k] ? 'checked' : ''}><span class="sw" aria-hidden="true"></span><span><b>${label}</b><span class="hint">${hint}</span></span></label>`;
function settingsView(role){
  S.settingsTab = S.settingsTab || {};
  const tabs = role === 'intern' ? [['notify','Notifications'],['alerts','Job alerts'],['privacy','Privacy and data'],['display','Display']] : role === 'employer' ? [['team','Team'],['notify','Notifications'],['display','Display']] : [['rules','Programme rules'],['staff','Staff'],['display','Display']];
  const tab = S.settingsTab[role] || tabs[0][0];
  let body = '';
  if (tab === 'notify') body = `<section class="panel"><h2>How we contact you</h2>${sw2('email','Email','Updates about applications and messages')}${sw2('sms','Text message','Only for interview reminders')}${sw2('inapp','In the app','The bell at the top of every page')}</section>
    <section class="panel"><h2>What we tell you about</h2>${sw2('matches', role === 'employer' ? 'New applicants' : 'New roles that match you', role === 'employer' ? 'A daily summary, never more than once a day' : 'At most once a day')}${sw2('events','Events and sessions','Profile Power Up, employer meet-ups and clinics')}</section>`;
  if (tab === 'alerts') body = `<section class="panel"><h2>Job alerts</h2><p class="small muted">We email you when new roles match a saved search.</p>
    ${S.alerts.map(a => `<div class="listitem"><span class="fc-ic sm">${icon('bell')}</span><div class="grow"><b>${a.q ? `"${esc(a.q)}"` : 'Any role'}${a.area ? ` in ${esc(a.area)}` : ' anywhere'}</b><div class="small muted">${esc(a.freq)} email</div></div><button class="btn btn-quiet btn-sm" data-act="alertdel" data-id="${a.id}">Remove</button></div>`).join('') || '<p class="muted">No alerts yet.</p>'}
    <form data-form="alert" class="alertform"><div class="field"><label for="al-q">Keyword</label><input id="al-q" name="q" type="text" placeholder="For example design"></div><div class="field"><label for="al-a">Area</label><select id="al-a" name="a"><option value="">Anywhere</option>${AREAS.map(x => `<option>${x}</option>`).join('')}</select></div><div class="field"><label for="al-f">How often</label><select id="al-f" name="f"><option>Daily</option><option>Weekly</option></select></div><button class="btn btn-primary">Create alert</button></form></section>`;
  if (tab === 'privacy') body = `<section class="panel"><h2>Who can see you</h2>${sw2('talent','Show me in talent search','Verified employers can find your CV and invite you to apply')}${sw2('leaderboard','Show me on the Boost leaderboard','First name and initial only')}</section>
    <section class="panel"><h2>Your data</h2><p class="small muted">Under UK GDPR you can get a copy of your data or ask us to delete it.</p><div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn btn-ghost" data-act="mydata">${icon('download')}Download my data</button><button class="btn btn-danger" data-act="delacct">Delete my account</button></div></section>`;
  if (tab === 'display') body = `<section class="panel">${displayPanel().replace(/<header>[\s\S]*?<\/header>/, '<h2>Display and accessibility</h2>')}</section>`;
  if (tab === 'team') body = `<section class="panel"><h2>Team members</h2><p class="small muted">Everyone here can see applicants for ${esc(ME_EMP().name)}.</p>${S.team.map(t => `<div class="listitem">${avatar({name:t.name})}<div class="grow"><b>${esc(t.name)}</b><div class="small muted">${esc(t.role)}</div></div><span class="chip">${esc(t.perm)}</span></div>`).join('')}
    <form data-form="invite-team" class="alertform"><div class="field"><label for="tm-n">Name</label><input id="tm-n" name="n" type="text" placeholder="Full name"></div><div class="field"><label for="tm-r">Job title</label><input id="tm-r" name="r" type="text" placeholder="For example Team lead"></div><div class="field"><label for="tm-p">Access</label><select id="tm-p" name="p"><option>Hiring manager</option><option>Admin</option><option>View only</option></select></div><button class="btn btn-primary">Send invite</button></form></section>`;
  if (tab === 'rules') body = `<section class="panel"><h2>Programme rules</h2><p class="small muted">Every new listing is checked against these before it can be approved. Try changing the minimum pay, then open a listing in Approvals.</p>
    <form data-form="rules" class="rulesform"><div class="field"><label for="r-pay">Minimum hourly pay (£)<span class="hint">National Living Wage is £${NLW}</span></label><input id="r-pay" name="pay" type="number" step="0.01" min="${NLW}" value="${S.rules.minPay}"></div>
      <div class="field"><label for="r-open">Minimum days a listing stays open</label><input id="r-open" name="open" type="number" min="1" max="30" value="${S.rules.minOpenDays}"></div>
      <div class="field"><label for="r-days">Approval target (working days)</label><input id="r-days" name="days" type="number" min="1" max="10" value="${S.rules.approvalDays}"></div>
      <div class="field"><label for="r-weeks">Placement length (weeks)</label><input id="r-weeks" name="weeks" type="number" min="4" max="12" value="${S.rules.weeks}"></div>
      <button class="btn btn-primary">Save rules</button></form></section>
    <section class="panel"><h2>Areas covered</h2><div class="chips">${['Cambridge','East Cambridgeshire','Fenland','Huntingdonshire','Peterborough','South Cambridgeshire'].map(x => `<span class="chip">${icon('pin')}${x}</span>`).join('')}</div></section>`;
  if (tab === 'staff') body = `<section class="panel"><h2>CPCA staff</h2>${S.staff.map(t => `<div class="listitem">${avatar({name:t.name})}<div class="grow"><b>${esc(t.name)}</b><div class="small muted">${esc(t.role)}</div></div><span class="chip">${icon('shield')}Signs in with work account</span></div>`).join('')}</section>`;
  return `<div class="pagehead"><div><h1>Settings</h1><p>${role === 'cpca' ? 'Rules and people for the whole programme.' : 'Choose how Talent Hive works for you.'}</p></div></div>
    <div class="tabs" role="tablist">${tabs.map(([k, l]) => `<button role="tab" aria-selected="${tab === k}" data-act="stab" data-t="${k}">${l}</button>`).join('')}</div>
    <div class="stack" style="max-width:760px">${body}</div>`;
}
ACT.stab = el => { S.settingsTab[route().role] = el.dataset.t; render({keepScroll:true, keepFocus:true}); $(`[data-act=stab][data-t="${el.dataset.t}"]`).focus(); };
INPUT.pref = el => { S.prefs[el.dataset.k] = el.checked; if (el.dataset.k === 'talent') intern(DEMO_PEOPLE.intern).talent = el.checked; toast('Saved'); };
FORM.alert = f => { S.alerts.push({id:uid('al'), q:f.q.value.trim(), area:f.a.value, freq:f.f.value}); toast('Job alert created'); render({keepScroll:true}); };
ACT.alertdel = el => { S.alerts = S.alerts.filter(a => a.id !== el.dataset.id); render({keepScroll:true}); toast('Alert removed'); };
ACT.mydata = () => { const data = {profile:S.cv, applications:myApps().map(a => ({role:job(a.job).title, employer:emp(job(a.job).emp).name, status:STATUS_LABEL[a.status], history:a.history})), alerts:S.alerts, preferences:S.prefs, note:'Demo export. All data is invented.'}; const l = document.createElement('a'); l.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], {type:'application/json'})); l.download = 'my-talent-hive-data.json'; document.body.appendChild(l); l.click(); l.remove(); toast('Your data has been downloaded'); };
ACT.delacct = () => openModal(`<form data-form="delacct"><header><h2>Delete your account?</h2><button type="button" class="icon-btn" data-act="close" aria-label="Close">${icon('x')}</button></header>
  <p>This removes your profile, CV and applications. Employers you applied to keep a record that you applied, as the law requires. You cannot undo this.</p>
  <div class="field"><label for="del-c">Type DELETE to confirm</label><input id="del-c" name="c" type="text" autocomplete="off"></div><div class="err" id="del-err" hidden>Type DELETE in capitals to confirm</div>
  <p class="small muted">This is a demo, so nothing is actually deleted.</p>
  <footer><button type="button" class="btn btn-ghost" data-act="close">Keep my account</button><button class="btn btn-danger">Delete account</button></footer></form>`, {label:'Delete your account'});
FORM.delacct = f => { if (f.c.value !== 'DELETE'){ $('#del-err').hidden = false; f.c.focus(); return; } closeModal(); toast('In the full site your account would now be deleted.'); };
FORM['invite-team'] = f => { const n = f.n.value.trim(); if (!n){ f.n.focus(); return; } S.team.push({name:n, role:f.r.value.trim() || 'Team member', perm:f.p.value}); toast(`Invite sent to ${n}`); render({keepScroll:true}); };
FORM.rules = f => { S.rules.minPay = Math.max(NLW, +f.pay.value || NLW); S.rules.minOpenDays = +f.open.value || 7; S.rules.approvalDays = +f.days.value || 2; S.rules.weeks = +f.weeks.value || 6; audit(`Updated programme rules: minimum pay £${S.rules.minPay.toFixed(2)}, open for ${S.rules.minOpenDays} days`); toast('Rules saved. New checks apply straight away.'); render({keepScroll:true}); };

/* ---------- Employer: interview calendar ---------- */
function interviewsView(){
  const wk = S.calWeek || 0;
  const weeks = [['2026-11-23','2026-11-24','2026-11-25','2026-11-26','2026-11-27'],['2026-11-30','2026-12-01','2026-12-02','2026-12-03','2026-12-04']];
  const days = weeks[wk];
  const ev = [];
  S.apps.filter(a => a.status === 'interview' && job(a.job).emp === DEMO_PEOPLE.employer).forEach(a => {
    if (a.when) ev.push({iso:a.when, title:intern(a.intern).name, sub:job(a.job).title, app:a.id, kind:'b'});
    else if (a.slots) a.slots.forEach(s => ev.push({iso:s, title:intern(a.intern).name, sub:'Offered, not picked yet', app:a.id, kind:'o'}));
  });
  if (!ev.some(e => e.app === 'a8')) ev.push({iso:'2026-11-27T14:00', title:'Kieran Walsh', sub:'Junior Web Developer Intern', app:'a8', kind:'b'});
  ev.push({iso:'2026-11-25T11:00', title:'Ben Okoro', sub:'Phone screen', app:'a6', kind:'b'}, {iso:'2026-11-24T15:30', title:'Ella Brooks', sub:'Week 4 check-in', kind:'p'}, {iso:'2026-11-26T10:00', title:'Team catch-up', sub:'Shortlist review', kind:'t'},
    {iso:'2026-12-01T11:00', title:'Team catch-up', sub:'Shortlist review', kind:'t'}, {iso:'2026-12-03T15:30', title:'Ella Brooks', sub:'Week 5 check-in', kind:'p'});
  const H0 = 9, H1 = 17, ph = 52;
  const inWeek = ev.filter(e => days.includes(e.iso.slice(0, 10)));
  const pending = S.apps.filter(a => a.status === 'interview' && a.slots && job(a.job).emp === DEMO_PEOPLE.employer);
  return `<div class="pagehead"><div><h1>Interviews</h1><p>Week of ${fmtLong(days[0]).replace(/ \d{4}$/, '')}. Candidates pick from the times you offer.</p></div>
    <div class="viewtog" role="group" aria-label="Week"><button data-act="calwk" data-w="0" aria-pressed="${wk === 0}">This week</button><button data-act="calwk" data-w="1" aria-pressed="${wk === 1}">Next week</button></div></div>
  <div class="chips" style="margin-bottom:14px"><span class="chip"><i class="lg-dot" style="background:var(--blue)"></i>Booked</span><span class="chip"><i class="lg-dot hatch"></i>Offered, waiting for a pick</span><span class="chip"><i class="lg-dot" style="background:#F7A8EE"></i>Placement check-in</span><span class="chip"><i class="lg-dot" style="background:var(--lime-50)"></i>Team</span></div>
  ${pending.length ? `<div class="infobar">${icon('clock')}<span>${pending.length} ${pending.length === 1 ? 'candidate has' : 'candidates have'} not picked a time yet. Their offered times show as striped blocks${wk === 0 ? ' next week' : ''}.</span></div>` : ''}
  <section class="panel cal"><div class="cal-grid"><div class="cal-times">${Array.from({length:H1 - H0}, (_, i) => `<span style="top:${i * ph}px">${String(H0 + i).padStart(2,'0')}:00</span>`).join('')}</div>
    ${days.map(dd => { const x = d(dd); const list = inWeek.filter(e => e.iso.startsWith(dd)); const today = dd === todayISO(); return `<div class="cal-day ${today ? 'today' : ''}"><div class="cal-h"><span class="small muted">${DAYS_L[x.getDay()].slice(0,3)}</span><b>${x.getDate()}</b></div><div class="cal-body" style="height:${(H1 - H0) * ph}px">${list.map(e => { const t = new Date(e.iso); const top = (t.getHours() + t.getMinutes() / 60 - H0) * ph; return `<button class="cal-ev k-${e.kind}" style="top:${top}px;height:${ph * .85}px" ${e.app ? `data-act="cand" data-id="${e.app}"` : 'data-act="noop"'}><b>${esc(e.title)}</b><span>${String(t.getHours()).padStart(2,'0')}:${String(t.getMinutes()).padStart(2,'0')}. ${esc(e.sub)}</span></button>`; }).join('')}</div></div>`; }).join('')}
  </div></section>`;
}
ACT.calwk = el => { S.calWeek = +el.dataset.w; render({keepScroll:true, keepFocus:true}); $(`[data-act=calwk][data-w="${el.dataset.w}"]`).focus(); };
ACT.noop = () => {};

/* ---------- Employer registration ---------- */
function empJoinView(){
  S.empJoin = S.empJoin || {step:0, org:'', ch:'', sector:'', size:'', name:'', email:'', count:'1', when:'January 2027'};
  const J = S.empJoin; const steps = ['Your organisation','About you','Your placements','Done'];
  const f = (k, l, o = {}) => `<div class="field"><label for="ej-${k}">${l}${o.hint ? `<span class="hint">${o.hint}</span>` : ''}</label>${o.select ? `<select id="ej-${k}" name="${k}">${o.select.map(v => `<option ${J[k] === v ? 'selected' : ''}>${v}</option>`).join('')}</select>` : `<input id="ej-${k}" name="${k}" type="${o.type || 'text'}" value="${esc(J[k])}" ${o.ph ? `placeholder="${o.ph}"` : ''}>`}<div class="err" id="ej-${k}-err" hidden>Fill in this field</div></div>`;
  const body = [
    () => `<form data-form="ej" novalidate><h2>Tell us about your organisation</h2>${f('org','Organisation name')}${f('ch','Companies House or charity number',{hint:'We use this to check you are a registered organisation',ph:'For example 08123456'})}<div class="row">${f('sector','Sector',{select:SECTORS.map(s => s.name)})}${f('size','Size',{select:['1 to 9 staff','10 to 49 staff','50 to 249 staff','250 or more staff']})}</div><button class="btn btn-primary">Continue</button></form>`,
    () => `<form data-form="ej" novalidate><h2>Who should we contact?</h2>${f('name','Your name')}${f('email','Work email',{type:'email'})}<div style="display:flex;justify-content:space-between"><button type="button" class="btn btn-ghost" data-act="ejback">Back</button><button class="btn btn-primary">Continue</button></div></form>`,
    () => `<form data-form="ej" novalidate><h2>Your placements</h2>${f('count','How many interns could you take?',{select:['1','2','3','4 or more']})}${f('when','When could they start?',{select:['January 2027','February 2027','Spring 2027','Not sure yet']})}<label class="check" style="margin-bottom:16px"><input type="checkbox" checked> I agree to pay at least ${minPayLabel()} (£${minPay().toFixed(2)} an hour) and to offer a named mentor</label><div style="display:flex;justify-content:space-between"><button type="button" class="btn btn-ghost" data-act="ejback">Back</button><button class="btn btn-primary">Register</button></div></form>`,
    () => `<div class="done-hero">${icon('check')}</div><h2>Thanks, ${esc(J.name.split(' ')[0] || 'there')}. ${esc(J.org)} is registered.</h2><p>The CPCA team will check your details within ${S.rules.approvalDays} working days. You can start drafting your first role now.</p><a class="btn btn-primary btn-lg" href="#/employer/post">Draft your first role</a><p class="small muted" style="margin-top:10px">In the demo this opens Fenlight Digital's account.</p>`
  ];
  return `<main id="main" class="section" style="max-width:760px"><h1>Register your organisation</h1><ol class="stepper">${steps.map((s, i) => `<li class="${i < J.step ? 'done' : i === J.step ? 'now' : ''}">Step ${i + 1}<br>${s}</li>`).join('')}</ol><div class="panel">${body[J.step]()}</div></main>`;
}
FORM.ej = f => {
  const J = S.empJoin; const need = [['org','ch'],['name','email'],[]][J.step];
  $$('input,select', f).forEach(i => { if (i.name) J[i.name] = i.value.trim(); });
  let first = null; need.forEach(k => { const bad = !J[k]; $('#ej-' + k + '-err').hidden = !bad; if (bad && !first) first = $('#ej-' + k); });
  if (first){ first.focus(); return; }
  if (J.step === 2){ const id = uid('e'); S.employers[id] = {id, name:J.org, sector:(SECTORS.find(s => s.name === J.sector) || {id:'business'}).id, town:'Cambridgeshire', color:'#5A4BF2', initials:J.org.split(' ').map(x => x[0]).join('').slice(0, 2).toUpperCase(), verified:false, size:J.size, contact:J.name, about:'Registered through the employer sign-up in this demo.'}; notify('cpca', `${J.org} registered as a new employer`, '#/cpca/approvals'); confetti(); }
  J.step++; render();
};
ACT.ejback = () => { S.empJoin.step--; render(); };

/* ---------- CPCA: profiles ---------- */
function cpcaInternView(id){
  const i = intern(id); if (!i) return '<h1>Intern not found</h1>';
  const apps = S.apps.filter(a => a.intern === id); const notes = S.cpcaNotes[id] || [];
  const tl = apps.flatMap(a => a.history.map(([s, t]) => ({t, text:`${STATUS_LABEL[s]}: ${job(a.job).title}, ${emp(job(a.job).emp).name}`}))).sort((a, b) => d(b.t) - d(a.t));
  return `<a class="back" href="#/cpca/interns">${icon('left')}Interns</a>
  <section class="company-hero" style="--c:var(--blue)">${avatar(i, 'lg')}<div><h1>${esc(i.name)}</h1><div class="chips"><span class="chip">${icon('pin')}${esc(i.area)}</span><span class="chip">${icon('calendar')}${esc(i.availability)}</span><span class="status st-approved">Eligibility confirmed</span>${i.talent ? '<span class="chip">Visible in talent search</span>' : ''}</div></div></section>
  <div class="grid-main"><div class="stack">
    <section class="panel"><h2>Applications (${apps.length})</h2>${apps.length ? `<div class="table-wrap"><table class="table"><thead><tr><th>Role</th><th>Employer</th><th>Status</th><th>Last update</th></tr></thead><tbody>${apps.map(a => `<tr><td><b>${esc(job(a.job).title)}</b></td><td>${esc(emp(job(a.job).emp).name)}</td><td>${status(a.status)}</td><td>${fmt(a.history.at(-1)[1])}</td></tr>`).join('')}</tbody></table></div>` : '<p class="muted">No applications yet.</p>'}</section>
    <section class="panel"><h2>Activity</h2><ul class="timeline">${tl.map(x => `<li><span class="small muted">${fmt(x.t)}</span> ${esc(x.text)}</li>`).join('') || '<li>Joined the programme</li>'}</ul></section>
  </div><aside class="stack">
    <section class="panel"><h2>About</h2><p class="small">${esc(id === DEMO_PEOPLE.intern ? S.cv.headline : i.headline)}</p><div class="chips">${(id === DEMO_PEOPLE.intern ? S.cv.skills : i.skills).map(s => `<span class="chip">${esc(s)}</span>`).join('')}</div><p class="small muted" style="margin:12px 0 0">${i.badges} verified badges</p></section>
    <section class="panel"><h2>Staff notes</h2>${notes.map(n => `<div class="reply" style="margin:0 0 8px"><p class="small" style="margin:0">${esc(n)}</p></div>`).join('') || '<p class="small muted">No notes yet.</p>'}<form data-form="cnote" data-id="${id}"><label class="sr-only" for="cn">Add a note</label><textarea id="cn" name="n" style="min-height:70px" placeholder="Add a note only CPCA staff can see"></textarea><button class="btn btn-ghost btn-sm" style="margin-top:8px">Add note</button></form></section>
    <section class="panel"><h2>Actions</h2><div style="display:flex;flex-direction:column;gap:8px;align-items:flex-start"><button class="btn btn-ghost btn-sm" data-act="askinfo" data-e="${esc(i.name)}">${icon('mail')}Send a message</button><button class="btn btn-ghost btn-sm" data-act="askinfo" data-e="${esc(i.name)}">${icon('calendar')}Book a check-in call</button></div></section>
  </aside></div>`;
}
function cpcaEmployerView(id){
  const e = emp(id); if (!e) return '<h1>Employer not found</h1>';
  const js = S.jobs.filter(j => j.emp === id); const apps = S.apps.filter(a => js.some(j => j.id === a.job)); const notes = S.cpcaNotes[id] || [];
  return `<a class="back" href="#/cpca/employers">${icon('left')}Employers</a>
  <section class="company-hero" style="--c:${e.color}">${logo(e, 'lg')}<div><h1>${esc(e.name)}</h1><div class="chips"><span class="chip">${icon('briefcase')}${esc(sectorName(e.sector))}</span><span class="chip">${icon('pin')}${esc(e.town)}</span><span class="chip">${icon('users')}${esc(e.size)}</span>${e.verified ? status('approved', 'Verified') : status('pending', 'Waiting for checks')}</div></div>${e.verified ? '' : `<button class="btn btn-primary" style="margin-left:auto" data-act="verify" data-id="${e.id}">Verify employer</button>`}</section>
  <div class="kpis"><div class="kpi"><div class="l">Live roles</div><div class="v">${js.filter(j => j.status === 'live').length}</div></div><div class="kpi"><div class="l">Applicants</div><div class="v">${apps.length}</div></div><div class="kpi"><div class="l">Interviews</div><div class="v">${apps.filter(a => a.status === 'interview').length}</div></div><div class="kpi"><div class="l">Placements</div><div class="v">${apps.filter(a => ['offer','placed'].includes(a.status)).length}</div></div></div>
  <div class="grid-main"><section class="panel"><h2>Listings</h2>${js.length ? `<div class="table-wrap"><table class="table"><thead><tr><th>Role</th><th>Status</th><th class="num">Applicants</th><th>Closes</th></tr></thead><tbody>${js.map(j => `<tr><td><b>${esc(j.title)}</b></td><td>${status(j.status, empStatusLabel(j.status))}</td><td class="num">${appsFor(j.id).length}</td><td>${fmt(j.closes)}</td></tr>`).join('')}</tbody></table></div>` : '<p class="muted">No listings yet.</p>'}</section>
  <aside class="stack"><section class="panel"><h2>Contact</h2><p class="small" style="margin:0">${esc(e.contact)}<br><span class="muted">${esc(e.about)}</span></p></section>
    <section class="panel"><h2>Staff notes</h2>${notes.map(n => `<div class="reply" style="margin:0 0 8px"><p class="small" style="margin:0">${esc(n)}</p></div>`).join('') || '<p class="small muted">No notes yet.</p>'}<form data-form="cnote" data-id="${id}"><label class="sr-only" for="cn">Add a note</label><textarea id="cn" name="n" style="min-height:70px" placeholder="Add a note only CPCA staff can see"></textarea><button class="btn btn-ghost btn-sm" style="margin-top:8px">Add note</button></form></section></aside></div>`;
}
FORM.cnote = f => { const v = f.n.value.trim(); if (!v) return; (S.cpcaNotes[f.dataset.id] = S.cpcaNotes[f.dataset.id] || []).push(`24 Nov: ${v}`); audit('Added a staff note'); toast('Note added'); render({keepScroll:true}); };

/* ---------- CPCA: live feed and cohort timeline ---------- */
const FEED_POOL = ['Maya Patel saved Lab Operations Intern','Nene Build Group viewed 2 applications','Ben Okoro booked a Profile Power Up place','Lucy Tran applied for Data and AI Intern','Riverside Accounts moved Tariq Ahmed to Shortlisted','Hana Kowalski completed her CV','Sofia Marques logged 30 hours for week 1','Callum Reid played today\'s Career Wordle','Isle of Ely Learning Trust replied to a message','Oliver Grant uploaded proof of address'];
let feedTick = null, feedI = 0, feedPaused = false;
function feedPanel(){ return `<section class="panel"><div class="section-head" style="margin-bottom:6px"><h2 style="margin:0;display:flex;align-items:center;gap:8px"><span class="live-dot" aria-hidden="true"></span>Live activity</h2><button class="btn btn-quiet btn-sm" data-act="feedpause">${feedPaused ? 'Resume' : 'Pause'}</button></div><ul class="feed" id="feed" aria-live="off">${S.feed.slice(0, 6).map(x => `<li><span class="small muted">${esc(x.t)}</span><span>${esc(x.text)}</span></li>`).join('')}</ul></section>`; }
ACT.feedpause = el => { feedPaused = !feedPaused; el.textContent = feedPaused ? 'Resume' : 'Pause'; };
AFTER.push(r => {
  clearInterval(feedTick);
  if (!$('#feed') || reducedMotion()) return;
  feedTick = setInterval(() => {
    if (feedPaused || !$('#feed')){ if (!$('#feed')) clearInterval(feedTick); return; }
    const now = new Date(); S.feed.unshift({t:`${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`, text:FEED_POOL[feedI++ % FEED_POOL.length]});
    const ul = $('#feed'); const li = document.createElement('li'); li.className = 'fresh'; li.innerHTML = `<span class="small muted">${S.feed[0].t}</span><span>${esc(S.feed[0].text)}</span>`; ul.prepend(li); while (ul.children.length > 6) ul.lastElementChild.remove();
  }, 6000);
});
function cohortTimeline(){
  const rows = [['Recruitment','2026-10-05','2026-12-18'],['Interviews','2026-11-16','2027-01-08'],['Placements','2027-01-04','2027-02-19'],['Reporting','2027-02-22','2027-03-05']];
  const t0 = d('2026-10-01'), t1 = d('2027-03-15'), span = t1 - t0, pct = x => ((d(x) - t0) / span * 100).toFixed(2);
  const months = ['2026-10-01','2026-11-01','2026-12-01','2027-01-01','2027-02-01','2027-03-01'];
  return `<section class="panel" style="margin-top:16px"><h2>Winter 2026 cohort timeline</h2><div class="gantt">
    <div class="g-months">${months.map(m => `<span style="left:${pct(m)}%">${MONTHS_L[d(m).getMonth()].slice(0,3)}</span>`).join('')}</div>
    ${rows.map(([l, a, b], i) => `<div class="g-row"><span class="g-l">${l}</span><div class="g-track"><i class="g-bar g${i}" style="left:${pct(a)}%;width:${(pct(b) - pct(a)).toFixed(2)}%" title="${fmt(a)} to ${fmt(b)}"></i></div></div>`).join('')}
    <div class="g-today" style="left:calc(130px + (100% - 130px) * ${pct('2026-11-24') / 100})"><span>Today</span></div>
  </div><p class="small muted" style="margin:8px 0 0">Recruitment runs until 18 December. Placements start on 4 January.</p></section>`;
}

/* ---------- Help widget ---------- */
const FAQS = {
  visitor:[['Who can join?','People who live in Cambridgeshire or Peterborough. The CPCA team confirms the full criteria when you join.'],['Are placements paid?','Yes. Every role pays at least the National Living Wage.'],['How long is a placement?','Six weeks, usually between 15 and 37.5 hours a week.']],
  intern:[['How do I know if an employer has seen my application?','Your Applications page shows when it is viewed, shortlisted or moved to interview. You also get a notification.'],['Can I apply for more than one role?','Yes. Apply for as many as suit you.'],['What happens if I am not progressed?','You are told the same day, often with feedback, and we suggest similar roles.'],['How do I earn badges?','Open Skills and badges and follow the steps for each one.']],
  employer:[['How long does approval take?','Usually two working days. You get a notification as soon as your role is live.'],['Can colleagues see applicants?','Yes. Invite them from Settings, then Team.'],['Who pays the intern?','You do, at least the National Living Wage, through your normal payroll.']],
  cpca:[['How do I change the minimum pay?','Go to Settings, then Programme rules. New checks apply straight away.'],['Where is the audit log?','In the menu under Audit log. Every approval and change is recorded.'],['How do I message a whole group?','Use Send a message and choose who should get it.']]
};
function helpWidget(){
  let b = $('#helpbtn');
  if (!b){ b = document.createElement('button'); b.id = 'helpbtn'; b.className = 'helpbtn'; b.setAttribute('data-act', 'help'); b.setAttribute('aria-label', 'Help'); b.innerHTML = icon('quiz') + '<span>Help</span>'; document.body.appendChild(b); }
}
AFTER.push(helpWidget);
ACT.help = () => {
  const role = route().role; const list = FAQS[role] || FAQS.visitor;
  openModal(`<header><h2>Help</h2><button class="icon-btn" data-act="close" aria-label="Close">${icon('x')}</button></header>
    <p class="muted small">Common questions for ${role === 'visitor' ? 'visitors' : role === 'cpca' ? 'the CPCA team' : role + 's'}.</p>
    <div class="faq">${list.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div>
    <h3 style="margin-top:20px">Still stuck?</h3><form data-form="helpmsg"><label for="hm">Message the Talent Hive team</label><textarea id="hm" name="m" style="min-height:80px" placeholder="Tell us what you need help with"></textarea><p class="small muted">We reply within one working day.</p><button class="btn btn-primary">${icon('send')}Send</button></form>`, {drawer:true, label:'Help'});
};
FORM.helpmsg = f => { if (!f.m.value.trim()){ f.m.focus(); return; } closeModal(); toast('Message sent. We will reply within one working day.'); };

/* ---------- Dark mode ---------- */
A11Y.dark = A11Y.dark || false;
const _apply = applyA11y;
applyA11y = function(){ _apply(); document.documentElement.classList.toggle('dark', !!A11Y.dark); };
applyA11y();
