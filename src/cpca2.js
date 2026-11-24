/* ---------- CPCA: extra views ---------- */
const PLACEMENTS_BY_TOWN = {'Cambridge':18,'Peterborough':15,'Huntingdon':7,'Ely':5,'St Neots':4,'Wisbech':3,'St Ives':3,'March':2,'Northstowe':1,'Alconbury Weald':1};
function audit(what){ const x = new Date(); S.audit.unshift({t:`${x.getDate() === 24 ? '24 Nov' : fmt(todayISO())}, ${String(x.getHours()).padStart(2,'0')}:${String(x.getMinutes()).padStart(2,'0')}`, who:DEMO_PEOPLE.staff, what}); }
ACT.townplace = el => toast(`${el.dataset.area}: ${PLACEMENTS_BY_TOWN[el.dataset.area]} placements this cohort`);

function funnelChart(rows){
  const max = rows[0][1];
  return `<div class="funnel">${rows.map(([l, n], i) => `<div class="fn-row"><div class="fn-l">${l}</div><div class="fn-bar"><i style="width:${n / max * 100}%"></i><span>${n}</span></div><div class="fn-d small muted">${i ? `${Math.round(n / rows[i - 1][1] * 100)}% of previous` : 'Everyone who joined'}</div></div>`).join('')}</div>`;
}

function auditView(){
  return `<div class="pagehead"><div><h1>Audit log</h1><p>Every approval, change and message sent by staff and employers. Kept for seven years.</p></div><button class="btn btn-ghost" data-act="csv-audit">${icon('download')}Export</button></div>
  <section class="panel"><div class="table-wrap"><table class="table"><thead><tr><th>When</th><th>Who</th><th>What happened</th></tr></thead><tbody>${S.audit.map(a => `<tr><td class="nowrap small">${esc(a.t)}</td><td class="nowrap">${esc(a.who)}</td><td>${esc(a.what)}</td></tr>`).join('')}</tbody></table></div></section>`;
}
ACT['csv-audit'] = () => { const lines = ['When,Who,What', ...S.audit.map(a => [a.t, a.who, a.what].map(v => `"${v.replace(/"/g, '""')}"`).join(','))]; const l = document.createElement('a'); l.href = URL.createObjectURL(new Blob([lines.join('\n')], {type:'text/csv'})); l.download = 'audit-log-sample.csv'; document.body.appendChild(l); l.click(); l.remove(); toast('Audit log exported'); };

const AUDIENCES = [['all','All interns',527],['notapplied','Interns who have not applied yet',239],['interviewing','Interns with an interview coming up',41],['placed','Interns on placement',59],['employers','All employers',86]];
function broadcastView(){
  return `<div class="pagehead"><div><h1>Send a message</h1><p>Reach a whole group at once. Messages arrive in their Talent Hive inbox and by email.</p></div></div>
  <div class="grid-main">
    <form class="panel" data-form="broadcast"><div class="field"><label for="ba">Who should get it?</label><select id="ba" name="aud" data-change="baud">${AUDIENCES.map(([v, l, n]) => `<option value="${v}">${l} (${n})</option>`).join('')}</select></div>
      <div class="field"><label for="bs">Subject</label><input id="bs" name="s" type="text" data-input="bprev" value="Christmas opening hours and January start dates"></div>
      <div class="field"><label for="bm">Message</label><textarea id="bm" name="m" data-input="bprev" style="min-height:160px">Hi everyone,

Our team is closed from 24 December to 1 January. Placements starting in January will begin from Monday 11 January. If you have an offer, check your placement page for the steps to complete before you start.

The Talent Hive team</textarea></div>
      <label class="check" style="margin-bottom:16px"><input type="checkbox" name="email" checked> Also send by email</label>
      <button class="btn btn-primary">${icon('send')}Send to <span id="bcount">527</span> people</button></form>
    <aside class="stack"><section class="panel"><p class="preview-label">Preview</p><div class="preview-frame" id="bprev">${bPreview('Christmas opening hours and January start dates', $('#bm') ? $('#bm').value : '')}</div></section>
      <section class="panel"><h2>Sent recently</h2>${S.broadcasts.map(b => `<div class="listitem"><div class="grow"><b>${esc(b.subject)}</b><div class="small muted">${esc(b.aud)}, ${b.n} people. ${esc(b.t)}</div></div></div>`).join('')}</section></aside>
  </div>`;
}
function bPreview(s, m){ return `<div class="small muted">From: Talent Hive team</div><b style="display:block;margin:4px 0 8px">${esc(s)}</b><div class="small" style="white-space:pre-wrap">${esc(m || 'Hi everyone,\n\nOur team is closed from 24 December to 1 January. Placements starting in January will begin from Monday 11 January. If you have an offer, check your placement page for the steps to complete before you start.\n\nThe Talent Hive team')}</div>`; }
INPUT.bprev = () => { $('#bprev').innerHTML = bPreview($('#bs').value, $('#bm').value); };
INPUT.baud = el => { $('#bcount').textContent = AUDIENCES.find(a => a[0] === el.value)[2]; };
FORM.broadcast = f => {
  const a = AUDIENCES.find(x => x[0] === f.aud.value); const s = f.s.value.trim() || 'Message from the Talent Hive team';
  S.broadcasts.unshift({subject:s, aud:a[1], n:a[2], t:'Just now'}); audit(`Sent message "${s}" to ${a[1].toLowerCase()} (${a[2]})`);
  if (['all','interviewing'].includes(a[0])){ S.threads.unshift({id:uid('t'), role:'intern', with:'CPCA Talent Hive team', subject:s, unread:true, msgs:[{from:'them', text:f.m.value.trim(), t:'Just now'}]}); notify('intern', `New message from the Talent Hive team: ${s}`, '#/intern/messages'); }
  if (a[0] === 'employers'){ S.threads.unshift({id:uid('t'), role:'employer', with:'CPCA Talent Hive team', subject:s, unread:true, msgs:[{from:'them', text:f.m.value.trim(), t:'Just now'}]}); notify('employer', `New message from the Talent Hive team: ${s}`, '#/employer/messages'); }
  toast(`Sent to ${a[2]} people`); render({keepScroll:true});
};

function signupsPanel(){
  return `<section class="panel">${S.signups.length ? `<div class="table-wrap"><table class="table"><thead><tr><th>Name</th><th>Postcode area</th><th>Joined</th><th>Documents</th><th><span class="sr-only">Actions</span></th></tr></thead><tbody>
    ${S.signups.map(s => `<tr><td><b>${esc(s.name)}</b></td><td>${esc(s.postcode)}, ${esc(s.area)}</td><td>${fmt(s.joined)}</td><td>${/checked/.test(s.docs) ? status('approved', s.docs) : status('pending', s.docs)}</td><td class="nowrap"><button class="btn btn-primary btn-sm" data-act="elig" data-id="${s.id}">Confirm eligible</button> <button class="btn btn-ghost btn-sm" data-act="askinfo" data-e="${esc(s.name)}">Ask for info</button></td></tr>`).join('')}
  </tbody></table></div>` : '<div class="empty" style="border:0"><h3>All caught up</h3><p class="muted">No new interns waiting for checks.</p></div>'}</section>`;
}
ACT.elig = el => { const s = S.signups.find(x => x.id === el.dataset.id); S.signups = S.signups.filter(x => x !== s); audit(`Confirmed eligibility: ${s.name}`); toast(`${s.name} confirmed. They can now apply for roles.`); render({keepScroll:true}); };
