/* ---------- Employer: listing insights ---------- */
function seeded(n, seed){ let x = 0; for (const ch of seed) x = (x * 31 + ch.charCodeAt(0)) % 9973; return Array.from({length:n}, (_, i) => { x = (x * 7919 + 17) % 9973; return x / 9973; }); }
function insightsView(id){
  const j = job(id); if (!j || j.emp !== DEMO_PEOPLE.employer) return '<h1>Listing not found</h1>';
  const apps = appsFor(j.id);
  const rnd = seeded(14, j.id);
  const days = rnd.map((r, i) => Math.round((j.views / 14) * (0.55 + r * 0.9) * (i > 9 ? 1.25 : 1)));
  const shortl = apps.filter(a => ['shortlisted','interview','offer','placed'].includes(a.status)).length;
  const intv = apps.filter(a => ['interview','offer','placed'].includes(a.status)).length;
  const funnel = [['Viewed the listing', j.views],['Applied', apps.length],['Shortlisted', shortl],['Interviewed', intv]];
  const W = 640, H = 200, pb = 26, pt = 14, max = Math.max(...days) * 1.15, bw = W / days.length;
  const y = v => pt + (H - pt - pb) * (1 - v / max);
  const line = days.map((v, i) => `${i ? 'L' : 'M'}${(i + .5) * bw} ${y(v)}`).join('');
  const area = line + `L${(days.length - .5) * bw} ${H - pb}L${bw / 2} ${H - pb}Z`;
  const labels = Array.from({length:14}, (_, i) => { const x = new Date(TODAY.getTime() - (13 - i) * 864e5); return `${x.getDate()} ${MONTHS[x.getMonth()]}`; });
  const skills = {}; apps.forEach(a => { const i = intern(a.intern); (a.intern === DEMO_PEOPLE.intern ? S.cv.skills : i.skills).forEach(s => skills[s] = (skills[s] || 0) + 1); });
  const topSkills = Object.entries(skills).sort((a, b) => b[1] - a[1]).slice(0, 6);
  return `<a class="back" href="#/employer/listings">${icon('left')}My listings</a>
  <div class="pagehead"><div><h1>${esc(j.title)}</h1><p>Insights for the last 14 days. Closes ${fmtLong(j.closes)}.</p></div><div style="display:flex;gap:8px"><a class="btn btn-ghost" href="#/jobs/${j.id}" target="_blank" rel="noopener">${icon('eye')}View as intern</a><a class="btn btn-primary" href="#/employer/pipeline/${j.id}">Applicants</a></div></div>
  <div class="kpis"><div class="kpi"><div class="v" data-count="${j.views}">${j.views}</div><div class="l">Views</div></div><div class="kpi"><div class="v" data-count="${apps.length}">${apps.length}</div><div class="l">Applications</div></div><div class="kpi"><div class="v">${(apps.length / j.views * 100).toFixed(1)}%</div><div class="l">Of viewers applied</div></div><div class="kpi"><div class="v">${daysUntil(j.closes)}</div><div class="l">Days until it closes</div></div></div>
  <div class="grid-main">
    <section class="panel"><h2>Views per day</h2><div class="chart" style="position:relative"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Views per day over 14 days, between ${Math.min(...days)} and ${Math.max(...days)}">
      <defs><pattern id="ga" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="7" fill="#F3F4FF"/><rect width="2" height="7" fill="#C9CEFF"/></pattern></defs>
      <line x1="0" x2="${W}" y1="${H - pb}" y2="${H - pb}" stroke="#CDD2DD"/>
      <path d="${area}" fill="url(#ga)"/><path d="${line}" fill="none" stroke="#2E3BFF" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" class="drawline"/>
      ${days.map((v, i) => `<g class="bar" tabindex="0" data-tip="${labels[i]}: ${v} views" aria-label="${labels[i]}: ${v} views"><rect x="${i * bw}" y="0" width="${bw}" height="${H - pb}" fill="transparent"/><path d="M${(i + .5) * bw - 4} ${y(v)}h8" stroke="transparent"/><circle cx="${(i + .5) * bw}" cy="${y(v)}" r="${i === 13 ? 5 : 0}" fill="#2E3BFF" stroke="#fff" stroke-width="2"/>${i % 3 === 1 || i === 13 ? `<text x="${(i + .5) * bw}" y="${H - 7}" text-anchor="middle">${labels[i]}</text>` : ''}</g>`).join('')}
    </svg><div class="tip charttip" role="tooltip" hidden></div></div></section>
    <section class="panel"><h2>From view to interview</h2>${funnel.map(([l, n], i) => `<div class="fun"><div class="fun-top"><span>${l}</span><b>${n}</b></div><div class="b"><i style="width:${Math.max(2, n / funnel[0][1] * 100)}%"></i></div>${i ? `<div class="small muted">${funnel[i - 1][1] ? Math.round(n / funnel[i - 1][1] * 100) : 0}% of the step before</div>` : ''}</div>`).join('')}</section>
  </div>
  <div class="grid-2" style="margin-top:20px">
    <section class="panel"><h2>How people found it</h2>${hbars([{s:'Jobs board search',n:58},{s:'Recommended to them',n:21},{s:'Browsing by sector',n:14},{s:'Shared link',n:7}]).replace(/<span class="n">(\d+)<\/span>/g, '<span class="n">$1%</span>')}</section>
    <section class="panel"><h2>Skills your applicants have</h2>${topSkills.length ? `<div class="chips">${topSkills.map(([s, n]) => `<span class="chip" ${j.skills.includes(s) ? 'style="background:var(--mint-50);color:var(--mint-ink);font-weight:700"' : ''}>${esc(s)} (${n})</span>`).join('')}</div><p class="small muted" style="margin:10px 0 0">Green skills are ones you asked for.</p>` : '<p class="muted">No applicants yet.</p>'}</section>
  </div>`;
}

/* ---------- Ratings and candidate compare ---------- */
ACT.rate = el => { S.ratings[el.dataset.id] = +el.dataset.r; $$(`[data-act=rate][data-id="${el.dataset.id}"]`).forEach(b => { b.classList.toggle('on', +b.dataset.r <= +el.dataset.r); b.setAttribute('aria-pressed', +b.dataset.r === +el.dataset.r); }); toast(`Rated ${el.dataset.r} out of 5`); };
const rateWidget = a => `<div class="rate" role="group" aria-label="Your rating">${[1,2,3,4,5].map(r => `<button class="${r <= (S.ratings[a.id] || 0) ? 'on' : ''}" data-act="rate" data-id="${a.id}" data-r="${r}" aria-pressed="${S.ratings[a.id] === r}" aria-label="${r} out of 5">${icon('star')}</button>`).join('')}</div>`;
INPUT.ccmp = el => {
  const id = el.dataset.id;
  if (el.checked){ if (S.candCompare.size >= 3){ el.checked = false; toast('You can compare up to 3 applicants'); return; } S.candCompare.add(id); } else S.candCompare.delete(id);
  empTray();
};
function empTray(){
  let t = $('#etray');
  if (!S.candCompare.size || route().parts[1] !== 'pipeline'){ if (t) t.remove(); return; }
  if (!t){ t = document.createElement('div'); t.id = 'etray'; t.className = 'tray'; document.body.appendChild(t); }
  t.innerHTML = `<span><b>${S.candCompare.size}</b> selected</span><span class="tray-names small">${[...S.candCompare].map(id => esc(intern(S.apps.find(a => a.id === id).intern).name)).join(', ')}</span><button class="btn btn-quiet btn-sm" data-act="ccmp-clear">Clear</button><button class="btn btn-honey btn-sm" data-act="ccmp-open" ${S.candCompare.size < 2 ? 'disabled' : ''}>Compare applicants</button>`;
}
AFTER.push(empTray);
ACT['ccmp-clear'] = () => { S.candCompare.clear(); empTray(); $$('[data-change=ccmp]').forEach(c => c.checked = false); };
ACT['ccmp-open'] = () => {
  const as = [...S.candCompare].map(id => S.apps.find(a => a.id === id)); const j = job(as[0].job);
  const sk = a => (a.intern === DEMO_PEOPLE.intern ? S.cv.skills : intern(a.intern).skills);
  const fit = a => j.skills.filter(s => sk(a).map(x => x.toLowerCase()).includes(s.toLowerCase()));
  openModal(`<header><h2>Compare applicants</h2><button class="icon-btn" data-act="close" aria-label="Close">${icon('x')}</button></header>
    <div class="table-wrap"><table class="table cmp"><thead><tr><th><span class="sr-only">Detail</span></th>${as.map(a => `<th scope="col">${avatar(intern(a.intern))}<div style="margin-top:6px;color:var(--ink)">${esc(intern(a.intern).name)}</div></th>`).join('')}</tr></thead><tbody>
      <tr><th scope="row">Stage</th>${as.map(a => `<td>${status(a.status)}</td>`).join('')}</tr>
      <tr><th scope="row">Your rating</th>${as.map(a => `<td>${S.ratings[a.id] ? stars(S.ratings[a.id]) : '<span class="muted">Not rated</span>'}</td>`).join('')}</tr>
      <tr><th scope="row">Skills match</th>${as.map(a => `<td><b>${fit(a).length} of ${j.skills.length}</b><div class="small muted">${fit(a).map(esc).join(', ') || 'None'}</div></td>`).join('')}</tr>
      <tr><th scope="row">Area</th>${as.map(a => `<td>${esc(intern(a.intern).area)}</td>`).join('')}</tr>
      <tr><th scope="row">Available</th>${as.map(a => `<td>${esc(intern(a.intern).availability)}</td>`).join('')}</tr>
      <tr><th scope="row">Badges</th>${as.map(a => `<td>${intern(a.intern).badges}</td>`).join('')}</tr>
      <tr><th scope="row">Your notes</th>${as.map(a => `<td class="small">${esc(a.empNotes || '')}</td>`).join('')}</tr>
    </tbody></table></div>`, {label:'Compare applicants'});
  $('#modal-root .modal').style.width = 'min(860px,100%)';
};

/* ---------- Offer interview times ---------- */
function offerSlots(id){
  const a = S.apps.find(x => x.id === id); const i = intern(a.intern);
  const def = ['2026-12-01T10:00','2026-12-02T14:30','2026-12-03T11:00'];
  openModal(`<form data-form="slots" data-id="${id}"><header><h2>Invite ${esc(i.name)} to interview</h2><button type="button" class="icon-btn" data-act="close" aria-label="Close">${icon('x')}</button></header>
    <p class="muted">Offer up to three times. ${esc(i.name.split(' ')[0])} picks one and it is booked straight away.</p>
    ${def.map((v, k) => `<div class="field"><label for="sl${k}">Option ${k + 1}</label><input id="sl${k}" name="s${k}" type="datetime-local" value="${v}"></div>`).join('')}
    <div class="field"><label for="slw">Where</label><select id="slw" name="where"><option>Video call (link sent when booked)</option><option>In person at ${esc(ME_EMP().name)}, ${esc(ME_EMP().town)}</option><option>Phone call</option></select></div>
    <footer><button type="button" class="btn btn-ghost" data-act="close">Cancel</button><button class="btn btn-primary">${icon('send')}Send invitation</button></footer></form>`, {label:'Invite to interview'});
}
FORM.slots = f => {
  const a = S.apps.find(x => x.id === f.dataset.id);
  a.slots = [f.s0.value, f.s1.value, f.s2.value].filter(Boolean); a.where = f.where.value; a.when = null; a.interview = '';
  closeModal(); moveApp(a.id, 'interview', true);
};

/* ---------- Employer: placements ---------- */
function empPlacementsView(){
  const P = S.empPlacement; const total = P.hours.reduce((s, x) => s + x.h, 0);
  return `<div class="pagehead"><div><h1>Placements</h1><p>Interns currently on placement with you, their hours and weekly check-ins.</p></div></div>
  <section class="panel placement-hero"><div class="ph-top">${ring(P.week / 6, 'Wk ' + P.week)}<div style="flex:1;min-width:0"><h2 style="margin:0">${esc(P.intern)}</h2><div class="muted">${esc(P.role)}. Mentor: ${esc(P.mentor)}. Started ${fmt(P.start)}</div>
    <div class="weeks">${[1,2,3,4,5,6].map(w => `<span class="${w < P.week ? 'done' : w === P.week ? 'now' : ''}">Week ${w}</span>`).join('')}</div></div><div class="ph-stat"><b>${total}</b><span class="small muted">hours so far</span></div></div></section>
  <div class="grid-main" style="margin-top:20px">
    <div class="stack">
      <section class="panel"><h2>Latest check-in</h2><div class="checkin"><div class="small muted">Week ${P.week}. ${esc(P.intern.split(' ')[0])} feels: <b>${MOODS[P.checkin.mood - 1]}</b></div><p>${esc(P.checkin.text)}</p>
        ${P.reply ? `<div class="reply"><b>Your reply</b><p>${esc(P.reply)}</p></div>` : `<form data-form="ereply"><label for="er">Reply to ${esc(P.intern.split(' ')[0])}</label><textarea id="er" name="t" placeholder="Thanks for the update. Let's book 30 minutes with our designer on Thursday to go through your CSS."></textarea><button class="btn btn-primary" style="margin-top:10px">Send reply</button></form>`}</div></section>
      <section class="panel"><h2>End-of-placement reference</h2>${P.reference ? `<div class="okbox">${icon('check')}<div><b>Reference sent.</b> ${esc(P.intern.split(' ')[0])} will see it with her certificate after week 6.</div></div>` : `<p class="small muted">Write it now and it is released after week 6. It appears on ${esc(P.intern.split(' ')[0])}'s Talent Hive profile.</p>
        <form data-form="reference">${['Reliability','Communication','Quality of work','Learning and initiative'].map((s, k) => `<fieldset class="seg rating"><legend>${s}</legend>${['Developing','Good','Very good','Excellent'].map((l, i) => `<label><input type="radio" name="r${k}" value="${i}" ${i === 2 ? 'checked' : ''}><span>${l}</span></label>`).join('')}</fieldset>`).join('')}
        <label class="check" style="margin-bottom:14px"><input type="checkbox" name="hire" checked> We would hire ${esc(P.intern.split(' ')[0])} again</label>
        <div class="field"><label for="refc">Comments</label><textarea id="refc" name="c">Ella picked up our front-end stack quickly and her search filter work is now live for a client.</textarea></div><button class="btn btn-primary">Save reference</button></form>`}</section>
    </div>
    <section class="panel"><h2>Hours to approve</h2><table class="table"><thead><tr><th>Week</th><th class="num">Hours</th><th><span class="sr-only">Action</span></th></tr></thead><tbody>${P.hours.map((h, i) => `<tr><td>Week ${h.wk}</td><td class="num">${h.h}</td><td>${h.ok ? status('approved','Approved') : `<button class="btn btn-primary btn-sm" data-act="approvehrs" data-i="${i}">Approve</button>`}</td></tr>`).join('')}</tbody></table>
      <p class="small muted" style="margin:10px 0 0">Approved hours go to your payroll export at the end of each week.</p></section>
  </div>`;
}
ACT.approvehrs = el => { S.empPlacement.hours[+el.dataset.i].ok = true; toast('Hours approved'); render({keepScroll:true}); };
FORM.ereply = f => { const t = f.t.value.trim() || f.t.placeholder; S.empPlacement.reply = t; toast('Reply sent'); render({keepScroll:true}); };
FORM.reference = f => { S.empPlacement.reference = {hire:f.hire.checked, c:f.c.value}; toast('Reference saved'); confetti(); render({keepScroll:true}); };
