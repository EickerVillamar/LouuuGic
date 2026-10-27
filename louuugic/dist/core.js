export const OPERATIONS = {
  sum: { name: 'Suma', symbol: '+', verb: 'suman', hint: 'Busca dos números que juntos lleguen al objetivo.' },
  sub: { name: 'Resta', symbol: '−', verb: 'restan', hint: 'Elige primero el número mayor y después el que vas a restar.' },
  mul: { name: 'Multiplicación', symbol: '×', verb: 'multiplican', hint: 'Piensa en las tablas: ¿qué dos factores forman el objetivo?' },
  div: { name: 'División', symbol: '÷', verb: 'dividen', hint: 'Elige primero el dividendo y después el divisor. El resultado siempre es entero.' },
  pow: { name: 'Potencias', symbol: '^', verb: 'elevan', hint: 'Elige primero la base y después el exponente. Por ejemplo, 3² = 9.' }
};
export const COLORS = ['green', 'orange', 'purple', 'blue', 'pink'];
export const WEEKDAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
export const uid = () => globalThis.crypto?.randomUUID?.() || `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
export function localDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export const fromDate = key => new Date(`${key}T12:00:00`);
export function shiftDate(key, amount) { const d = fromDate(key); d.setDate(d.getDate() + amount); return localDate(d); }
export const weekday = key => (fromDate(key).getDay() + 6) % 7;
export function daysInMonth(year, month) {
  return Array.from({ length: new Date(year, month + 1, 0).getDate() }, (_, i) => localDate(new Date(year, month, i + 1, 12)));
}
export function calculate(op, a, b) {
  return { sum: () => a + b, sub: () => a - b, mul: () => a * b, div: () => b === 0 ? NaN : a / b, pow: () => a ** b }[op]?.();
}
export function createChallenge(op = 'sum', level = 'easy', previousTarget = null, random = Math.random) {
  if (!OPERATIONS[op]) op = 'sum';
  const range = { easy: 10, medium: 20, hard: 50 }[level] || 10;
  const int = (min, max) => Math.floor(random() * (max - min + 1)) + min;
  let a, b, target;
  for (let attempt = 0; attempt < 30; attempt++) {
    a = int(1, range); b = int(1, range);
    if (op === 'sub') { a = int(3, range * 2); b = int(1, a - 1); }
    if (op === 'mul') { a = int(2, level === 'easy' ? 5 : level === 'medium' ? 10 : 12); b = int(2, level === 'easy' ? 5 : 12); }
    if (op === 'div') { b = int(2, level === 'easy' ? 5 : 12); a = b * int(2, level === 'easy' ? 6 : 12); }
    if (op === 'pow') { a = int(2, level === 'easy' ? 5 : 9); b = int(2, level === 'hard' ? 4 : 3); }
    target = calculate(op, a, b);
    if (target !== previousTarget) break;
  }
  const values = [a, b];
  const max = Math.max(range * 2, a + 5, b + 5);
  while (values.length < 8) { const value = int(1, max); if (!values.includes(value)) values.push(value); }
  const tiles = values.map(value => ({ id: uid(), value }));
  for (let i = tiles.length - 1; i > 0; i--) { const j = int(0, i); [tiles[i], tiles[j]] = [tiles[j], tiles[i]]; }
  return { id: uid(), op, a, b, target, tiles };
}
export function isScheduled(habit, key) {
  return key >= habit.startDate && (!habit.endDate || key <= habit.endDate) &&
    (habit.repeat === 'once' ? key === habit.startDate : habit.days.includes(weekday(key)));
}
export function getStatus(habit, key) { return habit.records[key] || 'pending'; }
export function daySummary(habits, key) {
  const scheduled = habits.filter(h => isScheduled(h, key));
  const done = scheduled.filter(h => getStatus(h, key) === 'done').length;
  return { total: scheduled.length, done, missed: scheduled.filter(h => getStatus(h, key) === 'missed').length, percent: scheduled.length ? Math.round(done / scheduled.length * 100) : 0 };
}
export function habitStreak(habit, today = localDate()) {
  let streak = 0, key = today;
  if (isScheduled(habit, key) && getStatus(habit, key) === 'pending') key = shiftDate(key, -1);
  for (let i = 0; i < 36600 && key >= habit.startDate; i++, key = shiftDate(key, -1)) {
    if (!isScheduled(habit, key)) continue;
    if (getStatus(habit, key) !== 'done') break;
    streak++;
  }
  return streak;
}
export function defaultState() { return { version: 1, name: '', habits: [], math: { days: {}, categories: {} }, sound: false }; }
export function validateState(input) {
  if (!input || typeof input !== 'object' || input.version !== 1 || !Array.isArray(input.habits) || input.habits.length > 500) throw new Error('Este archivo no es un respaldo válido de LouuuGic.');
  const dateOK = v => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(fromDate(v).valueOf()) && localDate(fromDate(v)) === v;
  const timeOK = v => typeof v === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(v);
  const ids = new Set();
  const habits = input.habits.map(h => {
    if (!h || typeof h.id !== 'string' || ids.has(h.id) || typeof h.name !== 'string' || !h.name.trim() || !dateOK(h.startDate) || (h.endDate && (!dateOK(h.endDate) || h.endDate < h.startDate)) || !timeOK(h.startTime) || !timeOK(h.endTime) || h.endTime <= h.startTime || !['daily', 'custom', 'once'].includes(h.repeat) || !Array.isArray(h.days) || !h.days.length || h.days.some(d => !Number.isInteger(d) || d < 0 || d > 6)) throw new Error('El respaldo contiene una meta inválida.');
    ids.add(h.id);
    const records = {};
    for (const [key, status] of Object.entries(h.records || {})) { if (!dateOK(key) || !['done', 'missed'].includes(status)) throw new Error('El respaldo contiene un registro inválido.'); records[key] = status; }
    return { id: h.id.slice(0, 100), name: h.name.trim().slice(0, 80), description: String(h.description || '').slice(0, 250), startDate: h.startDate, endDate: h.endDate || '', startTime: h.startTime, endTime: h.endTime, repeat: h.repeat, days: [...new Set(h.days)], color: COLORS.includes(h.color) ? h.color : 'green', icon: ['book', 'run', 'brain', 'briefcase', 'heart', 'sun'].includes(h.icon) ? h.icon : 'sun', records };
  });
  const days = {}, categories = {};
  for (const [key, data] of Object.entries(input.math?.days || {})) {
    if (!dateOK(key)) continue;
    const clean = {};
    for (const field of ['correct', 'attempts', 'xp']) clean[field] = Math.max(0, Math.min(1e8, Math.floor(Number(data?.[field]) || 0)));
    if (clean.correct > clean.attempts) throw new Error('Las estadísticas del respaldo no son válidas.');
    days[key] = clean;
  }
  for (const op of Object.keys(OPERATIONS)) categories[op] = Math.max(0, Math.min(1e8, Math.floor(Number(input.math?.categories?.[op]) || 0)));
  return { version: 1, name: String(input.name || '').slice(0, 40), habits, math: { days, categories }, sound: input.sound === true };
}
