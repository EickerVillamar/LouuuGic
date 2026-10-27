import test from 'node:test';
import assert from 'node:assert/strict';
import { OPERATIONS, createChallenge, calculate, daysInMonth, isScheduled, daySummary, habitStreak, validateState, defaultState, localDate, fromDate, shiftDate } from '../dist/core.js';
test('15,000 random challenges remain solvable with two distinct tiles and integer results', () => {
  for (const op of Object.keys(OPERATIONS)) for (const level of ['easy', 'medium', 'hard']) {
    let previous = null;
    for (let i = 0; i < 1000; i++) {
      const c = createChallenge(op, level, previous);
      assert.equal(c.tiles.length, 8);
      assert.equal(new Set(c.tiles.map(t => t.id)).size, 8);
      assert.ok(Number.isInteger(c.target) && c.target > 0);
      assert.equal(calculate(op, c.a, c.b), c.target);
      assert.ok(c.tiles.some((a, x) => c.tiles.some((b, y) => x !== y && calculate(op, a.value, b.value) === c.target)));
      assert.notEqual(c.target, previous);
      if (op === 'pow') assert.ok(c.b >= 2 && c.b <= 4 && c.a <= 9);
      if (op === 'div') assert.equal(c.a % c.b, 0);
      previous = c.target;
    }
  }
});
const habit = { id: 'habit-1', name: 'Leer', description: '', startDate: '2026-10-19', endDate: '', startTime: '08:00', endTime: '08:30', repeat: 'custom', days: [0, 2, 4], color: 'green', icon: 'book', records: { '2026-10-19': 'done', '2026-10-21': 'done', '2026-10-23': 'done' } };
test('calendar respects leap years, month lengths and local date arithmetic', () => {
  assert.equal(daysInMonth(2024, 1).length, 29);
  assert.equal(daysInMonth(2026, 1).length, 28);
  assert.equal(daysInMonth(2026, 9).length, 31);
  assert.equal(daysInMonth(2026, 10).length, 30);
  assert.equal(shiftDate('2026-12-31', 1), '2027-01-01');
  assert.equal(shiftDate('2024-03-01', -1), '2024-02-29');
  assert.equal(localDate(fromDate('2026-10-27')), '2026-10-27');
});
test('scheduling respects start, end, weekdays and one-time dates', () => {
  assert.equal(isScheduled(habit, '2026-10-16'), false);
  assert.equal(isScheduled(habit, '2026-10-19'), true);
  assert.equal(isScheduled(habit, '2026-10-20'), false);
  assert.equal(isScheduled({ ...habit, endDate: '2026-10-21' }, '2026-10-23'), false);
  assert.equal(isScheduled({ ...habit, repeat: 'once' }, '2026-10-19'), true);
  assert.equal(isScheduled({ ...habit, repeat: 'once' }, '2026-10-21'), false);
});
test('streak skips rest, preserves pending today, breaks on a missed scheduled date', () => {
  assert.equal(habitStreak(habit, '2026-10-24'), 3);
  assert.equal(habitStreak(habit, '2026-10-26'), 3);
  assert.equal(habitStreak({ ...habit, records: { ...habit.records, '2026-10-26': 'missed' } }, '2026-10-26'), 0);
  assert.equal(habitStreak(habit, '2026-10-27'), 0);
  assert.equal(habitStreak({ ...habit, records: { ...habit.records, '2026-10-23': 'missed' } }, '2026-10-24'), 0);
});
test('day summary distinguishes missed from pending and ignores unscheduled records', () => {
  const other = { ...habit, id: 'habit-2', records: { '2026-10-19': 'missed' } };
  assert.deepEqual(daySummary([habit, other], '2026-10-19'), { total: 2, done: 1, missed: 1, percent: 50 });
  assert.deepEqual(daySummary([habit], '2026-10-20'), { total: 0, done: 0, missed: 0, percent: 0 });
});
test('backup preserves records and rejects malformed schedules, records and duplicate IDs', () => {
  const data = { ...defaultState(), name: 'Ana', habits: [habit], math: { days: { '2026-10-27': { correct: 2, attempts: 3, xp: 20 } }, categories: { sum: 2 } } };
  assert.equal(validateState(JSON.parse(JSON.stringify(data))).habits[0].records['2026-10-19'], 'done');
  for (const change of [{ startDate: '2026-02-30' }, { endTime: '07:00' }, { days: [9] }, { records: { '2026-10-19': 'maybe' } }, { name: '' }]) assert.throws(() => validateState({ ...data, habits: [{ ...habit, ...change }] }));
  assert.throws(() => validateState({ ...data, habits: [habit, habit] }));
  assert.throws(() => validateState({ version: 2, habits: [] }));
  assert.throws(() => validateState({ ...data, math: { days: { '2026-10-27': { correct: 5, attempts: 2 } } } }));
});
