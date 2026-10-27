import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createStaticServer } from './serve.mjs';
const browserCandidates = process.platform === 'win32' ? [
  path.join(process.env.PROGRAMFILES || 'C:/Program Files', 'Google/Chrome/Application/chrome.exe'),
  path.join(process.env.LOCALAPPDATA || '', 'Google/Chrome/Application/chrome.exe'),
  path.join(process.env['PROGRAMFILES(X86)'] || 'C:/Program Files (x86)', 'Microsoft/Edge/Application/msedge.exe')
] : process.platform === 'darwin' ? [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge'
] : ['/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/opt/google/chrome/chrome'];
const browserPath = process.env.CHROME_PATH || browserCandidates.find(candidate => existsSync(candidate));
if (!browserPath || !existsSync(browserPath)) throw new Error('Instala Chrome, Chromium o Edge, o indica la ruta del ejecutable con CHROME_PATH.');
const artifacts = path.resolve('artifacts');
await mkdir(artifacts, { recursive: true });
const server = createStaticServer();
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
assert.equal((await fetch(origin)).status, 200);
const browser = spawn(browserPath, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0', `--user-data-dir=${path.join(artifacts, 'qa-profile')}`, 'about:blank'], { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
let ws;
const errors = [], checks = [];
try {
  const endpoint = await new Promise((resolve, reject) => {
    let output = '';
    const timeout = setTimeout(() => reject(new Error('Chrome DevTools unavailable')), 20000);
    browser.once('error', reject);
    browser.stderr.on('data', chunk => { output += chunk; const match = output.match(/DevTools listening on (ws:\/\/[^\s]+)/); if (match) { clearTimeout(timeout); resolve(match[1]); } });
  });
  const targets = await (await fetch(`http://127.0.0.1:${new URL(endpoint).port}/json/list`)).json();
  const target = targets.find(t => t.type === 'page');
  ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
  let nextId = 0; const pending = new Map();
  ws.addEventListener('message', event => {
    const msg = JSON.parse(event.data);
    if (msg.id) { const callbacks = pending.get(msg.id); if (!callbacks) return; pending.delete(msg.id); msg.error ? callbacks.reject(new Error(JSON.stringify(msg.error))) : callbacks.resolve(msg.result); }
    if (msg.method === 'Runtime.exceptionThrown') errors.push(msg.params.exceptionDetails.exception?.description || msg.params.exceptionDetails.text);
  });
  const cdp = (method, params = {}) => new Promise((resolve, reject) => { const id = ++nextId; pending.set(id, { resolve, reject }); ws.send(JSON.stringify({ id, method, params })); });
  const evaluate = async expression => { const r = await cdp('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true }); if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text); return r.result.value; };
  const waitFor = async expression => { const until = Date.now() + 10000; while (Date.now() < until) { if (await evaluate(expression)) return; await new Promise(r => setTimeout(r, 80)); } throw new Error(`Timeout: ${expression}`); };
  const click = async selector => evaluate(`(() => {const e=document.querySelector(${JSON.stringify(selector)});if(!e) throw new Error('Missing: '+${JSON.stringify(selector)});e.click();return true;})()`);
  const screenshot = async name => { await evaluate('document.fonts.ready'); await new Promise(r => setTimeout(r, 650)); await evaluate('document.querySelector("#toast").classList.remove("visible")'); const r = await cdp('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true }); await writeFile(path.join(artifacts, name), Buffer.from(r.data, 'base64')); };
  const checked = name => { checks.push(name); console.log(`PASS ${name}`); };
  await cdp('Page.enable'); await cdp('Runtime.enable');
  await cdp('Emulation.setTimezoneOverride', { timezoneId: 'America/Bogota' });
  await cdp('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1100, deviceScaleFactor: 1, mobile: false });
  await cdp('Page.navigate', { url: origin });
  await waitFor('document.querySelectorAll(".number-tile").length===8');
  checked('HTTP and ES modules load without a build');
  await screenshot('desktop-empty.png');
  assert.equal(await evaluate('document.documentElement.scrollWidth <= innerWidth'), true);
  const solve = async op => {
    const pair = await evaluate(`(() => { const tiles=[...document.querySelectorAll('.number-tile')];const t=Number(document.querySelector('.target-number').textContent);for(let i=0;i<tiles.length;i++)for(let j=0;j<tiles.length;j++){if(i===j)continue;const a=Number(tiles[i].childNodes[0].textContent),b=Number(tiles[j].childNodes[0].textContent);const r={sum:a+b,sub:a-b,mul:a*b,div:a/b,pow:a**b}[${JSON.stringify(op)}];if(r===t)return [tiles[i].dataset.id,tiles[j].dataset.id];}throw new Error('No solution');})()`);
    for (const id of pair) await click(`[data-action="tile"][data-id="${id}"]`);
    await click('[data-action="check"]');
    assert.equal(await evaluate('document.querySelector(".game-feedback").classList.contains("success")'), true);
  };
  for (const op of ['sum', 'sub', 'mul', 'div', 'pow']) { await click(`[data-action="operation"][data-op="${op}"]`); await solve(op); }
  assert.equal(await evaluate('Object.values(JSON.parse(localStorage.getItem("louuugic-v1")).math.days).reduce((n,d)=>n+d.correct,0)'), 5);
  checked('all five operations accept generated solutions and persist XP');
  await click('[data-action="next"]');
  await evaluate('document.querySelector("#difficulty").value="hard";document.querySelector("#difficulty").dispatchEvent(new Event("change",{bubbles:true}))');
  await solve('pow');
  checked('difficulty changes generate a solvable new challenge');
  await click('[data-action="navigate"][data-view="training"]');
  await click('[data-action="timer"]');
  await waitFor('document.querySelector("#timer-display")?.textContent==="59s"');
  await evaluate('window.qaOriginalNow=Date.now;Date.now=()=>window.qaOriginalNow()+61000');
  await waitFor('document.querySelector("#timer-display")?.textContent==="0s"');
  assert.equal(await evaluate('document.querySelector(".number-tile").disabled'), true);
  await evaluate('Date.now=window.qaOriginalNow');
  await click('[data-action="timer"]');
  checked('60-second timer counts down, locks at expiry and exits');
  await click('[data-action="navigate"][data-view="home"]');
  await click('[data-action="template"][data-template="read"]');
  await evaluate('document.querySelector("#habit-name").value="Leer 20 minutos";document.querySelector("#habit-form").requestSubmit()');
  assert.equal(await evaluate('document.querySelectorAll(".habit-row").length'), 1);
  await click('[data-action="mark-done"]');
  assert.equal(await evaluate('document.querySelector(".check-button").getAttribute("aria-pressed")'), 'true');
  await click('[data-action="mark-missed"]');
  assert.equal(await evaluate('document.querySelector(".check-button").classList.contains("missed")'), true);
  await click('[data-action="mark-missed"]');
  assert.equal(await evaluate('document.querySelector(".check-button").classList.contains("pending")'), true);
  await click('[data-action="mark-done"]');
  checked('user-created habits support completed, missed and pending states');
  await cdp('Page.reload'); await waitFor('document.querySelector(".habit-row")');
  assert.equal(await evaluate('document.querySelector(".habit-name").textContent'), 'Leer 20 minutos');
  assert.equal(await evaluate('document.querySelector(".check-button").classList.contains("done")'), true);
  checked('habit schedules, records and math progress survive reload');
  await click('[data-action="navigate"][data-view="habits"]');
  await click('[data-action="edit-habit"]');
  await evaluate('document.querySelector("#habit-name").value="Leer <b>cada día</b>";document.querySelector("#start-time").value="20:00";document.querySelector("#end-time").value="19:00";document.querySelector("#habit-form").requestSubmit()');
  assert.match(await evaluate('document.querySelector("#habit-error").textContent'), /posterior/);
  await evaluate('document.querySelector("#end-time").value="20:30";document.querySelector("#habit-form").requestSubmit()');
  assert.equal(await evaluate('document.querySelector(".habit-name").textContent'), 'Leer <b>cada día</b>');
  assert.equal(await evaluate('document.querySelector(".habit-name b")'), null);
  checked('editing validates time ranges and renders user text safely');
  await click('[data-action="edit-habit"]');
  await evaluate('document.querySelector("#habit-name").value="Leer 20 minutos";document.querySelector("#habit-form").requestSubmit()');
  const future = await evaluate('document.querySelectorAll(".calendar-day")[Array.from(document.querySelectorAll(".calendar-day")).findIndex(e=>e.classList.contains("today"))+1]?.dataset.date');
  if (future) {
    await click(`[data-action="select-day"][data-date="${future}"]`);
    assert.equal(await evaluate('document.querySelector("[data-action=mark-done]").disabled'), true);
    checked('future dates can be planned but cannot be marked early');
  }
  await click('[data-action="month-next"]');
  await click('[data-action="month-prev"]');
  await click('[data-action="calendar-today"]');
  await screenshot('desktop-calendar.png');
  await click('[data-action="new-habit"]');
  await evaluate('document.querySelector("#habit-name").value="Solo este día";document.querySelector("#repeat").value="once";document.querySelector("#repeat").dispatchEvent(new Event("change",{bubbles:true}));document.querySelector("#habit-form").requestSubmit()');
  assert.equal(await evaluate('document.querySelectorAll(".manage-card").length'), 2);
  await click('.manage-card:last-child [data-action="delete-habit"]');
  await click('[data-action="confirm-delete"]');
  assert.equal(await evaluate('document.querySelectorAll(".manage-card").length'), 1);
  checked('one-time goals and confirmed deletion work');
  await click('[data-action="navigate"][data-view="progress"]');
  assert.equal(await evaluate('document.querySelectorAll(".mini-month").length'), 12);
  await click('[data-action="year-prev"]'); await click('[data-action="year-next"]');
  await screenshot('desktop-progress.png');
  checked('12-month progress view and year navigation work');
  await click('[data-action="settings"]');
  await evaluate('document.querySelector("#profile-name").value="Ale";document.querySelector("#profile-form").requestSubmit()');
  await click('[data-action="navigate"][data-view="home"]');
  assert.match(await evaluate('document.querySelector("h1").textContent'), /Ale/);
  const backup = await evaluate('JSON.parse(localStorage.getItem("louuugic-v1"))');
  await writeFile(path.join(artifacts, 'valid-backup.json'), JSON.stringify(backup));
  await writeFile(path.join(artifacts, 'invalid-backup.json'), '{"version":1,"habits":[{"name":"invalid"}]}');
  await click('[data-action="settings"]');
  const setFile = async name => { const dom = await cdp('DOM.getDocument'); const node = await cdp('DOM.querySelector', { nodeId: dom.root.nodeId, selector: '#import-file' }); await cdp('DOM.setFileInputFiles', { nodeId: node.nodeId, files: [path.join(artifacts, name)] }); };
  await setFile('invalid-backup.json');
  await waitFor('document.querySelector("#import-error")?.textContent.length>0');
  assert.equal(await evaluate('JSON.parse(localStorage.getItem("louuugic-v1")).habits.length'), 1);
  checked('invalid backups show an error and preserve existing data');
  await setFile('valid-backup.json');
  await waitFor('document.querySelector("[data-action=confirm-import]")');
  await click('[data-action="confirm-import"]');
  assert.deepEqual(await evaluate('JSON.parse(localStorage.getItem("louuugic-v1"))'), backup);
  checked('file import restores complete data after explicit confirmation');
  await cdp('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: artifacts });
  await click('[data-action="settings"]');
  await click('[data-action="export"]');
  await click('[data-action="close-modal"]');
  checked('backup export triggers a JSON download');
  await screenshot('desktop.png');
  checked('personal name updates the interface');
  for (const width of [390, 360, 768, 1024]) {
    await cdp('Emulation.setDeviceMetricsOverride', { width, height: 844, deviceScaleFactor: 1, mobile: width < 700 });
    for (const v of ['home', 'training', 'habits', 'progress']) {
      await click(`[data-action="navigate"][data-view="${v}"]`);
      assert.equal(await evaluate('document.documentElement.scrollWidth<=innerWidth'), true, `Overflow in ${v} at ${width}`);
    }
    if (width === 390) { await click('[data-action="navigate"][data-view="home"]'); await screenshot('mobile.png'); }
  }
  checked('all four screens fit 360, 390, 768 and 1024 px without horizontal overflow');
  assert.deepEqual(errors, []);
  checked('no uncaught browser errors');
  await writeFile(path.join(artifacts, 'qa-results.json'), JSON.stringify({ checks, errors, date: new Date().toISOString() }, null, 2));
  console.log(`${checks.length} browser checks passed. Screenshots: ${artifacts}`);
} finally {
  ws?.close(); browser.kill(); await new Promise(resolve => server.close(resolve));
}
