// Wayground Cheat - Main Script
// Host this file on GitHub raw, then use the bookmarklet to load it.

(function(){
    if (window._wgCheatLoaded) return;
    window._wgCheatLoaded = true;

    function getClientPos(e) {
        if (e.touches) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
        return { x: e.clientX, y: e.clientY };
    }

    let floatDiv = document.createElement('div');
    floatDiv.id = 'omegas-float-window';
    Object.assign(floatDiv.style, {
        position: 'fixed', top: '100px', left: '100px',
        width: Math.min(420, window.innerWidth * 0.9) + 'px',
        height: Math.min(520, window.innerHeight * 0.8) + 'px',
        backgroundColor: '#1a1a2e', color: '#eee', fontFamily: 'sans-serif',
        border: '1px solid #444', borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.6)', zIndex: 999999,
        overflow: 'hidden', display: 'flex', flexDirection: 'column', touchAction: 'none'
    });

    let header = document.createElement('div');
    Object.assign(header.style, {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        backgroundColor: '#16213e', padding: '6px 12px', cursor: 'grab',
        userSelect: 'none', touchAction: 'none', borderBottom: '1px solid #0f3460'
    });
    header.innerHTML = '<span style="font-weight:bold;font-size:14px;color:#e94560;">Wayground Cheat</span><div id="header-buttons" style="display:flex;align-items:center;"></div>';
    let headerButtons = header.querySelector('#header-buttons');

    let minimizeBtn = document.createElement('button');
    minimizeBtn.textContent = '—';
    Object.assign(minimizeBtn.style, { backgroundColor: '#555', color: 'white', border: 'none', padding: '4px 10px', marginLeft: '5px', cursor: 'pointer', borderRadius: '3px', fontSize: '0.85em', touchAction: 'manipulation' });
    minimizeBtn.addEventListener('mouseenter', () => minimizeBtn.style.backgroundColor = '#777');
    minimizeBtn.addEventListener('mouseleave', () => minimizeBtn.style.backgroundColor = '#555');

    let closeBtn = document.createElement('button');
    closeBtn.textContent = 'X';
    Object.assign(closeBtn.style, { backgroundColor: '#e94560', color: 'white', border: 'none', padding: '4px 10px', marginLeft: '5px', cursor: 'pointer', borderRadius: '3px', fontSize: '0.85em', touchAction: 'manipulation' });
    closeBtn.addEventListener('mouseenter', () => closeBtn.style.backgroundColor = '#ff6b81');
    closeBtn.addEventListener('mouseleave', () => closeBtn.style.backgroundColor = '#e94560');

    headerButtons.appendChild(minimizeBtn);
    headerButtons.appendChild(closeBtn);

    let tabBar = document.createElement('div');
    Object.assign(tabBar.style, { display: 'flex', backgroundColor: '#16213e', borderBottom: '2px solid #0f3460', padding: '0 5px' });

    let tabs = ['Anti-Cheat', 'Login Spoof', 'Blatant', 'Console'];
    let tabButtons = {}, tabContents = {};

    tabs.forEach(tabName => {
        let tabBtn = document.createElement('button');
        tabBtn.textContent = tabName;
        let isActive = tabName === 'Anti-Cheat';
        Object.assign(tabBtn.style, {
            flex: '1', padding: '6px 4px',
            backgroundColor: isActive ? '#0f3460' : 'transparent',
            color: isActive ? '#e94560' : '#888',
            border: 'none', borderBottom: isActive ? '2px solid #e94560' : '2px solid transparent',
            cursor: 'pointer', fontSize: '11px', fontWeight: 'bold', fontFamily: 'sans-serif',
            touchAction: 'manipulation', transition: 'all 0.2s'
        });
        tabBtn.addEventListener('mouseenter', () => { if (!tabBtn.dataset.active) tabBtn.style.color = '#e94560'; });
        tabBtn.addEventListener('mouseleave', () => { if (!tabBtn.dataset.active) tabBtn.style.color = '#888'; });
        tabButtons[tabName] = tabBtn;
        tabBar.appendChild(tabBtn);
    });

    let contentArea = document.createElement('div');
    Object.assign(contentArea.style, { flex: '1', overflow: 'hidden', position: 'relative' });

    let acContent = document.createElement('div');
    Object.assign(acContent.style, { padding: '10px', height: '100%', overflowY: 'auto', fontSize: '12px', display: 'block' });
    acContent.innerHTML = '<div style="color:#e94560;font-weight:bold;margin-bottom:8px;">Anti-Cheat Bypass</div>' +
        '<div style="margin-bottom:6px;"><input type="checkbox" id="ac-fullscreen" checked> <label for="ac-fullscreen">Bypass Fullscreen</label></div>' +
        '<div style="margin-bottom:6px;"><input type="checkbox" id="ac-tabdetect" checked> <label for="ac-tabdetect">Block Tab Detection</label></div>' +
        '<div style="margin-bottom:6px;"><input type="checkbox" id="ac-toast" checked> <label for="ac-toast">Block Toast Notifications</label></div>' +
        '<div style="margin-bottom:6px;"><input type="checkbox" id="ac-xhr" checked> <label for="ac-xhr">Block XHR/Fetch (Infractions)</label></div>' +
        '<div style="margin-bottom:8px;"><button id="ac-apply" style="padding:5px 12px;background:#e94560;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px;">Apply Anti-Cheat</button></div>' +
        '<div id="ac-status" style="color:#888;font-size:11px;">Status: Not applied</div>';
    tabContents['Anti-Cheat'] = acContent;

    let lsContent = document.createElement('div');
    Object.assign(lsContent.style, { padding: '10px', height: '100%', overflowY: 'auto', fontSize: '12px', display: 'none' });
    lsContent.innerHTML = '<div style="color:#e94560;font-weight:bold;margin-bottom:8px;">Login Spoof</div>' +
        '<div style="margin-bottom:8px;"><label>Player ID / Name:</label><br><input type="text" id="ls-playerid" placeholder="Enter fake player name" style="width:100%;padding:5px;margin-top:4px;background:#0f3460;color:#eee;border:1px solid #444;border-radius:4px;font-size:12px;box-sizing:border-box;"></div>' +
        '<div style="margin-bottom:8px;"><button id="ls-apply" style="padding:5px 12px;background:#e94560;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px;">Apply Spoof</button></div>' +
        '<div id="ls-status" style="color:#888;font-size:11px;">Status: Not active</div>';
    tabContents['Login Spoof'] = lsContent;

    let blContent = document.createElement('div');
    Object.assign(blContent.style, { padding: '10px', height: '100%', overflowY: 'auto', fontSize: '12px', display: 'none' });
    blContent.innerHTML = '<div style="color:#e94560;font-weight:bold;margin-bottom:8px;">Blatant Cheat</div>' +
        '<div style="margin-bottom:6px;"><label>Gemini API Key:</label><br><input type="password" id="bl-apikey" placeholder="AI API Key" style="width:100%;padding:5px;margin-top:4px;background:#0f3460;color:#eee;border:1px solid #444;border-radius:4px;font-size:12px;box-sizing:border-box;"></div>' +
        '<div style="margin-bottom:6px;"><label>Delay per question (ms):</label><br><input type="number" id="bl-delay" value="5000" style="width:100%;padding:5px;margin-top:4px;background:#0f3460;color:#eee;border:1px solid #444;border-radius:4px;font-size:12px;box-sizing:border-box;"></div>' +
        '<div style="margin-bottom:8px;"><button id="bl-start" style="padding:5px 12px;background:#e94560;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px;">Start Auto Answer</button></div>' +
        '<div style="margin-bottom:6px;"><label>Bots:</label> <input type="number" id="bl-botcount" value="5" style="width:50px;padding:3px;background:#0f3460;color:#eee;border:1px solid #444;border-radius:3px;font-size:12px;"> <button id="bl-sendbot" style="padding:3px 8px;background:#0f3460;color:#e94560;border:1px solid #e94560;border-radius:3px;cursor:pointer;font-size:11px;">Send Bots</button></div>' +
        '<div style="margin-bottom:6px;"><label>Fake Player:</label> <input type="text" id="bl-fakeplayer" placeholder="Name" style="width:120px;padding:3px;background:#0f3460;color:#eee;border:1px solid #444;border-radius:3px;font-size:12px;"> <button id="bl-applyfake" style="padding:3px 8px;background:#0f3460;color:#e94560;border:1px solid #e94560;border-radius:3px;cursor:pointer;font-size:11px;">Apply</button></div>' +
        '<div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:6px;">' +
        '<button id="bl-start-cmd" style="padding:3px 6px;background:#16213e;color:#e94560;border:1px solid #e94560;border-radius:3px;cursor:pointer;font-size:10px;">Start</button>' +
        '<button id="bl-pause-cmd" style="padding:3px 6px;background:#16213e;color:#e94560;border:1px solid #e94560;border-radius:3px;cursor:pointer;font-size:10px;">Pause</button>' +
        '<button id="bl-resume-cmd" style="padding:3px 6px;background:#16213e;color:#e94560;border:1px solid #e94560;border-radius:3px;cursor:pointer;font-size:10px;">Resume</button>' +
        '</div>' +
        '<div style="margin-bottom:6px;"><label>Kick:</label> <input type="text" id="bl-kickname" placeholder="Name" style="width:100px;padding:3px;background:#0f3460;color:#eee;border:1px solid #444;border-radius:3px;font-size:12px;"> <button id="bl-kick" style="padding:3px 6px;background:#16213e;color:#e94560;border:1px solid #e94560;border-radius:3px;cursor:pointer;font-size:10px;">Kick</button></div>' +
        '<div style="margin-bottom:6px;"><label>Finish:</label> <input type="text" id="bl-finishname" placeholder="Name" style="width:100px;padding:3px;background:#0f3460;color:#eee;border:1px solid #444;border-radius:3px;font-size:12px;"> <button id="bl-finish" style="padding:3px 6px;background:#16213e;color:#e94560;border:1px solid #e94560;border-radius:3px;cursor:pointer;font-size:10px;">Finish</button></div>' +
        '<div id="bl-status" style="color:#888;font-size:11px;">Status: Ready</div>';
    tabContents['Blatant'] = blContent;

    let consoleContent = document.createElement('div');
    Object.assign(consoleContent.style, { padding: '5px', height: '100%', display: 'none', flexDirection: 'column' });
    let consoleLog = document.createElement('div');
    Object.assign(consoleLog.style, { flex: '1', overflowY: 'auto', backgroundColor: '#0a0a0a', padding: '5px', fontFamily: 'monospace', fontSize: '11px', color: '#0f0', whiteSpace: 'pre-wrap', wordBreak: 'break-all', borderRadius: '4px', marginBottom: '5px' });
    let consoleInput = document.createElement('input');
    Object.assign(consoleInput.style, { width: '100%', padding: '5px', backgroundColor: '#0f3460', color: '#eee', border: '1px solid #444', borderRadius: '4px', fontSize: '12px', fontFamily: 'monospace', boxSizing: 'border-box' });
    consoleInput.placeholder = 'Type command (e.g. help)...';
    consoleLog.appendChild(document.createTextNode('Wayground Cheat Console\nType "help" for commands.\n'));
    consoleContent.appendChild(consoleLog);
    consoleContent.appendChild(consoleInput);
    tabContents['Console'] = consoleContent;

    Object.values(tabContents).forEach(tc => contentArea.appendChild(tc));

    let resizeHandle = document.createElement('div');
    Object.assign(resizeHandle.style, { position: 'absolute', bottom: '0', right: '0', width: '20px', height: '20px', cursor: 'se-resize', backgroundColor: 'rgba(233,69,96,0.3)', borderBottomRightRadius: '8px', zIndex: 10, touchAction: 'none', color: '#e94560', fontSize: '16px', lineHeight: '16px', textAlign: 'center', userSelect: 'none' });
    resizeHandle.innerHTML = '▂';

    floatDiv.appendChild(header);
    floatDiv.appendChild(tabBar);
    floatDiv.appendChild(contentArea);
    floatDiv.appendChild(resizeHandle);
    document.body.appendChild(floatDiv);

    let restoreBtn = document.createElement('div');
    Object.assign(restoreBtn.style, { position: 'fixed', bottom: '20px', right: '20px', width: '40px', height: '40px', backgroundColor: 'rgba(233,69,96,0.25)', borderRadius: '50%', display: 'none', justifyContent: 'center', alignItems: 'center', color: 'rgba(255,255,255,0.8)', fontSize: '16px', cursor: 'pointer', zIndex: 1000000, userSelect: 'none', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(2px)', transition: 'background-color 0.2s' });
    restoreBtn.textContent = 'W';
    restoreBtn.addEventListener('mouseenter', () => restoreBtn.style.backgroundColor = 'rgba(233,69,96,0.5)');
    restoreBtn.addEventListener('mouseleave', () => restoreBtn.style.backgroundColor = 'rgba(233,69,96,0.25)');
    document.body.appendChild(restoreBtn);

    function switchTab(tabName) {
        Object.keys(tabContents).forEach(n => tabContents[n].style.display = n === tabName ? 'block' : 'none');
        Object.keys(tabButtons).forEach(n => {
            let b = tabButtons[n], a = n === tabName;
            b.style.backgroundColor = a ? '#0f3460' : 'transparent';
            b.style.color = a ? '#e94560' : '#888';
            b.style.borderBottom = a ? '2px solid #e94560' : '2px solid transparent';
            b.dataset.active = a ? '1' : '';
        });
    }
    Object.keys(tabButtons).forEach(n => tabButtons[n].addEventListener('click', () => switchTab(n)));

    let isMinimized = false;
    const minWidth = 200, minHeight = 150;
    let originalWidth = parseFloat(floatDiv.style.width), originalHeight = parseFloat(floatDiv.style.height);

    function resizeContainer(w, h) {
        w = Math.min(window.innerWidth * 0.9, Math.max(minWidth, w));
        h = Math.min(window.innerHeight * 0.9, Math.max(minHeight, h));
        floatDiv.style.width = w + 'px';
        floatDiv.style.height = h + 'px';
        if (!isMinimized) { originalWidth = w; originalHeight = h; }
    }

    function consolePrint(msg) {
        consoleLog.appendChild(document.createTextNode(msg + '\n'));
        consoleLog.scrollTop = consoleLog.scrollHeight;
    }

    minimizeBtn.addEventListener('click', () => { if (!isMinimized) { floatDiv.style.display = 'none'; restoreBtn.style.display = 'flex'; isMinimized = true; } });
    closeBtn.addEventListener('click', () => { floatDiv.remove(); restoreBtn.remove(); });
    restoreBtn.addEventListener('click', () => { restoreBtn.style.display = 'none'; floatDiv.style.display = 'flex'; resizeContainer(originalWidth, originalHeight); isMinimized = false; });

    let isDragging = false, dragStartX, dragStartY, dragStartLeft, dragStartTop;
    function onDragStart(e) {
        if (['BUTTON','INPUT','LABEL','SELECT'].includes(e.target.tagName)) return;
        e.preventDefault();
        let p = getClientPos(e);
        isDragging = true; dragStartX = p.x; dragStartY = p.y;
        dragStartLeft = floatDiv.offsetLeft; dragStartTop = floatDiv.offsetTop;
        header.style.cursor = 'grabbing';
    }
    function onDragMove(e) {
        if (!isDragging) return;
        e.preventDefault();
        let p = getClientPos(e);
        let nl = Math.max(0, Math.min(window.innerWidth - floatDiv.offsetWidth, dragStartLeft + p.x - dragStartX));
        let nt = Math.max(0, Math.min(window.innerHeight - floatDiv.offsetHeight, dragStartTop + p.y - dragStartY));
        floatDiv.style.left = nl + 'px'; floatDiv.style.top = nt + 'px';
    }
    function onDragEnd() { if (isDragging) { isDragging = false; header.style.cursor = 'grab'; } }

    header.addEventListener('mousedown', onDragStart);
    header.addEventListener('touchstart', onDragStart, { passive: false });
    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('touchmove', onDragMove, { passive: false });
    document.addEventListener('mouseup', onDragEnd);
    document.addEventListener('touchend', onDragEnd);

    let isResizing = false, rsX, rsY, rsW, rsH;
    function onResizeStart(e) { e.preventDefault(); let p = getClientPos(e); isResizing = true; rsX = p.x; rsY = p.y; rsW = floatDiv.offsetWidth; rsH = floatDiv.offsetHeight; }
    function onResizeMove(e) { if (!isResizing) return; e.preventDefault(); let p = getClientPos(e); resizeContainer(rsW + p.x - rsX, rsH + p.y - rsY); }
    function onResizeEnd() { isResizing = false; }

    resizeHandle.addEventListener('mousedown', onResizeStart);
    resizeHandle.addEventListener('touchstart', onResizeStart, { passive: false });
    document.addEventListener('mousemove', onResizeMove);
    document.addEventListener('touchmove', onResizeMove, { passive: false });
    document.addEventListener('mouseup', onResizeEnd);
    document.addEventListener('touchend', onResizeEnd);
    resizeHandle.addEventListener('mousedown', e => e.stopPropagation());
    resizeHandle.addEventListener('touchstart', e => e.stopPropagation());

    // === ANTI-CHEAT ===
    let _acApplied = false;
    function applyAntiCheat() {
        if (_acApplied) return; _acApplied = true;
        const _old_xhr = window.XMLHttpRequest, o_fetch = window.fetch;
        const blacklist_url = url => url.includes("playerinfraction") || url.includes("_anserver") || url.includes("sentry");

        if (document.getElementById('ac-fullscreen').checked) {
            const _old_rf = Element.prototype.requestFullscreen;
            const _old_rs = window?.history?.replaceState || history?.replaceState;
            if (location.href?.includes("/join/pre-game")) Element.prototype.requestFullscreen = () => {};
            window.history.replaceState = (...d) => {
                if (location.href?.includes("/join/pre-game")) Element.prototype.requestFullscreen = () => {};
                else if (location.href?.includes("/join/game")) Element.prototype.requestFullscreen = _old_rf;
                return _old_rs.apply(window.history, d);
            };
        }

        if (document.getElementById('ac-tabdetect').checked || document.getElementById('ac-toast').checked) {
            const blocked = ["left the tab", "right-click", "resized the window", "paste", "web extension"];
            let t = 0;
            let iv1 = setInterval(() => {
                const ao = document.querySelector("#root")?.__vue_app__?.config?.globalProperties?.$pinia?.state?.value?.gameData?.gameOptions?.antiCheating;
                if (typeof ao !== "object" || Array.isArray(ao) || ao == null) return;
                Object.keys(ao ?? {}).forEach(k => { if (typeof ao[k] === "boolean") Object.defineProperty(ao, k, { get: () => false }); });
                t += 250; if (t >= 40000) { clearInterval(iv1); }
            }, 250);
            let m = 0;
            let iv2 = setInterval(() => {
                [...document.getElementsByClassName("modal-container")].forEach(c => { if (c.querySelector(".fullscreen-exit-warning-container")) { c.remove(); clearInterval(iv2); } });
                m += 250; if (m >= 150000) { clearInterval(iv2); }
            }, 250);
            new MutationObserver(ml => {
                for (const mu of ml) { if (mu.type !== "childList") continue;
                    for (const n of mu.addedNodes) { if (n.nodeType !== 1) continue;
                        if (n.classList?.contains("modal-container") && n.querySelector(".fullscreen-exit-warning-container")) n.remove();
                        if (n.classList?.contains("toast") && n.classList?.contains("toast-alert") && n.querySelector(".title") && blocked.some(v => n.querySelector(".title").innerText?.toLowerCase().replaceAll(" ","").replaceAll("-","").includes(v.toLowerCase().replaceAll(" ","").replaceAll("-","")))) n.style.display = "none";
                    }
                }
            }).observe(document.body, { childList: true, subtree: true });
        }

        if (document.getElementById('ac-xhr').checked) {
            window.XMLHttpRequest = class extends _old_xhr { xhr_url; open(m, u) { this.xhr_url = u; return super.open(m, u); } send(b) { if (blacklist_url(this.xhr_url?.toLowerCase().replaceAll(" ","").replaceAll("-",""))) return; return super.send(b); } };
            window.navigator.sendBeacon = (...d) => { if (blacklist_url(d[0]?.toLowerCase().replaceAll(" ","").replaceAll("-",""))) return; return o_fetch(...d); };
            window.fetch = (...d) => { if (blacklist_url(d[0]?.toLowerCase().replaceAll(" ","").replaceAll("-",""))) return; return o_fetch(...d); };
        }

        document.getElementById('ac-status').textContent = 'Status: Applied!';
        document.getElementById('ac-status').style.color = '#4ecdc4';
        consolePrint('[Anti-Cheat] Bypass applied.');
    }
    document.getElementById('ac-apply').addEventListener('click', applyAntiCheat);

    // === LOGIN SPOOF ===
    let _lsApplied = false;
    function applyLoginSpoof() {
        if (_lsApplied) return;
        const fp = document.getElementById('ls-playerid').value?.trim();
        if (!fp) { document.getElementById('ls-status').textContent = 'Status: Enter a name!'; document.getElementById('ls-status').style.color = '#e94560'; return; }
        _lsApplied = true;
        const ox = window.XMLHttpRequest;
        const isJ = i => { let v = typeof i !== "string" ? JSON.stringify(i) : i; try { v = JSON.parse(v); } catch { return false; } return typeof v === "object" && v !== null; };
        window.XMLHttpRequest = class extends ox { send(b) { let t = b; if (isJ(b)) { const r = JSON.parse(b); if (r?.playerId) r.playerId = fp; t = JSON.stringify(r); } return super.send(t); } };
        document.getElementById('ls-status').textContent = 'Status: Spoofing as "' + fp + '"';
        document.getElementById('ls-status').style.color = '#4ecdc4';
        consolePrint('[Login Spoof] Spoofing as: ' + fp);
    }
    document.getElementById('ls-apply').addEventListener('click', applyLoginSpoof);

    // === BLATANT ===
    let _blG = {};
    async function initBlatant() {
        if (_blG.ready) return;
        await new Promise(r => { let i = setInterval(() => { if (!document.querySelector(".screen-loading")) { clearInterval(i); r(); } }, 100); });

        const vr = () => document.querySelector("#root")?.__vue_app__?.config?.globalProperties?.$pinia?.state?._rawValue;
        const gr = () => vr()?.gameData?.roomHash?._rawValue;
        const qv = () => vr()?.gameData?.quizVersionId?._rawValue;
        const pn = () => vr()?.player?.playerId?._rawValue;
        const ap = () => vr()?.gameData?.players?._rawValue;
        const gq = () => vr()?.gameQuestions?.list?._rawValue;
        const gs = l => { let r = ''; const c = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; for (let i = 0; i < l; i++) r += c.charAt(Math.floor(Math.random() * c.length)); return r; };
        _blG = { vr, gr, qv, pn, ap, gq, gs, ready: true };

        const ai_prompt = 'Hello Gemini, you\'re acting as a server for responding in JSON format. Please do not send back malformed JSON. JSON format does not need to be wraped in ```, or codeblock. This is the request format (Send by user, as JSON. After that they will have a variable named \'USER_REQUEST\'): {"question_text": QUESTION_TEXT, "question_type": QUESTION_TYPE, "question_options": QUESTION_OPTIONS}. if QUESTION_TYPE is "MCQ" choose one option as index. if "MSQ" choose multiple as array. if "BLANK" or "OPEN" type the answer. QUESTION_ANSWER will be the response. Return JSON: {"question_answer": ANSWER}.';

        const ai_request = async (qt, qo, qop) => {
            const k = document.getElementById('bl-apikey')?.value?.trim();
            if (!k) { consolePrint('[Blatant] No API key.'); return {}; }
            const p = ai_prompt.replace("__USER_REQUEST_JSON__", JSON.stringify({ question_text: qt, question_type: qo, question_options: qop || [] }));
            try {
                const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent?key=${k}`, { method: "POST", "Content-Type": "application/json", body: JSON.stringify({ contents: [{ parts: [{ text: p }] }] }) });
                const j = await r.json();
                return JSON.parse(j?.candidates?.[0]?.content?.parts?.[0]?.text?.toString().replaceAll("```json", "").replaceAll("```", "")) || {};
            } catch (e) { consolePrint('[Blatant] AI error: ' + e.message); return {}; }
        };

        const sendAnswer = async (player, qid, qtype, resp) => {
            let dr = resp;
            switch (qtype) { case "MCQ": dr = Number(resp) || 0; break; case "MSQ": dr = resp || [0]; break; case "BLANK": case "OPEN": dr = { media: null, text: resp, version: "2.0" }; break; }
            try {
                const r = await fetch("https://game.quizizz.com/play-api/v4/proceedGame", { credentials: "include", headers: { "Accept": "application/json", "Content-Type": "application/json", "Credentials": "include", "experiment-name": "canary_exp" }, referrer: "https://quizizz.com/", body: JSON.stringify({ roomHash: gr(), playerId: player, response: { attempt: 0, questionId: qid, questionType: qtype, response: dr, responseType: "original", timeTaken: 0, answer: [], isEvaluated: false, state: "attempted", provisional: { scores: { correct: 600, incorrect: 0 }, scoreBreakups: { correct: { base: 600, timer: 0, streak: 0, total: 600, powerups: [] }, incorrect: { base: 0, timer: 0, streak: 0, total: 0, powerups: [] } }, teamAdjustments: { correct: 0, incorrect: 0 } } }, questionId: qid, powerupEffects: { destroy: [] }, quizVersionId: qv() }), method: "POST", mode: "cors" });
                return await r.json() || {};
            } catch (e) { return {}; }
        };

        const joinReq = async (name) => {
            try { await fetch("https://game.quizizz.com/play-api/v5/join", { credentials: "omit", headers: { "Accept": "application/json", "Content-Type": "application/json", "Credentials": "include", "experiment-name": "main_main" }, referrer: "https://quizizz.com/", body: JSON.stringify({ roomHash: gr(), player: { id: name || gs(50), name: "", origin: "web", isGoogleAuth: false, avatarId: -1, startSource: "joinRoom", userAgent: "", uid: "", expName: "main_main", expSlot: "16" }, powerupInternalVersion: "20", ip: "1.1.1.1", "user-agent": "", socketId: "", authCookie: null, socketExperiment: "authRevamp" }), method: "POST", mode: "cors" }); } catch (e) {}
        };

        const getPlayerData = async (name) => {
            try { const r = await fetch("https://game.quizizz.com/play-api/v6/rejoinGame", { credentials: "include", headers: { "Accept": "application/json", "Content-Type": "application/json", "Credentials": "include", "experiment-name": "main_main" }, referrer: "https://quizizz.com/", body: JSON.stringify({ roomHash: gr(), playerId: name?.toString() || "", startSource: "rejoin.param.routeData", powerupInternalVersion: "20", type: "live", soloApis: "v2", serverId: "", ip: "1.1.1.1", "user-agent": "", socketId: "", authCookie: null, socketExperiment: "authRevamp" }), method: "POST", mode: "cors" }); return await r.json(); } catch (e) { return {}; }
        };

        document.getElementById('bl-start').addEventListener('click', async () => {
            const q = gq(); if (!q) { consolePrint('[Blatant] Game not started.'); return; }
            const pd = await getPlayerData(pn());
            const aq = pd?.player?.totalResponses || 0;
            const dl = parseInt(document.getElementById('bl-delay')?.value) || 5000;
            const keys = Object.keys(q);
            consolePrint(`[Blatant] Auto answer: ${keys.length} Q | Delay: ${dl}ms`);
            let c = 0;
            for (let i = aq; i < keys.length; i++) {
                ((idx) => {
                    setTimeout(async () => {
                        const question = q[keys[idx]];
                        const ar = await ai_request(question?.text || "", question?.type || "MCQ", question?.options || null);
                        const res = await sendAnswer(pn(), question?.id, question?.type || "MCQ", ar["question_answer"] || 0);
                        consolePrint(`#${idx} Q: "${question?.text}" | A: ${ar["question_answer"] || 0} | ${res?.response?.result || "?"}`);
                    }, c * dl);
                })(i);
                c++;
            }
        });

        document.getElementById('bl-sendbot').addEventListener('click', async () => {
            const n = parseInt(document.getElementById('bl-botcount')?.value) || 0;
            if (n <= 0) return;
            consolePrint(`[Blatant] Sending ${n} bots...`);
            for (let i = 0; i < n; i++) await joinReq(gs(50));
            consolePrint(`[Blatant] Done.`);
        });

        document.getElementById('bl-applyfake').addEventListener('click', () => {
            const n = document.getElementById('bl-fakeplayer')?.value?.trim();
            if (!n) return;
            try { vr().player.playerId._rawValue = n; vr().player.playerId._value = n; consolePrint('[Blatant] Fake: ' + n); } catch (e) { consolePrint('[Blatant] Error: ' + e.message); }
        });

        document.getElementById('bl-start-cmd').addEventListener('click', async () => { try { await fetch("https://quizizz.com/_api/main/game/start", { credentials: "include", headers: { "Accept": "application/json", "Content-Type": "application/json" }, body: JSON.stringify({ roomHash: gr() }), method: "POST" }); consolePrint('[Blatant] Game started.'); } catch (e) {} });
        document.getElementById('bl-pause-cmd').addEventListener('click', async () => { try { await fetch("https://quizizz.com/_api/main/game/pause", { credentials: "include", headers: { "Accept": "application/json", "Content-Type": "application/json" }, body: JSON.stringify({ pauseFor: 600, roomHash: gr() }), method: "POST" }); consolePrint('[Blatant] Paused.'); } catch (e) {} });
        document.getElementById('bl-resume-cmd').addEventListener('click', async () => { try { await fetch("https://quizizz.com/_api/main/game/pause", { credentials: "include", headers: { "Accept": "application/json", "Content-Type": "application/json" }, body: JSON.stringify({ pauseFor: 0, roomHash: gr() }), method: "POST" }); consolePrint('[Blatant] Resumed.'); } catch (e) {} });

        document.getElementById('bl-kick').addEventListener('click', async () => {
            const n = document.getElementById('bl-kickname')?.value?.trim(); if (!n) return;
            try { await fetch(`https://quizizz.com/_api/main/game/${gr()}/player`, { credentials: "include", headers: { "Accept": "application/json", "Content-Type": "application/json" }, body: JSON.stringify({ playerId: n }), method: "DELETE" }); consolePrint('[Blatant] Kicked: ' + n); } catch (e) {}
        });

        document.getElementById('bl-finish').addEventListener('click', async () => {
            const n = document.getElementById('bl-finishname')?.value?.trim(); if (!n) return;
            try { await fetch("https://game.quizizz.com/play-api/v2/playerGameOver", { credentials: "include", headers: { "Accept": "application/json", "Content-Type": "application/json", "Credentials": "include", "experiment-name": "main_main" }, referrer: "https://quizizz.com/", body: JSON.stringify({ roomHash: gr(), playerId: n, endedAt: Date.now(), serverId: "", ip: "1.1.1.1", "user-agent": "", socketId: "", authCookie: null, socketExperiment: "authRevamp" }), method: "POST" }); consolePrint('[Blatant] Finished: ' + n); } catch (e) {}
        });

        consolePrint('[Blatant] Ready. Room: ' + gr());
    }
    tabButtons['Blatant'].addEventListener('click', () => initBlatant());

    // === CONSOLE ===
    consoleInput.addEventListener('keydown', async e => {
        if (e.key !== 'Enter') return;
        const v = consoleInput.value?.trim(); if (!v) return;
        consoleInput.value = '';
        consolePrint('> ' + v);
        const p = v.split(' '), c = p[0].toLowerCase(), a = p.slice(1);
        if (c === 'help' || c === 'h') consolePrint('Commands: help, clear, autoanswer/aa, getplayers/gp, kick, finish/f, fakeplayer, start, pause, resume, sendbot, anticheat, spoof');
        else if (c === 'clear' || c === 'clr') consoleLog.textContent = '';
        else if (c === 'autoanswer' || c === 'aa') document.getElementById('bl-start')?.click();
        else if (c === 'getplayers' || c === 'gp') { if (_blG.ap) { const pl = _blG.ap(); if (pl) pl.forEach(p => consolePrint(`#${p.rank || "?"} | ${p.id || "?"}`)); } else consolePrint('Init Blatant tab first.'); }
        else if (c === 'kick' && a[0]) { document.getElementById('bl-kickname').value = a.join(' '); document.getElementById('bl-kick')?.click(); }
        else if ((c === 'finish' || c === 'f') && a[0]) { document.getElementById('bl-finishname').value = a.join(' '); document.getElementById('bl-finish')?.click(); }
        else if (c === 'fakeplayer' && a[0]) { document.getElementById('bl-fakeplayer').value = a.join(' '); document.getElementById('bl-applyfake')?.click(); }
        else if (c === 'start') document.getElementById('bl-start-cmd')?.click();
        else if (c === 'pause') document.getElementById('bl-pause-cmd')?.click();
        else if (c === 'resume') document.getElementById('bl-resume-cmd')?.click();
        else if (c === 'sendbot' && a[0]) { document.getElementById('bl-botcount').value = a[0]; document.getElementById('bl-sendbot')?.click(); }
        else if (c === 'anticheat') document.getElementById('ac-apply')?.click();
        else if (c === 'spoof' && a[0]) { document.getElementById('ls-playerid').value = a.join(' '); document.getElementById('ls-apply')?.click(); }
        else consolePrint('Unknown. Type "help".');
    });

    consolePrint('All modules loaded.');
})();
