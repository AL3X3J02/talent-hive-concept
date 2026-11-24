/* ---------- Public site ---------- */
function pubHeader(current, onBlue){
  const nav = [['#/jobs','Find a role','jobs'],['#/employers','For employers','employers'],['#/events','Events','events']];
  return `<header class="pub-header ${onBlue ? 'on-blue' : ''}"><div class="inner">${brand('#/')}
    <nav class="pub-nav" aria-label="Main">${nav.map(([h,l,id]) => `<a href="${h}" ${current === id ? 'aria-current="page"' : ''}>${l}</a>`).join('')}</nav>
    <div class="actions"><a class="btn btn-ghost btn-sm" href="#/signin">Sign in</a><a class="btn btn-primary btn-sm" href="#/join">Join Talent Hive</a></div>
  </div></header>`;
}
function pubFooter(){
  return `<footer class="pub-footer"><div class="section">
    <div class="fgrid"><div><b style="color:var(--ink)">Talent Hive demo, designed and built by Alexej Zhukov</b><br>Sample data only. Not an official Cambridgeshire and Peterborough Combined Authority website.</div>
    <div style="display:flex;gap:18px"><a href="#/jobs">Find a role</a><a href="#/employers">For employers</a><a href="#/join">Join</a><a href="#/signin">Sign in</a></div></div>
    <div class="huge" aria-hidden="true">Talent Hive</div>
  </div></footer>`;
}
function renderPublic(r){
  const p = r.parts;
  let body = '', cur = '';
  if (!p[0]) body = pubHome();
  else if (p[0] === 'jobs' && p[1]) { body = `<main id="main" class="section">${jobDetail(job(p[1]), '#/jobs')}</main>`; cur = 'jobs'; }
  else if (p[0] === 'jobs') { body = `<main id="main" class="section">${jobsBoard('#/jobs')}</main>`; cur = 'jobs'; }
  else if (p[0] === 'employers') { body = pubEmployers(); cur = 'employers'; }
  else if (p[0] === 'signin') body = pubSignin();
  else if (p[0] === 'join') body = joinView();
  else if (p[0] === 'company') { body = `<main id="main" class="section">${companyView(p[1], '#/jobs')}</main>`; cur = 'jobs'; }
  else if (p[0] === 'events') { body = `<main id="main" class="section"><div class="pagehead"><div><h1>Events</h1><p>Free sessions to help you get ready and meet employers.</p></div></div><div class="panel">${S.events.map(eventItem).join('')}</div></main>`; cur = 'events'; }
  else body = `<main id="main" class="section"><h1>Page not found</h1><p>The page you tried to open does not exist. Try the <a href="#/jobs">jobs board</a> or go back to the <a href="#/">home page</a>.</p></main>`;
  return `<a class="skip" href="#main">Skip to content</a>${pubHeader(cur, !p[0])}${body}${pubFooter()}`;
}

const SECTOR_ICON = {digital:'code', marketing:'megaphone', business:'chart', science:'flask', engineering:'cog', education:'graduation', health:'heart', construction:'hardhat', charity:'heart', facilities:'wrench'};
function sectorsGrid(){
  const count = id => liveJobs().filter(j => j.sector === id).length;
  const ids = ['digital','marketing','business','science','engineering','education','health','construction'];
  return `<div class="sectors" role="group" aria-label="Browse roles by sector">${ids.map(id => `<button class="sector" data-act="sector" data-id="${id}">${icon(SECTOR_ICON[id])}<span><span class="nm">${esc(sectorName(id))}</span><br><span class="ct">${count(id)} open ${count(id) === 1 ? 'role' : 'roles'}</span></span><span class="arr">${icon('arrowr')}</span></button>`).join('')}</div>`;
}
ACT.sector = el => {
  S.filters.sectors = new Set(el.dataset.id === 'all' ? [] : [el.dataset.id]);
  const base = route().role === 'intern' ? '#/intern/jobs' : '#/jobs';
  go(base);
};

function heroCards(){
  const j = job('j1'), e = emp(j.emp);
  return `<div class="hero-cards" aria-hidden="true">
    <div class="fcard" style="top:6px;left:30px;width:310px;--r:-2deg"><div class="fc-top">${logo(e)}<div><div class="fc-t">${esc(j.title)}</div><div class="fc-s">${esc(e.name)}, ${esc(j.area)}</div></div></div>
      <div class="chips" style="margin-top:10px"><span class="chip">${money(j.pay)} an hour</span><span class="chip">${esc(j.mode)}</span><span class="match">${matchScore(j)}% match</span></div></div>
    <div class="fcard" style="top:142px;right:0;width:270px;--r:2.5deg"><div class="fc-top">${avatar({name:'Jordan Ellis'})}<div><div class="fc-t">Jordan Ellis</div><div class="fc-s">Application update. Just now</div></div></div>
      <div style="margin-top:10px;display:flex;justify-content:space-between;align-items:center;gap:8px"><span class="small">Junior Web Developer</span>${status('shortlisted')}</div></div>
    <div class="fcard pinkpill" style="top:276px;left:0;--r:-3deg"><span class="cal">3<br><small style="font-weight:500;font-size:.6rem">DEC</small></span><div><div class="fc-t">Interview booked</div><div class="fc-s" style="color:#5b1d52">Ouse Valley Housing, 10:30</div></div></div>
    <div class="fcard stat" style="bottom:4px;right:28px;width:240px;--r:1.5deg"><div class="fc-s">Placements this cohort</div><div class="big">59</div><div class="hbar"><i style="width:68%"></i></div><div class="fc-s" style="margin-top:6px">68% of the cohort target</div></div>
  </div>`;
}
function marquee(){
  const styles = ['', 'serif', 'thin', 'round', '', 'thin', 'serif', 'round'];
  const names = Object.values(S.employers).filter(e => e.verified).map((e, i) => `<span class="wordmark ${styles[i % styles.length]}"><i style="background:${e.color};opacity:.55"></i>${esc(e.name)}</span>`).join('');
  return `<section class="marquee" aria-label="Employers offering placements"><div class="lbl">Employers offering placements this cohort</div><div class="track">${names}${names.replace(/<span class="wordmark/g, '<span aria-hidden="true" class="wordmark')}</div></section>`;
}
function pubHome(){
  const live = liveJobs();
  const soon = [...live].sort((a,b) => d(a.closes) - d(b.closes));
  const counts = {}; live.forEach(j => counts[j.area] = (counts[j.area] || 0) + 1);
  const words = 'Paid internships, close to home.'.split(' ');
  return `<main id="main">
    <section class="hero" data-hero>
      <div class="frame" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
      <div class="inner">
        <div>
          <div class="kicker"><b>+</b> Cambridgeshire and Peterborough</div>
          <h1 aria-label="Paid internships, close to home.">${words.map((w, i) => `<span class="w" aria-hidden="true" style="animation-delay:${120 + i * 90}ms">${w}</span>`).join(' ')}</h1>
          <p class="lede">Six-week paid placements with local employers. Free to join, with support from your first application to your first day.</p>
          <div class="ctas"><a class="btn btn-primary btn-lg" href="#/jobs">Find a role</a><a class="btn btn-dark btn-lg" href="#/employers">I'm an employer</a></div>
        </div>
        ${heroCards()}
      </div>
      <div class="hero-foot">
        <form class="searchbar" data-form="hero-search" role="search">
          <label class="sr-only" for="hq">Job title or skill</label>
          <input id="hq" name="q" type="search" placeholder="Job title or skill">
          <label class="sr-only" for="ha">Area</label>
          <select id="ha" name="area"><option value="">All areas</option>${AREAS.map(a => `<option>${a}</option>`).join('')}</select>
          <button class="btn btn-primary">${icon('search')}Search ${live.length} roles</button>
        </form>
        <p class="closing">Next to close: <a href="#/jobs/${soon[0].id}">${esc(soon[0].title)}</a>, ${fmt(soon[0].closes)}.</p>
        <div class="hero-sectors" aria-hidden="true"><span>Digital and tech</span><span>Business and finance</span><span>Marketing and media</span><span>Science and engineering</span></div>
      </div>
    </section>
    ${marquee()}

    <section class="section" aria-labelledby="sec-h">
      <div class="split"><div><div class="eyebrow">Sectors</div><h2 class="bigtitle" id="sec-h">Find the kind of work that suits you</h2></div><p>Every role is checked by the CPCA team and pays at least the National Living Wage. Pick a sector to see what is open right now.</p></div>
      ${sectorsGrid()}
    </section>

    <section class="section" aria-labelledby="soon-h" style="padding-top:0">
      <div class="section-head"><div><div class="eyebrow">Closing soon</div><h2 class="bigtitle" id="soon-h" style="font-size:2rem">Apply before these close</h2></div><a class="btn btn-ghost" href="#/jobs">See all ${live.length} roles</a></div>
      <div class="joblist">${soon.slice(0,4).map(j => jobRow(j)).join('')}</div>
    </section>

    <section class="blueband" aria-labelledby="how-h"><div class="section">
      <div class="split"><div><div class="eyebrow">How it works</div><h2 class="bigtitle" id="how-h">From sign-up to your first day</h2></div><p>One place for everything: your profile, your CV, every application and your placement once it starts.</p></div>
      <ol class="steps" style="grid-template-columns:repeat(4,1fr)">
        <li><h3>Join</h3><p class="muted">Check your postcode and create a free account in about five minutes.</p></li>
        <li><h3>Build your CV</h3><p class="muted">A guided builder with a live preview. Your badges show as verified skills.</p></li>
        <li><h3>Apply</h3><p class="muted">Send your CV with a short note, then track it as employers review it.</p></li>
        <li><h3>Start your placement</h3><p class="muted">Log hours, set weekly goals and check in with your mentor.</p></li>
      </ol>
    </div></section>

    <section class="violetband" aria-labelledby="num-h"><div class="section">
      <div class="split"><div><div class="eyebrow">Winter 2026 cohort</div><h2 class="bigtitle" id="num-h">The programme so far</h2></div><p style="color:rgba(255,255,255,.8)">Sample figures for this demo, updated as interns move from sign-up to placement.</p></div>
      <div class="statgrid">${[[527,'','people have joined this cohort',100],[76,'%','completed their profile and CV',76],[288,'','applied for at least one role',55],[59,'','started or confirmed a placement',11]].map(([n,u,t,w]) => `<div class="stat"><div class="n"><span data-count="${n}">${n}</span><small>${u}</small></div><div class="t">${t}</div><div class="hatchbar"><i data-w="${w}"></i></div></div>`).join('')}</div>
    </div></section>

    <section class="section" aria-labelledby="map-h">
      <div class="split" style="align-items:center"><div><div class="eyebrow">Across the region</div><h2 class="bigtitle" id="map-h">Roles from Wisbech to St&nbsp;Neots</h2><p style="margin-top:16px">Placements are spread across Cambridgeshire and Peterborough. Select a town to see its roles.</p></div>
      <div class="panel" style="padding:12px">${regionMap({counts, unit:'role', act:'homearea', title:'Open roles by town'})}</div></div>
    </section>

    <section class="employer-band" aria-labelledby="emp-h"><div class="section">
      <div>
        <div class="eyebrow" style="color:#8E98FF">For employers</div>
        <h2 id="emp-h">Offer a paid placement</h2>
        <p>Post a role in about ten minutes. We check it, share it with local candidates, and you review everyone who applies in one place.</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:24px"><a class="btn btn-honey btn-lg" href="#/employer/post">Post a role</a><a class="btn btn-ghost btn-lg" href="#/employers">How it works for employers</a></div>
      </div>
      <ul>
        <li>${icon('check')}<span>A guided form with a live preview, so your listing has everything candidates ask about</span></li>
        <li>${icon('check')}<span>Every applicant in one pipeline, with their CV, badges and answers</span></li>
        <li>${icon('check')}<span>Offer interview times and candidates book a slot themselves</span></li>
        <li>${icon('check')}<span>Support from the CPCA team from your first post to their first day</span></li>
      </ul>
    </div></section>

    <section class="section" id="events" aria-labelledby="ev-h">
      <div class="section-head"><div><div class="eyebrow">Events</div><h2 class="bigtitle" id="ev-h" style="font-size:2rem">Free sessions to get you ready</h2></div><a class="btn btn-ghost" href="#/events">All events</a></div>
      <div class="panel">${S.events.slice(0,3).map(eventItem).join('')}</div>
    </section>
  </main>`;
}
ACT.homearea = el => { S.filters.area = el.dataset.area; go('#/jobs'); };
AFTER.push(r => {
  const h = $('[data-hero]');
  if (h && !reducedMotion()) h.addEventListener('pointermove', e => { const b = h.getBoundingClientRect(); h.style.setProperty('--mx', (e.clientX - b.left) + 'px'); h.style.setProperty('--my', (e.clientY - b.top) + 'px'); });
  const bars = $$('.hatchbar i[data-w]');
  if (bars.length){
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting){ en.target.style.width = en.target.dataset.w + '%'; io.unobserve(en.target); } }), {threshold:.4});
    bars.forEach(b => io.observe(b));
  }
});
function eventItem(ev){
  const x = d(ev.date);
  const booked = S.booked.has(ev.id);
  const r = route().role;
  return `<div class="listitem"><div class="date hex"><b>${x.getDate()}</b><span>${MONTHS[x.getMonth()]}</span></div>
    <div class="grow"><b>${esc(ev.title)}</b><div class="small muted">${fmtLong(ev.date)}, ${esc(ev.time)}. ${esc(ev.where)}</div></div>
    ${r === 'visitor' ? `<button class="btn btn-ghost btn-sm" data-act="book" data-id="${ev.id}">Book a place</button>` :
      booked ? `<span class="status st-approved">Booked</span>` : `<button class="btn btn-ghost btn-sm" data-act="book" data-id="${ev.id}">Book a place</button>`}
  </div>`;
}
ACT.book = el => {
  if (route().role === 'visitor'){ promptSignIn('book events'); return; }
  S.booked.add(el.dataset.id); toast('Place booked. We have added it to your events.'); render({keepScroll:true, keepFocus:true});
};
FORM['hero-search'] = f => {
  S.filters.q = f.q.value.trim(); S.filters.area = f.area.value;
  go('#/jobs');
};

/* ---------- Jobs board (shared) ---------- */
function filteredJobs(){
  const F = S.filters;
  const q = F.q.toLowerCase();
  let list = liveJobs().filter(j => {
    const e = emp(j.emp);
    if (q && !(j.title + ' ' + e.name + ' ' + j.skills.join(' ') + ' ' + sectorName(j.sector) + ' ' + j.summary).toLowerCase().includes(q)) return false;
    if (F.area && j.area !== F.area) return false;
    if (F.sectors.size && !F.sectors.has(j.sector)) return false;
    if (F.modes.size && !F.modes.has(j.mode)) return false;
    if (F.programme && j.programme !== F.programme) return false;
    if (F.minPay && j.pay < 13) return false;
    return true;
  });
  const sorts = {
    newest:(a,b) => d(b.posted) - d(a.posted),
    closing:(a,b) => d(a.closes) - d(b.closes),
    pay:(a,b) => b.pay - a.pay,
    match:(a,b) => matchScore(b) - matchScore(a)
  };
  return list.sort(sorts[F.sort] || sorts.newest);
}
function jobsBoard(base){
  const F = S.filters;
  const isIntern = base.startsWith('#/intern');
  const used = new Set(liveJobs().map(j => j.sector));
  return `<div class="pagehead"><div><h1>${isIntern ? 'Jobs' : 'Find a role'}</h1><p>Paid placements with checked employers. Every role shows its pay, hours and closing date.</p></div>
    ${isIntern ? `<a class="btn btn-ghost" href="#/intern/jobs/saved">${icon('bookmark')}Saved jobs (${S.saved.size})</a>` : ''}</div>
  <div class="board">
    <aside class="filters" aria-label="Filters">
      <fieldset><legend>Area</legend>
        <label class="sr-only" for="farea">Area</label>
        <select id="farea" data-change="farea"><option value="">All areas</option>${AREAS.map(a => `<option ${F.area === a ? 'selected' : ''}>${a}</option>`).join('')}</select>
      </fieldset>
      <fieldset><legend>Sector</legend>
        ${SECTORS.filter(s => used.has(s.id)).map(s => `<label class="check"><input type="checkbox" data-change="fsector" value="${s.id}" ${F.sectors.has(s.id) ? 'checked' : ''}>${s.name}</label>`).join('')}
      </fieldset>
      <fieldset><legend>Where you work</legend>
        ${['On-site','Hybrid','Remote'].map(m => `<label class="check"><input type="checkbox" data-change="fmode" value="${m}" ${F.modes.has(m) ? 'checked' : ''}>${m}</label>`).join('')}
      </fieldset>
      <fieldset><legend>Type</legend>
        <select aria-label="Programme type" data-change="fprog"><option value="">All types</option>${PROGRAMMES.map(p => `<option ${F.programme === p ? 'selected' : ''}>${p}</option>`).join('')}</select>
      </fieldset>
      <fieldset style="margin:0"><legend>Pay</legend>
        <label class="check"><input type="checkbox" data-change="fpay" ${F.minPay ? 'checked' : ''}>£13 an hour or more</label>
      </fieldset>
    </aside>
    <div>
      <form class="boardsearch" data-form="noop" role="search">
        <label class="sr-only" for="bq">Search roles</label>
        <input id="bq" type="search" value="${esc(F.q)}" placeholder="Search by job title, skill or employer" data-input="jobsq">
      </form>
      <div id="results">${jobResults(base)}</div>
    </div>
  </div>`;
}
function jobResults(base){
  const list = filteredJobs();
  const isIntern = base.startsWith('#/intern');
  const F = S.filters;
  const active = F.q || F.area || F.sectors.size || F.modes.size || F.programme || F.minPay;
  return `<div class="resultbar"><p class="muted" style="margin:0" role="status">${list.length} ${list.length === 1 ? 'role' : 'roles'} found</p>
    <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">${active ? `<button class="btn btn-quiet btn-sm" data-act="clearfilters">Clear filters</button>` : ''}
    <div class="viewtog" role="group" aria-label="Show results as"><button data-act="view" data-v="list" aria-pressed="${!S.mapView}">${icon('list')}List</button><button data-act="view" data-v="map" aria-pressed="${!!S.mapView}">${icon('map')}Map</button></div>
    <label class="sr-only" for="sort">Sort by</label>
    <select id="sort" data-change="fsort">${[['newest','Newest first'],['closing','Closing soonest'],['pay','Highest pay'], ...(isIntern ? [['match','Best match for me']] : [])].map(([v,l]) => `<option value="${v}" ${F.sort === v ? 'selected' : ''}>${l}</option>`).join('')}</select></div></div>
    ${S.mapView ? jobsMap() : list.length ? `<div class="joblist">${list.map(j => jobRow(j, {base, showMatch:isIntern})).join('')}</div>` :
      `<div class="empty"><h3>No roles match those filters</h3><p class="muted">Try removing a filter or searching for a broader word, like "admin" or "digital".</p><button class="btn btn-ghost" data-act="clearfilters">Clear filters</button></div>`}`;
}
function refreshResults(){ const r = $('#results'); if (r){ const base = route().role === 'intern' ? '#/intern/jobs' : '#/jobs'; r.innerHTML = jobResults(base); } }
FORM.noop = () => {};
INPUT.jobsq = el => { S.filters.q = el.value; clearTimeout(INPUT._t); INPUT._t = setTimeout(refreshResults, 120); };
INPUT.farea = el => { S.filters.area = el.value; refreshResults(); };
INPUT.fsector = el => { el.checked ? S.filters.sectors.add(el.value) : S.filters.sectors.delete(el.value); refreshResults(); };
INPUT.fmode = el => { el.checked ? S.filters.modes.add(el.value) : S.filters.modes.delete(el.value); refreshResults(); };
INPUT.fprog = el => { S.filters.programme = el.value; refreshResults(); };
INPUT.fpay = el => { S.filters.minPay = el.checked; refreshResults(); };
INPUT.fsort = el => { S.filters.sort = el.value; refreshResults(); };
ACT.clearfilters = () => { S.filters = {q:'', area:'', sectors:new Set(), modes:new Set(), programme:'', minPay:false, sort:S.filters.sort}; render({keepScroll:true}); };

/* ---------- Job detail (shared) ---------- */
function jobDetail(j, base){
  if (!j) return `<h1>Role not found</h1><p>This role may have closed. <a href="${base}">See open roles</a>.</p>`;
  const e = emp(j.emp);
  const role = route().role;
  const app = role === 'intern' ? S.apps.find(a => a.job === j.id && a.intern === DEMO_PEOPLE.intern) : null;
  const saved = S.saved.has(j.id);
  const applyBlock = app
    ? `<p>${status(app.status)}</p><p class="small muted">You applied on ${fmt(app.history[0][1])}.</p><a class="btn btn-ghost" href="#/intern/applications">Track your application</a>`
    : `<button class="btn btn-primary btn-lg" style="width:100%" data-act="apply" data-id="${j.id}">Apply now</button>
       <button class="btn btn-ghost" style="width:100%;margin-top:8px" data-act="save" data-id="${j.id}" aria-pressed="${saved}">${icon('bookmark')}${saved ? 'Saved' : 'Save for later'}</button>`;
  return `<a class="back" href="${base}">${icon('left')}Back to roles</a>
  <div class="grid-main">
    <article>
      <div class="jobhead">${logo(e, 'lg')}<div><h1>${esc(j.title)}</h1><div class="muted">${esc(e.name)}, ${esc(j.area)} ${e.verified ? `<span class="chip" style="margin-left:6px">${icon('shield')}Checked by CPCA</span>` : ''}</div>
        ${role === 'intern' ? `<div class="match" style="margin-top:6px">${matchScore(j)}% match with your CV</div>` : ''}</div></div>
      <dl class="facts">
        <div><dt>Pay</dt><dd>${money(j.pay)} an hour (about ${weekly(j)} a week)</dd></div>
        <div><dt>Hours</dt><dd>${j.hours} hours a week</dd></div>
        <div><dt>Length</dt><dd>${j.weeks} weeks</dd></div>
        <div><dt>Location</dt><dd>${esc(j.area)}, ${esc(j.mode.toLowerCase())}</dd></div>
        <div><dt>Starts</dt><dd>${fmtLong(j.starts)}</dd></div>
        <div><dt>Closing date</dt><dd>${fmtLong(j.closes)}</dd></div>
      </dl>
      <div class="prose">
        <p style="font-size:1.1rem">${esc(j.summary)}</p>
        <h2>What you will do</h2><ul>${j.duties.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
        <h2>What you need</h2><ul>${j.needs.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
        <h2>Skills you will use</h2><div class="chips">${j.skills.map(s => `<span class="chip">${esc(s)}</span>`).join('')}</div>
        <h2>About ${esc(e.name)}</h2><p>${esc(e.about)}</p><p class="muted small">${esc(e.size)}, ${esc(e.town)}</p>
        <p><a href="${base.startsWith('#/intern') ? '#/intern/company/' : '#/company/'}${e.id}">See ${esc(e.name)}'s profile and reviews from past interns</a></p>
      </div>
    </article>
    <aside class="panel applybox" aria-label="Apply">
      <h2>${closingText(j)}</h2>
      <p class="deadline muted">Applications close at midnight on ${fmtLong(j.closes)}.</p>
      ${role === 'visitor' ? `<button class="btn btn-primary btn-lg" style="width:100%" data-act="apply-visitor">Apply now</button><p class="small muted" style="margin-top:10px">You will need a free Talent Hive account. It takes about five minutes.</p>` : applyBlock}
      <hr style="border:0;border-top:1px solid var(--line);margin:18px 0">
      <p class="small muted" style="margin:0">Questions about this role? Message the employer after you apply, or contact the Talent Hive team.</p>
    </aside>
  </div>`;
}
ACT['apply-visitor'] = () => promptSignIn('apply');

/* ---------- For employers ---------- */
function pubEmployers(){
  return `<main id="main">
  <section class="hero"><div class="inner" style="grid-template-columns:1fr">
    <div><h1 style="max-width:18ch">Find your next intern, without the admin</h1>
    <p class="lede">Talent Hive connects local employers with people ready for a paid six-week placement. Posting a role is free, and the CPCA team supports you throughout.</p>
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:24px"><a class="btn btn-primary btn-lg" href="#/employer/post">Post a role</a><a class="btn btn-ghost btn-lg" href="#/employer">See the employer dashboard</a></div></div>
  </div></section>
  <section class="section">
    <h2>From first post to first day</h2>
    <ol class="steps">
      <li><h3>Post your role</h3><p class="muted">A four-step form covers pay, hours, duties and up to three screening questions. You see a live preview as you type.</p></li>
      <li><h3>We check and share it</h3><p class="muted">The CPCA team checks your listing within two working days, then it goes live to local candidates.</p></li>
      <li><h3>Review and hire</h3><p class="muted">Move applicants through your pipeline. They are told automatically at every step.</p></li>
    </ol>
  </section>
  <section class="section" style="padding-top:0">
    <div class="grid-3">
      <div class="panel"><h3>Every listing is complete</h3><p class="muted" style="margin:0">Required fields for pay, hours, location and closing date mean candidates get the facts they need up front.</p></div>
      <div class="panel"><h3>Applicants in one place</h3><p class="muted" style="margin:0">No more CVs scattered across inboxes. See each candidate's CV, badges and answers on one screen.</p></div>
      <div class="panel"><h3>Search for talent</h3><p class="muted" style="margin:0">Browse interns who have chosen to be found, filtered by skill and availability, and invite them to apply.</p></div>
    </div>
  </section></main>`;
}

/* ---------- Sign in ---------- */
function pubSignin(){
  return `<main id="main" class="section" style="max-width:820px">
    <h1>Sign in or join</h1>
    <p class="lede muted" style="font-size:1.1rem">In the full site you would sign in with a secure link sent to your email. In this demo, choose a role to continue.</p>
    <div class="grid-2" style="margin-top:24px">
      <div class="panel"><h2>I am looking for a placement</h2><p class="muted">Find roles, build your CV, apply and track every application.</p><button class="btn btn-primary" data-act="role" data-role="intern">Continue as Jordan, an intern</button></div>
      <div class="panel"><h2>I am an employer</h2><p class="muted">Post roles, review applicants and confirm placements.</p><button class="btn btn-primary" data-act="role" data-role="employer">Continue as Priya, an employer</button></div>
    </div>
    <p class="muted" style="margin-top:20px">CPCA staff sign in with their work account. <button class="btn btn-quiet btn-sm" data-act="role" data-role="cpca">Continue as Sam, CPCA team</button></p>
  </main>`;
}
