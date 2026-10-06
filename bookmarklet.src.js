(function () {
  'use strict';

  if (window.__jhLoaded) { document.getElementById('jh')?.remove(); document.getElementById('jh-restore')?.remove(); }
  window.__jhLoaded = true;

  const API_URL = 'https://api.thirtystore.com/v1/chat/completions';
  const DEFAULT_KEY = 'sk-ts-QWF4176C3G7TBVYXKDDVM36A4CBG';
  const DEFAULT_MODEL = 'deepseek-v4.1-flash';

  const store = {
    get: (k, d) => { try { const v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} },
  };

  const cfg = {
    key: store.get('jh_key', DEFAULT_KEY),
    model: store.get('jh_model', DEFAULT_MODEL),
    delay: +store.get('jh_delay', 0) || 0,
  };
  const save = () => { store.set('jh_key', cfg.key); store.set('jh_model', cfg.model); store.set('jh_delay', cfg.delay); };

  const txt = (el) => (el ? el.innerText.replace(/\s+/g, ' ').trim() : '');

  function getQuestion() {
    const sels = ['[class*="question-text"]', '[data-testid*="question"]', '.question-text', '[class*="QuestionText"]', 'h2', 'h1'];
    for (const s of sels) {
      const n = document.querySelector(s);
      if (n && txt(n).length > 2) return txt(n);
    }
    return '';
  }

  function getOptions() {
    const sels = ['[class*="answer"]', '[class*="option"]', '[data-testid*="answer"]', 'button[class*="choice"]'];
    for (const s of sels) {
      const list = [...document.querySelectorAll(s)].filter((e) => e.offsetParent !== null && txt(e).length);
      const uniq = [];
      const seen = new Set();
      for (const e of list) {
        const t = txt(e);
        if (!seen.has(t)) { seen.add(t); uniq.push(e); }
      }
      if (uniq.length >= 2 && uniq.length <= 6) return uniq;
    }
    return [];
  }

  async function askAI(question, options, multi) {
    const opts = options.map((o, i) => `${String.fromCharCode(65 + i)}. ${txt(o)}`).join('\n');
    const sys = multi
      ? 'Jawab quiz. Bisa lebih dari satu benar. Balas HANYA JSON array label huruf, contoh ["A","C"].'
      : 'Jawab quiz. Balas HANYA JSON array berisi satu label huruf, contoh ["B"].';
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${cfg.key}` },
      body: JSON.stringify({
        model: cfg.model,
        temperature: 0,
        messages: [
          { role: 'system', content: sys },
          { role: 'user', content: `Pertanyaan:\n${question}\n\nPilihan:\n${opts}` },
        ],
      }),
    });
    const j = await res.json();
    const c = j.choices[0].message.content;
    const m = c.match(/\[[^\]]*\]/);
    return m ? JSON.parse(m[0]) : [];
  }

  const css = `
  #jh *{box-sizing:border-box;font-family:system-ui,sans-serif;}
  #jh{position:fixed;top:100px;left:100px;width:300px;z-index:999999;color:#eee;
      background:#1a1a2e;border:1px solid #444;border-radius:8px;
      box-shadow:0 4px 20px rgba(0,0,0,.6);display:flex;flex-direction:column;overflow:hidden;touch-action:none;}
  #jh-header{display:flex;justify-content:space-between;align-items:center;background:#16213e;
      padding:6px 12px;cursor:grab;user-select:none;border-bottom:1px solid #0f3460;}
  #jh-header span{font-weight:bold;font-size:14px;color:#e94560;}
  #jh-header button{background:#555;color:#fff;border:none;padding:4px 10px;margin-left:5px;
      cursor:pointer;border-radius:3px;font-size:.85em;}
  #jh-header button#jh-close{background:#e94560;}
  #jh-tabs{display:flex;background:#16213e;border-bottom:2px solid #0f3460;padding:0 5px;}
  #jh-tabs button{flex:1;padding:6px 4px;background:transparent;color:#888;border:none;
      border-bottom:2px solid transparent;cursor:pointer;font-size:12px;font-weight:bold;}
  #jh-tabs button.active{background:#0f3460;color:#e94560;border-bottom-color:#e94560;}
  #jh-body{flex:1;overflow:hidden;position:relative;}
  .jh-pane{position:absolute;inset:0;padding:10px;overflow-y:auto;font-size:12px;display:none;}
  .jh-pane.active{display:block;}
  .jh-lbl{color:#e94560;font-weight:bold;margin-bottom:8px;}
  .jh-pane input[type=text],.jh-pane input[type=password],.jh-pane input[type=number]{
      width:100%;padding:5px;margin-top:4px;background:#0f3460;color:#eee;border:1px solid #444;
      border-radius:4px;font-size:12px;}
  .jh-pane label{display:block;margin-bottom:6px;color:#aaa;}
  .jh-btn{padding:6px 12px;background:#e94560;color:#fff;border:none;border-radius:4px;
      cursor:pointer;font-size:12px;margin-right:6px;margin-top:4px;}
  .jh-st{color:#888;font-size:11px;margin-top:8px;}
  .jh-row{display:flex;gap:6px;align-items:center;margin-bottom:6px;}
  #jh-console{flex:1;overflow-y:auto;background:#0a0a0a;padding:5px;font-family:monospace;
      font-size:11px;color:#0f0;white-space:pre-wrap;word-break:break-all;border-radius:4px;}
  #jh-console-input{width:100%;padding:5px;background:#0f3460;color:#eee;border:1px solid #444;
      border-radius:4px;font-size:12px;font-family:monospace;margin-top:5px;}
  #jh-console-pane{display:none;flex-direction:column;padding:5px;}
  #jh-console-pane.active{display:flex;}
  #jh-resize{position:absolute;bottom:0;right:0;width:20px;height:20px;cursor:se-resize;
      background:rgba(233,69,96,.3);color:#e94560;border-bottom-right-radius:8px;font-size:16px;
      line-height:14px;text-align:center;user-select:none;}
  `;
  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  const div = document.createElement('div');
  div.id = 'jh';
  div.innerHTML = `
    <div id="jh-header"><span>Wayground Cheat</span>
      <div><button id="jh-min">\u2014</button><button id="jh-close">X</button></div>
    </div>
    <div id="jh-tabs">
      <button data-tab="ai" class="active">AI Answer</button>
      <button data-tab="console">Console</button>
    </div>
    <div id="jh-body">
      <div class="jh-pane active" id="jh-ai-pane">
        <div class="jh-lbl">AI Auto Answer</div>
        <label>API Key<input type="password" id="jh-key"/></label>
        <label>Model<input type="text" id="jh-model"/></label>
        <div class="jh-row">
          <button class="jh-btn" id="jh-check" style="background:#0f3460">Check API</button>
          <label style="margin:0"><input type="checkbox" id="jh-auto"/> Auto Select</label>
        </div>
        <label>Delay (ms)<input type="number" id="jh-delay"/></label>
        <div class="jh-row">
          <button class="jh-btn" id="jh-run">Analyze &amp; Select</button>
          <button class="jh-btn" id="jh-multi" style="background:#0f3460">Auto Scan</button>
        </div>
        <div class="jh-st" id="jh-pick"></div>
        <div class="jh-st" id="jh-status">Diagnostic: ready</div>
      </div>
      <div class="jh-pane" id="jh-console-pane">
        <div id="jh-console"></div>
        <input id="jh-console-input" placeholder="Type command (help)..."/>
      </div>
      <div id="jh-resize">\u2582</div>
    </div>`;
  document.body.appendChild(div);

  const restore = document.createElement('div');
  restore.id = 'jh-restore';
  Object.assign(restore.style, {
    position: 'fixed', bottom: '20px', right: '20px', width: '40px', height: '40px',
    backgroundColor: 'rgba(233,69,96,.25)', borderRadius: '50%', display: 'none',
    justifyContent: 'center', alignItems: 'center', color: '#fff', fontSize: '16px',
    cursor: 'pointer', zIndex: 1000000, border: '1px solid rgba(255,255,255,.2)',
    userSelect: 'none',
  });
  restore.textContent = 'W';
  restore.title = 'Klik untuk mengembalikan jendela';
  document.body.appendChild(restore);

  const $ = (id) => div.querySelector('#' + id);
  const consoleEl = $('#jh-console');
  const consolePrint = (msg) => { consoleEl.appendChild(document.createTextNode(msg + '\n')); consoleEl.scrollTop = consoleEl.scrollHeight; };
  const setStatus = (s) => ($('#jh-status').textContent = 'Diagnostic: ' + s);

  $('#jh-key').value = cfg.key;
  $('#jh-model').value = cfg.model;
  $('#jh-delay').value = cfg.delay;
  $('#jh-key').oninput = () => { cfg.key = $('#jh-key').value.trim(); save(); };
  $('#jh-model').oninput = () => { cfg.model = $('#jh-model').value.trim(); save(); };
  $('#jh-delay').oninput = () => { cfg.delay = +$('#jh-delay').value || 0; save(); };

  const tabs = [...div.querySelectorAll('#jh-tabs button')];
  const panes = { ai: $('#jh-ai-pane'), console: $('#jh-console-pane') };
  tabs.forEach((b) =>
    b.addEventListener('click', () => {
      tabs.forEach((x) => x.classList.toggle('active', x === b));
      Object.entries(panes).forEach(([k, p]) => p.classList.toggle('active', k === b.dataset.tab));
    })
  );

  $('#jh-min').onclick = () => { div.style.display = 'none'; restore.style.display = 'flex'; };
  $('#jh-close').onclick = () => { div.remove(); restore.remove(); };
  restore.onclick = () => { restore.style.display = 'none'; div.style.display = 'flex'; };

  (function () {
    let drag = false, dx, dy;
    const h = $('#jh-header');
    h.addEventListener('mousedown', (e) => {
      if (['BUTTON', 'INPUT'].includes(e.target.tagName)) return;
      drag = true; dx = e.clientX - div.offsetLeft; dy = e.clientY - div.offsetTop;
      h.style.cursor = 'grabbing';
    });
    document.addEventListener('mousemove', (e) => {
      if (!drag) return;
      div.style.left = Math.max(0, Math.min(innerWidth - div.offsetWidth, e.clientX - dx)) + 'px';
      div.style.top = Math.max(0, Math.min(innerHeight - div.offsetHeight, e.clientY - dy)) + 'px';
    });
    document.addEventListener('mouseup', () => { drag = false; h.style.cursor = 'grab'; });
  })();

  (function () {
    let rz = false, sx, sy, sw, sh;
    const h = $('#jh-resize');
    h.addEventListener('mousedown', (e) => {
      e.stopPropagation(); rz = true; sx = e.clientX; sy = e.clientY;
      sw = div.offsetWidth; sh = div.offsetHeight;
    });
    document.addEventListener('mousemove', (e) => {
      if (!rz) return;
      div.style.width = Math.max(200, sw + e.clientX - sx) + 'px';
      div.style.height = Math.max(150, sh + e.clientY - sy) + 'px';
    });
    document.addEventListener('mouseup', () => (rz = false));
  })();

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  $('#jh-check').onclick = async () => {
    setStatus('checking...');
    try {
      const r = await askAI('2+2?', [{ innerText: '3' }, { innerText: '4' }, { innerText: '5' }], false);
      setStatus('API OK (' + r.join(',') + ')');
      consolePrint('[AI] Check API OK -> ' + r.join(','));
    } catch (e) { setStatus('API FAIL: ' + e.message); consolePrint('[AI] FAIL: ' + e.message); }
  };

  async function solve(multi) {
    const q = getQuestion();
    const opts = getOptions();
    if (!q || opts.length < 2) { setStatus('soal/opsi tidak ditemukan'); return; }
    setStatus('analyzing...');
    let labels;
    try { labels = await askAI(q, opts, multi); }
    catch (e) { setStatus('AI error: ' + e.message); consolePrint('[AI] error: ' + e.message); return; }
    $('#jh-pick').textContent = '\u2713 AI Pick: ' + labels.join(', ');
    consolePrint('[AI] Q: "' + q + '" | pick: ' + labels.join(','));
    for (const lab of labels) {
      const i = lab.toUpperCase().charCodeAt(0) - 65;
      if (opts[i]) { opts[i].click(); await sleep(120); }
    }
    setStatus('picked ' + labels.join(','));
  }

  $('#jh-run').onclick = () => solve(false);
  $('#jh-multi').onclick = () => solve(true);

  let last = '';
  setInterval(() => {
    if (!$('#jh-auto').checked) return;
    const q = getQuestion();
    if (q && q !== last) { last = q; setTimeout(() => solve(false), cfg.delay); }
  }, 1500);

  $('#jh-console-input').addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    const val = e.target.value.trim();
    if (!val) return;
    e.target.value = '';
    consolePrint('> ' + val);
    const cmd = val.split(' ')[0].toLowerCase();
    if (cmd === 'help' || cmd === 'h') consolePrint('Commands: help, clear, analyze, scan, check');
    else if (cmd === 'clear' || cmd === 'clr') consoleEl.textContent = '';
    else if (cmd === 'analyze' || cmd === 'aa') $('#jh-run').click();
    else if (cmd === 'scan') $('#jh-multi').click();
    else if (cmd === 'check') $('#jh-check').click();
    else consolePrint('Unknown command. Type "help".');
  });

  consolePrint('Wayground Cheat loaded. AI Answer ready.');
})();
