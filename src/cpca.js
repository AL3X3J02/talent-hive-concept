/* ---------- CPCA team area ---------- */
const pendingJobs = () => S.jobs.filter(j => j.status === 'pending');
const unverified = () => Object.values(S.employers).filter(e => !e.verified);
function cpcaNav(){
  return [
    {id:'home',href:'#/cpca',icon:'chart',label:'Overview'},
    {id:'approvals',href:'#/cpca/approvals',icon:'shield',label:'Approvals',count:pendingJobs().length + unverified().length},
    {id:'interns',href:'#/cpca/interns',icon:'users',label:'Interns'},
    {id:'employers',href:'#/cpca/employers',icon:'building',label:'Employers'},
    {id:'placements',href:'#/cpca/placements',icon:'briefcase',label:'Placements'},
    {id:'reports',href:'#/cpca/reports',icon:'download',label:'Reports'},
    {id:'content',href:'#/cpca/content',icon:'news',label:'News and events'}
  ];
}
function renderCpca(r){
  const v = r.parts[1] || 'home';
  let body;
  if (v === 'home') body = cpcaHome();
  else if (v === 'approvals' && r.parts[2]) body = reviewView(r.parts[2]);
  else if (v === 'approvals') body = approvalsView();
  else if (v === 'interns') body = internsTable();
  else if (v === 'employers') body = employersTable();
  else if (v === 'placements') body = placementsView();
  else if (v === 'reports') body = reportsView();
  else if (v === 'content') body = contentView();
  else body = '<h1>Page not found</h1>';
  return `<a class="skip" href="#main">Skip to content</a>` + shell('cpca', v, cpcaNav(), `${avatar({name:DEMO_PEOPLE.staff,color:'#2F9E6E'})}<div><b>${DEMO_PEOPLE.staff}</b><span>Programme officer, CPCA</span></div>`, body);
}

/* Charts: single series, one hue, rounded data-ends, hover and focus tooltips */
function columnChart(data, {label, unit='applications'} = {}){
  const W = 640, H = 240, padL = 34, padB = 28, padT = 26, max = Math.ceil(Math.max(...data.map(x => x.n)) / 10) * 10;
  const bw = (W - padL - 10) / data.length, barW = Math.min(36, bw * .55);
  const y = v => padT + (H - padT - padB) * (1 - v / max);
  const peak = data.reduce((m,x,i) => x.n > data[m].n ? i : m, 0);
  const ticks = [0, max / 2, max];
  return `<div class="chart" style="position:relative"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label)}">
    ${ticks.map(t => `<line x1="${padL}" x2="${W - 6}" y1="${y(t)}" y2="${y(t)}" stroke="#E3E9F0" stroke-width="1"/><text x="${padL - 8}" y="${y(t) + 4}" text-anchor="end">${t}</text>`).join('')}
    ${data.map((x,i) => { const cx = padL + bw * i + bw / 2, top = y(x.n), h = H - padB - top, partial = i === data.length - 1;
      const r = Math.min(4, h);
      return `<g class="bar" tabindex="0" data-tip="${esc(x.w)}${partial ? ' (week so far)' : ''}: ${x.n} ${unit}" aria-label="Week of ${esc(x.w)}${partial ? ', so far' : ''}: ${x.n} ${unit}">
        <rect x="${cx - bw / 2}" y="${padT}" width="${bw}" height="${H - padT - padB}" fill="transparent"/>
        <path d="M${cx - barW / 2} ${H - padB}V${top + r}Q${cx - barW / 2} ${top} ${cx - barW / 2 + r} ${top}H${cx + barW / 2 - r}Q${cx + barW / 2} ${top} ${cx + barW / 2} ${top + r}V${H - padB}Z" fill="${partial ? '#9FB2C6' : '#0E2A47'}"/>
        ${i === peak || partial ? `<text class="val" x="${cx}" y="${top - 6}" text-anchor="middle">${x.n}</text>` : ''}
        <text x="${cx}" y="${H - 9}" text-anchor="middle">${esc(x.w)}</text></g>`; }).join('')}
    <line x1="${padL}" x2="${W - 6}" y1="${H - padB}" y2="${H - padB}" stroke="#B9C6D4"/>
  </svg><div class="tip" role="tooltip" hidden style="position:absolute;pointer-events:none;background:var(--ink);color:#fff;font-size:.85rem;padding:6px 10px;border-radius:8px;white-space:nowrap;transform:translate(-50%,-110%)"></div>
  <p class="small muted" style="margin:6px 0 0">The lighter bar is the current week, still in progress.</p></div>`;
}
function hbars(data){
  const max = Math.max(...data.map(x => x.n));
  return data.map(x => `<div class="bar-h"><span>${esc(x.s)}</span><span class="b"><i style="width:${x.n / max * 100}%"></i></span><span class="n">${x.n}</span></div>`).join('');
}
AFTER.push(() => {
  $$('.chart').forEach(ch => {
    const tip = $('.tip', ch); if (!tip) return;
    const show = g => { const r = g.getBoundingClientRect(), c = ch.getBoundingClientRect(); tip.textContent = g.dataset.tip; tip.hidden = false; tip.style.left = (r.left - c.left + r.width / 2) + 'px'; tip.style.top = (g.querySelector('path').getBoundingClientRect().top - c.top) + 'px'; };
    $$('.bar', ch).forEach(g => { g.addEventListener('mouseenter', () => show(g)); g.addEventListener('focus', () => show(g)); g.addEventListener('mouseleave', () => tip.hidden = true); g.addEventListener('blur', () => tip.hidden = true); });
  });
});

function stalled(){ return S.apps.filter(a => ['applied','viewed','shortlisted'].includes(a.status) && daysSince(a.history.at(-1)[1]) >= 7); }
function cpcaHome(){
  const live = liveJobs().length;
  const monthApps = WEEKLY_APPS.slice(4).reduce((s,x) => s + x.n, 0);
  const placed = PLACEMENTS_BY_SECTOR.reduce((s,x) => s + x.n, 0) + S.apps.filter(a => a.status === 'placed').length;
  const waiting = pendingJobs().length + unverified().length;
  const st = stalled();
  return `<div class="pagehead"><div><h1>Programme overview</h1><p>Winter 2026 cohort. Updated Tuesday 24 November, 09:00.</p></div><a class="btn btn-ghost" href="#/cpca/reports">${icon('download')}Reports</a></div>
  ${waiting ? `<section class="nextstep"><div class="hexdeco hex">${icon('shield')}</div><div><h2>${waiting} ${waiting === 1 ? 'item needs' : 'items need'} your approval</h2><p>${pendingJobs().length} new ${pendingJobs().length === 1 ? 'listing' : 'listings'} and ${unverified().length} new ${unverified().length === 1 ? 'employer' : 'employers'}. Aim to review within two working days.</p></div><a class="btn btn-honey" href="#/cpca/approvals">Review now</a></section>` : ''}
  <div class="kpis">
    <div class="kpi"><div class="v">${live}</div><div class="l">Live listings</div></div>
    <div class="kpi"><div class="v">${monthApps}</div><div class="l">Applications in November</div><div class="d">Up ${Math.round((monthApps / WEEKLY_APPS.slice(0,4).reduce((s,x) => s + x.n, 0) - 1) * 100)}% on October</div></div>
    <div class="kpi"><div class="v">${placed}</div><div class="l">Placements this cohort</div></div>
    <div class="kpi"><div class="v">${st.length}</div><div class="l">Applications with no update for 7+ days</div></div>
  </div>
  <div class="grid-main">
    <section class="panel"><h2>Applications per week</h2><p class="small muted">Since applications moved onto the platform on 5 October.</p>${columnChart(WEEKLY_APPS, {label:'Applications per week, 5 October to 23 November. Peak of 44 in the week of 16 November.'})}</section>
    <section class="panel"><h2>Needs a nudge</h2><p class="small muted">Applicants have heard nothing for a week or more.</p>
      ${st.map(a => { const j = job(a.job), e = emp(j.emp), i = intern(a.intern); return `<div class="listitem"><div class="grow"><b>${esc(i.name)}</b><div class="small muted">${esc(j.title)}, ${esc(e.name)}</div><div class="small">${STATUS_LABEL[a.status]} ${daysSince(a.history.at(-1)[1])} days ago, nothing since</div></div><button class="btn btn-ghost btn-sm" data-act="nudge" data-e="${esc(e.name)}">Nudge</button></div>`; }).join('') || '<p class="muted">Nothing stalled. Nice.</p>'}
    </section>
  </div>
  <section class="panel" style="margin-top:20px"><h2>Placements by sector this cohort</h2>${hbars(PLACEMENTS_BY_SECTOR)}</section>`;
}
ACT.nudge = el => { toast(`Reminder sent to ${el.dataset.e}`); el.disabled = true; el.textContent = 'Nudged'; };

/* Approvals */
function approvalsView(){
  const tab = S.approvalsTab;
  const pj = pendingJobs(), ue = unverified();
  return `<div class="pagehead"><div><h1>Approvals</h1><p>Check new listings and employers before anything reaches interns.</p></div></div>
  <div class="tabs" role="tablist">
    <button role="tab" aria-selected="${tab === 'listings'}" data-act="atab" data-t="listings">Listings (${pj.length})</button>
    <button role="tab" aria-selected="${tab === 'employers'}" data-act="atab" data-t="employers">Employers (${ue.length})</button>
  </div>
  ${tab === 'listings' ? `<section class="panel">${pj.length ? `<div class="table-wrap"><table class="table"><thead><tr><th>Role</th><th>Employer</th><th>Submitted</th><th>Checks</th><th><span class="sr-only">Action</span></th></tr></thead><tbody>
    ${pj.map(j => { const fails = listingChecks(j).filter(c => !c.ok).length; return `<tr><td><b>${esc(j.title)}</b></td><td>${esc(emp(j.emp).name)}${emp(j.emp).verified ? '' : ' <span class="status st-pending">New employer</span>'}</td><td>${fmt(j.submitted)}</td><td>${fails ? `<span class="status st-returned">${fails} to check</span>` : '<span class="status st-approved">All passed</span>'}</td><td><a class="btn btn-primary btn-sm" href="#/cpca/approvals/${j.id}">Review</a></td></tr>`; }).join('')}
    </tbody></table></div>` : '<div class="empty" style="border:0"><h3>All caught up</h3><p class="muted">No listings waiting for approval.</p></div>'}</section>`
  : `<section class="panel">${ue.length ? ue.map(e => `<div class="listitem" style="align-items:flex-start">${logo(e)}<div class="grow"><b>${esc(e.name)}</b><div class="small muted">${esc(sectorName(e.sector))}, ${esc(e.town)}. ${esc(e.size)}. Contact: ${esc(e.contact)}</div><p class="small" style="margin:6px 0">${esc(e.about)}</p>
      <ul class="checklist small"><li class="ok">${icon('check')}Registered company number checked</li><li class="ok">${icon('check')}Employer liability insurance uploaded</li><li class="bad">${icon('alert')}Safeguarding contact not yet named</li></ul></div>
      <div style="display:flex;flex-direction:column;gap:8px"><button class="btn btn-primary btn-sm" data-act="verify" data-id="${e.id}">Verify employer</button><button class="btn btn-ghost btn-sm" data-act="askinfo" data-e="${esc(e.name)}">Ask for details</button></div></div>`).join('') : '<div class="empty" style="border:0"><h3>All caught up</h3><p class="muted">No employers waiting for checks.</p></div>'}</section>`}`;
}
ACT.atab = el => { S.approvalsTab = el.dataset.t; render({keepScroll:true, keepFocus:true}); $(`[data-act=atab][data-t="${el.dataset.t}"]`).focus(); };
ACT.verify = el => { emp(el.dataset.id).verified = true; toast(`${emp(el.dataset.id).name} verified`); render({keepScroll:true}); };
ACT.askinfo = el => toast(`Request sent to ${el.dataset.e}`);
function listingChecks(j){
  const e = emp(j.emp);
  const text = [j.summary, ...j.duties, ...j.needs].join(' ');
  return [
    {ok:e.verified, t:'Employer is verified', fix:`${e.name} has not been verified yet`},
    {ok:j.pay >= NLW, t:`Pay is at least £${NLW} an hour (National Living Wage)`, fix:`Pay is ${money(j.pay)} an hour, below the National Living Wage`},
    {ok:daysUntil(j.closes) >= 7, t:'Open for at least 7 days', fix:'Closes in under 7 days'},
    {ok:j.duties.length > 0 && j.needs.length > 0, t:'Duties and requirements filled in', fix:'Missing duties or requirements'},
    {ok:d(j.starts) > d(j.closes), t:'Start date is after the closing date', fix:'Start date is before the closing date'},
    {ok:!/@|https?:/.test(text), t:'Applications go through Talent Hive, not email', fix:'Listing text includes an email address or link'}
  ];
}
function reviewView(id){
  const j = job(id); if (!j) return '<h1>Listing not found</h1>';
  const e = emp(j.emp); const checks = listingChecks(j); const blockers = checks.filter(c => !c.ok);
  return `<a class="back" href="#/cpca/approvals">${icon('left')}Back to approvals</a>
  <div class="pagehead"><div><h1>Review: ${esc(j.title)}</h1><p>${esc(e.name)}. Submitted ${fmtLong(j.submitted)}.</p></div>${status(j.status, j.status === 'pending' ? 'Waiting for approval' : j.status === 'live' ? 'Live' : 'Returned')}</div>
  <div class="grid-main">
    <section class="panel"><p class="preview-label">How interns will see it</p>
      <div style="display:flex;gap:14px;align-items:center;margin-bottom:14px">${logo(e)}<div><h2 style="margin:0">${esc(j.title)}</h2><div class="muted small">${esc(e.name)}, ${esc(j.area)}</div></div></div>
      <dl class="facts"><div><dt>Pay</dt><dd>${money(j.pay)} an hour</dd></div><div><dt>Hours</dt><dd>${j.hours} a week</dd></div><div><dt>Length</dt><dd>${j.weeks} weeks</dd></div><div><dt>Location</dt><dd>${esc(j.area)}, ${esc(j.mode.toLowerCase())}</dd></div><div><dt>Starts</dt><dd>${fmt(j.starts)}</dd></div><div><dt>Closes</dt><dd>${fmt(j.closes)}</dd></div></dl>
      <div class="prose"><p>${esc(j.summary)}</p><h2>What you will do</h2><ul>${j.duties.map(x => `<li>${esc(x)}</li>`).join('')}</ul><h2>What you need</h2><ul>${j.needs.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
      ${j.questions.length ? `<h2>Screening questions</h2><ul>${j.questions.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}</div>
    </section>
    <aside class="stack">
      <section class="panel"><h2>Automatic checks</h2><ul class="checklist">${checks.map(c => `<li class="${c.ok ? 'ok' : 'bad'}">${icon(c.ok ? 'check' : 'alert')}<span>${esc(c.ok ? c.t : c.fix)}</span></li>`).join('')}</ul></section>
      ${j.status === 'pending' ? `<section class="panel"><h2>Decision</h2>
        ${blockers.length ? `<p class="small" style="color:var(--red);font-weight:700">${blockers.length} ${blockers.length === 1 ? 'check needs' : 'checks need'} attention. Return the listing with comments, or fix the issue first.</p>` : '<p class="small">Everything checks out.</p>'}
        ${!e.verified ? `<button class="btn btn-ghost" style="width:100%;margin-bottom:8px" data-act="verify" data-id="${e.id}">Verify ${esc(e.name)}</button>` : ''}
        <button class="btn btn-primary" style="width:100%;margin-bottom:8px" data-act="approve" data-id="${j.id}" ${blockers.length ? 'disabled aria-describedby="why-disabled"' : ''}>Approve and publish</button>
        ${blockers.length ? '<p id="why-disabled" class="small muted">Approve is available once every check passes.</p>' : ''}
        <button class="btn btn-ghost" style="width:100%" data-act="return" data-id="${j.id}">Return with comments</button></section>` : ''}
    </aside>
  </div>`;
}
ACT.approve = el => { const j = job(el.dataset.id); j.status = 'live'; j.posted = todayISO(); toast('Published. It is now on the jobs board.'); go('#/cpca/approvals'); };
ACT['return'] = el => {
  const j = job(el.dataset.id); const fails = listingChecks(j).filter(c => !c.ok).map(c => c.fix);
  openModal(`<form data-form="return" data-id="${j.id}"><header><h2>Return ${esc(j.title)}</h2><button type="button" class="icon-btn" data-act="close" aria-label="Close">${icon('x')}</button></header>
    <p class="muted">${esc(emp(j.emp).contact)} at ${esc(emp(j.emp).name)} will see this message with their listing.</p>
    <div class="field"><label for="rc">What needs to change</label><textarea id="rc" name="c">${esc(fails.length ? fails.join('. ') + '. Please update and resubmit.' : '')}</textarea></div>
    <footer><button type="button" class="btn btn-ghost" data-act="close">Cancel</button><button class="btn btn-primary">Return to employer</button></footer></form>`, {label:'Return listing'});
};
FORM['return'] = f => { const j = job(f.dataset.id); j.status = 'returned'; S.returned[j.id] = f.c.value.trim() || 'Please review and resubmit.'; closeModal(); toast(`Returned to ${emp(j.emp).name}`); go('#/cpca/approvals'); };

/* People */
function internsTable(){
  const rows = Object.values(S.interns).map(i => {
    const apps = S.apps.filter(a => a.intern === i.id);
    const st = apps.some(a => a.status === 'placed') ? ['placed','Placed'] : apps.some(a => a.status === 'offer') ? ['offer','Offer made'] : apps.some(a => a.status === 'interview') ? ['interview','Interviewing'] : apps.length ? ['applied','Applying'] : ['draft','Not applied yet'];
    return {i, apps, st};
  });
  return `<div class="pagehead"><div><h1>Interns</h1><p>${rows.length} interns in this sample. Full site: search, eligibility checks and full history.</p></div></div>
  <section class="panel"><div class="table-wrap"><table class="table"><thead><tr><th>Name</th><th>Area</th><th class="num">Badges</th><th class="num">Applications</th><th>Status</th><th>Available</th></tr></thead><tbody>
  ${rows.map(({i,apps,st}) => `<tr><td><div style="display:flex;gap:10px;align-items:center">${avatar(i)}<b>${esc(i.name)}</b></div></td><td>${esc(i.area)}</td><td class="num">${i.badges}</td><td class="num">${apps.length}</td><td>${status(st[0], st[1])}</td><td>${esc(i.availability)}</td></tr>`).join('')}
  </tbody></table></div></section>`;
}
function employersTable(){
  const rows = Object.values(S.employers);
  return `<div class="pagehead"><div><h1>Employers</h1><p>${rows.length} employers in this sample.</p></div></div>
  <section class="panel"><div class="table-wrap"><table class="table"><thead><tr><th>Employer</th><th>Sector</th><th>Location</th><th>Status</th><th class="num">Live roles</th><th class="num">Applicants</th></tr></thead><tbody>
  ${rows.map(e => { const js = S.jobs.filter(j => j.emp === e.id); return `<tr><td><div style="display:flex;gap:10px;align-items:center">${logo(e)}<b>${esc(e.name)}</b></div></td><td>${esc(sectorName(e.sector))}</td><td>${esc(e.town)}</td><td>${e.verified ? status('approved','Verified') : status('pending','Waiting for checks')}</td><td class="num">${js.filter(j => j.status === 'live').length}</td><td class="num">${S.apps.filter(a => js.some(j => j.id === a.job)).length}</td></tr>`; }).join('')}
  </tbody></table></div></section>`;
}
function placementsView(){
  const list = S.apps.filter(a => a.status === 'offer' || a.status === 'placed');
  return `<div class="pagehead"><div><h1>Placements</h1><p>Offers accepted by interns become confirmed placements and count in reports.</p></div></div>
  <section class="panel"><div class="table-wrap"><table class="table"><thead><tr><th>Intern</th><th>Role</th><th>Employer</th><th>Starts</th><th>Status</th><th><span class="sr-only">Action</span></th></tr></thead><tbody>
  ${list.map(a => { const j = job(a.job), e = emp(j.emp), i = intern(a.intern); return `<tr><td><b>${esc(i.name)}</b></td><td>${esc(j.title)}</td><td>${esc(e.name)}</td><td class="nowrap">${fmt(j.starts)}</td><td>${a.status === 'placed' ? status('placed','Confirmed') : status('offer','Offer made')}</td><td>${a.status === 'offer' ? `<button class="btn btn-ghost btn-sm" data-act="confirmplace" data-id="${a.id}">Confirm placement</button>` : '<span class="small muted">Welcome pack sent</span>'}</td></tr>`; }).join('') || '<tr><td colspan="6" class="muted">No offers yet.</td></tr>'}
  </tbody></table></div></section>
  <p class="small muted" style="margin-top:12px">Tip: accept the offer as Jordan in the intern view, or make an offer in the employer pipeline, and it appears here.</p>`;
}
ACT.confirmplace = el => { const a = S.apps.find(x => x.id === el.dataset.id); a.status = 'placed'; a.history.push(['placed', todayISO()]); toast('Placement confirmed'); render({keepScroll:true}); };

/* Reports */
function reportsView(){
  return `<div class="pagehead"><div><h1>Reports</h1><p>Numbers for funders and the programme board. Download as CSV to use in Excel.</p></div>
    <div style="display:flex;gap:8px;align-items:flex-end"><div><label for="rng" class="small">Period</label><select id="rng"><option>This cohort</option><option>Last 30 days</option><option>This financial year</option></select></div><button class="btn btn-primary" data-act="csv">${icon('download')}Download CSV</button></div></div>
  <div class="grid-2">
    <section class="panel"><h2>Applications per week</h2>${columnChart(WEEKLY_APPS, {label:'Applications per week, 5 October to 23 November'})}
      <details style="margin-top:10px"><summary class="small" style="cursor:pointer;color:var(--link);font-weight:700">Show as a table</summary><table class="table" style="margin-top:8px"><thead><tr><th>Week starting</th><th class="num">Applications</th></tr></thead><tbody>${WEEKLY_APPS.map(x => `<tr><td>${x.w}</td><td class="num">${x.n}</td></tr>`).join('')}</tbody></table></details></section>
    <section class="panel"><h2>Placements by sector</h2>${hbars(PLACEMENTS_BY_SECTOR)}</section>
  </div>
  <section class="panel" style="margin-top:20px"><h2>Funnel this cohort</h2><div class="table-wrap"><table class="table"><thead><tr><th>Stage</th><th class="num">People</th><th class="num">Share of sign-ups</th></tr></thead><tbody>
    ${[['Signed up',527],['Completed profile and CV',402],['Applied for at least one role',288],['Interviewed',131],['Placed',59]].map(([s,n]) => `<tr><td>${s}</td><td class="num">${n}</td><td class="num">${Math.round(n / 527 * 100)}%</td></tr>`).join('')}
  </tbody></table></div><p class="small muted" style="margin:10px 0 0">Sample figures for the demo.</p></section>`;
}
ACT.csv = () => {
  const lines = ['Section,Label,Value', ...WEEKLY_APPS.map(x => `Applications per week,${x.w},${x.n}`), ...PLACEMENTS_BY_SECTOR.map(x => `Placements by sector,${x.s},${x.n}`)];
  const blob = new Blob([lines.join('\n')], {type:'text/csv'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'talent-hive-report-sample.csv'; document.body.appendChild(a); a.click(); a.remove();
  toast('Report downloaded');
};

/* Content */
function contentView(){
  return `<div class="pagehead"><div><h1>News and events</h1><p>Updates and sessions for interns and employers. Job listings live in their own approval queue, never here.</p></div><button class="btn btn-primary" data-act="addevent">${icon('plus')}Add event</button></div>
  <section class="panel"><h2>Events</h2>${S.events.map(ev => { const x = d(ev.date); return `<div class="listitem"><div class="date hex"><b>${x.getDate()}</b><span>${MONTHS[x.getMonth()]}</span></div><div class="grow"><b>${esc(ev.title)}</b><div class="small muted">${esc(ev.time)}. ${esc(ev.where)}</div></div><span class="chip">${esc(ev.type)}</span></div>`; }).join('')}</section>
  <section class="panel"><h2>News</h2>
    <div class="listitem"><div class="grow"><b>Welcome to the winter 2026 cohort</b><div class="small muted">Published 2 November. Seen by 412 interns</div></div>${status('live','Published')}</div>
    <div class="listitem"><div class="grow"><b>New: track your applications in one place</b><div class="small muted">Published 5 October. Seen by 498 interns</div></div>${status('live','Published')}</div>
    <div class="listitem"><div class="grow"><b>Christmas opening hours</b><div class="small muted">Draft</div></div>${status('draft','Draft')}</div>
  </section>`;
}
ACT.addevent = () => openModal(`<form data-form="addevent"><header><h2>Add an event</h2><button type="button" class="icon-btn" data-act="close" aria-label="Close">${icon('x')}</button></header>
  <div class="field"><label for="ev-t">Title</label><input id="ev-t" name="title" type="text" value="CV clinic"></div>
  <div class="row"><div class="field"><label for="ev-d">Date</label><input id="ev-d" name="date" type="date" value="2027-01-20"></div><div class="field"><label for="ev-time">Time</label><input id="ev-time" name="time" type="text" value="10:00 to 11:00"></div></div>
  <div class="row"><div class="field"><label for="ev-w">Where</label><input id="ev-w" name="where" type="text" value="Online"></div><div class="field"><label for="ev-type">Type</label><select id="ev-type" name="type"><option>Online</option><option>In person</option></select></div></div>
  <footer><button type="button" class="btn btn-ghost" data-act="close">Cancel</button><button class="btn btn-primary">Publish event</button></footer></form>`, {label:'Add an event'});
FORM.addevent = f => { if (!f.title.value.trim() || !f.date.value) return; S.events.push({id:uid('ev'), title:f.title.value.trim(), date:f.date.value, time:f.time.value, where:f.where.value, type:f.type.value}); S.events.sort((a,b) => d(a.date) - d(b.date)); closeModal(); toast('Event published. Interns can book it now.'); render({keepScroll:true}); };
