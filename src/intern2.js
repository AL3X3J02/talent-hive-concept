/* ---------- Region map (simplified) ---------- */
const TOWNS = {
  'Peterborough':[52.5695,-0.2405],'Wisbech':[52.666,0.159],'March':[52.551,0.088],'Huntingdon':[52.331,-0.186],
  'St Ives':[52.333,-0.075],'St Neots':[52.229,-0.27],'Ely':[52.399,0.262],'Cambridge':[52.205,0.1218],
  'Northstowe':[52.283,0.045],'Alconbury Weald':[52.372,-0.236]
};
const OUTLINE = [[52.66,-0.42],[52.70,-0.22],[52.69,-0.02],[52.74,0.10],[52.75,0.18],[52.70,0.27],[52.56,0.31],[52.50,0.44],[52.42,0.52],[52.30,0.48],[52.22,0.43],[52.12,0.34],[52.05,0.15],[52.08,-0.05],[52.15,-0.19],[52.20,-0.33],[52.32,-0.46],[52.45,-0.41],[52.55,-0.48]];
const LABEL_POS = {'Peterborough':['l',0],'March':['r',0],'Wisbech':['l',0],'Ely':['r',0],'Huntingdon':['l',8],'St Ives':['r',-10],'Alconbury Weald':['l',-6],'St Neots':['l',0],'Northstowe':['r',0],'Cambridge':['r',0]};
const RIVERS = [
  [[52.21,-0.30],[52.23,-0.27],[52.30,-0.22],[52.33,-0.18],[52.33,-0.07],[52.34,0.04],[52.38,0.20],[52.40,0.26],[52.47,0.30],[52.56,0.34],[52.62,0.38]],
  [[52.55,-0.42],[52.57,-0.24],[52.59,-0.10],[52.62,0.05],[52.66,0.16],[52.73,0.19]],
  [[52.17,0.08],[52.21,0.13],[52.27,0.19],[52.33,0.22],[52.36,0.24]]
];
function regionMap({counts, unit, act, title}){
  const W = 560, H = 620, pad = 30;
  const lats = OUTLINE.map(p => p[0]), lons = OUTLINE.map(p => p[1]);
  const la0 = Math.min(...lats), la1 = Math.max(...lats), lo0 = Math.min(...lons), lo1 = Math.max(...lons);
  const k = Math.cos(52.4 * Math.PI / 180);
  const sx = (W - pad * 2) / ((lo1 - lo0) * k), sy = (H - pad * 2) / (la1 - la0), s = Math.min(sx, sy);
  const offX = (W - (lo1 - lo0) * k * s) / 2, offY = (H - (la1 - la0) * s) / 2;
  const P = ([la, lo]) => [offX + (lo - lo0) * k * s, offY + (la1 - la) * s];
  const path = pts => pts.map((p, i) => (i ? 'L' : 'M') + P(p).map(v => v.toFixed(1)).join(' ')).join('');
  const max = Math.max(1, ...Object.values(counts));
  const towns = Object.entries(TOWNS).map(([n, ll]) => { const [x, y] = P(ll); const c = counts[n] || 0; const r = c ? 10 + 18 * Math.sqrt(c / max) : 4; const L = LABEL_POS[n] || ['r', 0]; const right = L[0] === 'r'; const dy = L[1];
    return c ? `<g class="town" role="button" tabindex="0" data-act="${act}" data-area="${n}" aria-label="${n}: ${c} ${unit}${c === 1 ? '' : 's'}"><circle cx="${x}" cy="${y}" r="${r + 6}" fill="transparent"/><circle class="bub" cx="${x}" cy="${y}" r="${r}"/><text class="cnt" x="${x}" y="${y + 4}" text-anchor="middle">${c}</text><text class="lbl" x="${right ? x + r + 6 : x - r - 6}" y="${y + 4 + dy}" text-anchor="${right ? 'start' : 'end'}">${n}</text></g>`
      : `<g class="town empty" aria-hidden="true"><circle cx="${x}" cy="${y}" r="3.5"/><text class="lbl" x="${right ? x + 8 : x - 8}" y="${y + 4 + dy}" text-anchor="${right ? 'start' : 'end'}">${n}</text></g>`; }).join('');
  return `<figure class="regionmap"><svg viewBox="0 0 ${W} ${H}" role="group" aria-label="${esc(title)}">
    <path class="land" d="${path(OUTLINE)}Z"/>
    ${RIVERS.map(r => `<path class="river" d="${path(r)}"/>`).join('')}
    ${towns}
  </svg><figcaption class="small muted">Simplified map. Circle size shows the number of ${unit}s in each town.</figcaption></figure>`;
}
document.addEventListener('keydown', e => {
  const g = e.target.closest && e.target.closest('[role=button][data-act]');
  if (g && g.tagName !== 'BUTTON' && (e.key === 'Enter' || e.key === ' ')){ e.preventDefault(); g.dispatchEvent(new MouseEvent('click', {bubbles:true})); }
});
ACT.maparea = el => { S.filters.area = el.dataset.area; S.mapView = false; render({keepScroll:true}); toast(`Showing roles in ${el.dataset.area}`); };
ACT.view = el => { S.mapView = el.dataset.v === 'map'; refreshResults(); };
function jobsMap(){
  const counts = {}; filteredJobs().forEach(j => counts[j.area] = (counts[j.area] || 0) + 1);
  return regionMap({counts, unit:'role', act:'maparea', title:'Open roles by town'});
}

/* ---------- Compare jobs ---------- */
INPUT.cmp = el => {
  const id = el.dataset.id;
  if (!el.checked) S.compare.delete(id);
  else { if (S.compare.size >= 3){ toast('You can compare up to 3 roles'); el.checked = false; return; } S.compare.add(id); }
  updateTray();
};
function updateTray(){
  let t = $('#tray');
  if (!S.compare.size || route().role !== 'intern'){ if (t) t.remove(); return; }
  if (!t){ t = document.createElement('div'); t.id = 'tray'; t.className = 'tray'; document.body.appendChild(t); }
  t.innerHTML = `<span><b>${S.compare.size}</b> ${S.compare.size === 1 ? 'role' : 'roles'} selected</span><span class="tray-names small">${[...S.compare].map(id => esc(job(id).title)).join(', ')}</span><button class="btn btn-quiet btn-sm" data-act="cmp-clear">Clear</button><button class="btn btn-honey btn-sm" data-act="cmp-open" ${S.compare.size < 2 ? 'disabled' : ''}>Compare</button>`;
}
AFTER.push(updateTray);
ACT['cmp-clear'] = () => { S.compare.clear(); updateTray(); $$('[data-act=cmp]').forEach(c => c.checked = false); };
ACT['cmp-open'] = () => {
  const js = [...S.compare].map(job);
  const best = (f, hi = true) => { const v = js.map(f); const b = hi ? Math.max(...v) : Math.min(...v); return v.map(x => x === b); };
  const pb = best(j => j.pay), mb = best(j => matchScore(j)), cb = best(j => d(j.closes), false);
  const row = (label, cells, flags) => `<tr><th scope="row">${label}</th>${cells.map((c, i) => `<td class="${flags && flags[i] ? 'best' : ''}">${c}${flags && flags[i] ? ' <span class="sr-only">(best)</span>' : ''}</td>`).join('')}</tr>`;
  openModal(`<header><h2>Compare roles</h2><button class="icon-btn" data-act="close" aria-label="Close">${icon('x')}</button></header>
    <div class="table-wrap"><table class="table cmp"><thead><tr><th><span class="sr-only">Detail</span></th>${js.map(j => `<th scope="col">${logo(emp(j.emp))}<div style="margin-top:8px;color:var(--ink)">${esc(j.title)}</div><div class="small muted" style="font-weight:400">${esc(emp(j.emp).name)}</div></th>`).join('')}</tr></thead><tbody>
      ${row('Match with your CV', js.map(j => matchScore(j) + '%'), mb)}
      ${row('Pay', js.map(j => money(j.pay) + ' an hour'), pb)}
      ${row('About a week', js.map(j => weekly(j)))}
      ${row('Hours', js.map(j => j.hours + ' a week'))}
      ${row('Where', js.map(j => esc(j.area) + ', ' + j.mode.toLowerCase()))}
      ${row('Closes', js.map(j => fmt(j.closes)), cb)}
      ${row('Starts', js.map(j => fmt(j.starts)))}
      ${row('Skills', js.map(j => j.skills.map(esc).join(', ')))}
      <tr><th></th>${js.map(j => `<td><a class="btn btn-primary btn-sm" href="#/intern/jobs/${j.id}" data-act="close-go">View role</a></td>`).join('')}</tr>
    </tbody></table></div><p class="small muted">Highlighted cells are the best of the roles you picked.</p>`, {label:'Compare roles'});
  $('#modal-root .modal').style.width = 'min(900px,100%)';
};
ACT['close-go'] = el => { closeModal(); go(el.getAttribute('href')); };

/* ---------- Interview booking and calendar ---------- */
const fmtSlot = iso => { const x = new Date(iso); return `${DAYS_L[x.getDay()]} ${x.getDate()} ${MONTHS_L[x.getMonth()]}, ${String(x.getHours()).padStart(2,'0')}:${String(x.getMinutes()).padStart(2,'0')}`; };
ACT.pickslot = el => {
  const a = S.apps.find(x => x.id === el.dataset.id); const iso = el.dataset.slot;
  a.when = iso; a.interview = `${fmtSlot(iso)}. ${a.where || 'Video call'}`; a.slots = null;
  notify('employer', `${intern(a.intern).name} booked an interview for ${fmtSlot(iso)}`, '#/employer/pipeline/' + a.job);
  toast('Interview booked. We have told the employer.'); render({keepScroll:true});
};
ACT.ics = el => {
  const a = S.apps.find(x => x.id === el.dataset.id); const j = job(a.job), e = emp(j.emp);
  const st = new Date(a.when), en = new Date(st.getTime() + 45 * 60000);
  const f = x => `${x.getFullYear()}${String(x.getMonth() + 1).padStart(2,'0')}${String(x.getDate()).padStart(2,'0')}T${String(x.getHours()).padStart(2,'0')}${String(x.getMinutes()).padStart(2,'0')}00`;
  const ics = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Talent Hive demo//EN','BEGIN:VEVENT',`UID:${a.id}@talenthive.demo`,`DTSTAMP:${f(new Date())}`,`DTSTART:${f(st)}`,`DTEND:${f(en)}`,`SUMMARY:Interview: ${j.title} at ${e.name}`,`LOCATION:${a.where || e.name + ', ' + e.town}`,'DESCRIPTION:Booked through the Talent Hive demo.','END:VEVENT','END:VCALENDAR'].join('\r\n');
  const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([ics], {type:'text/calendar'})); link.download = 'interview.ics'; document.body.appendChild(link); link.click(); link.remove();
  toast('Calendar file downloaded');
};
function interviewBlock(a){
  if (a.status !== 'interview') return '';
  if (a.slots && a.slots.length) return `<div class="slotbox"><b>Choose a time for your interview</b><p class="small muted" style="margin:2px 0 10px">${esc(a.where || 'Video call')}. About 45 minutes.</p><div class="chips">${a.slots.map(s => `<button class="btn btn-ghost btn-sm" data-act="pickslot" data-id="${a.id}" data-slot="${s}">${fmtSlot(s)}</button>`).join('')}</div></div>`;
  return `<div class="slotbox ok"><div><b>Interview booked</b><div>${esc(a.interview || 'The employer will confirm a time')}</div></div>${a.when ? `<button class="btn btn-ghost btn-sm" data-act="ics" data-id="${a.id}">${icon('calendar')}Add to calendar</button>` : ''}</div>`;
}

/* ---------- Sign up ---------- */
const OUTWARD = {CB1:'Cambridge',CB2:'Cambridge',CB3:'Cambridge',CB4:'Cambridge',CB5:'Cambridge',CB6:'Ely',CB7:'Ely',CB21:'South Cambridgeshire',CB22:'South Cambridgeshire',CB23:'South Cambridgeshire',CB24:'South Cambridgeshire',CB25:'East Cambridgeshire',
  PE1:'Peterborough',PE2:'Peterborough',PE3:'Peterborough',PE4:'Peterborough',PE6:'Peterborough',PE7:'Peterborough',PE13:'Wisbech',PE14:'Wisbech',PE15:'March',PE16:'Chatteris',PE19:'St Neots',PE26:'Ramsey',PE27:'St Ives',PE28:'Huntingdonshire',PE29:'Huntingdon'};
function joinView(){
  S.join = S.join || {step:0, pc:'', area:'', name:'', email:'', sectors:new Set(), when:'From January 2027'};
  const J = S.join;
  const steps = ['Check your area','About you','All done'];
  const body = [
    () => `<h2>Do you live in Cambridgeshire or Peterborough?</h2><p class="muted">Talent Hive placements are for people who live in the area. Enter your postcode to check.</p>
      <form data-form="pc" class="row" style="flex-direction:row;gap:8px;max-width:420px"><label class="sr-only" for="pc">Postcode</label><input id="pc" name="pc" type="text" autocomplete="postal-code" value="${esc(J.pc)}" placeholder="For example PE29 3TN" aria-describedby="pc-msg"><button class="btn btn-primary" style="flex:none">Check</button></form>
      <div id="pc-msg" role="status" style="margin-top:14px">${J.area ? `<div class="okbox">${icon('check')}<div><b>${esc(J.pc.toUpperCase())} is in ${esc(J.area)}.</b> You are in the area, so you can join.</div></div><button class="btn btn-primary" style="margin-top:14px" data-act="join-next">Continue</button>` : J.out ? `<div class="warnbox">${icon('alert')}<div><b>That postcode looks like it is outside Cambridgeshire and Peterborough.</b> The programme is for people who live in the area, but you can still <a href="#/jobs">browse roles</a>.</div></div>` : ''}</div>
      <p class="small muted" style="margin-top:18px">Demo check based on the first part of your postcode. In the full site, the CPCA team confirms the rest of the eligibility criteria with you.</p>`,
    () => `<h2>Tell us a little about you</h2><form data-form="join-about" novalidate>
      <div class="row"><div class="field"><label for="jn">Full name</label><input id="jn" name="name" type="text" autocomplete="name" value="${esc(J.name)}"><div class="err" id="jn-err" hidden>Enter your name</div></div><div class="field"><label for="je">Email</label><input id="je" name="email" type="email" autocomplete="email" value="${esc(J.email)}"><div class="err" id="je-err" hidden>Enter an email address, like name@example.com</div></div></div>
      <fieldset class="field" style="border:0;padding:0;margin:0 0 18px"><legend style="font-weight:700;margin-bottom:8px">What kind of work interests you? <span class="hint">Pick any</span></legend><div class="pickgrid">${SECTORS.map(s => `<label class="pick"><input type="checkbox" name="sec" value="${s.id}" ${J.sectors.has(s.id) ? 'checked' : ''}><span>${s.name}</span></label>`).join('')}</div></fieldset>
      <div class="field"><label for="jw">When could you start?</label><select id="jw" name="when">${['Now','From January 2027','From February 2027','Later in 2027'].map(o => `<option ${J.when === o ? 'selected' : ''}>${o}</option>`).join('')}</select></div>
      <div style="display:flex;justify-content:space-between;gap:10px"><button type="button" class="btn btn-ghost" data-act="join-back">Back</button><button class="btn btn-primary">Create my account</button></div></form>`,
    () => `<div class="done-hero">${icon('check')}</div><h2>Welcome to Talent Hive, ${esc(J.name.split(' ')[0])}</h2><p>Your account is ready. The CPCA team will confirm your eligibility within two working days. Meanwhile you can build your CV and save roles.</p>
      <ol class="nextlist"><li><b>Build your CV.</b> It takes about 15 minutes with the guided builder.</li><li><b>Earn your first badges.</b> They show employers you are ready.</li><li><b>Book a Profile Power Up session.</b> Free, online, once a month.</li></ol>
      <button class="btn btn-primary btn-lg" data-act="role" data-role="intern">Go to your dashboard</button><p class="small muted" style="margin-top:10px">In the demo this opens Jordan's account, which already has applications in progress.</p>`
  ];
  return `<main id="main" class="section" style="max-width:760px"><h1>Join Talent Hive</h1>
    <ol class="stepper">${steps.map((s, i) => `<li class="${i < J.step ? 'done' : i === J.step ? 'now' : ''}" ${i === J.step ? 'aria-current="step"' : ''}>Step ${i + 1}<br>${s}</li>`).join('')}</ol>
    <div class="panel">${body[J.step]()}</div></main>`;
}
FORM.pc = f => {
  const J = S.join; J.pc = f.pc.value.trim();
  const out = J.pc.toUpperCase().replace(/\s+/g, ' ').split(' ')[0].replace(/[^A-Z0-9]/g, '');
  J.area = OUTWARD[out] || ''; J.out = !J.area && !!out;
  if (!out){ J.out = false; }
  render({keepScroll:true, keepFocus:true});
  const b = $('[data-act=join-next]'); if (b) b.focus(); else $('#pc').focus();
};
ACT['join-next'] = () => { S.join.step = 1; render(); };
ACT['join-back'] = () => { S.join.step = 0; render(); };
FORM['join-about'] = f => {
  const J = S.join; J.name = f.name.value.trim(); J.email = f.email.value.trim(); J.when = f.when.value;
  J.sectors = new Set($$('input[name=sec]:checked', f).map(x => x.value));
  const badN = !J.name, badE = !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(J.email);
  $('#jn-err').hidden = !badN; $('#je-err').hidden = !badE;
  if (badN){ $('#jn').focus(); return; } if (badE){ $('#je').focus(); return; }
  S.signups.unshift({id:uid('s'), name:J.name, postcode:J.pc.toUpperCase().split(' ')[0], area:J.area, joined:todayISO(), docs:'Waiting for right to work check'});
  notify('cpca', `${J.name} joined and is waiting for an eligibility check`, '#/cpca/approvals');
  J.step = 2; render(); confetti();
};

/* ---------- Placement tracker ---------- */
const MOODS = ['Struggling','Not great','OK','Good','Great'];
function ring(pct, label){
  const r = 34, c = 2 * Math.PI * r;
  return `<svg class="ring" viewBox="0 0 84 84" aria-hidden="true"><circle cx="42" cy="42" r="${r}" class="ring-bg"/><circle cx="42" cy="42" r="${r}" class="ring-fg" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - pct)}"/><text x="42" y="40" text-anchor="middle" class="ring-n">${label}</text><text x="42" y="55" text-anchor="middle" class="ring-s">of 6</text></svg>`;
}
function placementView(){
  const placed = myApps().find(a => a.status === 'placed');
  const P = S.myPlacement;
  const pre = placed ? (() => { const j = job(placed.job), e = emp(j.emp); return `<section class="panel placement-hero" style="margin-bottom:20px"><div class="ph-top">${logo(e,'lg')}<div><h2 style="margin:0">${esc(j.title)}</h2><div class="muted">${esc(e.name)}. Starts ${fmtLong(j.starts)}</div></div><span class="status st-placed">Placement confirmed</span></div>
    <h3 style="margin-top:18px">Before you start</h3><ul class="checklist">${[['Accept your offer',true],['Upload your right to work documents',false],['Add your bank details for pay, through the secure form',false],['Book your induction call with the CPCA team',false],['Read the welcome pack',false]].map(([t, ok]) => `<li class="${ok ? 'ok' : ''}">${icon(ok ? 'check' : 'target')}<span>${t}</span></li>`).join('')}</ul></section>
    <h2 style="font-size:1.15rem">Preview: what your placement page looks like in week 4</h2>`; })() : `<div class="infobar">${icon('eye')}<span>You have not started a placement yet, so this is a preview of how this page works during one.</span></div>`;
  const total = P.hours.reduce((s, x) => s + x.h, 0);
  return `<div class="pagehead"><div><h1>My placement</h1><p>Your six weeks in one place: goals, hours, check-ins and feedback.</p></div></div>${pre}
  <section class="panel placement-hero"><div class="ph-top">${ring(P.week / 6, 'Wk ' + P.week)}<div style="flex:1;min-width:0"><h2 style="margin:0">Front-end Intern at Fenlight Digital</h2><div class="muted">Mentor: Sam Hughes. 26 October to 4 December</div>
      <div class="weeks" aria-label="Week ${P.week} of 6">${[1,2,3,4,5,6].map(w => `<span class="${w < P.week ? 'done' : w === P.week ? 'now' : ''}">Week ${w}</span>`).join('')}</div></div>
      <div class="ph-stat"><b data-count="${total}">${total}</b><span class="small muted">hours logged</span></div></div></section>
  <div class="grid-main" style="margin-top:20px">
    <div class="stack">
      <section class="panel"><h2>This week's goals</h2><ul class="goals">${P.goals.map((g, i) => `<li><label class="check"><input type="checkbox" data-change="goal" data-i="${i}" ${g.done ? 'checked' : ''}><span class="${g.done ? 'done' : ''}">${esc(g.t)}</span></label></li>`).join('')}</ul>
        <form data-form="goal" class="row" style="flex-direction:row;gap:8px;margin-top:10px"><label class="sr-only" for="ng">Add a goal</label><input id="ng" name="g" type="text" placeholder="Add a goal for this week"><button class="btn btn-ghost" style="flex:none">Add</button></form></section>
      <section class="panel"><h2>Weekly check-in</h2><p class="small muted">Your mentor and the CPCA team see this. It takes two minutes.</p>
        <form data-form="checkin"><fieldset class="seg moods"><legend>How is it going this week?</legend>${MOODS.map((m, i) => `<label><input type="radio" name="mood" value="${i + 1}" ${i === 3 ? 'checked' : ''}><span>${m}</span></label>`).join('')}</fieldset>
        <div class="field"><label for="refl">What went well, and what would help?</label><textarea id="refl" name="t" placeholder="For example: I fixed my first bug on a live site. I would like more time with the designer."></textarea></div><button class="btn btn-primary">Send check-in</button></form></section>
      <section class="panel"><h2>Check-ins and feedback</h2>${P.checkins.slice().reverse().map(c => `<div class="checkin"><div class="small muted">Week ${c.wk}. You felt: <b>${MOODS[c.mood - 1]}</b></div><p>${esc(c.text)}</p>${c.reply ? `<div class="reply"><b>Sam Hughes, mentor</b><p>${esc(c.reply)}</p></div>` : '<p class="small muted">Waiting for your mentor to reply.</p>'}</div>`).join('')}</section>
    </div>
    <div class="stack">
      <section class="panel"><h2>Hours</h2><table class="table"><thead><tr><th>Week</th><th class="num">Hours</th><th>Status</th></tr></thead><tbody>${P.hours.map(h => `<tr><td>Week ${h.wk}</td><td class="num">${h.h}</td><td>${h.ok ? status('approved','Approved') : status('pending','Waiting')}</td></tr>`).join('')}</tbody></table>
        <form data-form="hours" class="row" style="flex-direction:row;gap:8px;margin-top:12px;align-items:flex-end"><div style="flex:1"><label for="hh" class="small">Add hours for week ${P.week}</label><input id="hh" name="h" type="number" min="1" max="10" value="6"></div><button class="btn btn-ghost" style="flex:none">Log hours</button></form>
        <p class="small muted" style="margin:10px 0 0">Approved hours are paid by your employer at ${money(13.5)} an hour.</p></section>
      <section class="panel cert"><div class="cert-ico">${icon('graduation')}</div><h2>Completion certificate</h2><p class="small">Unlocks after week 6, with your employer's reference and the Experience of Work badge.</p><div class="meter honey"><i style="width:${Math.round(P.week / 6 * 100)}%"></i></div><p class="small muted" style="margin:6px 0 0">${6 - P.week} weeks to go</p></section>
    </div>
  </div>`;
}
INPUT.goal = el => { S.myPlacement.goals[+el.dataset.i].done = el.checked; el.nextElementSibling.classList.toggle('done', el.checked); if (S.myPlacement.goals.every(g => g.done)){ toast('All goals done this week'); confetti(); } };
FORM.goal = f => { const v = f.g.value.trim(); if (!v) return; S.myPlacement.goals.push({t:v, done:false}); render({keepScroll:true, keepFocus:true}); $('#ng').focus(); };
FORM.hours = f => { const h = +f.h.value; if (!h) return; const P = S.myPlacement; const w = P.hours.find(x => x.wk === P.week); w.h = Math.min(37.5, w.h + h); toast(`${h} hours logged for week ${P.week}`); render({keepScroll:true, keepFocus:true}); };
FORM.checkin = f => { const t = f.t.value.trim(); if (!t){ f.t.focus(); return; } S.myPlacement.checkins.push({wk:S.myPlacement.week, mood:+f.mood.value, text:t, reply:''}); notify('employer', 'Ella Brooks submitted a check-in', '#/employer/placements'); toast('Check-in sent to your mentor'); render({keepScroll:true}); };

/* ---------- Boost: levels and leaderboard ---------- */
function boostExtras(){
  const pts = S.boost.points, lvl = Math.floor(pts / 100) + 1, into = pts % 100;
  const board = [{n:'Priyanka N',p:340,s:12},{n:'Ben O',p:295,s:9},{n:'Amira H',p:250,s:7},{n:'Callum R',p:210,s:6},{n:'You',p:pts,s:S.boost.streak,me:true},{n:'Sofia M',p:140,s:3},{n:'Tariq A',p:95,s:2},{n:'Lucy T',p:60,s:1}].sort((a, b) => b.p - a.p);
  const ach = [['First game played',true],['3 games in one day',Object.values(S.boost.played).every(Boolean)],['5-day streak',S.boost.streak >= 5],['Perfect quiz',S.quiz && S.quiz.done && S.quiz.score === 5],['Wordle in 3 or fewer',S.wordle && S.wordle.won && S.wordle.guesses.length <= 3],['7-day streak',S.boost.streak >= 7]];
  return `<div class="grid-2" style="margin-top:20px">
    <section class="panel"><div class="section-head" style="margin-bottom:10px"><h2 style="margin:0">Level ${lvl}</h2><span class="small muted">${100 - into} points to level ${lvl + 1}</span></div><div class="meter honey"><i style="width:${into}%"></i></div>
      <h3 style="margin-top:20px;font-size:1rem">Achievements</h3><ul class="achv">${ach.map(([t, ok]) => `<li class="${ok ? 'got' : ''}"><span class="ach-ico">${icon(ok ? 'trophy' : 'target')}</span>${t}<span class="sr-only">${ok ? ', earned' : ', not yet earned'}</span></li>`).join('')}</ul></section>
    <section class="panel"><div class="section-head" style="margin-bottom:6px"><h2 style="margin:0">This week's leaderboard</h2><span class="small muted">Winter 2026 cohort</span></div>
      <ol class="board">${board.map((b, i) => `<li class="${b.me ? 'me' : ''}"><span class="pos">${i + 1}</span><span class="nm">${b.me ? '<b>You</b>' : esc(b.n)}</span><span class="small muted">${b.s} day streak</span><span class="pts">${b.p}</span></li>`).join('')}</ol>
      <p class="small muted" style="margin:10px 0 0">Shows first names only. You can hide yourself from the leaderboard in settings.</p></section>
  </div>`;
}

/* ---------- Company pages ---------- */
const REVIEWS = {
  e1:[{n:'Former Junior Developer Intern, summer 2026',r:5,t:'I shipped real code in week two. The team explained everything and I was offered a part-time role at the end.'},{n:'Former Content Design Intern, spring 2026',r:4,t:'Friendly studio and proper mentoring. Hybrid working took a week to get used to.'}],
  e2:[{n:'Former Data Intern, summer 2026',r:5,t:'Great mix of analysis and talking to tenants. My findings went to the board.'}],
  e3:[{n:'Former Social Media Intern, autumn 2026',r:4,t:'Fast-paced. I built a portfolio of 40 posts in six weeks.'}],
  e4:[{n:'Former Lab Intern, spring 2026',r:5,t:'Strict on safety, which I liked. Lots to learn about how a real lab runs.'}]
};
const stars = r => `<span class="stars" aria-label="${r} out of 5">${[1,2,3,4,5].map(i => `<span class="${i <= r ? 'on' : ''}">${icon('star')}</span>`).join('')}</span>`;
function companyView(id, base){
  const e = emp(id); if (!e) return '<h1>Employer not found</h1>';
  const roles = liveJobs().filter(j => j.emp === id); const rv = REVIEWS[id] || [];
  const avg = rv.length ? (rv.reduce((s, x) => s + x.r, 0) / rv.length).toFixed(1) : null;
  return `<a class="back" href="${base}">${icon('left')}Back to roles</a>
  <section class="company-hero" style="--c:${e.color}">${logo(e,'lg')}<div><h1>${esc(e.name)}</h1><div class="chips"><span class="chip">${icon('briefcase')}${esc(sectorName(e.sector))}</span><span class="chip">${icon('pin')}${esc(e.town)}</span><span class="chip">${icon('users')}${esc(e.size)}</span>${e.verified ? `<span class="chip">${icon('shield')}Checked by CPCA</span>` : ''}</div></div></section>
  <div class="grid-main">
    <div class="stack"><section class="panel"><h2>About</h2><p style="margin:0">${esc(e.about)}</p></section>
      <section class="panel"><h2>Open roles (${roles.length})</h2>${roles.length ? `<div class="joblist">${roles.map(j => jobRow(j, {base:base, showMatch:base.startsWith('#/intern')})).join('')}</div>` : '<p class="muted">No open roles right now. Save this employer to hear when they post.</p>'}</section></div>
    <aside class="stack"><section class="panel"><h2>What past interns say</h2>${avg ? `<p style="display:flex;align-items:center;gap:8px"><b style="font-size:1.6rem;font-family:var(--display)">${avg}</b>${stars(Math.round(avg))}<span class="small muted">${rv.length} ${rv.length === 1 ? 'review' : 'reviews'}</span></p>${rv.map(x => `<blockquote class="review">${stars(x.r)}<p>${esc(x.t)}</p><footer class="small muted">${esc(x.n)}</footer></blockquote>`).join('')}` : '<p class="muted">No reviews yet. Interns can leave a review after their placement.</p>'}</section></aside>
  </div>`;
}
