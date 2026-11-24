/* ---------- Daily Career Boost ---------- */
const realToday = new Date();
const dayIndex = Math.floor((realToday - new Date(realToday.getFullYear(), 0, 0)) / 864e5);

function finishGame(key, pts){
  if (S.boost.played[key]) return;
  S.boost.played[key] = true;
  S.boost.points += pts;
  if (!S.boost.counted){ S.boost.counted = true; S.boost.streak += 1; setTimeout(() => toast(`Streak extended to ${S.boost.streak} days. +${pts} points`), 400); }
  else setTimeout(() => toast(`+${pts} points`), 400);
}

function boostView(game){
  if (game === 'wordle') return wordleView();
  if (game === 'quiz') return quizView();
  if (game === 'match') return matchView();
  const P = S.boost.played;
  const card = (key, ic, title, desc, pts) => `<article class="gamecard ${P[key] ? 'done' : ''}"><div class="gicon hex">${icon(P[key] ? 'check' : ic)}</div><h2 style="font-size:1.2rem;margin:4px 0 0">${title}</h2><p class="muted small" style="margin:0">${desc}</p><p class="small" style="margin:0"><b>${P[key] ? 'Done today' : `${pts} points`}</b></p>
    <a class="btn ${P[key] ? 'btn-ghost' : 'btn-primary'}" href="#/intern/boost/${key}">${P[key] ? 'See result' : 'Play'}</a></article>`;
  const played = Object.values(P).filter(Boolean).length;
  return `<div class="pagehead"><div><h1>Daily Career Boost</h1><p>Three short games a day to sharpen your workplace know-how. New ones every morning.</p></div>
    <div class="streak"><span class="hex">${S.boost.streak}</span><div><b>day streak</b><div class="small muted">${S.boost.points} points</div></div></div></div>
  <div class="gamecards">
    ${card('wordle','grid','Career Wordle','Guess today\'s five-letter workplace word in six tries.',30)}
    ${card('quiz','quiz','Workplace Quiz','Five quick questions on interviews and first days, with tips after each.',50)}
    ${card('match','link','Skill Match','Pair four skills with the roles that use them.',20)}
  </div>${boostExtras()}
  <section class="panel" style="margin-top:20px"><h2>Today</h2>
    <div class="meter honey" style="margin-bottom:8px"><i style="width:${played / 3 * 100}%"></i></div>
    <p class="small" style="margin:0">${played} of 3 games played. ${S.boost.streak >= 7 ? '' : `Keep going for ${7 - S.boost.streak} more ${7 - S.boost.streak === 1 ? 'day' : 'days'} to earn the 7-day streak badge.`}</p>
  </section>
  <section class="panel"><h2>New roles since your last visit</h2><div class="joblist">${liveJobs().filter(j => daysSince(j.posted) <= 5).slice(0,2).map(j => jobRow(j, {base:'#/intern/jobs', showMatch:true})).join('')}</div></section>`;
}

/* Career Wordle */
function wordleState(){
  if (!S.wordle){ const w = WORDS[dayIndex % WORDS.length]; S.wordle = {answer:w.w, def:w.def, guesses:[], cur:'', done:false, won:false, msg:''}; }
  return S.wordle;
}
function scoreGuess(g, ans){
  const res = Array(5).fill('absent'); const a = ans.split(''); const used = Array(5).fill(false);
  for (let i = 0; i < 5; i++) if (g[i] === a[i]){ res[i] = 'correct'; used[i] = true; }
  for (let i = 0; i < 5; i++){ if (res[i] === 'correct') continue; const k = a.findIndex((c,j) => c === g[i] && !used[j]); if (k > -1){ res[i] = 'present'; used[k] = true; } }
  return res;
}
const WL = {correct:'right letter, right place', present:'in the word, wrong place', absent:'not in the word'};
function wordleBoard(){
  const W = wordleState();
  let rows = '';
  for (let r = 0; r < 6; r++){
    const g = W.guesses[r];
    let tiles = '', sr = '';
    if (g){ const sc = scoreGuess(g, W.answer); tiles = g.split('').map((c,i) => `<div class="tile hex ${sc[i]}">${c}</div>`).join(''); sr = `<span class="sr-only">Guess ${r + 1}: ${g.split('').map((c,i) => `${c} ${WL[sc[i]]}`).join(', ')}.</span>`; }
    else if (r === W.guesses.length && !W.done){ tiles = Array.from({length:5}, (_,i) => `<div class="tile hex ${W.cur[i] ? 'filled' : ''}">${W.cur[i] || ''}</div>`).join(''); }
    else tiles = Array.from({length:5}, () => '<div class="tile hex"></div>').join('');
    rows += `<div class="wrow" aria-hidden="${g ? 'false' : 'true'}">${g ? `<span aria-hidden="true" style="display:contents">${tiles}</span>${sr}` : tiles}</div>`;
  }
  const states = {};
  W.guesses.forEach(g => scoreGuess(g, W.answer).forEach((s,i) => { const c = g[i]; const rank = {correct:3,present:2,absent:1}; if (!states[c] || rank[s] > rank[states[c]]) states[c] = s; }));
  const kb = ['QWERTYUIOP','ASDFGHJKL','+ZXCVBNM-'].map(row => `<div>${row.split('').map(k => k === '+' ? `<button class="wide" data-act="wk" data-k="Enter">Enter</button>` : k === '-' ? `<button class="wide" data-act="wk" data-k="Backspace" aria-label="Delete letter">Delete</button>` : `<button class="${states[k] || ''}" data-act="wk" data-k="${k}" aria-label="${k}${states[k] ? ', ' + WL[states[k]] : ''}">${k}</button>`).join('')}</div>`).join('');
  return `<div class="wordle" role="group" aria-label="Guesses">${rows}</div>
    <p role="status" class="small" style="text-align:center;min-height:1.5em;font-weight:700">${esc(W.msg)}</p>
    ${W.done ? `<div class="panel" style="max-width:520px;margin:0 auto;text-align:center"><h2>${W.won ? 'Nice work' : 'Today\'s word'}: ${W.answer}</h2><p>${esc(W.answer[0] + W.answer.slice(1).toLowerCase())} is ${esc(W.def)}</p><a class="btn btn-primary" href="#/intern/boost">Back to today's games</a></div>` : `<div class="kbd" aria-label="Keyboard">${kb}</div>`}
    <div class="legend" style="margin-top:16px"><span><i style="background:var(--mint)"></i>Right letter, right place</span><span><i style="background:#FFB547"></i>In the word, wrong place</span><span><i style="background:#7C8396"></i>Not in the word</span></div>`;
}
function wordleView(){
  return `<a class="back" href="#/intern/boost">${icon('left')}Daily Career Boost</a><div class="pagehead"><div><h1>Career Wordle</h1><p>Guess the five-letter workplace word. You have six tries. Type on your keyboard or use the keys below.</p></div></div><div id="wordle">${wordleBoard()}</div>`;
}
function wordleKey(k){
  const W = wordleState(); if (W.done) return;
  W.msg = '';
  if (k === 'Enter'){
    if (W.cur.length < 5){ W.msg = 'Enter five letters'; }
    else {
      W.guesses.push(W.cur); W.cur = '';
      if (W.guesses.at(-1) === W.answer){ W.done = true; W.won = true; W.msg = `Solved in ${W.guesses.length} ${W.guesses.length === 1 ? 'try' : 'tries'}`; finishGame('wordle', 30); setTimeout(confetti, 150); }
      else if (W.guesses.length === 6){ W.done = true; W.msg = 'Out of tries. Here is today\'s word.'; finishGame('wordle', 10); }
    }
  } else if (k === 'Backspace'){ W.cur = W.cur.slice(0, -1); }
  else if (/^[A-Z]$/.test(k) && W.cur.length < 5){ W.cur += k; }
  const box = $('#wordle'); if (box) box.innerHTML = wordleBoard();
}
ACT.wk = el => { wordleKey(el.dataset.k); const b = $(`[data-act=wk][data-k="${el.dataset.k}"]`); if (b) b.focus(); };
document.addEventListener('keydown', e => {
  if (!$('#wordle') || $('#modal-root').innerHTML) return;
  if (e.target.matches('input,textarea,select')) return;
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  if (e.key === 'Enter' && e.target.closest('button')) return;
  const k = e.key.length === 1 ? e.key.toUpperCase() : e.key;
  if (k === 'Enter' || k === 'Backspace' || /^[A-Z]$/.test(k)){ e.preventDefault(); wordleKey(k); }
});

/* Workplace Quiz */
function quizView(){
  if (!S.quiz) S.quiz = {i:0, picked:null, score:0, done:false};
  const Q = S.quiz;
  const head = `<a class="back" href="#/intern/boost">${icon('left')}Daily Career Boost</a><div class="pagehead"><div><h1>Workplace Quiz</h1><p>Five questions. Tips after each one.</p></div></div>`;
  if (Q.done) return head + `<div class="panel" style="max-width:640px"><h2>You scored ${Q.score} out of ${QUIZ.length}</h2><p>${Q.score === 5 ? 'Perfect. You are interview-ready.' : 'Good effort. The tips are worth a second read before your next interview.'}</p><a class="btn btn-primary" href="#/intern/boost">Back to today's games</a></div>`;
  const q = QUIZ[Q.i];
  return head + `<div class="panel" style="max-width:680px">
    <p class="small muted" style="margin:0 0 4px">Question ${Q.i + 1} of ${QUIZ.length}</p>
    <div class="meter honey" style="margin-bottom:16px"><i style="width:${(Q.i) / QUIZ.length * 100}%"></i></div>
    <h2 style="font-size:1.25rem">${esc(q.q)}</h2>
    <div role="group" aria-label="Answers">${q.opts.map((o,i) => {
      const cls = Q.picked === null ? '' : i === q.a ? 'right' : i === Q.picked ? 'wrong' : '';
      const mark = Q.picked === null ? '' : i === q.a ? ' (correct answer)' : i === Q.picked ? ' (your answer)' : '';
      return `<button class="quizopt ${cls}" data-act="qpick" data-i="${i}" ${Q.picked !== null ? 'disabled' : ''}>${esc(o)}${mark ? `<span class="small" style="font-weight:400">${mark}</span>` : ''}</button>`; }).join('')}</div>
    ${Q.picked !== null ? `<div class="explain" role="status"><b>${Q.picked === q.a ? 'Correct.' : 'Not quite.'}</b> ${esc(q.why)}</div><button class="btn btn-primary" data-act="qnext">${Q.i === QUIZ.length - 1 ? 'See my score' : 'Next question'}</button>` : ''}
  </div>`;
}
ACT.qpick = el => { const Q = S.quiz; Q.picked = +el.dataset.i; if (Q.picked === QUIZ[Q.i].a) Q.score++; render({keepScroll:true, keepFocus:true}); const n = $('[data-act=qnext]'); if (n) n.focus(); };
ACT.qnext = () => { const Q = S.quiz; if (Q.i === QUIZ.length - 1){ Q.done = true; finishGame('quiz', Q.score * 10); } else { Q.i++; Q.picked = null; } render({keepScroll:true}); };

/* Skill Match */
function matchView(){
  if (!S.match){ const order = [2,0,3,1]; S.match = {sel:null, paired:[], jobs:order.map(i => MATCH[i].job), wrong:null}; }
  const M = S.match;
  const done = M.paired.length === MATCH.length;
  return `<a class="back" href="#/intern/boost">${icon('left')}Daily Career Boost</a><div class="pagehead"><div><h1>Skill Match</h1><p>Choose a skill, then choose the role that uses it most.</p></div></div>
  <div class="panel" style="max-width:820px">
    <div class="matchgrid">
      <div role="group" aria-label="Skills"><h2 style="font-size:1rem">Skills</h2>${MATCH.map((m,i) => { const p = M.paired.includes(i); return `<button class="matchbtn ${p ? 'paired' : ''}" data-act="mskill" data-i="${i}" aria-pressed="${M.sel === i}" ${p ? 'disabled' : ''}>${esc(m.skill)}${p ? ' (matched)' : ''}</button>`; }).join('')}</div>
      <div role="group" aria-label="Roles"><h2 style="font-size:1rem">Roles</h2>${M.jobs.map(jb => { const idx = MATCH.findIndex(m => m.job === jb); const p = M.paired.includes(idx); return `<button class="matchbtn ${p ? 'paired' : ''} ${M.wrong === jb ? 'shake' : ''}" data-act="mjob" data-job="${esc(jb)}" ${p ? 'disabled' : ''}>${esc(jb)}${p ? ' (matched)' : ''}</button>`; }).join('')}</div>
    </div>
    <p role="status" class="small" style="font-weight:700;min-height:1.5em">${done ? 'All four matched.' : M.wrong ? 'Not that one. Try another role.' : M.sel !== null ? 'Now choose a role.' : ''}</p>
    ${done ? `<a class="btn btn-primary" href="#/intern/boost">Back to today's games</a>` : ''}
  </div>`;
}
ACT.mskill = el => { S.match.sel = +el.dataset.i; S.match.wrong = null; render({keepScroll:true, keepFocus:true}); $(`[data-act=mskill][data-i="${el.dataset.i}"]`).focus(); };
ACT.mjob = el => {
  const M = S.match; if (M.sel === null){ return; }
  if (MATCH[M.sel].job === el.dataset.job){ M.paired.push(M.sel); M.sel = null; M.wrong = null; if (M.paired.length === MATCH.length) finishGame('match', 20); }
  else M.wrong = el.dataset.job;
  render({keepScroll:true, keepFocus:true});
  const next = $('[data-act=mskill]:not([disabled])') || $('#app .btn-primary'); if (next) next.focus();
};
