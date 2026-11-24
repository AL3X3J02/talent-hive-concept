/* ---------- Intern area ---------- */
const myApps = () => S.apps.filter(a => a.intern === DEMO_PEOPLE.intern);
function internNav(){
  const unread = S.threads.filter(t => t.role === 'intern' && t.unread).length;
  const gamesLeft = Object.values(S.boost.played).filter(x => !x).length;
  return [
    {id:'home',href:'#/intern',icon:'home',label:'Dashboard'},
    {id:'jobs',href:'#/intern/jobs',icon:'briefcase',label:'Jobs'},
    {id:'applications',href:'#/intern/applications',icon:'apps',label:'Applications'},
    {id:'placement',href:'#/intern/placement',icon:'graduation',label:'My placement'},
    {id:'cv',href:'#/intern/cv',icon:'file',label:'My CV'},
    {id:'badges',href:'#/intern/badges',icon:'hex',label:'Skills and badges'},
    {id:'boost',href:'#/intern/boost',icon:'spark',label:'Daily Career Boost',count:gamesLeft},
    {id:'messages',href:'#/intern/messages',icon:'mail',label:'Messages',count:unread},
    {id:'events',href:'#/intern/events',icon:'calendar',label:'Events'}
  ];
}
function renderIntern(r){
  const p = r.parts; const v = p[1] || 'home';
  const me = intern(DEMO_PEOPLE.intern);
  let body;
  if (v === 'home') body = internHome();
  else if (v === 'jobs' && p[2] === 'saved') body = savedJobs();
  else if (v === 'jobs' && p[2]) body = jobDetail(job(p[2]), '#/intern/jobs');
  else if (v === 'jobs') body = jobsBoard('#/intern/jobs');
  else if (v === 'applications') body = internApps();
  else if (v === 'placement') body = placementView();
  else if (v === 'company') body = companyView(p[2], '#/intern/jobs');
  else if (v === 'cv') body = cvBuilder();
  else if (v === 'badges') body = badgesView();
  else if (v === 'boost') body = boostView(p[2]);
  else if (v === 'messages') body = messagesView('intern');
  else if (v === 'events') body = `<div class="pagehead"><div><h1>Events</h1><p>Book free sessions and employer meet-ups.</p></div></div><div class="panel">${S.events.map(eventItem).join('')}</div>`;
  else body = `<h1>Page not found</h1>`;
  return `<a class="skip" href="#main">Skip to content</a>` + shell('intern', v, internNav(), `${avatar(me)}<div><b>${esc(me.name)}</b><span>Intern, ${esc(me.area)}</span></div>`, body);
}

function cvChecks(){
  const c = S.cv;
  return [
    {ok:!!(c.headline && c.headline.length > 10), tip:'Add a headline'},
    {ok:c.about.length >= 80, tip:'Write at least two sentences about yourself'},
    {ok:c.exp.length >= 1, tip:'Add some experience, paid or unpaid'},
    {ok:c.edu.length >= 1, tip:'Add your education'},
    {ok:c.skills.length >= 5, tip:'Add at least five skills'},
    {ok:!!(c.link && c.link.trim()), tip:'Add a link to a project or portfolio'}
  ];
}
const cvPct = () => { const c = cvChecks(); return Math.round(100 * c.filter(x => x.ok).length / c.length); };

function trackHTML(a){
  if (a.status === 'notprogressed') return '';
  const steps = ['applied','viewed','shortlisted','interview','offer'];
  const at = a.status === 'placed' ? 5 : steps.indexOf(a.status);
  return `<ol class="track" aria-label="Progress: ${STATUS_LABEL[a.status]}">${steps.map((s,i) => `<li class="${i < at ? 'done' : i === at ? 'now' : ''}">${STATUS_LABEL[s]}</li>`).join('')}</ol>`;
}

function internHome(){
  const apps = myApps();
  const interview = apps.find(a => a.status === 'interview');
  const offer = apps.find(a => a.status === 'offer');
  const active = apps.filter(a => !['notprogressed'].includes(a.status));
  const applied = new Set(apps.map(a => a.job));
  const recs = liveJobs().filter(j => !applied.has(j.id)).sort((a,b) => matchScore(b) - matchScore(a)).slice(0,3);
  const played = Object.values(S.boost.played).filter(Boolean).length;
  const pct = cvPct();
  const next = offer ? {t:`You have an offer from ${emp(job(offer.job).emp).name}`, s:`${job(offer.job).title}. Reply by ${fmt('2026-11-27')} to accept or decline.`, b:'<a class="btn btn-honey" href="#/intern/applications">Review offer</a>'}
    : interview ? {t:`Interview with ${emp(job(interview.job).emp).name}`, s:interview.slots ? 'They have offered three times. Pick the one that suits you.' : `${interview.interview}`, b:`<button class="btn btn-honey" data-act="prep" data-id="${interview.id}">Prepare for it</button>`}
    : {t:'Find your next role', s:'New roles are added every week.', b:'<a class="btn btn-honey" href="#/intern/jobs">Browse jobs</a>'};
  return `<div class="pagehead"><div><h1>Good morning, Jordan</h1><p>Tuesday 24 November. Here is what needs your attention.</p></div></div>
  <section class="nextstep" aria-label="Next step"><div class="hexdeco hex">${icon('calendar')}</div><div><h2>${esc(next.t)}</h2><p>${esc(next.s)}</p></div>${next.b}</section>
  <div class="grid-main">
    <div class="stack">
      <section class="panel" aria-labelledby="apps-h">
        <div class="section-head" style="margin-bottom:6px"><h2 id="apps-h" style="margin:0">Your applications</h2><a href="#/intern/applications">See all ${apps.length}</a></div>
        ${active.map(a => { const j = job(a.job), e = emp(j.emp); return `<div class="listitem" style="align-items:flex-start">${logo(e)}<div class="grow"><b>${esc(j.title)}</b><div class="small muted">${esc(e.name)}. Updated ${fmt(a.history.at(-1)[1])}</div>${trackHTML(a)}</div>${status(a.status)}</div>`; }).join('')}
      </section>
      <section class="panel" aria-labelledby="rec-h">
        <div class="section-head" style="margin-bottom:12px"><div><h2 id="rec-h" style="margin:0">Recommended for you</h2><p class="small">Based on the skills on your CV and the areas you chose.</p></div><a href="#/intern/jobs">All jobs</a></div>
        <div class="joblist">${recs.map(j => jobRow(j, {base:'#/intern/jobs', showMatch:true})).join('')}</div>
      </section>
    </div>
    <div class="stack">
      <section class="panel" aria-labelledby="boost-h" style="background:var(--honey-50);border-color:#F6D9A8">
        <h2 id="boost-h">Daily Career Boost</h2>
        <div class="boosthead" style="margin-bottom:12px"><div class="streak" style="background:#fff"><span class="hex">${S.boost.streak}</span><div><b>day streak</b><div class="small muted">${S.boost.points} points</div></div></div></div>
        <p class="small" style="margin-bottom:12px">${played === 3 ? 'All three games done today. Come back tomorrow to keep your streak.' : `${3 - played} of 3 games left today. Each takes about two minutes.`}</p>
        <a class="btn btn-primary" href="#/intern/boost">${played === 3 ? 'See your progress' : 'Play today\'s games'}</a>
      </section>
      <section class="panel" aria-labelledby="cv-h">
        <h2 id="cv-h">Your CV is ${pct}% complete</h2>
        <div class="meter"><i style="width:${pct}%"></i></div>
        ${pct < 100 ? `<p class="small" style="margin:12px 0">${esc(cvChecks().find(c => !c.ok).tip)} to reach 100%.</p>` : '<p class="small" style="margin:12px 0">Your CV has everything employers look for.</p>'}
        <a class="btn btn-ghost btn-sm" href="#/intern/cv">Edit CV</a>
      </section>
      <section class="panel" aria-labelledby="ev-h2">
        <h2 id="ev-h2">Your events</h2>
        ${S.events.filter(e => S.booked.has(e.id)).map(eventItem).join('') || '<p class="muted small">No events booked yet.</p>'}
        <a class="btn btn-quiet btn-sm" href="#/intern/events">Find more events</a>
      </section>
    </div>
  </div>`;
}
ACT.prep = el => {
  const a = S.apps.find(x => x.id === el.dataset.id); const j = job(a.job), e = emp(j.emp);
  openModal(`<header><h2>Prepare for your interview</h2><button class="icon-btn" data-act="close" aria-label="Close">${icon('x')}</button></header>
    <p><b>${esc(j.title)}</b> at ${esc(e.name)}<br>${esc(a.interview)}</p>
    <h3>Before the day</h3>
    <ul><li>Re-read the <a href="#/intern/jobs/${j.id}">job description</a> and pick three examples that match it.</li><li>Practise answering with the STAR method. The Workplace Quiz covers it.</li><li>Plan your journey and aim to arrive ten minutes early.</li></ul>
    <h3>Bring with you</h3><ul><li>An example of a spreadsheet you have built, as the employer asked.</li><li>Two questions to ask them about the team.</li></ul>
    <footer><a class="btn btn-ghost" href="#/intern/boost/quiz">Practise with the quiz</a><a class="btn btn-primary" href="#/intern/messages">Message the employer</a></footer>`, {label:'Prepare for your interview'});
};

function savedJobs(){
  const list = [...S.saved].map(job).filter(Boolean);
  return `<a class="back" href="#/intern/jobs">${icon('left')}Back to jobs</a><div class="pagehead"><div><h1>Saved jobs</h1><p>Roles you have bookmarked. We will remind you two days before each closes.</p></div></div>
  ${list.length ? `<div class="joblist">${list.map(j => jobRow(j, {base:'#/intern/jobs', showMatch:true})).join('')}</div>` : `<div class="empty"><h3>No saved jobs</h3><p class="muted">Use the bookmark on any role to save it here.</p><a class="btn btn-primary" href="#/intern/jobs">Browse jobs</a></div>`}`;
}

/* ---------- Apply ---------- */
ACT.apply = el => {
  const j = job(el.dataset.id), e = emp(j.emp);
  openModal(`<form data-form="apply" data-id="${j.id}" novalidate>
    <header><div><h2>Apply for ${esc(j.title)}</h2><p class="muted" style="margin:4px 0 0">${esc(e.name)}, ${esc(j.area)}</p></div><button type="button" class="icon-btn" data-act="close" aria-label="Close">${icon('x')}</button></header>
    <div class="field"><span style="font-weight:700;display:block;margin-bottom:6px">Your CV</span>
      <div class="cvchip">${icon('file')}<div class="grow" style="flex:1"><b>${esc(S.cv.name)} CV</b><div class="small muted">${cvPct()}% complete, with 4 verified badges</div></div><a href="#/intern/cv" class="small">Edit</a></div></div>
    <div class="field"><label for="ap-note">Why do you want this role? <span class="hint">Optional. Two or three sentences is plenty.</span></label><textarea id="ap-note" name="note" maxlength="600"></textarea></div>
    ${j.questions.map((q,i) => `<div class="field"><label for="ap-q${i}">${esc(q)} <span class="hint">Required</span></label><textarea id="ap-q${i}" name="q${i}" style="min-height:80px" aria-describedby="ap-q${i}-err"></textarea><div id="ap-q${i}-err" class="err" hidden>Answer this question to apply</div></div>`).join('')}
    <label class="check"><input type="checkbox" name="confirm" aria-describedby="ap-c-err"> I live in Cambridgeshire or Peterborough and could start on ${fmtLong(j.starts)}</label>
    <div id="ap-c-err" class="err" hidden>Confirm this to apply</div>
    <p class="small muted" style="margin:14px 0 0">Demo only: nothing is sent to anyone.</p>
    <footer><button type="button" class="btn btn-ghost" data-act="close">Cancel</button><button class="btn btn-primary">${icon('send')}Send application</button></footer>
  </form>`, {label:'Apply for ' + j.title});
};
FORM.apply = f => {
  const j = job(f.dataset.id);
  let ok = true, first = null;
  j.questions.forEach((q,i) => { const t = f['q' + i]; const bad = !t.value.trim(); $('#ap-q' + i + '-err').hidden = !bad; t.setAttribute('aria-invalid', bad); if (bad){ ok = false; first = first || t; } });
  const c = f.confirm; $('#ap-c-err').hidden = c.checked; if (!c.checked){ ok = false; first = first || c; }
  if (!ok){ first.focus(); return; }
  S.apps.unshift({id:uid('a'), job:j.id, intern:DEMO_PEOPLE.intern, status:'applied', note:f.note.value.trim(), answers:j.questions.map((q,i) => f['q' + i].value.trim()), history:[['applied', todayISO()]]});
  closeModal();
  if (j.emp === DEMO_PEOPLE.employer) notify('employer', `${S.cv.name} applied for ${j.title}`, '#/employer/pipeline/' + j.id);
  toast(`Application sent to ${emp(j.emp).name}`);
  render({keepScroll:true});
};

/* ---------- Applications ---------- */
function internApps(){
  const apps = myApps();
  const active = apps.filter(a => a.status !== 'notprogressed');
  const closed = apps.filter(a => a.status === 'notprogressed');
  const card = a => {
    const j = job(a.job), e = emp(j.emp);
    let extra = '';
    if (a.status === 'interview') extra = interviewBlock(a);
    if (a.status === 'offer') extra = `<div style="margin-top:14px;padding:14px;background:var(--mint-50);border-radius:10px"><b>${esc(e.name)} has offered you this placement.</b><p class="small" style="margin:4px 0 10px">Starts ${fmtLong(j.starts)}. ${j.hours} hours a week at ${money(j.pay)} an hour.</p><button class="btn btn-primary btn-sm" data-act="accept" data-id="${a.id}">Accept offer</button> <button class="btn btn-ghost btn-sm" data-act="decline" data-id="${a.id}">Decline</button></div>`;
    if (a.status === 'placed') extra = `<p style="margin:12px 0 0"><b>You start on ${fmtLong(j.starts)}.</b> The CPCA team will send your welcome pack.</p>`;
    if (a.status === 'notprogressed' && a.feedback) extra = `<p class="small" style="margin:12px 0 0"><b>Feedback from the employer:</b> ${esc(a.feedback)}</p>`;
    return `<article class="appcard"><div class="top">${logo(e)}<div><h3 style="margin:0"><a href="#/intern/jobs/${j.id}">${esc(j.title)}</a></h3><div class="small muted">${esc(e.name)}. Applied ${fmt(a.history[0][1])}, last update ${fmt(a.history.at(-1)[1])}</div></div>${status(a.status)}</div>
      ${trackHTML(a)}${extra}
      <details style="margin-top:12px"><summary class="small" style="cursor:pointer;color:var(--link);font-weight:700">History</summary><ul class="timeline">${a.history.map(([s,t]) => `<li>${STATUS_LABEL[s]} on ${fmt(t)}</li>`).join('')}</ul></details>
    </article>`;
  };
  return `<div class="pagehead"><div><h1>Applications</h1><p>Every role you have applied for, and where each one stands.</p></div><a class="btn btn-primary" href="#/intern/jobs">Find more roles</a></div>
  <h2 style="font-size:1.15rem">In progress (${active.length})</h2>${active.map(card).join('') || '<div class="empty">No applications yet.</div>'}
  <h2 style="font-size:1.15rem;margin-top:28px">Closed (${closed.length})</h2>${closed.map(card).join('') || '<p class="muted">None.</p>'}`;
}
ACT.accept = el => { const a = S.apps.find(x => x.id === el.dataset.id); a.status = 'placed'; a.history.push(['placed', todayISO()]); const j = job(a.job); notify('employer', `${S.cv.name} accepted your offer for ${j.title}`, '#/employer/pipeline/' + j.id); notify('cpca', `${S.cv.name} accepted a placement at ${emp(j.emp).name}`, '#/cpca/placements'); toast('Offer accepted. Congratulations!'); render({keepScroll:true}); confetti(); };
ACT.decline = el => { const a = S.apps.find(x => x.id === el.dataset.id); a.status = 'notprogressed'; a.history.push(['notprogressed', todayISO()]); a.feedback = 'You declined this offer.'; toast('Offer declined'); render({keepScroll:true}); };

/* ---------- CV builder ---------- */
function cvPreview(){
  const c = S.cv;
  return `<h2>${esc(c.name)}</h2><div class="muted">${esc(c.headline)}</div><div class="small muted">${esc(c.area)}. ${esc(c.email)}${c.link ? `. ${esc(c.link)}` : ''}</div>
    <h3>About me</h3><p>${esc(c.about)}</p>
    <h3>Experience</h3>${c.exp.map(x => `<p><span class="role">${esc(x.role)}</span>, ${esc(x.org)} <span class="muted">(${esc(x.dates)})</span><br>${esc(x.desc)}</p>`).join('') || '<p class="muted">Add experience on the left.</p>'}
    <h3>Education</h3>${c.edu.map(x => `<p><span class="role">${esc(x.course)}</span>, ${esc(x.org)} <span class="muted">(${esc(x.dates)})</span></p>`).join('')}
    <h3>Skills</h3><p>${c.skills.map(esc).join(', ')}</p>
    ${c.showBadges ? `<h3>Verified badges</h3><div class="badges">${BADGES.start.filter(b => b.earned).map(b => `<span class="chip">${icon('hex')}${esc(b.name)}</span>`).join('')}</div>` : ''}`;
}
function cvMeter(){
  const pct = cvPct();
  const missing = cvChecks().filter(x => !x.ok);
  return `<div style="display:flex;justify-content:space-between;align-items:baseline"><b>${pct}% complete</b>${missing.length ? `<span class="small muted">${esc(missing[0].tip)}</span>` : '<span class="small" style="color:var(--mint-ink);font-weight:700">Ready to send</span>'}</div><div class="meter" style="margin-top:6px"><i style="width:${pct}%"></i></div>`;
}
function cvBuilder(){
  const c = S.cv;
  const f = (label, path, val, opts = {}) => `<div class="field"><label for="cv-${path}">${label}${opts.hint ? `<span class="hint">${opts.hint}</span>` : ''}</label>${opts.area ? `<textarea id="cv-${path}" data-input="cv" data-path="${path}">${esc(val)}</textarea>` : `<input id="cv-${path}" type="text" data-input="cv" data-path="${path}" value="${esc(val)}" ${opts.ph ? `placeholder="${opts.ph}"` : ''}>`}</div>`;
  return `<div class="pagehead"><div><h1>My CV</h1><p>Employers see this when you apply. Changes save as you type.</p></div><button class="btn btn-ghost" data-act="printcv">${icon('download')}Download as PDF</button></div>
  <div class="cvgrid">
    <div class="stack">
      <section class="panel"><h2>The basics</h2>
        ${f('Full name','name',c.name)}${f('Headline','headline',c.headline,{hint:'One line about you and what you are looking for'})}
        <div class="row">${f('Email','email',c.email)}${f('Area','area',c.area)}</div>
        ${f('Portfolio or project link','link',c.link || '',{hint:'Optional. A website, GitHub or online portfolio',ph:'For example github.com/yourname'})}
      </section>
      <section class="panel"><h2>About me</h2>${f('A short introduction','about',c.about,{area:true,hint:'Two to four sentences employers will read first'})}</section>
      <section class="panel"><h2>Experience</h2><p class="small muted">Paid work, volunteering, projects and caring roles all count.</p>
        ${c.exp.map((x,i) => `<div class="cvexp">${f('Role','exp.' + i + '.role',x.role)}<div class="row">${f('Organisation','exp.' + i + '.org',x.org)}${f('Dates','exp.' + i + '.dates',x.dates)}</div>${f('What you did','exp.' + i + '.desc',x.desc,{area:true})}<button class="btn btn-quiet btn-sm" data-act="cv-del" data-i="${i}">Remove this experience</button></div>`).join('')}
        <button class="btn btn-ghost btn-sm" data-act="cv-add">${icon('plus')}Add experience</button>
      </section>
      <section class="panel"><h2>Education</h2>
        ${c.edu.map((x,i) => `<div class="cvexp">${f('Course or qualification','edu.' + i + '.course',x.course)}<div class="row">${f('Where','edu.' + i + '.org',x.org)}${f('Dates','edu.' + i + '.dates',x.dates)}</div></div>`).join('')}
      </section>
      <section class="panel"><h2>Skills</h2>
        <div class="chips" style="margin-bottom:12px">${c.skills.map((s,i) => `<span class="chip">${esc(s)}<button class="icon-btn" style="padding:0" data-act="skill-del" data-i="${i}" aria-label="Remove ${esc(s)}">${icon('x')}</button></span>`).join('')}</div>
        <form data-form="skill" class="row" style="gap:8px;flex-direction:row"><label class="sr-only" for="newskill">Add a skill</label><input id="newskill" name="skill" type="text" placeholder="Add a skill, for example Figma"><button class="btn btn-ghost" style="flex:none">Add</button></form>
      </section>
      <section class="panel"><label class="check"><input type="checkbox" data-change="cvbadges" ${c.showBadges ? 'checked' : ''}> Show my verified badges on my CV</label></section>
    </div>
    <div>
      <div class="panel" style="margin-bottom:16px" id="cv-meter">${cvMeter()}</div>
      <div class="cvpaper" id="cv-preview" aria-label="CV preview">${cvPreview()}</div>
    </div>
  </div>`;
}
function refreshCV(){ $('#cv-preview').innerHTML = cvPreview(); $('#cv-meter').innerHTML = cvMeter(); }
INPUT.cv = el => {
  const path = el.dataset.path.split('.');
  let o = S.cv; while (path.length > 1){ o = o[path.shift()]; }
  o[path[0]] = el.value; refreshCV();
};
INPUT.cvbadges = el => { S.cv.showBadges = el.checked; refreshCV(); };
ACT['cv-add'] = () => { S.cv.exp.push({role:'',org:'',dates:'',desc:''}); render({keepScroll:true, keepFocus:true}); const i = S.cv.exp.length - 1; const el = $('#cv-exp\\.' + i + '\\.role'); if (el) el.focus(); };
ACT['cv-del'] = el => { S.cv.exp.splice(+el.dataset.i, 1); render({keepScroll:true, keepFocus:true}); toast('Experience removed'); };
ACT['skill-del'] = el => { S.cv.skills.splice(+el.dataset.i, 1); render({keepScroll:true, keepFocus:true}); };
FORM.skill = f => { const v = f.skill.value.trim(); if (!v) return; S.cv.skills.push(v); render({keepScroll:true, keepFocus:true}); $('#newskill').focus(); };
ACT.printcv = () => { document.body.classList.add('print-cv'); window.print(); setTimeout(() => document.body.classList.remove('print-cv'), 500); };

/* ---------- Badges ---------- */
function pathHTML(list, nextIdx){
  return `<div class="path">${list.map((b,i) => `${i ? `<div class="link ${b.earned ? 'done' : ''}" aria-hidden="true"></div>` : ''}<div class="node ${b.earned ? 'earned' : i === nextIdx ? 'next' : ''}"><div class="hex">${icon(b.earned ? 'check' : 'hex')}</div><span>${esc(b.name)}<br><span class="small muted">${b.earned ? 'Earned' : i === nextIdx ? 'Up next' : 'Not started'}</span></span></div>`).join('')}</div>`;
}
function badgesView(){
  return `<div class="pagehead"><div><h1>Skills and badges</h1><p>Badges are verified by CPCA and appear on your CV, so employers can trust them.</p></div></div>
  <section class="panel"><div class="section-head" style="margin-bottom:6px"><div><h2 style="margin:0">Get started</h2><p class="small">Complete these to be matched to a placement.</p></div>${status('approved','4 of 4 earned')}</div>${pathHTML(BADGES.start, -1)}</section>
  <section class="panel"><div class="section-head" style="margin-bottom:6px"><div><h2 style="margin:0">Enhance your employability</h2><p class="small">Show employers what you have done beyond study.</p></div>${status('pending','0 of 3 earned')}</div>${pathHTML(BADGES.enhance, 0)}
    <button class="btn btn-primary" data-act="badgeinfo">How to earn Volunteering</button></section>
  <section class="panel"><div class="section-head" style="margin-bottom:6px"><div><h2 style="margin:0">Daily Career Boost</h2><p class="small">Keep a streak going to earn these.</p></div></div>${pathHTML(BADGES.boost, 0)}
    <p class="small" style="margin:0">Your streak is ${S.boost.streak} days. ${7 - S.boost.streak > 0 ? `${7 - S.boost.streak} more days to earn the 7-day badge.` : 'You have reached 7 days.'}</p></section>`;
}
ACT.badgeinfo = () => openModal(`<header><h2>Earn the Volunteering badge</h2><button class="icon-btn" data-act="close" aria-label="Close">${icon('x')}</button></header>
  <p>Show you have given your time to a community group, charity or event.</p>
  <ol><li>Volunteer for at least 6 hours. It can be spread over several weeks.</li><li>Ask the organiser for a short reference, or upload a photo or certificate.</li><li>Tell us what you did and what you learned in a few sentences.</li></ol>
  <p class="small muted">The CPCA team reviews badge applications within five working days.</p>
  <footer><button class="btn btn-ghost" data-act="close">Not now</button><button class="btn btn-primary" data-act="badgestart">Start my application</button></footer>`, {label:'Earn the Volunteering badge'});
ACT.badgestart = () => { closeModal(); toast('Badge application started. Find it under Skills and badges.'); };

/* ---------- Messages (shared) ---------- */
function messagesView(role){
  const list = S.threads.filter(t => t.role === role);
  const cur = list.find(t => t.id === S.activeThread[role]) || list[0];
  if (cur) cur.unread = false;
  return `<div class="pagehead"><div><h1>Messages</h1><p>Every conversation about your ${role === 'intern' ? 'applications' : 'roles'} in one place.</p></div></div>
  <div class="inbox">
    <div class="threads" role="list">${list.map(t => `<button class="thread" role="listitem" data-act="thread" data-id="${t.id}" aria-current="${t === cur}">${t.unread ? '<span class="unread" aria-label="Unread"></span>' : ''}<b style="display:inline">${esc(t.with)}</b><div class="sub">${esc(t.subject)}</div><div class="small muted">${esc(t.msgs.at(-1).t)}</div></button>`).join('')}</div>
    ${cur ? `<section class="conv" aria-label="Conversation with ${esc(cur.with)}"><header><b>${esc(cur.subject)}</b><div class="small muted">With ${esc(cur.with)}</div></header>
      <div class="msgs" id="msgs">${cur.msgs.map(m => `<div class="msg ${m.from === 'me' ? 'me' : ''}">${esc(m.text)}<div class="t">${esc(m.t)}</div></div>`).join('')}</div>
      <form data-form="reply" data-id="${cur.id}"><label class="sr-only" for="reply">Write a reply</label><input id="reply" name="text" type="text" placeholder="Write a reply" autocomplete="off"><button class="btn btn-primary">${icon('send')}Send</button></form></section>` : '<div class="empty">No messages</div>'}
  </div>`;
}
ACT.thread = el => { S.activeThread[route().role] = el.dataset.id; render({keepScroll:true, keepFocus:true}); const b = $(`[data-act=thread][data-id="${el.dataset.id}"]`); if (b) b.focus(); };
FORM.reply = f => {
  const t = S.threads.find(x => x.id === f.dataset.id); const v = f.text.value.trim(); if (!v) return;
  t.msgs.push({from:'me', text:v, t:'Just now'}); render({keepScroll:true, keepFocus:true}); $('#reply').focus();
  const m = $('#msgs'); if (m) m.scrollTop = m.scrollHeight;
};
