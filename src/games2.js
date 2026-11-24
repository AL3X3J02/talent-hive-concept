/* ---------- Daily Career Boost: the full games library ---------- */
const GAMES = [
  {key:'hive', title:'Word Hive', ic:'hex', mins:3, pts:'Up to 50', isNew:true, desc:'Make words from seven letters. Every word must use the centre letter.'},
  {key:'wordle', title:'Career Wordle', ic:'grid', mins:2, pts:'30', desc:'Guess today\'s five-letter workplace word in six tries.'},
  {key:'connections', title:'Career Connections', ic:'columns', mins:3, pts:'Up to 40', isNew:true, desc:'Sort sixteen words into four hidden groups. Four mistakes allowed.'},
  {key:'quiz', title:'Workplace Quiz', ic:'quiz', mins:2, pts:'Up to 50', desc:'Five quick questions on interviews and first days, with tips after each.'},
  {key:'inbox', title:'Inbox Rush', ic:'mail', mins:3, pts:'Up to 45', isNew:true, desc:'Eight work emails land at once. Decide what to do with each.'},
  {key:'star', title:'STAR Builder', ic:'star', mins:3, pts:'Up to 30', isNew:true, desc:'Put three interview answers into Situation, Task, Action, Result order.'},
  {key:'slip', title:'Spot the Slip', ic:'edit', mins:2, pts:'Up to 30', isNew:true, desc:'Find the six mistakes in a CV before an employer does.'},
  {key:'pay', title:'Pay Check', ic:'pound', mins:2, pts:'Up to 30', isNew:true, desc:'Which role pays more each week? The hourly rate is only half the story.'},
  {key:'scramble', title:'Job Scramble', ic:'briefcase', mins:2, pts:'Up to 30', isNew:true, desc:'Unscramble five job titles. Hints cost points.'},
  {key:'match', title:'Skill Match', ic:'link', mins:1, pts:'20', desc:'Pair four skills with the roles that use them.'}
];
const FEATURED = ['hive', 'wordle', 'connections'];
const TOMORROW = ['inbox', 'star', 'pay'];
const gameInfo = k => GAMES.find(g => g.key === k);
const featuredLeft = () => FEATURED.filter(k => !S.boost.played[k]).length;
function gameHead(key, sub){
  const g = gameInfo(key);
  return `<a class="back" href="#/intern/boost">${icon('left')}Daily Career Boost</a><div class="pagehead"><div><h1>${g.title}</h1><p>${sub}</p></div><span class="chip">${icon('clock')}About ${g.mins} ${g.mins === 1 ? 'minute' : 'minutes'}</span></div>`;
}
const backToGames = () => `<a class="btn btn-primary" href="#/intern/boost">Back to today's games</a>`;
const shareBtn = key => `<button class="btn btn-ghost" data-act="share" data-key="${key}">${icon('send')}Share result</button>`;

/* Share: a spoiler-free summary, like the newspaper puzzles */
function shareText(key){
  const head = `Talent Hive ${gameInfo(key).title}, ${fmtLong('2026-11-24')}`;
  if (key === 'wordle' && S.wordle){ const W = S.wordle; const em = {correct:'🟩', present:'🟨', absent:'⬜'}; return `${head}\n${W.won ? W.guesses.length : 'X'}/6\n${W.guesses.map(g => scoreGuess(g, W.answer).map(s => em[s]).join('')).join('\n')}`; }
  if (key === 'connections' && S.conn){ const em = ['🟨','🟩','🟦','🟪']; return `${head}\n${S.conn.guesses.map(g => g.map(w => em[CONN.findIndex(c => c.words.includes(w))]).join('')).join('\n')}`; }
  if (key === 'hive' && S.hive){ return `${head}\n${hiveRank().name}: ${S.hive.found.length} words, ${hiveTotal()} points`; }
  if (key === 'inbox' && S.inbox){ return `${head}\n${S.inbox.picks.map((p, i) => p === INBOX.at(i).a ? '✅' : '❌').join('')} in ${S.inbox.secs} seconds`; }
  if (key === 'star' && S.star){ return `${head}\n${S.star.results.map(r => r ? '⭐' : '☆').join('')}`; }
  if (key === 'slip' && S.slip){ return `${head}\nFound ${S.slip.found.length} of ${SLIP_FIX.length} mistakes`; }
  if (key === 'pay' && S.pay){ return `${head}\n${S.pay.picks.map((p, i) => p === payWinner(i) ? '💷' : '❌').join('')}`; }
  if (key === 'scramble' && S.scr){ return `${head}\n${SCRAMBLE.map((_, i) => S.scr.solved.includes(i) ? (S.scr.hints.includes(i) ? '🟨' : '🟩') : '⬜').join('')}`; }
  if (key === 'quiz' && S.quiz){ return `${head}\n${S.quiz.score}/5`; }
  return `${head}\nDone`;
}
ACT.share = async el => {
  const txt = shareText(el.dataset.key);
  try { await navigator.clipboard.writeText(txt); }
  catch(e){ const t = document.createElement('textarea'); t.value = txt; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0'; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); } catch(_){} t.remove(); }
  toast('Result copied. Paste it into a message to share.');
};

/* ===== Word Hive ===== */
const HIVE = {centre:'A', outer:['P','L','C','I','N','G'], words:['ACING','AGING','ALIGN','ALIGNING','ALPACA','ANGLING','APING','APPAL','APPALLING','CAGING','CALL','CALLING','CANAL','CANNING','CAPPING','CLAN','CLANG','CLANGING','CLAP','CLAPPING','GAIN','GAINING','GALA','GALL','GALLING','GANGLIA','GAPING','GAPPING','LACING','LAGGING','LAIN','LANCING','LAPPING','LILAC','NAAN','NAGGING','NAIL','NAILING','NAPPING','PACING','PAGAN','PAGING','PAIL','PAIN','PALING','PALL','PALLING','PANG','PANIC','PANNING','PAPAL','PLACING','PLAIN','PLAN','PLANING','PLANNING']};
const HIVE_ALL = [HIVE.centre, ...HIVE.outer];
const isPangram = w => HIVE_ALL.every(l => w.includes(l));
const hiveScore = w => (w.length === 4 ? 1 : w.length) + (isPangram(w) ? 7 : 0);
const HIVE_MAX = HIVE.words.reduce((s, w) => s + hiveScore(w), 0);
const HIVE_RANKS = [['Getting started', 0], ['Warming up', .04], ['Good', .1], ['Solid', .18], ['Great', .3], ['Amazing', .45], ['Hive mind', .65]];
function hiveState(){ if (!S.hive) S.hive = {found:[], cur:'', msg:'', order:[0,1,2,3,4,5], done:false, flash:''}; return S.hive; }
const hiveTotal = () => hiveState().found.reduce((s, w) => s + hiveScore(w), 0);
function hiveRank(){
  const f = hiveTotal() / HIVE_MAX; let idx = 0;
  HIVE_RANKS.forEach(([n, t], i) => { if (f >= t) idx = i; });
  const next = HIVE_RANKS.at(idx + 1);
  return {name:HIVE_RANKS.at(idx)[0], idx, toNext:next ? Math.ceil(next[1] * HIVE_MAX) - hiveTotal() : 0, nextName:next ? next[0] : ''};
}
const HEXPOS = [[120,46],[190,86],[190,166],[120,206],[50,166],[50,86]];
function hiveBoard(){
  const H = hiveState(), R = hiveRank();
  const cell = (L, x, y, centre) => `<button class="hcell ${centre ? 'centre' : ''}" style="left:${x - 44}px;top:${y - 40}px" data-act="hkey" data-k="${L}" aria-label="${L}${centre ? ', centre letter' : ''}" ${H.done ? 'disabled' : ''}><span class="hexshape">${L}</span></button>`;
  const typed = H.cur ? H.cur.split('').map(c => `<span class="${c === HIVE.centre ? 'cen' : HIVE_ALL.includes(c) ? '' : 'bad'}">${c}</span>`).join('') : '<span class="ph">Type or tap letters</span>';
  const dots = HIVE_RANKS.map((r, i) => `<i class="${i <= R.idx ? 'on' : ''} ${i === R.idx ? 'now' : ''}" title="${r[0]}"></i>`).join('');
  const found = [...H.found].sort();
  const missed = H.done ? HIVE.words.filter(w => !H.found.includes(w)) : [];
  return `<div class="hive-layout">
    <div class="hive-play">
      <div class="hive-rank"><b>${R.name}</b><div class="rankdots" aria-hidden="true">${dots}</div><span class="small muted">${R.toNext > 0 ? `${R.toNext} points to ${R.nextName}` : 'Top rank reached'}</span></div>
      <div class="hive-input ${H.flash}" aria-live="polite" aria-label="Current word">${typed}</div>
      <div class="hive" role="group" aria-label="Today's letters. The centre letter is ${HIVE.centre}.">
        ${cell(HIVE.centre, 120, 126, true)}${H.order.map((o, i) => cell(HIVE.outer.at(o), HEXPOS.at(i)[0], HEXPOS.at(i)[1], false)).join('')}
      </div>
      ${H.done ? '' : `<div class="hive-ctrls"><button class="btn btn-ghost" data-act="hkey" data-k="Backspace">Delete</button><button class="btn btn-ghost" data-act="hshuf" aria-label="Shuffle the outer letters">${icon('arrowr')}Shuffle</button><button class="btn btn-primary" data-act="hkey" data-k="Enter">Enter</button></div>`}
      <p role="status" class="small hive-msg">${esc(H.msg)}</p>
    </div>
    <section class="panel hive-found" aria-labelledby="hf-h">
      <div class="section-head" style="margin-bottom:8px"><h2 id="hf-h" style="margin:0">You have found ${H.found.length} ${H.found.length === 1 ? 'word' : 'words'}</h2><span class="chip">${hiveTotal()} points</span></div>
      <ul class="wordcols">${found.map(w => `<li class="${isPangram(w) ? 'pan' : ''}">${w[0] + w.slice(1).toLowerCase()}${isPangram(w) ? '<span class="sr-only"> (uses all seven letters)</span>' : ''}</li>`).join('')}</ul>
      ${H.done ? `<h3 style="font-size:1rem;margin-top:16px">Words you missed (${missed.length})</h3><ul class="wordcols missed">${missed.map(w => `<li class="${isPangram(w) ? 'pan' : ''}">${w[0] + w.slice(1).toLowerCase()}</li>`).join('')}</ul>
        <div class="explain" style="margin-top:14px"><b>Today's theme: getting placed.</b> Placing, planning, aligning and gaining were all in there.</div>
        <div class="btnrow" style="margin-top:14px">${backToGames()}${shareBtn('hive')}</div>`
      : `<p class="small muted" style="margin:14px 0 8px">Four-letter words score 1. Longer words score one point per letter. A word using all seven letters scores 7 extra and shows in blue.</p><button class="btn btn-quiet" data-act="hfinish">Finish for today</button>`}
    </section>
  </div>`;
}
function hiveDraw(focusSel){ const b = $('#hivegame'); if (b) b.innerHTML = hiveBoard(); if (focusSel){ const f = $(focusSel); if (f) f.focus(); } }
function hiveKey(k){
  const H = hiveState(); if (H.done) return;
  H.msg = ''; H.flash = '';
  if (k === 'Backspace') H.cur = H.cur.slice(0, -1);
  else if (k === 'Enter'){
    const w = H.cur;
    if (!w) return;
    if (w.length < 4) H.msg = 'Too short. Words need four letters or more.';
    else if (!w.includes(HIVE.centre)) H.msg = `Every word needs the centre letter, ${HIVE.centre}.`;
    else if ([...w].some(c => !HIVE_ALL.includes(c))) H.msg = 'That uses a letter that is not in today\'s hive.';
    else if (H.found.includes(w)) H.msg = 'Already found.';
    else if (!HIVE.words.includes(w)) H.msg = 'Not in today\'s word list.';
    else {
      const before = hiveRank().idx;
      H.found.push(w); const p = hiveScore(w);
      H.msg = isPangram(w) ? `Uses all seven letters! +${p}` : p === 1 ? 'Nice. +1' : `Great word. +${p}`;
      H.flash = isPangram(w) ? 'pangram' : 'good';
      if (hiveRank().idx > before){ H.msg += `. You reached ${hiveRank().name}.`; if (hiveRank().name === 'Hive mind') setTimeout(confetti, 150); }
      H.cur = ''; hiveDraw(); return;
    }
    H.flash = 'shake'; H.cur = '';
  }
  else if (/^[A-Z]$/.test(k) && H.cur.length < 14) H.cur += k;
  hiveDraw();
}
ACT.hkey = el => { const k = el.dataset.k; hiveKey(k); hiveDraw(`[data-act=hkey][data-k="${k}"]`); };
ACT.hshuf = () => { const H = hiveState(); for (let i = H.order.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [H.order[i], H.order[j]] = [H.order[j], H.order[i]]; } hiveDraw('[data-act=hshuf]'); };
ACT.hfinish = () => { const H = hiveState(); H.done = true; H.cur = ''; const R = hiveRank(); finishGame('hive', Math.min(50, 10 + R.idx * 7)); render({keepScroll:true}); };
function hiveView(){ hiveState(); return gameHead('hive', `Make words of four letters or more. Every word must use the centre letter, ${HIVE.centre}, and letters can be used more than once.`) + `<div id="hivegame">${hiveBoard()}</div>`; }

/* ===== Career Connections ===== */
const CONN = [
  {name:'Kinds of interview', words:['PANEL','PHONE','VIDEO','GROUP']},
  {name:'Sections of a CV', words:['PROFILE','SKILLS','EDUCATION','REFERENCES']},
  {name:'Microsoft 365 apps', words:['EXCEL','TEAMS','OUTLOOK','WORD']},
  {name:'They all go before LETTER', words:['COVER','OFFER','RESIGNATION','REJECTION']}
];
const CONN_START = ['TEAMS','COVER','PANEL','SKILLS','OUTLOOK','REJECTION','PHONE','PROFILE','WORD','GROUP','OFFER','EDUCATION','VIDEO','EXCEL','REFERENCES','RESIGNATION'];
function connState(){ if (!S.conn) S.conn = {order:[...CONN_START], sel:[], solved:[], mistakes:0, guesses:[], msg:'', done:false, shake:false}; return S.conn; }
function connView(){
  const C = connState();
  const solvedRows = C.solved.map(gi => `<div class="conn-solved lvl${gi}"><b>${esc(CONN.at(gi).name)}</b><span>${CONN.at(gi).words.map(w => w[0] + w.slice(1).toLowerCase()).join(', ')}</span></div>`).join('');
  const left = C.order.filter(w => !C.solved.some(gi => CONN.at(gi).words.includes(w)));
  const tiles = left.map(w => `<button class="conn-tile ${C.sel.includes(w) ? 'sel' : ''} ${C.shake && C.sel.includes(w) ? 'shake' : ''} ${w.length > 8 ? 'long' : ''}" data-act="ccsel" data-w="${w}" aria-pressed="${C.sel.includes(w)}" ${C.done ? 'disabled' : ''}>${w}</button>`).join('');
  return gameHead('connections', 'Find four groups of four words that share something. Select four, then submit. You can make four mistakes.') + `
  <div class="conn-wrap">
    <div class="conn-board" role="group" aria-label="Words">${solvedRows}${left.length ? `<div class="conn-grid">${tiles}</div>` : ''}</div>
    <p role="status" class="small" style="text-align:center;font-weight:700;min-height:1.5em;margin:12px 0 4px">${esc(C.msg)}</p>
    ${C.done ? `<div class="panel" style="max-width:560px;margin:8px auto 0;text-align:center"><h2>${C.solved.length === 4 && C.mistakes < 4 ? (C.mistakes === 0 ? 'Perfect. No mistakes.' : `Solved with ${C.mistakes} ${C.mistakes === 1 ? 'mistake' : 'mistakes'}.`) : 'Out of guesses. Here are the groups.'}</h2><p class="small muted">The trickiest group is usually the one hiding in plain sight. Today it was words that go before letter.</p><div class="btnrow" style="justify-content:center">${backToGames()}${shareBtn('connections')}</div></div>` : `
    <div class="conn-mistakes small">Mistakes left <span aria-hidden="true">${[0,1,2,3].map(i => `<i class="${i < 4 - C.mistakes ? 'on' : ''}"></i>`).join('')}</span><span class="sr-only">${4 - C.mistakes} of 4</span></div>
    <div class="btnrow conn-ctrls"><button class="btn btn-ghost" data-act="ccshuf">Shuffle</button><button class="btn btn-ghost" data-act="ccclear" ${C.sel.length ? '' : 'disabled'}>Deselect all</button><button class="btn btn-primary" data-act="ccsub" ${C.sel.length === 4 ? '' : 'disabled'}>Submit</button></div>`}
  </div>`;
}
const connDraw = sel => { render({keepScroll:true}); if (sel){ const f = $(sel); if (f) f.focus(); } };
ACT.ccsel = el => { const C = connState(); const w = el.dataset.w; C.shake = false; C.msg = ''; if (C.sel.includes(w)) C.sel = C.sel.filter(x => x !== w); else if (C.sel.length < 4) C.sel.push(w); connDraw(`[data-act=ccsel][data-w="${w}"]`); };
ACT.ccclear = () => { const C = connState(); C.sel = []; C.msg = ''; connDraw('[data-act=ccshuf]'); };
ACT.ccshuf = () => { const C = connState(); for (let i = C.order.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [C.order[i], C.order[j]] = [C.order[j], C.order[i]]; } connDraw('[data-act=ccshuf]'); };
ACT.ccsub = () => {
  const C = connState(); if (C.sel.length !== 4) return;
  const key = [...C.sel].sort().join();
  if (C.guesses.some(g => [...g].sort().join() === key)){ C.msg = 'You have already tried that group.'; connDraw('[data-act=ccsub]'); return; }
  C.guesses.push([...C.sel]);
  const gi = CONN.findIndex(g => C.sel.every(w => g.words.includes(w)));
  if (gi > -1){
    C.solved.push(gi); C.sel = []; C.msg = `Correct: ${CONN.at(gi).name}.`;
    if (C.solved.length === 4){ C.done = true; finishGame('connections', Math.max(10, 40 - C.mistakes * 10)); if (!C.mistakes) setTimeout(confetti, 150); }
    connDraw('[data-act=ccsel]');
    return;
  }
  C.mistakes++; C.shake = true;
  const oneAway = CONN.some(g => C.sel.filter(w => g.words.includes(w)).length === 3);
  C.msg = oneAway ? 'One away. Three of those belong together.' : 'Not a group. Try again.';
  if (C.mistakes >= 4){ C.done = true; C.sel = []; CONN.forEach((_, i) => { if (!C.solved.includes(i)) C.solved.push(i); }); C.msg = 'No mistakes left.'; finishGame('connections', 5); }
  connDraw('[data-act=ccsub]');
};

/* ===== Inbox Rush ===== */
const INBOX = [
  {from:'Priya Shah', who:'Your manager', time:'08:52', subj:'Client demo moved to 11:00', body:'The Ouse Valley demo is now at 11:00 today. Can you send me the updated slides by 10:30?', a:'now', why:'Your manager needs it for a client today, with a deadline in under two hours. Do this first.'},
  {from:'IT Service Desk', who:'Fenlight Digital', time:'08:40', subj:'Your password expires in 14 days', body:'Please choose a new password before 8 December.', a:'plan', why:'It matters, but not today. Put a reminder in your calendar for next week.'},
  {from:'Ben Clarke', who:'Senior developer', time:'09:05', subj:'Contact form is broken on the live site', body:'Customers are getting an error when they send a message. Can you look at it with me now?', a:'now', why:'Customers are affected right now, and a senior colleague has asked for your help.'},
  {from:'Accounts mailbox', who:'Shared inbox', time:'09:10', subj:'Question about invoice 2291', body:'Hi, I think we were charged twice for October. Can someone check?', a:'pass', why:'Invoices are not a development intern\'s job. Forward it to the finance team so the customer gets the right answer.'},
  {from:'Pay Team', who:'payroll-update@fenlight-pay.co', time:'09:14', subj:'URGENT: confirm your bank details today', body:'Your pay will be delayed unless you confirm your bank details at the link below within 2 hours.', a:'pass', why:'This looks like phishing: pressure, an odd address and a link asking for bank details. Do not click anything. Report it to IT.'},
  {from:'Sam Hollis', who:'Office manager, all staff', time:'09:20', subj:'Cake in the kitchen', body:'It is Jo\'s birthday. Cake in the kitchen from 3pm.', a:'archive', why:'Nice to know, nothing to do. Archive it and enjoy the cake later.'},
  {from:'Talent Hive', who:'CPCA', time:'09:31', subj:'Your weekly check-in is due Friday', body:'Tell your mentor how week 2 went. It takes about five minutes.', a:'plan', why:'Due on Friday, so plan a slot for it. Leaving it to the last minute is how check-ins get missed.'},
  {from:'Priya Shah', who:'Your manager', time:'09:45', subj:'Ideas for next week\'s team meeting', body:'Could you bring three ideas for improving our onboarding to Tuesday\'s meeting?', a:'plan', why:'Important, but due next week. Book time to prepare rather than doing it right now.'}
];
const BINS = [['now','Do now','flame'],['plan','Plan for later','calendar'],['pass','Pass on or report','send'],['archive','Archive','file']];
const binName = k => BINS.find(b => b.at(0) === k).at(1);
function inboxState(){ if (!S.inbox) S.inbox = {i:0, picks:[], show:false, done:false, start:null, secs:0}; return S.inbox; }
function inboxView(){
  const I = inboxState();
  const head = gameHead('inbox', 'You are in week two of a placement at Fenlight Digital. Eight emails arrived before 10am. Decide what to do with each one.');
  const list = INBOX.map((m, i) => { const p = I.picks[i]; const ok = p && p === m.a; return `<li class="${i === I.i && !I.done ? 'cur' : ''} ${p ? 'sorted' : ''}"><div class="grow"><b>${esc(m.from)}</b><div class="small">${esc(m.subj)}</div></div>${p ? `<span class="ibtag ${ok ? 'ok' : 'no'}">${esc(binName(p))}</span>` : `<span class="small muted">${m.time}</span>`}</li>`; }).join('');
  if (I.done){
    const right = I.picks.filter((p, i) => p === INBOX.at(i).a).length;
    return head + `<div class="inbox-grid"><ul class="inbox-list" aria-label="Your inbox">${list}</ul><section class="panel"><h2>${right} of 8 sorted well, in ${I.secs} seconds</h2><p>${right === 8 ? 'Calm, quick and safe. That is exactly how a good first month looks.' : 'Worth a second look at the ones in red. The phishing email is the one that catches most people out.'}</p>
      <ul class="small" style="padding-left:18px;line-height:1.6">${INBOX.map((m, i) => I.picks[i] === m.a ? '' : `<li><b>${esc(m.subj)}</b>: best answer is ${esc(binName(m.a))}. ${esc(m.why)}</li>`).join('')}</ul>
      <div class="btnrow">${backToGames()}${shareBtn('inbox')}</div></section></div>`;
  }
  const m = INBOX.at(I.i), p = I.picks[I.i];
  return head + `<div class="inbox-grid">
    <ul class="inbox-list" aria-label="Your inbox">${list}</ul>
    <section class="panel mailpane" aria-labelledby="mail-subj">
      <div class="small muted">Email ${I.i + 1} of 8. Received ${m.time}</div>
      <h2 id="mail-subj" style="margin:6px 0">${esc(m.subj)}</h2>
      <div class="mailfrom"><span class="avatar" style="--av:${['#E8EAFF','#FCE4F8','#EEFAD0','#FFE8D6'].at(I.i % 4)}">${esc(m.from.split(' ').map(x => x[0]).join('').slice(0, 2))}</span><div><b>${esc(m.from)}</b><div class="small muted">${esc(m.who)}</div></div></div>
      <p class="mailbody">${esc(m.body)}</p>
      <div class="bins" role="group" aria-label="What will you do with this email?">${BINS.map(([k, n, ic]) => `<button class="binbtn ${p ? (k === m.a ? 'right' : k === p ? 'wrong' : '') : ''}" data-act="ibpick" data-k="${k}" ${p ? 'disabled' : ''}>${icon(ic)}${n}</button>`).join('')}</div>
      ${p ? `<div class="explain" role="status"><b>${p === m.a ? 'Good call.' : `Better: ${binName(m.a)}.`}</b> ${esc(m.why)}</div><button class="btn btn-primary" data-act="ibnext">${I.i === 7 ? 'See how you did' : 'Next email'}</button>` : ''}
    </section></div>`;
}
ACT.ibpick = el => { const I = inboxState(); if (I.start === null) I.start = Date.now(); I.picks[I.i] = el.dataset.k; render({keepScroll:true}); const n = $('[data-act=ibnext]'); if (n) n.focus(); };
ACT.ibnext = () => {
  const I = inboxState();
  if (I.i === 7){ I.done = true; I.secs = Math.max(1, Math.round((Date.now() - (I.start || Date.now())) / 1000)); const right = I.picks.filter((p, i) => p === INBOX.at(i).a).length; finishGame('inbox', right * 5 + (I.secs < 120 ? 5 : 0)); if (right === 8) setTimeout(confetti, 150); }
  else I.i++;
  render({keepScroll:true}); const b = $('.binbtn'); if (b) b.focus();
};

/* ===== STAR Builder ===== */
const STAR_LABELS = [['S','Situation','Set the scene'],['T','Task','What you had to do'],['A','Action','What you did'],['R','Result','What happened in the end']];
const STARQ = [
  {q:'Tell me about a time you solved a problem.', mix:[2,0,3,1], parts:[
    'In my final year, our group\'s survey app kept crashing the day before our presentation.',
    'I was responsible for finding the cause and getting it working in time.',
    'I read the error logs, traced it to one faulty update, rolled it back and tested every screen.',
    'The app ran smoothly in the presentation and we got the top mark in the module.']},
  {q:'Tell me about a time you worked well in a team.', mix:[1,3,0,2], parts:[
    'At my part-time café job, two staff called in sick on our busiest Saturday.',
    'The manager asked me to keep the queue moving while she covered the kitchen.',
    'I split the till and coffee jobs with a new starter and showed her a quicker way to take orders.',
    'Waiting times stayed under five minutes, and I was asked to train new staff afterwards.']},
  {q:'Tell me about a time you had to learn something quickly.', mix:[3,1,2,0], parts:[
    'A week before my volunteer shift at the food bank, they moved to a new stock system.',
    'I needed to be able to log donations on my own by the first shift.',
    'I watched the training videos, practised on the test version and made a one-page guide.',
    'I logged over 200 items on day one, and the team now gives my guide to new volunteers.']}
];
function starState(){ if (!S.star) S.star = {qi:0, placed:[null,null,null,null], checked:false, tries:0, results:[], score:0, done:false}; return S.star; }
function starView(){
  const T = starState();
  const head = gameHead('star', 'Strong interview answers follow STAR: Situation, Task, Action, Result. Put each answer\'s sentences in that order.');
  if (T.done) return head + `<section class="panel" style="max-width:720px"><h2>${T.results.filter(Boolean).length} of 3 right first time</h2><p>Use the same shape for any "tell me about a time" question. Keep the Action part the longest, and finish with a result you can measure if you can.</p><div class="btnrow">${backToGames()}<a class="btn btn-ghost" href="#/intern/practice">Practise your own answers</a>${shareBtn('star')}</div></section>`;
  const Q = STARQ.at(T.qi);
  const full = T.placed.every(x => x !== null), allRight = T.checked && T.placed.every((x, i) => x === i);
  const slots = STAR_LABELS.map(([l, n, h], i) => { const x = T.placed[i]; const st = T.checked && x !== null ? (x === i ? 'right' : 'wrong') : ''; return `<div class="starslot ${st}"><div class="starlbl"><span class="hexbadge">${l}</span><div><b>${n}</b><div class="small muted">${h}</div></div></div>${x === null ? `<div class="starempty small muted">Choose a sentence below</div>` : `<button class="starsent placed" data-act="stback" data-slot="${i}" ${allRight ? 'disabled' : ''} aria-label="${esc(Q.parts.at(x))}. Remove from ${n}">${esc(Q.parts.at(x))}</button>`}</div>`; }).join('');
  const pool = Q.mix.filter(k => !T.placed.includes(k)).map(k => `<button class="starsent" data-act="stput" data-k="${k}">${esc(Q.parts.at(k))}</button>`).join('');
  return head + `<section class="panel" style="max-width:820px">
    <div class="small muted">Question ${T.qi + 1} of 3</div>
    <h2 style="font-size:1.3rem;margin:4px 0 16px">"${esc(Q.q)}"</h2>
    <div class="starslots">${slots}</div>
    ${pool ? `<h3 class="small muted" style="margin:16px 0 8px;font-weight:600">Sentences to place</h3><div class="starpool" role="group" aria-label="Sentences to place">${pool}</div>` : ''}
    <p role="status" class="small" style="font-weight:700;min-height:1.5em;margin:12px 0">${T.checked ? (allRight ? (T.tries === 1 ? 'Spot on, first time. +10' : 'All in order now. +5') : 'Not quite. The ones in red are in the wrong place.') : ''}</p>
    <div class="btnrow">${allRight ? `<button class="btn btn-primary" data-act="stnext">${T.qi === 2 ? 'See how you did' : 'Next question'}</button>` : T.checked ? `<button class="btn btn-primary" data-act="stretry">Move the red ones</button>` : `<button class="btn btn-primary" data-act="stcheck" ${full ? '' : 'disabled'}>Check my answer</button>`}</div>
  </section>`;
}
ACT.stput = el => { const T = starState(); const i = T.placed.indexOf(null); if (i > -1) T.placed[i] = +el.dataset.k; render({keepScroll:true}); const n = $('[data-act=stput]') || $('[data-act=stcheck]'); if (n) n.focus(); };
ACT.stback = el => { const T = starState(); T.placed[+el.dataset.slot] = null; T.checked = false; render({keepScroll:true}); const n = $('[data-act=stput]'); if (n) n.focus(); };
ACT.stcheck = () => { const T = starState(); T.checked = true; T.tries++; const ok = T.placed.every((x, i) => x === i); if (ok){ T.results.push(T.tries === 1); T.score += T.tries === 1 ? 10 : 5; } render({keepScroll:true}); const n = $('[data-act=stnext]') || $('[data-act=stretry]'); if (n) n.focus(); };
ACT.stretry = () => { const T = starState(); T.placed = T.placed.map((x, i) => x === i ? x : null); T.checked = false; render({keepScroll:true}); const n = $('[data-act=stput]'); if (n) n.focus(); };
ACT.stnext = () => { const T = starState(); if (T.qi === 2){ T.done = true; finishGame('star', T.score); if (T.results.every(Boolean)) setTimeout(confetti, 150); } else { T.qi++; T.placed = [null,null,null,null]; T.checked = false; T.tries = 0; } render({keepScroll:true}); const n = $('[data-act=stput]'); if (n) n.focus(); };

/* ===== Spot the Slip ===== */
const SLIP_TEXT = 'Organised and reliable graduate with strong attension to detail. At Bean There Café I worked closely with the manger to train new staff and helped customers with there orders. I recieved an Employee of the Month award and handled loads of cash payments each day. Confident using Microsoft Excell and Teams.';
const SLIP_FIX = [['attension','attention','Spelling.'],['manger','manager','A manger is where animals feed.'],['there','their','Their shows belonging.'],['recieved','received','I before E, except after C.'],['loads','a high number','"Loads of" is too casual for a CV.'],['Excell','Excel','Get software names exactly right.']];
const slipTokens = () => SLIP_TEXT.split(' ').map(t => { const m = t.match(/^(.*?)([.,]?)$/); return {w:m[1], p:m[2]}; });
function slipState(){ if (!S.slip) S.slip = {found:[], wrong:0, last:null, done:false}; return S.slip; }
function slipView(){
  const L = slipState();
  const toks = slipTokens();
  const words = toks.map((t, i) => {
    const fixIdx = SLIP_FIX.findIndex(f => f.at(0) === t.w);
    const found = L.found.includes(fixIdx) && fixIdx > -1;
    const reveal = L.done && fixIdx > -1;
    if (found || reveal) return `<span class="slipfix ${found ? 'got' : 'miss'}"><s>${esc(t.w)}</s> <b>${esc(SLIP_FIX.at(fixIdx).at(1))}</b></span>${esc(t.p)} `;
    return `<button class="slipword ${L.last === i ? 'nope' : ''}" data-act="slpick" data-i="${i}" ${L.done ? 'disabled' : ''}>${esc(t.w)}</button>${esc(t.p)} `;
  }).join('');
  const head = gameHead('slip', 'An employer spends seconds on a CV, and small mistakes stand out. Tap each word that is wrong. There are six.');
  return head + `<div class="grid-main">
    <section class="panel slipcv" aria-labelledby="slip-h"><div class="cvmini"><b id="slip-h">Jordan Ellis</b><span class="small muted">Peterborough. Graduate, BSc Computing</span></div><h3 style="font-size:.95rem;margin:16px 0 6px">About me and experience</h3><p class="slipbody">${words}</p></section>
    <aside class="stack"><section class="panel"><h2 style="font-size:1.1rem">Mistakes found</h2><div class="slipcount"><b>${L.found.length}</b><span>of ${SLIP_FIX.length}</span></div><div class="meter honey" style="margin:10px 0"><i style="width:${L.found.length / SLIP_FIX.length * 100}%"></i></div>
      <p role="status" class="small" style="font-weight:700;min-height:1.5em">${L.last !== null && !L.done ? 'That one is fine. Look again.' : L.found.length && !L.done ? `${esc(SLIP_FIX.at(L.found.at(-1)).at(2))}` : ''}</p>
      ${L.wrong ? `<p class="small muted" style="margin:0">Wrong taps: ${L.wrong}</p>` : ''}
      ${L.done ? `<div class="btnrow" style="margin-top:12px">${backToGames()}${shareBtn('slip')}</div>` : `<button class="btn btn-quiet" data-act="slreveal" style="margin-top:8px">Show me the answers</button>`}</section>
      <section class="panel"><h2 style="font-size:1.1rem">Why it matters</h2><p class="small" style="margin:0">Spelling mistakes are one of the most common reasons employers give for turning down a CV. Read yours aloud, or use the checker in your CV builder before you apply.</p></section></aside></div>`;
}
ACT.slpick = el => {
  const L = slipState(); const i = +el.dataset.i; const t = slipTokens().at(i);
  const fixIdx = SLIP_FIX.findIndex(f => f.at(0) === t.w);
  if (fixIdx > -1){ L.found.push(fixIdx); L.last = null; if (L.found.length === SLIP_FIX.length){ L.done = true; finishGame('slip', Math.max(5, 30 - L.wrong * 2)); setTimeout(confetti, 150); } }
  else { L.wrong++; L.last = i; }
  render({keepScroll:true}); const n = $(`[data-act=slpick][data-i="${i}"]`) || $('[data-act=slpick]') || $('#app .btn-primary'); if (n) n.focus();
};
ACT.slreveal = () => { const L = slipState(); L.done = true; L.last = null; finishGame('slip', Math.max(5, L.found.length * 5 - L.wrong * 2)); render({keepScroll:true}); };

/* ===== Pay Check ===== */
const PAYPAIRS = [['j5','j1'],['j3','j7'],['j2','j6'],['j8','j11'],['j4','j12']];
const wk = j => j.pay * j.hours;
const payWinner = i => { const [a, b] = PAYPAIRS.at(i).map(job); return wk(a) >= wk(b) ? a.id : b.id; };
function payState(){ if (!S.pay) S.pay = {i:0, picks:[], done:false}; return S.pay; }
function payView(){
  const P = payState();
  const head = gameHead('pay', 'Two real roles from the jobs board. Which one pays more each week? Multiply the hourly rate by the hours.');
  if (P.done){
    const right = P.picks.filter((p, i) => p === payWinner(i)).length;
    const [a, b] = PAYPAIRS.at(2).map(job);
    return head + `<section class="panel" style="max-width:720px"><h2>${right} of 5 correct</h2><p>A higher hourly rate does not always mean more money. ${esc(b.title)} pays less per hour than ${esc(a.title)}, but its longer week adds up to ${money((wk(b) - wk(a)) * 6)} more over a six-week placement.</p><div class="btnrow">${backToGames()}<a class="btn btn-ghost" href="#/intern/jobs">Browse roles</a>${shareBtn('pay')}</div></section>`;
  }
  const pair = PAYPAIRS.at(P.i).map(job), picked = P.picks[P.i], win = payWinner(P.i);
  const card = j => { const e = emp(j.emp); const st = picked ? (j.id === win ? 'right' : j.id === picked ? 'wrong' : '') : ''; return `<button class="paycard ${st}" data-act="paypick" data-id="${j.id}" ${picked ? 'disabled' : ''}><span class="payhead">${logo(e)}<span><b>${esc(j.title)}</b><span class="small muted">${esc(e.name)}, ${esc(j.area)}</span></span></span><span class="payfacts"><span><span class="small muted">Hourly</span><b>${money(j.pay)}</b></span><span><span class="small muted">Hours a week</span><b>${j.hours}</b></span></span>${picked ? `<span class="payweek"><span class="small">${money(j.pay)} × ${j.hours} hours</span><b>${money(wk(j))} a week</b></span>` : ''}</button>`; };
  const [a, b] = pair, diff = Math.abs(wk(a) - wk(b));
  return head + `<section class="panel" style="max-width:860px"><div class="small muted">Round ${P.i + 1} of 5</div><h2 style="margin:4px 0 16px">Which pays more each week?</h2>
    <div class="paypair" role="group" aria-label="Choose a role">${card(a)}<span class="vs" aria-hidden="true">or</span>${card(b)}</div>
    ${picked ? `<div class="explain" role="status"><b>${picked === win ? 'Correct.' : 'Not this time.'}</b> ${esc(job(win).title)} pays ${money(diff)} more each week${a.pay !== b.pay && (a.pay > b.pay) !== (wk(a) > wk(b)) ? ', even though its hourly rate is lower' : ''}.</div><button class="btn btn-primary" data-act="paynext">${P.i === 4 ? 'See my score' : 'Next round'}</button>` : ''}
  </section>`;
}
ACT.paypick = el => { const P = payState(); P.picks[P.i] = el.dataset.id; render({keepScroll:true}); const n = $('[data-act=paynext]'); if (n) n.focus(); };
ACT.paynext = () => { const P = payState(); if (P.i === 4){ P.done = true; const right = P.picks.filter((p, i) => p === payWinner(i)).length; finishGame('pay', right * 6); if (right === 5) setTimeout(confetti, 150); } else P.i++; render({keepScroll:true}); const n = $('[data-act=paypick]'); if (n) n.focus(); };

/* ===== Job Scramble ===== */
const SCRAMBLE = [
  {w:'ANALYST', s:'TSYLANA', hint:'Works with data to spot trends and explain them'},
  {w:'DESIGNER', s:'GERNSIDE', hint:'Plans how something looks and how people use it'},
  {w:'ENGINEER', s:'RINEEGEN', hint:'Designs, builds and fixes machines, systems or structures'},
  {w:'ACCOUNTANT', s:'TACCNUOTAN', hint:'Keeps the money side of a business accurate'},
  {w:'TECHNICIAN', s:'NICHECTINA', hint:'Runs and looks after equipment, often in a lab'}
];
function scrState(){ if (!S.scr) S.scr = {i:0, hints:[], solved:[], skipped:[], msg:'', done:false}; return S.scr; }
function scrambleView(){
  const R = scrState();
  const head = gameHead('scramble', 'Each set of letters spells a job title. Type your answer. A hint costs 2 points.');
  const prog = SCRAMBLE.map((_, i) => `<i class="${R.solved.includes(i) ? 'ok' : R.skipped.includes(i) ? 'skip' : i === R.i && !R.done ? 'now' : ''}"></i>`).join('');
  if (R.done) return head + `<section class="panel" style="max-width:640px"><div class="scrprog" aria-hidden="true">${prog}</div><h2>${R.solved.length} of 5 unscrambled</h2><ul class="small" style="padding-left:18px;line-height:1.7">${SCRAMBLE.map((x, i) => `<li><b>${x.w[0] + x.w.slice(1).toLowerCase()}</b>: ${esc(x.hint.toLowerCase())}${R.solved.includes(i) ? '' : ' <span class="muted">(skipped)</span>'}</li>`).join('')}</ul><div class="btnrow">${backToGames()}${shareBtn('scramble')}</div></section>`;
  const x = SCRAMBLE.at(R.i); const fresh = R.shown !== R.i; R.shown = R.i;
  return head + `<section class="panel" style="max-width:640px">
    <div class="scrprog" aria-hidden="true">${prog}</div>
    <div class="small muted" style="margin-top:10px">Word ${R.i + 1} of 5. ${x.w.length} letters</div>
    <div class="scrtiles ${fresh ? 'anim' : ''}" aria-label="Scrambled letters: ${x.s.split('').join(' ')}">${x.s.split('').map(c => `<span>${c}</span>`).join('')}</div>
    ${R.hints.includes(R.i) ? `<div class="explain" style="margin-bottom:12px"><b>Hint.</b> ${esc(x.hint)}. It starts with ${x.w[0]}.</div>` : ''}
    <form data-form="scr" class="scrform" novalidate><label for="scr-in" class="sr-only">Your answer</label><input id="scr-in" name="a" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="Your answer" value=""><button class="btn btn-primary">Check</button></form>
    <p role="status" class="small" style="font-weight:700;min-height:1.5em;margin:10px 0">${esc(R.msg)}</p>
    <div class="btnrow">${R.hints.includes(R.i) ? '' : `<button class="btn btn-ghost" data-act="scrhint">Get a hint</button>`}<button class="btn btn-quiet" data-act="scrskip">Skip this one</button></div>
  </section>`;
}
function scrAdvance(){ const R = scrState(); if (R.i === SCRAMBLE.length - 1){ R.done = true; const pts = R.solved.reduce((s, i) => s + (R.hints.includes(i) ? 4 : 6), 0); finishGame('scramble', Math.max(5, pts)); if (R.solved.length === 5) setTimeout(confetti, 150); } else R.i++; }
FORM.scr = f => {
  const R = scrState(); const a = f.a.value.trim().toUpperCase(); const x = SCRAMBLE.at(R.i);
  if (!a){ R.msg = 'Type a job title first.'; render({keepScroll:true}); $('#scr-in').focus(); return; }
  if (a === x.w){ R.solved.push(R.i); R.msg = `Yes, ${x.w[0] + x.w.slice(1).toLowerCase()}.`; scrAdvance(); }
  else R.msg = a.length !== x.w.length ? `Not quite. It has ${x.w.length} letters.` : 'Not quite. Try again.';
  render({keepScroll:true}); const n = $('#scr-in') || $('#app .btn-primary'); if (n) n.focus();
};
ACT.scrhint = () => { const R = scrState(); if (!R.hints.includes(R.i)) R.hints.push(R.i); R.msg = ''; render({keepScroll:true}); $('#scr-in').focus(); };
ACT.scrskip = () => { const R = scrState(); R.skipped.push(R.i); R.msg = `It was ${SCRAMBLE.at(R.i).w[0] + SCRAMBLE.at(R.i).w.slice(1).toLowerCase()}.`; scrAdvance(); render({keepScroll:true}); const n = $('#scr-in') || $('#app .btn-primary'); if (n) n.focus(); };

/* Keyboard play for Word Hive */
document.addEventListener('keydown', e => {
  if (!$('#hivegame') || $('#modal-root').innerHTML || (typeof tourI !== 'undefined' && tourI > -1)) return;
  if (e.target.matches('input,textarea,select')) return;
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  if (e.key === 'Enter' && e.target.closest('button')) return;
  const k = e.key.length === 1 ? e.key.toUpperCase() : e.key;
  if (k === 'Enter' || k === 'Backspace' || /^[A-Z]$/.test(k)){ e.preventDefault(); hiveKey(k); }
});

/* ===== Hub ===== */
const BOOST_HISTORY = ['2026-11-10','2026-11-11','2026-11-12','2026-11-14','2026-11-15','2026-11-16','2026-11-20','2026-11-21','2026-11-22','2026-11-23'];
function streakCalendar(){
  const days = Array.from({length:14}, (_, i) => { const x = new Date(TODAY); x.setDate(x.getDate() - 13 + i); return x; });
  const iso = x => `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`;
  return `<div class="streakcal" role="list" aria-label="Days played in the last two weeks">${days.map(x => { const k = iso(x), isToday = k === '2026-11-24', on = BOOST_HISTORY.includes(k) || (isToday && S.boost.counted); return `<div role="listitem" class="sday ${on ? 'on' : ''} ${isToday ? 'today' : ''}"><span class="small">${'SMTWTFS'[x.getDay()]}</span><i>${on ? icon('check') : ''}</i><span class="sr-only">${fmt(k)}: ${on ? 'played' : 'not played'}${isToday ? ', today' : ''}</span><span class="small muted" aria-hidden="true">${x.getDate()}</span></div>`; }).join('')}</div>`;
}
function weekGames(){ return 3 + Object.values(S.boost.played).filter(Boolean).length; }
function boostHub(){
  const P = S.boost.played;
  const played = GAMES.filter(g => P[g.key]).length;
  const lvl = Math.floor(S.boost.points / 100) + 1;
  const big = k => { const g = gameInfo(k); return `<article class="gamecard ${P[k] ? 'done' : ''}">${g.isNew ? '<span class="newtag">New</span>' : ''}<div class="gicon hex">${icon(P[k] ? 'check' : g.ic)}</div><h3 style="font-size:1.2rem;margin:4px 0 0">${g.title}</h3><p class="muted small" style="margin:0">${g.desc}</p><p class="small" style="margin:0"><b>${P[k] ? 'Done today' : `${g.pts} points`}</b> <span class="muted">${P[k] ? '' : `About ${g.mins} min`}</span></p><a class="btn ${P[k] ? 'btn-ghost' : 'btn-primary'}" href="#/intern/boost/${k}">${P[k] ? 'See result' : 'Play'}</a></article>`; };
  const small = g => `<a class="gametile ${P[g.key] ? 'done' : ''}" href="#/intern/boost/${g.key}"><span class="gicon">${icon(P[g.key] ? 'check' : g.ic)}</span><span class="grow"><span class="gt-title"><b>${g.title}</b>${g.isNew ? '<span class="newtag inline">New</span>' : ''}</span><span class="small muted">${g.desc}</span></span><span class="small gt-meta">${P[g.key] ? 'Done' : `${g.pts} pts`}</span></a>`;
  const wkg = weekGames(), wkTarget = 12;
  return `<div class="pagehead"><div><h1>Daily Career Boost</h1><p>Ten short games that build workplace know-how. Three are picked for you each day, and every game resets at midnight.</p></div>
    <div class="streak"><span class="hex">${S.boost.streak}</span><div><b>day streak</b><div class="small muted">${S.boost.points} points. Level ${lvl}</div></div></div></div>
  <div class="section-head"><h2 style="margin:0">Today's three</h2><span class="small muted">${featuredLeft() ? `${featuredLeft()} left to keep your streak` : 'All done. Your streak is safe.'}</span></div>
  <div class="gamecards">${FEATURED.map(big).join('')}</div>
  <div class="grid-2" style="margin-top:20px">
    <section class="panel"><div class="section-head" style="margin-bottom:10px"><h2 style="margin:0">Your last two weeks</h2><span class="small muted">${S.boost.streak} day streak</span></div>${streakCalendar()}<p class="small muted" style="margin:10px 0 0">Play any game to count the day.</p></section>
    <section class="panel"><div class="section-head" style="margin-bottom:10px"><h2 style="margin:0">Weekly challenge</h2><span class="chip">${icon('trophy')}+50 points</span></div><p style="margin:0 0 10px">Play ${wkTarget} games before Sunday.</p><div class="meter honey"><i style="width:${Math.min(100, wkg / wkTarget * 100)}%"></i></div><p class="small muted" style="margin:8px 0 0">${wkg >= wkTarget ? 'Challenge complete. Bonus added.' : `${wkg} of ${wkTarget} played this week`}</p></section>
  </div>
  <div class="section-head" style="margin-top:24px"><h2 style="margin:0">All games</h2><span class="small muted">${played} of ${GAMES.length} played today</span></div>
  <div class="gamelib">${GAMES.filter(g => !FEATURED.includes(g.key)).map(small).join('')}</div>
  <p class="small muted tomorrow">${icon('calendar')}Tomorrow's three: ${TOMORROW.map(k => gameInfo(k).title).join(', ')}.</p>
  ${boostExtras()}
  <section class="panel" style="margin-top:20px"><h2>New roles since your last visit</h2><div class="joblist">${liveJobs().filter(j => daysSince(j.posted) <= 5).slice(0,2).map(j => jobRow(j, {base:'#/intern/jobs', showMatch:true})).join('')}</div></section>`;
}
