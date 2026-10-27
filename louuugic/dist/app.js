import { OPERATIONS, COLORS, WEEKDAYS, uid, localDate, fromDate, shiftDate, weekday, daysInMonth, calculate, createChallenge, isScheduled, getStatus, daySummary, habitStreak, defaultState, validateState } from './core.js';

const paths = {
  home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
  brain: '<path d="M12 5a3 3 0 0 0-5-2 3.5 3.5 0 0 0-3 5 4 4 0 0 0-1 7 3.5 3.5 0 0 0 4 5 3 3 0 0 0 5-2V5Zm0 0a3 3 0 0 1 5-2 3.5 3.5 0 0 1 3 5 4 4 0 0 1 1 7 3.5 3.5 0 0 1-4 5 3 3 0 0 1-5-2"/><path d="M7 7c0 2 1 3 3 3m-6 5c2-1 3 0 4 1m9-9c0 2-1 3-3 3m6 5c-2-1-3 0-4 1"/>',
  leaf: '<path d="M20 3c-8-1-16 3-16 10a7 7 0 0 0 7 7c7 0 10-9 9-17Z"/><path d="M4 21 15 10M9 16V9m0 7h7"/>',
  chart: '<path d="M4 3v17h17M8 15v-4m5 4V7m5 8V4"/>',
  settings: '<path d="m10 3-1 3-3 1-3 3 2 3-1 4 3 2 3-1 3 3 3-2 4-1v-4l2-3-2-3-3-1-1-3z"/><circle cx="12" cy="12" r="3"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 2-2.5 2-2.5 4m0 3h.01"/>',
  chevron: '<path d="m9 5 7 7-7 7"/>', left: '<path d="m15 5-7 7 7 7"/>',
  plus: '<path d="M12 5v14M5 12h14"/>', close: '<path d="m6 6 12 12M6 18 18 6"/>',
  check: '<path d="m5 12 4 4L19 6"/>', arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4m10-4v4M3 11h18m-13 5h.01m4 0h.01m4 0h.01"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1"/>',
  sparkle: '<path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2Z"/>',
  flame: '<path d="M12 2c3 5 0 6 3 9 1-1 2-2 2-4 6 6 5 14-4 14-9 0-12-8-6-14 0 4 2 4 3 6 2-3-1-6 2-11Z"/>',
  bolt: '<path d="m13 2-9 12h7l-1 8 10-13h-7l1-7z"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  refresh: '<path d="M20 7a9 9 0 0 0-15-2L3 7m0-5v5h5m-4 10a9 9 0 0 0 15 2l2-2m0 5v-5h-5"/>',
  light: '<path d="M9 18h6m-5 3h4M8 14a6 6 0 1 1 8 0c-1 1-1 2-1 2H9s0-1-1-2Z"/>',
  book: '<path d="M12 5c-3-2-6-2-10-1v15c4-1 7-1 10 1 3-2 6-2 10-1V4c-4-1-7-1-10 1v15"/>',
  run: '<circle cx="15" cy="4" r="2"/><path d="m12 9-4 4-4-1m16-1-4 1-4-3-3 7 5 3-1 4M9 16l-5 6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  briefcase: '<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V3h8v4M3 12c5 3 13 3 18 0m-9 0v4"/>',
  heart: '<path d="M20 5c-3-3-6-1-8 1-2-2-5-4-8-1-5 5 2 11 8 16 6-5 13-11 8-16Z"/>',
  edit: '<path d="m16 3 5 5-12 12-6 1 1-6L16 3Zm-2 2 5 5"/>',
  trash: '<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/>',
  volume: '<path d="m11 4-6 5H2v6h3l6 5V4Zm4 4a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>',
  muted: '<path d="m11 4-6 5H2v6h3l6 5V4Zm5 5 6 6m-6 0 6-6"/>',
  download: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
  upload: '<path d="M12 16V4m-5 5 5-5 5 5M4 16v5h16v-5"/>',
  lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V6a4 4 0 0 1 8 0v4m-4 4v3"/>',
  trophy: '<path d="M7 3h10v6a5 5 0 0 1-10 0V3ZM7 5H3v3a4 4 0 0 0 4 4m10-7h4v3a4 4 0 0 1-4 4m-5 2v6m-5 1h10"/>',
  play: '<path d="m8 4 12 8-12 8V4Z"/>',
  logo: '<path d="M5 6v9a7 7 0 0 0 14 0V6M5 2h.01M19 2h.01"/>'
};
const icon = (name, cls = '') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.sparkle}</svg>`;
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const $ = s => document.querySelector(s);
const STORAGE_KEY = 'louuugic-v1';
let storageAvailable = true;
let state = defaultState();
try { const saved = localStorage.getItem(STORAGE_KEY); if (saved) state = validateState(JSON.parse(saved)); } catch (error) { storageAvailable = false; }
let view = ['home', 'training', 'habits', 'progress'].includes(location.hash.slice(1)) ? location.hash.slice(1) : 'home';
let today = localDate(), selectedDate = today, visibleMonth = fromDate(today).getMonth(), visibleYear = fromDate(today).getFullYear(), progressYear = visibleYear;
let operation = 'sum', difficulty = 'easy', challenge = createChallenge(operation, difficulty), selected = [], solved = false, feedback = '', feedbackType = '', streak = 0, sessionCorrect = 0, sessionAttempts = 0;
let timed = false, seconds = 60, deadline = 0, timerId = null, timerFinished = false;
let formColor = 'green', formIcon = 'sun', toastTimeout, modalTrigger;
const viewNames = { home: 'Mi espacio', training: 'Gimnasio mental', habits: 'Mis hábitos', progress: 'Mi progreso' };
const monthName = (year, month) => new Intl.DateTimeFormat('es', { month: 'long' }).format(new Date(year, month, 1));
const prettyDate = (key, options = { weekday: 'long', day: 'numeric', month: 'long' }) => new Intl.DateTimeFormat('es-CO', options).format(fromDate(key));
const isFuture = key => key > today;
const totalMath = () => Object.values(state.math.days).reduce((a, d) => ({ correct: a.correct + d.correct, attempts: a.attempts + d.attempts, xp: a.xp + d.xp }), { correct: 0, attempts: 0, xp: 0 });
const todayMath = () => state.math.days[today] || { correct: 0, attempts: 0, xp: 0 };
const levelNumber = () => Math.floor(totalMath().xp / 100) + 1;
function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); storageAvailable = true; }
  catch { storageAvailable = false; toast('No se pudo guardar. Exporta un respaldo desde Ajustes.'); }
}
function toast(message) { const el = $('#toast'); el.textContent = message; el.classList.add('visible'); clearTimeout(toastTimeout); toastTimeout = setTimeout(() => el.classList.remove('visible'), 4000); }
function sound(success) {
  if (!state.sound) return;
  try { const ctx = new (window.AudioContext || window.webkitAudioContext)(); const gain = ctx.createGain(); gain.connect(ctx.destination); gain.gain.setValueAtTime(.06, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .35); const osc = ctx.createOscillator(); osc.type = 'sine'; osc.frequency.setValueAtTime(success ? 523.25 : 220, ctx.currentTime); osc.frequency.setValueAtTime(success ? 783.99 : 174.61, ctx.currentTime + .12); osc.connect(gain); osc.start(); osc.stop(ctx.currentTime + .35); osc.onended = () => ctx.close(); } catch {}
}
function celebrate() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  $('#celebration').innerHTML = Array.from({ length: 28 }, () => `<i class="confetti" style="--x:${Math.random() * 100}vw;--drift:${Math.random() * 160 - 80}px;--c:${['#aac780', '#dfb488', '#688951', '#d2a7b6'][Math.floor(Math.random() * 4)]};--delay:${Math.random() * .3}s"></i>`).join('');
  setTimeout(() => { $('#celebration').innerHTML = ''; }, 2500);
}
function shell() {
  const nav = [['home', 'home', 'Mi espacio'], ['training', 'brain', 'Gimnasio mental'], ['habits', 'leaf', 'Mis hábitos'], ['progress', 'chart', 'Mi progreso']];
  $('#app').innerHTML = `<aside class="sidebar" aria-label="Navegación principal">
    <a href="#home" class="brand" aria-label="LouuuGic, ir al inicio"><span class="brand-mark">${icon('logo')}</span><span class="brand-word">Louuu<span>Gic</span></span></a>
    <p class="nav-label">TU PEQUEÑO GRAN CAMBIO</p>
    <nav class="nav-list">${nav.map(([key, name, label]) => `<button class="nav-item ${view === key ? 'active' : ''}" data-action="navigate" data-view="${key}" ${view === key ? 'aria-current="page"' : ''}>${icon(name)}<span>${label}</span></button>`).join('')}</nav>
    <div class="sidebar-grow"></div>
    <div class="seed-card"><div class="plant" aria-hidden="true"><i></i><i></i><i></i></div><h4>Todo empieza contigo.</h4><p>Las pequeñas acciones de hoy<br>son los grandes cambios de mañana.</p></div>
    <div class="side-bottom"><button class="nav-item" data-action="settings">${icon('settings')}<span>Ajustes y respaldo</span></button><button class="nav-item" data-action="help">${icon('help')}<span>¿Cómo funciona?</span></button><div class="local-status"><i class="status-dot"></i>Un espacio solo para ti</div></div>
  </aside>
  <div class="workspace"><header class="topbar"><div class="breadcrumb">Tu camino ${icon('chevron')} <b>${viewNames[view]}</b></div><a href="#home" class="mobile-brand"><span class="brand-mark">${icon('logo')}</span><span class="brand-word">Louuu<span>Gic</span></span></a><div class="top-actions"><span class="date-label">${icon('calendar')}${esc(prettyDate(today, { day: 'numeric', month: 'short', year: 'numeric' }))}</span><button class="icon-button" data-action="help" aria-label="Cómo funciona">${icon('help')}</button><button class="avatar" data-action="settings" aria-label="Abrir mi perfil y ajustes">${esc(state.name ? state.name.slice(0, 2).toUpperCase() : 'TÚ')}</button></div></header>
  <main id="main" class="main" tabindex="-1">${!storageAvailable ? '<div class="storage-warning" role="alert">El almacenamiento del navegador no está disponible o el respaldo guardado no se pudo leer. Tus cambios podrían perderse al cerrar. Exporta tus datos desde Ajustes.</div>' : ''}${view === 'home' ? homeView() : view === 'training' ? trainingView() : view === 'habits' ? habitsView() : progressView()}${footer()}</main></div>`;
}
function footer() { return `<footer class="footer"><span>${icon('heart')} Hecho para crecer, a tu ritmo.</span><span>${icon('lock')} Tus datos se guardan en este navegador</span><button class="footer-brand" data-action="settings">LouuuGic · un día a la vez</button></footer>`; }
function homeView() {
  const name = state.name ? `, ${esc(state.name.split(' ')[0])}` : '';
  return `<div class="page-heading"><div><h1>Qué bueno tenerte aquí${name}<span style="color:#b6c38f">.</span></h1><p>Un nuevo día para entrenar tu mente y acercarte a tus metas.</p></div><span class="outline-pill">${icon('sun')} Un día a la vez</span></div>
  <section class="hero" aria-label="Bienvenida"><div class="hero-copy"><div class="eyebrow">${icon('sparkle')} TU MEJOR VERSIÓN EMPIEZA HOY</div><h2>Un poquito cada día.<br><em>Un mundo de posibilidades.</em></h2><p>Despierta tu lógica. Cultiva tus hábitos.<br>Descubre todo lo que puedes lograr.</p></div><div class="hero-art" aria-hidden="true"><div class="orbit"></div><div class="orbit second"></div><div class="float-block a">+</div><div class="float-block b">×</div><div class="float-block c">÷</div><span class="art-spark">✧</span><span class="art-dot"></span>${icon('leaf', 'hero-squiggle')}</div></section>
  <div class="dashboard-grid"><section><div class="section-heading"><h2>${icon('brain')} Un poco de gimnasia mental</h2><button class="text-button" data-action="navigate" data-view="training">Explorar ${icon('arrow')}</button></div><div id="game">${gameView()}</div></section><div>${todayView()}<div class="note-card"><span class="note-icon">${icon('light')}</span><div><h4>La constancia vale más que la perfección.</h4><p>Empieza pequeño. Repite mañana. Celebra cada paso.</p></div></div></div></div>${statsRow()}`;
}
function statCard(name, color, value, label) { return `<div class="stat-card"><span class="stat-icon color-${color}">${icon(name)}</span><div><strong>${value}</strong><p>${label}</p></div></div>`; }
function statsRow() {
  const summary = daySummary(state.habits, today), daily = todayMath();
  const best = Math.max(0, ...state.habits.map(h => habitStreak(h, today)));
  return `<div class="stats-row">${statCard('flame', 'orange', `${best} <small>${best === 1 ? 'día' : 'días'}</small>`, 'Tu mejor racha actual')}${statCard('bolt', 'green', `${daily.xp} <small>XP</small>`, 'Energía mental de hoy')}${statCard('target', 'purple', `${summary.done}<small> / ${summary.total}</small>`, 'Metas cumplidas hoy')}</div>`;
}
function gameView() {
  const op = OPERATIONS[operation];
  const values = selected.map(id => challenge.tiles.find(t => t.id === id)?.value);
  return `<div class="panel game-panel"><div class="game-top"><span class="game-label"><i></i> ${timed ? 'CONTRARRELOJ' : 'CADA RETO ES DIFERENTE'}</span><select class="small-select" id="difficulty" aria-label="Dificultad del ejercicio"><option value="easy" ${difficulty === 'easy' ? 'selected' : ''}>Nivel semilla</option><option value="medium" ${difficulty === 'medium' ? 'selected' : ''}>Nivel brote</option><option value="hard" ${difficulty === 'hard' ? 'selected' : ''}>Nivel árbol</option></select></div>
  <div class="operation-tabs" role="group" aria-label="Tipo de operación">${Object.entries(OPERATIONS).map(([key, o]) => `<button class="operation-tab ${operation === key ? 'active' : ''}" data-action="operation" data-op="${key}" aria-pressed="${operation === key}" title="${o.name}"><span class="op-symbol">${o.symbol === '^' ? 'xⁿ' : o.symbol}</span><span>${{ sum: 'Suma', sub: 'Resta', mul: 'Multiplica', div: 'Divide', pow: 'Potencia' }[key]}</span></button>`).join('')}</div>
  <div class="challenge-area"><p class="challenge-prompt">${operation === 'pow' ? '¿Qué base y exponente dan este número?' : operation === 'sub' || operation === 'div' ? 'Elige dos números, en el orden correcto' : 'Encuentra los dos números que dan'}</p><div class="target-wrap"><span class="target-number" aria-label="Objetivo: ${challenge.target}">${challenge.target}</span><span class="target-spark" aria-hidden="true">✧</span><span class="target-dot" aria-hidden="true"></span></div><p class="challenge-caption">${operation === 'pow' ? 'Una base. Un exponente. Muchas posibilidades.' : 'Un objetivo. Muchas formas de pensar.'}</p></div>
  <div class="expression" aria-label="${values.length ? values.join(` ${op.symbol} `) : 'Elige tu respuesta'}"><span class="expression-slot ${values[0] !== undefined ? 'filled' : ''}">${values[0] ?? '?'}</span><span>${op.symbol}</span><span class="expression-slot ${values[1] !== undefined ? 'filled' : ''}">${values[1] ?? '?'}</span><span class="expression-equals">=</span><span class="expression-result">${challenge.target}</span></div>
  <div class="number-grid" aria-label="Números para elegir">${challenge.tiles.map((t, i) => `<button style="--i:${i}" class="number-tile ${selected.includes(t.id) ? 'selected' : ''}" data-action="tile" data-id="${t.id}" aria-pressed="${selected.includes(t.id)}" aria-label="${t.value}${selected.includes(t.id) ? `, elección ${selected.indexOf(t.id) + 1}` : ''}" ${solved || timerFinished ? 'disabled' : ''}>${t.value}${selected.includes(t.id) ? `<span class="tile-order">${selected.indexOf(t.id) + 1}º</span>` : ''}</button>`).join('')}</div>
  <div class="game-actions"><button class="btn btn-secondary" data-action="hint" aria-label="Pedir una pista" title="Dame una pista" ${solved || timerFinished ? 'disabled' : ''}>${icon('light')}</button><button class="btn btn-primary" data-action="${solved ? 'next' : 'check'}" ${timerFinished || (!solved && selected.length !== 2) ? 'disabled' : ''}>${timerFinished ? 'Minuto completado' : solved ? '¡Vamos por otro!' : 'Comprobar'}${icon(solved ? 'arrow' : 'check')}</button><button class="btn btn-secondary" data-action="next" aria-label="Generar otro reto" title="Otro reto" ${timerFinished ? 'disabled' : ''}>${icon('refresh')}</button></div>
  <div class="game-feedback ${feedbackType}" role="status" aria-live="polite">${feedback || 'Toca dos números y pon a prueba tu intuición.'}</div><div class="game-footer"><span>${icon('bolt')} +${difficulty === 'hard' ? 20 : difficulty === 'medium' ? 15 : 10} XP por acierto</span><span>${icon('flame')} ${streak} seguidos</span><button data-action="sound" aria-label="${state.sound ? 'Desactivar' : 'Activar'} sonido" aria-pressed="${state.sound}">${icon(state.sound ? 'volume' : 'muted')}</button></div></div>`;
}
function updateGame() { const el = $('#game'); const active = el?.contains(document.activeElement) ? document.activeElement?.closest('[data-action]')?.dataset : null; if (el) el.innerHTML = gameView(); const stats = $('#session-stats'); if (stats) stats.innerHTML = sessionStats(); const row = $('.stats-row'); if (row) row.outerHTML = statsRow(); if (active) { const action = active.action === 'check' && solved ? 'next' : active.action; const focus = el.querySelector(`[data-action="${action}"]${active.id ? `[data-id="${CSS.escape(active.id)}"]` : active.op ? `[data-op="${active.op}"]` : ''}:not(:disabled)`) || el.querySelector('.number-tile:not(:disabled)'); focus?.focus({ preventScroll: true }); } }
function resetChallenge() { challenge = createChallenge(operation, difficulty, challenge.target); selected = []; solved = false; feedback = ''; feedbackType = ''; updateGame(); }
function trainingView() {
  return `<div class="page-heading"><div><h1>Dale movimiento a tu mente<span style="color:#b6c38f">.</span></h1><p>Sin presión. Sin fracciones largas. Solo tú y el siguiente reto.</p></div><div class="game-toolbar"><button class="timer-button ${timed ? 'active' : ''}" data-action="timer">${icon('clock')}${timed ? 'Salir del reloj' : 'Reto de 60 s'}</button></div></div>
  <div class="training-layout"><section id="game">${gameView()}</section><aside class="training-aside"><div class="panel info-panel"><h3>¿Cómo se juega?</h3><div class="step"><span>1</span><p>Elige una operación y un nivel que te resulte cómodo.</p></div><div class="step"><span>2</span><p>Toca dos números para formar el resultado del centro. Puedes volver a tocarlos para cambiar tu elección.</p></div><div class="step"><span>3</span><p>Comprueba tu respuesta. Si te atascas, pide una pista o prueba con otro reto.</p></div><p>En resta, división y potencias, el orden importa.</p></div><div class="panel info-panel"><h3>Tu entrenamiento de hoy</h3><p>Cada intento cuenta para seguir aprendiendo.</p><div class="session-stats" id="session-stats">${sessionStats()}</div><div id="timer-block" ${!timed ? 'hidden' : ''}><div class="section-divider"></div><p style="text-align:center">Tu minuto de concentración</p><div class="timer-display" id="timer-display" aria-live="off">${seconds}s</div><button class="btn btn-secondary" data-action="restart-timer" style="width:100%;margin-top:12px">${icon('refresh')} Reiniciar minuto</button></div></div><div class="note-card" style="margin:0"><span class="note-icon">${icon('leaf')}</span><div><h4>Aprender también es equivocarse.</h4><p>Cambia de estrategia, toma aire y vuelve a intentarlo.</p></div></div></aside></div>`;
}
function sessionStats() { const d = todayMath(); return `<div><strong>${d.correct}</strong><p>retos resueltos</p></div><div><strong>${d.attempts ? Math.round(d.correct / d.attempts * 100) : 0}<small>%</small></strong><p>de precisión</p></div>`; }
function todayView() {
  const summary = daySummary(state.habits, selectedDate);
  const weekStart = shiftDate(selectedDate, -weekday(selectedDate));
  const habits = state.habits.filter(h => isScheduled(h, selectedDate)).sort((a, b) => a.startTime.localeCompare(b.startTime));
  const dateText = selectedDate === today ? 'Tu día, a tu manera' : prettyDate(selectedDate, { day: 'numeric', month: 'long' });
  return `<section class="today-section"><div class="section-heading today-heading"><h2>${icon('leaf')} Pequeños pasos, grandes hábitos</h2></div><div class="panel today-panel"><div class="today-top"><strong>${esc(dateText)}</strong><button class="text-button" data-action="navigate" data-view="habits">${icon('calendar')} Mi calendario</button></div><div class="week-strip" aria-label="Elegir un día de la semana">${Array.from({ length: 7 }, (_, i) => { const key = shiftDate(weekStart, i); return `<button class="week-day ${key === selectedDate ? 'selected' : ''} ${key === today ? 'today' : ''}" data-action="select-day" data-date="${key}" aria-label="${esc(prettyDate(key))}" aria-pressed="${key === selectedDate}"><span>${WEEKDAYS[i]}</span><b>${fromDate(key).getDate()}</b><i></i></button>`; }).join('')}</div>
  ${summary.total ? `<div class="day-progress"><div class="mini-ring" style="--progress:${summary.percent}"><span>${summary.percent}%</span></div><div><strong>${summary.done} de ${summary.total} metas cumplidas</strong><p>${summary.percent === 100 ? 'Cada paso cuenta. ¡Hoy lo lograste!' : isFuture(selectedDate) ? 'Tu próximo paso ya tiene su espacio.' : 'Tu próximo pequeño paso te espera.'}</p></div>${icon(summary.percent === 100 ? 'sparkle' : 'target')}</div><div class="habit-list">${habits.map(h => habitRow(h, selectedDate)).join('')}</div><button class="add-habit-line" data-action="new-habit">${icon('plus')} Añadir una meta</button>${isFuture(selectedDate) ? '<p class="form-note" style="margin-top:10px;text-align:center">Podrás marcar estas metas cuando llegue el día.</p>' : ''}` : `<div class="empty-habits"><span class="empty-symbol">${icon('leaf')}</span><h3>Todo gran hábito empieza pequeño.</h3><p>${state.habits.length ? 'No tienes metas para este día. Deja espacio para descansar o planea algo nuevo.' : 'Leer, moverte, aprender algo nuevo…<br>Haz espacio para lo que te hace bien.'}</p><button class="btn btn-primary" data-action="new-habit">${icon('plus')} Crear ${state.habits.length ? 'una meta' : 'mi primera meta'}</button></div><p class="suggestion-label" style="text-align:center">¿UN POCO DE INSPIRACIÓN?</p><div class="suggestions"><button class="suggestion" data-action="template" data-template="read">${icon('book')} Leer</button><button class="suggestion" data-action="template" data-template="move">${icon('run')} Moverme</button><button class="suggestion" data-action="template" data-template="study">${icon('brain')} Aprender</button></div>`}</div></section>`;
}
function habitRow(h, key) {
  const status = getStatus(h, key), future = isFuture(key);
  return `<div class="habit-row ${status === 'done' ? 'habit-done' : ''}"><span class="habit-icon color-${h.color}">${icon(h.icon)}</span><div class="habit-info"><p class="habit-name">${esc(h.name)}</p><small>${icon('clock')}${h.startTime} – ${h.endTime}${status === 'missed' ? ' · No cumplida' : ''}</small></div><button class="miss-button" data-action="mark-missed" data-id="${esc(h.id)}" data-date="${key}" aria-label="${status === 'missed' ? 'Volver a pendiente' : 'Marcar no cumplida'}: ${esc(h.name)}" title="${status === 'missed' ? 'Volver a pendiente' : 'Hoy no pude'}" ${future ? 'disabled' : ''}>${icon('close')}</button><button class="check-button ${status}" data-action="mark-done" data-id="${esc(h.id)}" data-date="${key}" aria-label="${status === 'done' ? 'Volver a pendiente' : 'Marcar cumplida'}: ${esc(h.name)}" aria-pressed="${status === 'done'}" ${future ? 'disabled' : ''}>${status === 'done' ? icon('check') : status === 'missed' ? icon('close') : ''}</button></div>`;
}
function habitsView() {
  return `<div class="page-heading"><div><h1>Haz espacio para lo que importa<span style="color:#b6c38f">.</span></h1><p>Tus metas, tu tiempo y una nueva oportunidad cada día.</p></div><button class="btn btn-primary" data-action="new-habit">${icon('plus')} Nueva meta</button></div><div class="habits-layout"><section class="panel calendar-panel">${calendarView()}</section><div>${todayView()}</div></div><section class="all-habits"><div class="section-heading"><h2>Mis metas <span style="font-size:13px;color:#a8b49a;margin-left:6px">${state.habits.length}</span></h2><span class="form-note">Hechas a tu medida</span></div>${state.habits.length ? `<div class="manage-grid">${state.habits.map(h => manageHabit(h)).join('')}</div>` : `<div class="no-data"><p>Este espacio está esperando tus ideas.<br>Crea una meta para un día o conviértela en un hábito.</p><button class="btn btn-secondary" data-action="new-habit">${icon('plus')} Dar mi primer paso</button></div>`}</section>`;
}
function calendarView() {
  const days = daysInMonth(visibleYear, visibleMonth), offset = weekday(days[0]);
  return `<div class="calendar-head"><h3>${monthName(visibleYear, visibleMonth)} <span style="color:#a9b29c;font-weight:400">${visibleYear}</span></h3><div class="calendar-controls"><button class="text-button" data-action="calendar-today">Hoy</button><button class="icon-button" data-action="month-prev" aria-label="Mes anterior">${icon('left')}</button><button class="icon-button" data-action="month-next" aria-label="Mes siguiente">${icon('chevron')}</button></div></div><div class="calendar-weekdays">${['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => `<span>${d}</span>`).join('')}</div><div class="calendar-grid">${'<span></span>'.repeat(offset)}${days.map(key => { const summary = daySummary(state.habits, key); return `<button class="calendar-day ${key === selectedDate ? 'selected' : ''} ${key === today ? 'today' : ''}" data-action="select-day" data-date="${key}" aria-label="${esc(prettyDate(key))}, ${summary.done} de ${summary.total} metas cumplidas" aria-pressed="${key === selectedDate}"><span>${fromDate(key).getDate()}</span><span class="day-indicator">${Array.from({ length: Math.min(3, summary.total) }, (_, i) => `<i class="${i < summary.done ? 'done' : i < summary.done + summary.missed ? 'missed' : ''}"></i>`).join('')}</span></button>`; }).join('')}</div><div class="calendar-legend"><span><i class="legend-dot done"></i>Cumplida</span><span><i class="legend-dot missed"></i>No cumplida</span><span><i class="legend-dot"></i>Pendiente</span></div>`;
}
function manageHabit(h) {
  const repeat = h.repeat === 'once' ? prettyDate(h.startDate, { day: 'numeric', month: 'short', year: 'numeric' }) : h.days.length === 7 ? 'Todos los días' : h.days.map(d => ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'][d]).join(' · ');
  return `<article class="panel manage-card"><div class="manage-card-top"><span class="habit-icon color-${h.color}">${icon(h.icon)}</span><div class="manage-actions"><button data-action="edit-habit" data-id="${esc(h.id)}" aria-label="Editar ${esc(h.name)}">${icon('edit')}</button><button data-action="delete-habit" data-id="${esc(h.id)}" aria-label="Eliminar ${esc(h.name)}">${icon('trash')}</button></div></div><h3>${esc(h.name)}</h3><p>${esc(repeat)}<br>${h.startTime} – ${h.endTime}</p>${h.description ? `<p>${esc(h.description)}</p>` : ''}<div class="manage-card-footer"><span>${icon('flame')}${habitStreak(h, today)} días de racha</span><span>${Object.values(h.records).filter(v => v === 'done').length} ${icon('check')}</span></div></article>`;
}
function progressView() {
  const total = totalMath(), done = state.habits.reduce((n, h) => n + Object.values(h.records).filter(s => s === 'done').length, 0), best = Math.max(0, ...state.habits.map(h => habitStreak(h, today)));
  const last7 = Array.from({ length: 7 }, (_, i) => shiftDate(today, i - 6));
  const max = Math.max(5, ...last7.map(d => (state.math.days[d]?.correct || 0)));
  const totalCategories = Math.max(1, ...Object.values(state.math.categories));
  return `<div class="page-heading"><div><h1>Mira todo lo que estás construyendo<span style="color:#b6c38f">.</span></h1><p>El progreso se ve en los pequeños pasos que repites.</p></div><button class="btn btn-ghost" data-action="export">${icon('download')} Mi respaldo</button></div><div class="progress-top">${statCard('bolt', 'green', `${total.xp}<small> XP</small>`, `Tu energía · nivel ${levelNumber()}`)}${statCard('brain', 'purple', total.correct, 'Retos resueltos')}${statCard('target', 'blue', done, 'Metas cumplidas')}${statCard('flame', 'orange', `${best}<small> días</small>`, 'Mejor racha actual')}</div>
  <div class="progress-grid"><section class="panel chart-panel"><div class="chart-head"><h3>Tu mente en movimiento</h3><p>Retos · últimos 7 días</p></div><div class="bar-chart">${last7.map(key => { const correct = state.math.days[key]?.correct || 0; return `<div class="chart-column ${key === today ? 'today' : ''}"><span>${correct}</span><div class="chart-bar" style="height:${correct / max * 140}px" title="${esc(prettyDate(key))}: ${correct} retos"></div></div>`; }).join('')}</div><div class="chart-labels">${last7.map(key => `<span>${WEEKDAYS[weekday(key)]}</span>`).join('')}</div></section><section class="panel chart-panel"><div class="chart-head"><h3>Cada habilidad, un paso más</h3></div><div class="category-list">${Object.entries(OPERATIONS).map(([key, op]) => `<div class="category-row"><span>${op.name}</span><span class="category-track"><i style="width:${(state.math.categories[key] || 0) / totalCategories * 100}%"></i></span><b>${state.math.categories[key] || 0}</b></div>`).join('')}</div></section></div>
  <section><div class="year-heading"><div><h2>Un año de pequeños pasos</h2><p class="form-note" style="margin-top:5px">Cada día con metas cumplidas deja su huella. Toca un mes para explorarlo.</p></div><div class="year-picker"><button class="icon-button" data-action="year-prev" aria-label="Año anterior">${icon('left')}</button><span>${progressYear}</span><button class="icon-button" data-action="year-next" aria-label="Año siguiente">${icon('chevron')}</button></div></div><div class="year-grid">${Array.from({ length: 12 }, (_, month) => miniMonth(progressYear, month)).join('')}</div><div class="calendar-legend"><span>Menos</span>${[0, 1, 2, 3, 4].map(level => `<i class="heat-cell ${level ? `level${level}` : ''}" style="width:10px;height:10px;min-height:10px"></i>`).join('')}<span>Más metas cumplidas</span></div></section>
  <div class="achievements">${achievement('leaf', 'Tu primera semilla', 'Completa tu primera meta.', done >= 1)}${achievement('brain', 'Una mente curiosa', 'Resuelve 10 retos matemáticos.', total.correct >= 10)}${achievement('flame', 'Paso a paso', 'Mantén una racha de 7 días.', best >= 7)}</div>`;
}
function miniMonth(year, month) {
  const days = daysInMonth(year, month), offset = weekday(days[0]); let doneDays = 0;
  const cells = days.map(key => { const s = daySummary(state.habits, key); if (s.done) doneDays++; const level = s.done ? Math.max(1, Math.ceil(s.percent / 25)) : 0; return `<span class="heat-cell ${level ? `level${level}` : ''} ${key > today ? 'future' : ''}" title="${esc(prettyDate(key))}: ${s.done} de ${s.total}"></span>`; }).join('');
  return `<button class="mini-month" data-action="open-month" data-month="${month}" aria-label="Ver ${monthName(year, month)} de ${year}"><span class="mini-month-heading">${monthName(year, month)}<span>${doneDays} ${doneDays === 1 ? 'día' : 'días'}</span></span><span class="heat-grid">${'<span></span>'.repeat(offset)}${cells}</span></button>`;
}
function achievement(name, title, text, unlocked) { return `<div class="achievement ${unlocked ? 'unlocked' : ''}"><span class="habit-icon color-green">${icon(unlocked ? name : 'lock')}</span><div><h4>${title}${unlocked ? ' ✓' : ''}</h4><p>${text}</p></div></div>`; }

function navigate(next) {
  if (view !== next) stopTimer();
  view = next;
  if (view === 'home') selectedDate = today;
  if (location.hash !== `#${next}`) history.pushState(null, '', `#${next}`);
  shell(); $('#main').focus({ preventScroll: true }); window.scrollTo({ top: 0, behavior: 'instant' });
}
function openModal(content, label) {
  modalTrigger = document.activeElement;
  const dialog = $('#modal'); dialog.setAttribute('aria-label', label); dialog.innerHTML = `<div class="modal-content">${content}</div>`;
  if (!dialog.open) dialog.showModal();
}
function closeModal() { $('#modal').close(); }
function modalHeader(title, subtitle) { return `<div class="modal-header"><div><h2>${title}</h2>${subtitle ? `<p>${subtitle}</p>` : ''}</div><button class="icon-button" data-action="close-modal" aria-label="Cerrar">${icon('close')}</button></div>`; }
function openHabitForm(id, template) {
  const existing = state.habits.find(h => h.id === id);
  const templates = { read: { name: 'Leer 20 minutos', startTime: '20:00', endTime: '20:20', icon: 'book', color: 'orange' }, move: { name: 'Mover el cuerpo', startTime: '07:00', endTime: '07:30', icon: 'run', color: 'green' }, study: { name: 'Aprender algo nuevo', startTime: '18:00', endTime: '18:30', icon: 'brain', color: 'purple' } };
  const h = existing || { name: '', description: '', startDate: selectedDate, endDate: '', startTime: '08:00', endTime: '08:30', days: [0, 1, 2, 3, 4, 5, 6], repeat: 'daily', color: 'green', icon: 'sun', ...templates[template] };
  formColor = h.color; formIcon = h.icon;
  openModal(`${modalHeader(existing ? 'Tu meta, a tu manera' : 'Planta una nueva meta', 'Pequeña, posible y con un espacio en tu día.')}<form id="habit-form" data-id="${esc(existing?.id || '')}"><div class="form-field"><label for="habit-name">¿Qué quieres lograr?</label><input id="habit-name" name="name" required maxlength="80" placeholder="Por ejemplo, leer 20 minutos" value="${esc(h.name)}" autofocus></div><div class="form-row"><div class="form-field"><label for="start-time">Desde</label><input type="time" id="start-time" name="startTime" required value="${h.startTime}"></div><div class="form-field"><label for="end-time">Hasta</label><input type="time" id="end-time" name="endTime" required value="${h.endTime}"></div></div><div class="form-field"><label for="repeat">¿Cuándo la harás?</label><select id="repeat" name="repeat"><option value="daily" ${h.repeat === 'daily' ? 'selected' : ''}>Todos los días</option><option value="custom" ${h.repeat === 'custom' ? 'selected' : ''}>Elegir días de la semana</option><option value="once" ${h.repeat === 'once' ? 'selected' : ''}>Solo una fecha</option></select></div><div id="repeat-days" ${h.repeat !== 'custom' ? 'hidden' : ''}><span class="form-label">Tus días</span><div class="day-checkboxes">${WEEKDAYS.map((d, i) => `<label><input type="checkbox" name="days" value="${i}" ${h.days.includes(i) ? 'checked' : ''} aria-label="${['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'][i]}"><span>${d}</span></label>`).join('')}</div></div><div class="form-row"><div class="form-field"><label for="start-date">${h.repeat === 'once' ? 'Fecha' : 'Fecha de inicio'}</label><input type="date" id="start-date" name="startDate" required min="2000-01-01" max="2100-12-31" value="${h.startDate}"></div><div class="form-field" id="end-date-field" ${h.repeat === 'once' ? 'hidden' : ''}><label for="end-date">Hasta el día (opcional)</label><input type="date" id="end-date" name="endDate" min="2000-01-01" max="2100-12-31" value="${h.endDate || ''}"></div></div><div class="form-field"><label for="habit-description">Tu intención (opcional)</label><textarea id="habit-description" name="description" maxlength="250" rows="2" placeholder="¿Por qué es importante para ti?">${esc(h.description || '')}</textarea></div><span class="form-label">Dale tu toque</span><div class="style-options" style="margin-top:12px">${COLORS.map(c => `<button type="button" class="color-option ${c === formColor ? 'selected' : ''}" data-action="form-color" data-color="${c}" aria-label="Color ${ { green: 'verde', orange: 'naranja', purple: 'morado', blue: 'azul', pink: 'rosa' }[c]}" aria-pressed="${c === formColor}"></button>`).join('')}</div><div class="icon-options">${['book', 'run', 'brain', 'briefcase', 'heart', 'sun'].map(name => `<button type="button" class="icon-option ${h.icon === name ? 'selected' : ''}" data-action="form-icon" data-icon="${name}" aria-label="${{ book: 'Lectura', run: 'Actividad física', brain: 'Aprendizaje', briefcase: 'Trabajo', heart: 'Bienestar', sun: 'Personal' }[name]}" aria-pressed="${h.icon === name}">${icon(name)}</button>`).join('')}</div><p id="habit-error" class="form-error" role="alert"></p>${existing ? '<p class="form-note">Los cambios de horario y repetición también se reflejarán en el calendario anterior de esta meta.</p>' : ''}<div class="form-actions"><button type="button" class="btn btn-ghost" data-action="close-modal">Cancelar</button><button type="submit" class="btn btn-primary">${icon('check')}${existing ? 'Guardar cambios' : 'Crear mi meta'}</button></div></form>`, existing ? 'Editar meta' : 'Nueva meta');
}
function submitHabit(form) {
  const fd = new FormData(form), repeat = fd.get('repeat');
  const days = repeat === 'custom' ? fd.getAll('days').map(Number) : [0, 1, 2, 3, 4, 5, 6];
  const error = $('#habit-error');
  if (!String(fd.get('name')).trim()) { error.textContent = 'Dale un nombre a tu meta.'; return; }
  if (fd.get('endTime') <= fd.get('startTime')) { error.textContent = 'La hora de fin debe ser posterior al inicio, dentro del mismo día.'; return; }
  if (!days.length) { error.textContent = 'Elige al menos un día de la semana.'; return; }
  if (repeat !== 'once' && fd.get('endDate') && fd.get('endDate') < fd.get('startDate')) { error.textContent = 'La fecha final debe ser igual o posterior a la de inicio.'; return; }
  const id = form.dataset.id, old = state.habits.find(h => h.id === id);
  const habit = { id: id || uid(), name: String(fd.get('name')).trim(), description: String(fd.get('description')).trim(), startDate: fd.get('startDate'), endDate: repeat === 'once' ? '' : fd.get('endDate'), startTime: fd.get('startTime'), endTime: fd.get('endTime'), repeat, days, color: formColor, icon: formIcon, records: old?.records || {} };
  try { validateState({ ...state, habits: [habit] }); } catch (e) { error.textContent = e.message; return; }
  if (old) state.habits[state.habits.findIndex(h => h.id === id)] = habit; else state.habits.push(habit);
  selectedDate = habit.startDate; visibleMonth = fromDate(selectedDate).getMonth(); visibleYear = fromDate(selectedDate).getFullYear();
  save(); closeModal(); shell(); toast(old ? 'Tu meta se actualizó. Sigue a tu ritmo.' : 'Una nueva semilla plantada. ¡Vamos paso a paso!');
}
function settingsModal() {
  openModal(`${modalHeader('Este es tu espacio', 'Personalízalo y cuida todo lo que has construido.')}<form id="profile-form"><div class="form-field"><label for="profile-name">¿Cómo te llamas?</label><input id="profile-name" name="name" maxlength="40" value="${esc(state.name)}" placeholder="Tu nombre o apodo" autocomplete="given-name"></div><button class="btn btn-primary" type="submit">Guardar mi nombre ${icon('check')}</button></form><div class="section-divider"></div><h3 style="font-size:17px">Tus datos, contigo</h3><p class="form-note" style="margin-top:8px">Cada persona tiene sus propias metas en su navegador. No necesitas una cuenta. Los datos no se sincronizan entre dispositivos; si borras los datos del navegador, se borran también de aquí.</p><div class="backup-actions"><button class="btn btn-secondary" data-action="export">${icon('download')} Exportar respaldo</button><button class="btn btn-secondary" data-action="import">${icon('upload')} Importar respaldo</button></div><p class="form-note">Para continuar en otro dispositivo, exporta tu respaldo e impórtalo allí. Importar reemplaza los datos actuales, después de tu confirmación.</p><input type="file" id="import-file" accept=".json,application/json" hidden><p id="import-error" class="form-error" role="alert" style="margin-top:10px"></p><div class="section-divider"></div><div style="display:flex;align-items:center;justify-content:space-between;gap:15px"><div><h3 style="font-size:15px">Un toque de sonido</h3><p class="form-note" style="margin-top:5px">Una pequeña señal al comprobar tus respuestas.</p></div><button class="icon-button" data-action="settings-sound" aria-label="${state.sound ? 'Desactivar' : 'Activar'} sonido" aria-pressed="${state.sound}">${icon(state.sound ? 'volume' : 'muted')}</button></div>`, 'Mi perfil y respaldo');
}
function helpModal() {
  openModal(`${modalHeader('Un poquito cada día', 'Dos formas de crecer. Un mismo espacio para ti.')}<div class="help-steps"><section><h3>${icon('brain')} Entrena tu lógica</h3><p>Escoge suma, resta, multiplicación, división o potencias. Elige dos fichas para formar el número central y comprueba la respuesta. Los números cambian en cada reto y siempre hay una solución. En resta, división y potencias, selecciona en orden. Prueba los tres niveles o un minuto contrarreloj.</p></section><section><h3>${icon('leaf')} Cultiva tus hábitos</h3><p>Crea una meta con horario, elige una fecha o los días en que se repite y toca un día del calendario para ver tu agenda. Usa ✓ para marcar cumplida o × para marcar no cumplida. Toca de nuevo el mismo estado para volver a pendiente. Puedes registrar días anteriores; los futuros se marcan cuando lleguen.</p></section><section><h3>${icon('chart')} Mira cómo creces</h3><p>Tu progreso reúne retos, energía XP, rachas y los 12 meses del año, con los días reales de cada mes. Una racha cuenta solo los días programados. El descanso no rompe una racha.</p></section><section><h3>${icon('lock')} Tu espacio personal</h3><p>Todo se guarda en este navegador. Comparte el enlace para que cada visitante empiece su propio camino. Para guardar una copia o cambiar de dispositivo, usa Ajustes y respaldo.</p></section><section><p style="font-size:10px">Inspiración de producto: <a href="https://habitify.me/onboarding-instruction/create-new-habit" target="_blank" rel="noopener noreferrer">Habitify</a>, <a href="https://goal4.app/" target="_blank" rel="noopener noreferrer">Goal4</a> y <a href="https://www.youtube.com/watch?v=kYmDyC389Y8" target="_blank" rel="noopener noreferrer">Habitify en YouTube</a>.</p></section></div><button class="btn btn-primary" data-action="close-modal" style="width:100%;margin-top:23px">Listo para dar el primer paso ${icon('arrow')}</button>`, 'Cómo funciona LouuuGic');
}
function exportState() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' }), url = URL.createObjectURL(blob);
  const link = document.createElement('a'); link.href = url; link.download = `louuugic-respaldo-${today}.json`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 10000); toast('Tu respaldo está listo para descargar.');
}
let pendingImport;
async function readImport(file) {
  if (!file) return;
  try {
    if (file.size > 5 * 1024 * 1024) throw new Error('El archivo es demasiado grande. Elige un respaldo de menos de 5 MB.');
    pendingImport = validateState(JSON.parse(await file.text()));
    openModal(`${modalHeader('¿Recuperamos tu camino?', 'Comprueba el respaldo antes de continuar.')}<p class="form-note">Este respaldo contiene <strong>${pendingImport.habits.length} metas</strong> y <strong>${Object.values(pendingImport.math.days).reduce((n, d) => n + d.correct, 0)} retos resueltos</strong>. Reemplazará las metas y estadísticas actuales de este navegador.</p><p class="form-note" style="margin-top:12px">Puedes descargar tus datos actuales antes de reemplazarlos.</p><div class="form-actions"><button class="btn btn-ghost" data-action="export">${icon('download')} Guardar actuales</button><button class="btn btn-primary" data-action="confirm-import">Importar respaldo</button></div><button class="text-button" data-action="settings" style="margin-top:16px">Cancelar y volver a ajustes</button>`, 'Confirmar importación');
  } catch (error) { const el = $('#import-error'); if (el) el.textContent = error instanceof SyntaxError ? 'No pudimos leer este archivo. Elige un respaldo JSON de LouuuGic.' : error.message; else toast('No se pudo importar el respaldo.'); }
}
function stopTimer() { clearInterval(timerId); timerId = null; timed = false; timerFinished = false; seconds = 60; }
function startTimer() {
  clearInterval(timerId); timed = true; timerFinished = false; seconds = 60; deadline = Date.now() + 60000; sessionCorrect = 0; sessionAttempts = 0; resetChallenge(); shell();
  timerId = setInterval(() => {
    seconds = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
    const display = $('#timer-display'); if (display) display.textContent = `${seconds}s`;
    if (seconds === 0) { clearInterval(timerId); timerId = null; timerFinished = true; feedback = `¡Minuto completado! ${sessionCorrect} ${sessionCorrect === 1 ? 'reto resuelto' : 'retos resueltos'}. Respira y celebra tu esfuerzo.`; feedbackType = 'success'; updateGame(); toast(`¡Tu minuto! ${sessionCorrect} aciertos en ${sessionAttempts} intentos.`); if (sessionCorrect) celebrate(); }
  }, 250);
}
function checkAnswer() {
  if (solved || selected.length !== 2 || timerFinished || (timed && Date.now() >= deadline)) return;
  const [a, b] = selected.map(id => challenge.tiles.find(t => t.id === id).value), result = calculate(operation, a, b);
  const correct = result === challenge.target;
  const d = state.math.days[today] ||= { correct: 0, attempts: 0, xp: 0 }; d.attempts++; sessionAttempts++;
  if (correct) { solved = true; streak++; sessionCorrect++; d.correct++; const xp = difficulty === 'hard' ? 20 : difficulty === 'medium' ? 15 : 10; d.xp += xp; state.math.categories[operation] = (state.math.categories[operation] || 0) + 1; feedback = `¡Así se hace! ${a} ${OPERATIONS[operation].symbol} ${b} = ${challenge.target}. +${xp} XP para tu mente.`; feedbackType = 'success'; sound(true); if (streak % 5 === 0) celebrate(); }
  else { streak = 0; const readable = Number.isFinite(result) && Math.abs(result) < 1e8 ? Number.isInteger(result) ? result : Number(result.toFixed(2)) : 'un valor demasiado grande'; feedback = `${a} ${OPERATIONS[operation].symbol} ${b} da ${readable}. Buscamos ${challenge.target}. ¡Prueba otra combinación!`; feedbackType = 'error'; sound(false); selected = []; }
  save(); updateGame();
}
function markHabit(id, key, status) {
  const h = state.habits.find(h => h.id === id);
  if (!h || !isScheduled(h, key) || key > today) return;
  if (getStatus(h, key) === status) delete h.records[key]; else h.records[key] = status;
  const summary = daySummary(state.habits, key);
  save(); shell();
  if (status === 'done' && getStatus(h, key) === 'done') { sound(true); if (summary.percent === 100) { celebrate(); toast('¡Todas tus metas del día! Celebra este pequeño gran paso.'); } }
}
function changeMonth(amount) { const d = new Date(visibleYear, visibleMonth + amount, 1, 12); if (d.getFullYear() < 2000 || d.getFullYear() > 2100) return; visibleYear = d.getFullYear(); visibleMonth = d.getMonth(); shell(); }

document.addEventListener('click', event => {
  const button = event.target.closest('[data-action]'); if (!button || button.disabled) return;
  const { action, id } = button.dataset;
  switch (action) {
    case 'navigate': navigate(button.dataset.view); break;
    case 'settings': settingsModal(); break;
    case 'help': helpModal(); break;
    case 'close-modal': closeModal(); break;
    case 'operation': operation = button.dataset.op; resetChallenge(); break;
    case 'tile': {
      if (solved || timerFinished || (timed && Date.now() >= deadline)) break;
      if (selected.includes(id)) selected = selected.filter(value => value !== id);
      else if (selected.length < 2) selected.push(id);
      else selected = [selected[0], id];
      feedback = ''; feedbackType = ''; updateGame(); const tile = document.querySelector(`[data-action="tile"][data-id="${id}"]`); tile?.focus({ preventScroll: true }); break;
    }
    case 'check': checkAnswer(); break;
    case 'next': if (!timerFinished) resetChallenge(); break;
    case 'hint': feedback = `${OPERATIONS[operation].hint} Una solución empieza con ${challenge.a}.`; feedbackType = ''; updateGame(); break;
    case 'sound': state.sound = !state.sound; save(); updateGame(); if (state.sound) sound(true); break;
    case 'settings-sound': state.sound = !state.sound; save(); button.innerHTML = icon(state.sound ? 'volume' : 'muted'); button.setAttribute('aria-pressed', String(state.sound)); button.setAttribute('aria-label', `${state.sound ? 'Desactivar' : 'Activar'} sonido`); if (state.sound) sound(true); break;
    case 'new-habit': openHabitForm(); break;
    case 'template': openHabitForm(null, button.dataset.template); break;
    case 'edit-habit': openHabitForm(id); break;
    case 'delete-habit': { const h = state.habits.find(h => h.id === id); if (!h) break; openModal(`${modalHeader('¿Dejamos ir esta meta?', 'A veces, crecer también es cambiar de rumbo.')}<p class="form-note">Se eliminará <strong class="delete-name">${esc(h.name)}</strong> junto con sus registros. Puedes exportar un respaldo desde Ajustes si quieres conservarlos.</p><div class="form-actions"><button class="btn btn-ghost" data-action="close-modal">Conservar mi meta</button><button class="btn btn-danger" data-action="confirm-delete" data-id="${esc(id)}">${icon('trash')} Eliminar meta</button></div>`, 'Eliminar meta'); break; }
    case 'confirm-delete': state.habits = state.habits.filter(h => h.id !== id); save(); closeModal(); shell(); toast('Meta eliminada. Haz espacio para tu siguiente paso.'); break;
    case 'select-day': selectedDate = button.dataset.date; visibleYear = fromDate(selectedDate).getFullYear(); visibleMonth = fromDate(selectedDate).getMonth(); shell(); break;
    case 'mark-done': markHabit(id, button.dataset.date, 'done'); break;
    case 'mark-missed': markHabit(id, button.dataset.date, 'missed'); break;
    case 'month-prev': changeMonth(-1); break;
    case 'month-next': changeMonth(1); break;
    case 'calendar-today': selectedDate = today; visibleYear = fromDate(today).getFullYear(); visibleMonth = fromDate(today).getMonth(); shell(); break;
    case 'year-prev': progressYear = Math.max(2000, progressYear - 1); shell(); break;
    case 'year-next': progressYear = Math.min(2100, progressYear + 1); shell(); break;
    case 'open-month': visibleYear = progressYear; visibleMonth = Number(button.dataset.month); selectedDate = visibleYear === fromDate(today).getFullYear() && visibleMonth === fromDate(today).getMonth() ? today : localDate(new Date(visibleYear, visibleMonth, 1, 12)); navigate('habits'); break;
    case 'form-color': formColor = button.dataset.color; document.querySelectorAll('.color-option').forEach(b => { b.classList.toggle('selected', b === button); b.setAttribute('aria-pressed', String(b === button)); }); break;
    case 'form-icon': formIcon = button.dataset.icon; document.querySelectorAll('.icon-option').forEach(b => { b.classList.toggle('selected', b === button); b.setAttribute('aria-pressed', String(b === button)); }); break;
    case 'export': exportState(); break;
    case 'import': $('#import-file')?.click(); break;
    case 'confirm-import': if (pendingImport) { stopTimer(); state = pendingImport; pendingImport = null; save(); closeModal(); shell(); toast('Tu camino está de vuelta. ¡Qué bueno seguir!'); } break;
    case 'timer': if (timed) { stopTimer(); resetChallenge(); shell(); } else startTimer(); break;
    case 'restart-timer': startTimer(); break;
  }
});
document.addEventListener('submit', event => {
  if (event.target.id === 'habit-form') { event.preventDefault(); submitHabit(event.target); }
  if (event.target.id === 'profile-form') { event.preventDefault(); state.name = String(new FormData(event.target).get('name')).trim(); save(); closeModal(); shell(); toast('Tu espacio ya tiene tu nombre.'); }
});
document.addEventListener('change', event => {
  if (event.target.id === 'difficulty') { difficulty = event.target.value; resetChallenge(); }
  if (event.target.id === 'repeat') { $('#repeat-days').hidden = event.target.value !== 'custom'; $('#end-date-field').hidden = event.target.value === 'once'; $('label[for="start-date"]').textContent = event.target.value === 'once' ? 'Fecha' : 'Fecha de inicio'; }
  if (event.target.id === 'import-file') readImport(event.target.files[0]);
});
$('#modal').addEventListener('click', event => { if (event.target === $('#modal')) { const r = $('#modal').getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) closeModal(); } });
$('#modal').addEventListener('close', () => { if (modalTrigger?.isConnected) modalTrigger.focus({ preventScroll: true }); });
window.addEventListener('popstate', () => navigate(['home', 'training', 'habits', 'progress'].includes(location.hash.slice(1)) ? location.hash.slice(1) : 'home'));
window.addEventListener('hashchange', () => { const next = location.hash.slice(1); if (Object.hasOwn(viewNames, next) && view !== next) navigate(next); });
window.addEventListener('storage', event => { if (event.key !== STORAGE_KEY || !event.newValue) return; try { state = validateState(JSON.parse(event.newValue)); shell(); toast('Tus cambios de otra pestaña ya están aquí.'); } catch {} });
function checkDay() { const now = localDate(); if (now !== today) { const wasToday = selectedDate === today; today = now; if (wasToday) { selectedDate = today; visibleYear = fromDate(today).getFullYear(); visibleMonth = fromDate(today).getMonth(); } if (!$('#modal').open) shell(); } }
document.addEventListener('visibilitychange', () => { if (!document.hidden) checkDay(); });
setInterval(checkDay, 30000);
shell();
