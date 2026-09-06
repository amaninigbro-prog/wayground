javascript:(function(){
    // --- Fungsi utilitas untuk touch/mouse ---
    function getClientPos(e) {
        if (e.touches) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
        return { x: e.clientX, y: e.clientY };
    }

    // --- Buat floating container utama ---
    let floatDiv = document.createElement('div');
    floatDiv.id = 'omegas-float-window';
    Object.assign(floatDiv.style, {
        position: 'fixed',
        top: '100px',
        left: '100px',
        width: Math.min(420, window.innerWidth * 0.9) + 'px',
        height: Math.min(520, window.innerHeight * 0.8) + 'px',
        backgroundColor: '#1a1a2e',
        color: '#eee',
        fontFamily: 'sans-serif',
        border: '1px solid #444',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
        zIndex: 999999,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        touchAction: 'none'
    });

    // --- Header ---
    let header = document.createElement('div');
    Object.assign(header.style, {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#16213e',
        padding: '6px 12px',
        cursor: 'grab',
        userSelect: 'none',
        touchAction: 'none',
        borderBottom: '1px solid #0f3460'
    });
    header.innerHTML = '<span style="font-weight:bold;font-size:14px;color:#e94560;">Wayground Cheat</span><div id="header-buttons" style="display: flex; align-items: center;"></div>';
    let headerButtons = header.querySelector('#header-buttons');

    // Tombol Minimize
    let minimizeBtn = document.createElement('button');
    minimizeBtn.textContent = '—';
    Object.assign(minimizeBtn.style, {
        backgroundColor: '#555', color: 'white', border: 'none', padding: '4px 10px',
        marginLeft: '5px', cursor: 'pointer', borderRadius: '3px', fontSize: '0.85em',
        touchAction: 'manipulation'
    });
    minimizeBtn.addEventListener('mouseenter', () => minimizeBtn.style.backgroundColor = '#777');
    minimizeBtn.addEventListener('mouseleave', () => minimizeBtn.style.backgroundColor = '#555');

    // Tombol Close
    let closeBtn = document.createElement('button');
    closeBtn.textContent = 'X';
    Object.assign(closeBtn.style, {
        backgroundColor: '#e94560', color: 'white', border: 'none', padding: '4px 10px',
        marginLeft: '5px', cursor: 'pointer', borderRadius: '3px', fontSize: '0.85em',
        touchAction: 'manipulation'
    });
    closeBtn.addEventListener('mouseenter', () => closeBtn.style.backgroundColor = '#ff6b81');
    closeBtn.addEventListener('mouseleave', () => closeBtn.style.backgroundColor = '#e94560');

    headerButtons.appendChild(minimizeBtn);
    headerButtons.appendChild(closeBtn);

    // --- Tab Bar ---
    let tabBar = document.createElement('div');
    Object.assign(tabBar.style, {
        display: 'flex',
        backgroundColor: '#16213e',
        borderBottom: '2px solid #0f3460',
        padding: '0 5px'
    });

    let tabs = ['Anti-Cheat', 'Login Spoof', 'Blatant', 'Console'];
    let tabButtons = {};
    let tabContents = {};

    tabs.forEach(tabName => {
        let tabBtn = document.createElement('button');
        tabBtn.textContent = tabName;
        let isActive = tabName === 'Anti-Cheat';
        Object.assign(tabBtn.style, {
            flex: '1',
            padding: '6px 4px',
            backgroundColor: isActive ? '#0f3460' : 'transparent',
            color: isActive ? '#e94560' : '#888',
            border: 'none',
            borderBottom: isActive ? '2px solid #e94560' : '2px solid transparent',
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: 'bold',
            fontFamily: 'sans-serif',
            touchAction: 'manipulation',
            transition: 'all 0.2s'
        });
        tabBtn.addEventListener('mouseenter', () => {
            if (!tabBtn.dataset.active) tabBtn.style.color = '#e94560';
        });
        tabBtn.addEventListener('mouseleave', () => {
            if (!tabBtn.dataset.active) tabBtn.style.color = '#888';
        });
        tabButtons[tabName] = tabBtn;
        tabBar.appendChild(tabBtn);
    });

    // --- Tab Contents ---
    let contentArea = document.createElement('div');
    Object.assign(contentArea.style, {
        flex: 1,
        overflow: 'hidden',
        position: 'relative'
    });

    // === Tab: Anti-Cheat ===
    let acContent = document.createElement('div');
    Object.assign(acContent.style, {
        padding: '10px',
        height: '100%',
        overflowY: 'auto',
        fontSize: '12px',
        display: 'block'
    });
    acContent.innerHTML = '<div style="color:#e94560;font-weight:bold;margin-bottom:8px;">Anti-Cheat Bypass</div>' +
        '<div style="margin-bottom:6px;"><input type="checkbox" id="ac-fullscreen" checked> <label for="ac-fullscreen">Bypass Fullscreen</label></div>' +
        '<div style="margin-bottom:6px;"><input type="checkbox" id="ac-tabdetect" checked> <label for="ac-tabdetect">Block Tab Detection</label></div>' +
        '<div style="margin-bottom:6px;"><input type="checkbox" id="ac-toast" checked> <label for="ac-toast">Block Toast Notifications</label></div>' +
        '<div style="margin-bottom:6px;"><input type="checkbox" id="ac-xhr" checked> <label for="ac-xhr">Block XHR/Fetch (Infractions)</label></div>' +
        '<div style="margin-bottom:8px;"><button id="ac-apply" style="padding:5px 12px;background:#e94560;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px;">Apply Anti-Cheat</button></div>' +
        '<div id="ac-status" style="color:#888;font-size:11px;">Status: Not applied</div>';
    tabContents['Anti-Cheat'] = acContent;

    // === Tab: Login Spoof ===
    let lsContent = document.createElement('div');
    Object.assign(lsContent.style, {
        padding: '10px',
        height: '100%',
        overflowY: 'auto',
        fontSize: '12px',
        display: 'none'
    });
    lsContent.innerHTML = '<div style="color:#e94560;font-weight:bold;margin-bottom:8px;">Login Spoof</div>' +
        '<div style="margin-bottom:8px;"><label>Player ID / Name:</label><br><input type="text" id="ls-playerid" placeholder="Enter fake player name" style="width:100%;padding:5px;margin-top:4px;background:#0f3460;color:#eee;border:1px solid #444;border-radius:4px;font-size:12px;box-sizing:border-box;"></div>' +
        '<div style="margin-bottom:8px;"><button id="ls-apply" style="padding:5px 12px;background:#e94560;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px;">Apply Spoof</button></div>' +
        '<div id="ls-status" style="color:#888;font-size:11px;">Status: Not active</div>';
    tabContents['Login Spoof'] = lsContent;

    // === Tab: Blatant ===
    let blContent = document.createElement('div');
    Object.assign(blContent.style, {
        padding: '10px',
        height: '100%',
        overflowY: 'auto',
        fontSize: '12px',
        display: 'none'
    });
    blContent.innerHTML = '<div style="color:#e94560;font-weight:bold;margin-bottom:8px;">Blatant Cheat</div>' +
        '<div style="margin-bottom:6px;"><label>Gemini API Key:</label><br><input type="password" id="bl-apikey" placeholder="AI API Key" style="width:100%;padding:5px;margin-top:4px;background:#0f3460;color:#eee;border:1px solid #444;border-radius:4px;font-size:12px;box-sizing:border-box;"></div>' +
        '<div style="margin-bottom:6px;"><label>Delay per question (ms):</label><br><input type="number" id="bl-delay" value="5000" style="width:100%;padding:5px;margin-top:4px;background:#0f3460;color:#eee;border:1px solid #444;border-radius:4px;font-size:12px;box-sizing:border-box;"></div>' +
        '<div style="margin-bottom:8px;"><button id="bl-start" style="padding:5px 12px;background:#e94560;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:12px;">Start Auto Answer</button></div>' +
        '<div style="margin-bottom:6px;"><label>Bots to add:</label> <input type="number" id="bl-botcount" value="5" style="width:50px;padding:3px;background:#0f3460;color:#eee;border:1px solid #444;border-radius:3px;font-size:12px;"> <button id="bl-sendbot" style="padding:3px 8px;background:#0f3460;color:#e94560;border:1px solid #e94560;border-radius:3px;cursor:pointer;font-size:11px;">Send Bots</button></div>' +
        '<div style="margin-bottom:6px;"><label>Fake Player:</label> <input type="text" id="bl-fakeplayer" placeholder="Player name" style="width:120px;padding:3px;background:#0f3460;color:#eee;border:1px solid #444;border-radius:3px;font-size:12px;"> <button id="bl-applyfake" style="padding:3px 8px;background:#0f3460;color:#e94560;border:1px solid #e94560;border-radius:3px;cursor:pointer;font-size:11px;">Apply</button></div>' +
        '<div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:6px;">' +
        '<button id="bl-start-cmd" style="padding:3px 6px;background:#16213e;color:#e94560;border:1px solid #e94560;border-radius:3px;cursor:pointer;font-size:10px;">Start</button>' +
        '<button id="bl-pause-cmd" style="padding:3px 6px;background:#16213e;color:#e94560;border:1px solid #e94560;border-radius:3px;cursor:pointer;font-size:10px;">Pause</button>' +
        '<button id="bl-resume-cmd" style="padding:3px 6px;background:#16213e;color:#e94560;border:1px solid #e94560;border-radius:3px;cursor:pointer;font-size:10px;">Resume</button>' +
        '</div>' +
        '<div style="margin-bottom:6px;"><label>Kick player:</label> <input type="text" id="bl-kickname" placeholder="Name" style="width:100px;padding:3px;background:#0f3460;color:#eee;border:1px solid #444;border-radius:3px;font-size:12px;"> <button id="bl-kick" style="padding:3px 6px;background:#16213e;color:#e94560;border:1px solid #e94560;border-radius:3px;cursor:pointer;font-size:10px;">Kick</button></div>' +
        '<div style="margin-bottom:6px;"><label>Finish player:</label> <input type="text" id="bl-finishname" placeholder="Name" style="width:100px;padding:3px;background:#0f3460;color:#eee;border:1px solid #444;border-radius:3px;font-size:12px;"> <button id="bl-finish" style="padding:3px 6px;background:#16213e;color:#e94560;border:1px solid #e94560;border-radius:3px;cursor:pointer;font-size:10px;">Finish</button></div>' +
        '<div id="bl-status" style="color:#888;font-size:11px;">Status: Ready</div>';
    tabContents['Blatant'] = blContent;

    // === Tab: Console ===
    let consoleContent = document.createElement('div');
    Object.assign(consoleContent.style, {
        padding: '5px',
        height: '100%',
        display: 'none',
        flexDirection: 'column'
    });
    let consoleLog = document.createElement('div');
    Object.assign(consoleLog.style, {
        flex: 1,
        overflowY: 'auto',
        backgroundColor: '#0a0a0a',
        padding: '5px',
        fontFamily: 'monospace',
        fontSize: '11px',
        color: '#0f0',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-all',
        borderRadius: '4px',
        marginBottom: '5px'
    });
    let consoleInput = document.createElement('input');
    Object.assign(consoleInput.style, {
        width: '100%',
        padding: '5px',
        backgroundColor: '#0f3460',
        color: '#eee',
        border: '1px solid #444',
        borderRadius: '4px',
        fontSize: '12px',
        fontFamily: 'monospace',
        boxSizing: 'border-box'
    });
    consoleInput.placeholder = 'Type command (e.g. help)...';
    consoleLog.appendChild(document.createTextNode('Wayground Cheat Console\n'));
    consoleLog.appendChild(document.createTextNode('Type "help" for available commands.\n'));
    consoleContent.appendChild(consoleLog);
    consoleContent.appendChild(consoleInput);
    tabContents['Console'] = consoleContent;

    // Add all tab contents to content area
    Object.values(tabContents).forEach(tc => contentArea.appendChild(tc));

    // --- Handle resize (pojok kanan bawah) ---
    let resizeHandle = document.createElement('div');
    resizeHandle.id = 'resize-handle';
    Object.assign(resizeHandle.style, {
        position: 'absolute',
        bottom: '0',
        right: '0',
        width: '20px',
        height: '20px',
        cursor: 'se-resize',
        backgroundColor: 'rgba(233,69,96,0.3)',
        borderBottomRightRadius: '8px',
        zIndex: 10,
        touchAction: 'none',
        color: '#e94560',
        fontSize: '16px',
        lineHeight: '16px',
        textAlign: 'center',
        userSelect: 'none'
    });
    resizeHandle.innerHTML = '▂';

    // Gabungkan elemen utama
    floatDiv.appendChild(header);
    floatDiv.appendChild(tabBar);
    floatDiv.appendChild(contentArea);
    floatDiv.appendChild(resizeHandle);
    document.body.appendChild(floatDiv);

    // --- Tombol restore ---
    let restoreBtn = document.createElement('div');
    restoreBtn.id = 'omegas-restore-button';
    Object.assign(restoreBtn.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '40px',
        height: '40px',
        backgroundColor: 'rgba(233, 69, 96, 0.25)',
        borderRadius: '50%',
        display: 'none',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'rgba(255,255,255,0.8)',
        fontSize: '16px',
        cursor: 'pointer',
        zIndex: 1000000,
        userSelect: 'none',
        border: '1px solid rgba(255,255,255,0.2)',
        backdropFilter: 'blur(2px)',
        transition: 'background-color 0.2s'
    });
    restoreBtn.textContent = 'W';
    restoreBtn.title = 'Klik untuk mengembalikan jendela';
    restoreBtn.addEventListener('mouseenter', () => restoreBtn.style.backgroundColor = 'rgba(233, 69, 96, 0.5)');
    restoreBtn.addEventListener('mouseleave', () => restoreBtn.style.backgroundColor = 'rgba(233, 69, 96, 0.25)');
    document.body.appendChild(restoreBtn);

    // --- Tab Switching ---
    function switchTab(tabName) {
        Object.keys(tabContents).forEach(name => {
            tabContents[name].style.display = (name === tabName) ? 'block' : 'none';
        });
        Object.keys(tabButtons).forEach(name => {
            let btn = tabButtons[name];
            let isActive = name === tabName;
            btn.style.backgroundColor = isActive ? '#0f3460' : 'transparent';
            btn.style.color = isActive ? '#e94560' : '#888';
            btn.style.borderBottom = isActive ? '2px solid #e94560' : '2px solid transparent';
            btn.dataset.active = isActive ? '1' : '';
        });
    }
    Object.keys(tabButtons).forEach(name => {
        tabButtons[name].addEventListener('click', () => switchTab(name));
    });

    // --- State ---
    let isMinimized = false;
    const minWidth = 200, minHeight = 150;
    const maxWidth = window.innerWidth * 0.9, maxHeight = window.innerHeight * 0.9;
    let originalWidth = parseFloat(floatDiv.style.width);
    let originalHeight = parseFloat(floatDiv.style.height);

    function resizeContainer(w, h) {
        w = Math.min(maxWidth, Math.max(minWidth, w));
        h = Math.min(maxHeight, Math.max(minHeight, h));
        floatDiv.style.width = w + 'px';
        floatDiv.style.height = h + 'px';
        if (!isMinimized) {
            originalWidth = w;
            originalHeight = h;
        }
    }

    // --- Console Logger ---
    function consolePrint(msg) {
        let line = document.createTextNode(msg + '\n');
        consoleLog.appendChild(line);
        consoleLog.scrollTop = consoleLog.scrollHeight;
    }
    window._wgConsolePrint = consolePrint;

    // --- Tombol events ---
    minimizeBtn.addEventListener('click', () => {
        if (!isMinimized) {
            floatDiv.style.display = 'none';
            restoreBtn.style.display = 'flex';
            isMinimized = true;
        }
    });
    minimizeBtn.addEventListener('touchstart', (e) => e.stopPropagation(), { passive: false });

    closeBtn.addEventListener('click', () => {
        floatDiv.remove();
        restoreBtn.remove();
    });
    closeBtn.addEventListener('touchstart', (e) => e.stopPropagation(), { passive: false });

    restoreBtn.addEventListener('click', () => {
        restoreBtn.style.display = 'none';
        floatDiv.style.display = 'flex';
        resizeContainer(originalWidth, originalHeight);
        isMinimized = false;
    });
    restoreBtn.addEventListener('touchstart', (e) => e.stopPropagation(), { passive: false });

    // --- Drag ---
    let isDragging = false;
    let dragStartX, dragStartY, dragStartLeft, dragStartTop;

    function onDragStart(e) {
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT' || e.target.tagName === 'LABEL' || e.target.tagName === 'SELECT') return;
        e.preventDefault();
        let pos = getClientPos(e);
        isDragging = true;
        dragStartX = pos.x;
        dragStartY = pos.y;
        dragStartLeft = floatDiv.offsetLeft;
        dragStartTop = floatDiv.offsetTop;
        header.style.cursor = 'grabbing';
    }

    function onDragMove(e) {
        if (!isDragging) return;
        e.preventDefault();
        let pos = getClientPos(e);
        let dx = pos.x - dragStartX;
        let dy = pos.y - dragStartY;
        let newLeft = dragStartLeft + dx;
        let newTop = dragStartTop + dy;
        newLeft = Math.max(0, Math.min(window.innerWidth - floatDiv.offsetWidth, newLeft));
        newTop = Math.max(0, Math.min(window.innerHeight - floatDiv.offsetHeight, newTop));
        floatDiv.style.left = newLeft + 'px';
        floatDiv.style.top = newTop + 'px';
    }

    function onDragEnd() {
        if (isDragging) {
            isDragging = false;
            header.style.cursor = 'grab';
        }
    }

    header.addEventListener('mousedown', onDragStart);
    header.addEventListener('touchstart', onDragStart, { passive: false });
    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('touchmove', onDragMove, { passive: false });
    document.addEventListener('mouseup', onDragEnd);
    document.addEventListener('touchend', onDragEnd);
    document.addEventListener('touchcancel', onDragEnd);
    header.addEventListener('mouseleave', () => { if (!isDragging) header.style.cursor = 'grab'; });

    // --- Resize ---
    let isResizing = false;
    let resizeStartX, resizeStartY, resizeStartWidth, resizeStartHeight;

    function onResizeStart(e) {
        e.preventDefault();
        let pos = getClientPos(e);
        isResizing = true;
        resizeStartX = pos.x;
        resizeStartY = pos.y;
        resizeStartWidth = floatDiv.offsetWidth;
        resizeStartHeight = floatDiv.offsetHeight;
    }

    function onResizeMove(e) {
        if (!isResizing) return;
        e.preventDefault();
        let pos = getClientPos(e);
        resizeContainer(resizeStartWidth + (pos.x - resizeStartX), resizeStartHeight + (pos.y - resizeStartY));
    }

    function onResizeEnd() { isResizing = false; }

    resizeHandle.addEventListener('mousedown', onResizeStart);
    resizeHandle.addEventListener('touchstart', onResizeStart, { passive: false });
    document.addEventListener('mousemove', onResizeMove);
    document.addEventListener('touchmove', onResizeMove, { passive: false });
    document.addEventListener('mouseup', onResizeEnd);
    document.addEventListener('touchend', onResizeEnd);
    document.addEventListener('touchcancel', onResizeEnd);
    resizeHandle.addEventListener('mousedown', (e) => e.stopPropagation());
    resizeHandle.addEventListener('touchstart', (e) => e.stopPropagation());

    // =====================================================
    //  MODULE: ANTI-CHEAT
    // =====================================================
    let _acApplied = false;
    let _old_request_fullscreen, _old_replace_state;
    let _acIntervals = [];

    function applyAntiCheat() {
        if (_acApplied) return;
        _acApplied = true;

        const _old_xhr = window.XMLHttpRequest;
        const o_fetch = window.fetch;
        const blacklist_url = (url) => url.includes("playerinfraction") || url.includes("_anserver") || url.includes("sentry");

        if (document.getElementById('ac-fullscreen').checked) {
            _old_request_fullscreen = Element.prototype.requestFullscreen;
            _old_replace_state = window?.history?.replaceState || history?.replaceState;
            if (window.location.href?.toString().includes("/join/pre-game")) {
                Element.prototype.requestFullscreen = () => {};
            }
            window.history.replaceState = (...data) => {
                if (window.location.href?.toString().includes("/join/pre-game")) {
                    Element.prototype.requestFullscreen = () => {};
                } else if (window.location.href?.toString().includes("/join/game")) {
                    Element.prototype.requestFullscreen = _old_request_fullscreen;
                }
                return _old_replace_state.apply(window.history, data);
            }
        }

        if (document.getElementById('ac-tabdetect').checked || document.getElementById('ac-toast').checked) {
            const toast_content_block = ["left the tab", "right-click", "resized the window", "paste", "web extension"];
            let _disable_tries = 0;
            let iv1 = setInterval(() => {
                const anti_opt = document.querySelector("#root")?.__vue_app__?.config?.globalProperties?.$pinia?.state?.value?.gameData?.gameOptions?.antiCheating;
                if (typeof anti_opt !== "object" || Array.isArray(anti_opt) || anti_opt == null) return;
                const all_keys = Object.keys(anti_opt ?? {});
                for (let i = 0; i < all_keys.length; i++) {
                    if (typeof anti_opt[all_keys[i]] !== "boolean") return;
                    Object.defineProperty(anti_opt, all_keys[i], { get() { return false } });
                }
                _disable_tries += 250;
                if (_disable_tries >= 40000) { _disable_tries = 0; clearInterval(iv1); }
            }, 250);
            _acIntervals.push(iv1);

            let _modal_tries = 0;
            let iv2 = setInterval(() => {
                const mc = document.getElementsByClassName("modal-container");
                if (mc.length > 0) {
                    for (const _c of mc) {
                        if (_c.querySelector(".fullscreen-exit-warning-container")) {
                            _c.remove();
                            clearInterval(iv2);
                        }
                    }
                }
                _modal_tries += 250;
                if (_modal_tries >= 150000) { _modal_tries = 0; clearInterval(iv2); }
            }, 250);
            _acIntervals.push(iv2);

            new MutationObserver((mutationsList) => {
                for (const mutation of mutationsList) {
                    if (mutation.type !== "childList") return;
                    for (const addedNode of mutation.addedNodes) {
                        if (addedNode.nodeType !== 1) return;
                        if (addedNode.classList.contains("modal-container")) {
                            if (addedNode.querySelector(".fullscreen-exit-warning-container")) addedNode.remove();
                        }
                        if (addedNode.classList.contains("toast") && addedNode.classList.contains("toast-alert")) {
                            if (addedNode.querySelector(".title") && toast_content_block.some((v) => addedNode.querySelector(".title").innerText?.toString().toLowerCase().replaceAll(" ", "").replaceAll("-", "").includes(v?.toString().toLowerCase().replaceAll(" ", "").replaceAll("-", "")))) {
                                addedNode.style.display = "none";
                            }
                        }
                    }
                }
            }).observe(document.body, { childList: true, subtree: true });
        }

        if (document.getElementById('ac-xhr').checked) {
            window.XMLHttpRequest = class extends _old_xhr {
                xhr_url;
                open(method, url) { this.xhr_url = url; return super.open(method, url); }
                send(body) {
                    if (blacklist_url(this.xhr_url?.toString().toLowerCase().replaceAll(" ", "").replaceAll("-", "")) === true) return;
                    return super.send(body);
                }
            }
            window.navigator.sendBeacon = (...data) => {
                if (blacklist_url(data[0]?.toString().toLowerCase().replaceAll(" ", "").replaceAll("-", "")) === true) return;
                return o_fetch(...data);
            }
            window.fetch = (...data) => {
                if (blacklist_url(data[0]?.toString().toLowerCase().replaceAll(" ", "").replaceAll("-", "")) === true) return;
                return o_fetch(...data);
            }
        }

        document.getElementById('ac-status').textContent = 'Status: Applied!';
        document.getElementById('ac-status').style.color = '#4ecdc4';
        consolePrint('[Anti-Cheat] Bypass applied successfully.');
    }

    document.getElementById('ac-apply').addEventListener('click', applyAntiCheat);

    // =====================================================
    //  MODULE: LOGIN SPOOF
    // =====================================================
    let _lsApplied = false;

    function applyLoginSpoof() {
        if (_lsApplied) return;
        const fakePlayerId = document.getElementById('ls-playerid').value?.trim();
        if (!fakePlayerId) {
            document.getElementById('ls-status').textContent = 'Status: Enter a player name!';
            document.getElementById('ls-status').style.color = '#e94560';
            return;
        }
        _lsApplied = true;

        const original_xhr = window.XMLHttpRequest;
        const isJSON = (item) => {
            let value = typeof item !== "string" ? JSON.stringify(item) : item;
            try { value = JSON.parse(value); } catch (e) { return false; }
            return typeof value === "object" && value !== null;
        }

        class injected_xhr extends original_xhr {
            send(body) {
                let tampered_body = body;
                if (isJSON(body)) {
                    const r_body = JSON.parse(body);
                    if (r_body && r_body["playerId"]) r_body["playerId"] = fakePlayerId;
                    tampered_body = JSON.stringify(r_body);
                }
                return super.send(tampered_body);
            }
        }

        window.XMLHttpRequest = injected_xhr;
        document.getElementById('ls-status').textContent = 'Status: Spoofing as "' + fakePlayerId + '"';
        document.getElementById('ls-status').style.color = '#4ecdc4';
        consolePrint('[Login Spoof] Now spoofing as: ' + fakePlayerId);
    }

    document.getElementById('ls-apply').addEventListener('click', applyLoginSpoof);

    // =====================================================
    //  MODULE: BLATANT
    // =====================================================
    let _blLoaded = false;
    let _blGlobals = {};

    async function initBlatant() {
        if (_blLoaded) return;
        _blLoaded = true;

        const waitForEl = async (sel, interval) => {
            return new Promise((resolve) => {
                const iv = setInterval(() => { if (!document.querySelector(sel)) { clearInterval(iv); resolve(); } }, interval);
            });
        }
        await waitForEl(".screen-loading", 100);

        const get_vueRoot = () => document.querySelector("#root")?.__vue_app__?.config?.globalProperties?.$pinia?.state?._rawValue;
        const getRoomHash = () => get_vueRoot()?.gameData?.roomHash?._rawValue;
        const get_quizVersionId = () => get_vueRoot()?.gameData?.quizVersionId?._rawValue;
        const get_playerName = () => get_vueRoot()?.player?.playerId?._rawValue;
        const getAllPlayers = () => get_vueRoot()?.gameData?.players?._rawValue;
        const getGameQuestions = () => get_vueRoot()?.gameQuestions?.list?._rawValue;

        _blGlobals = { get_vueRoot, getRoomHash, get_quizVersionId, get_playerName, getAllPlayers, getGameQuestions };

        const o_setTimeout = setTimeout;
        const o_setInterval = setInterval;

        const true_obj = ["true", "on", "yes", "y", "yea", "enable"];
        const booleanify = (s) => true_obj.includes(s);

        const generateString = (length) => {
            let result = '';
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            for (let i = 0; i < length; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
            return result;
        }

        const ai_prompt = 'Hello Gemini, you\'re acting as a server for responding in JSON format. Please do not send back malformed JSON. JSON format does not need to be wraped in ```, or codeblock. This is the request format (Send by user, as JSON. After that they will have a variable named \'USER_REQUEST\'): {"question_text": QUESTION_TEXT, "question_type": QUESTION_TYPE, "question_options": QUESTION_OPTIONS}. if QUESTION_TYPE is "MCQ" choose one option as index. if "MSQ" choose multiple as array. if "BLANK" or "OPEN" type the answer. QUESTION_ANSWER will be the response. Return JSON: {"question_answer": ANSWER}.';

        const ai_request = async (question_text, question_type, question_options) => {
            const gemini_key = document.getElementById('bl-apikey').value?.trim();
            if (!gemini_key) { consolePrint('[Blatant] Error: No API key provided.'); return {}; }
            const crafted_information = { question_text, question_type, question_options: question_options || [] };
            const crafted_prompt = ai_prompt.replace("__USER_REQUEST_JSON__", JSON.stringify(crafted_information));
            try {
                const ai_res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent?key=${gemini_key}`, {
                    method: "POST",
                    "Content-Type": "application/json",
                    body: JSON.stringify({ contents: [{ parts: [{ text: crafted_prompt }] }] })
                });
                const cooked_res = await ai_res.json();
                return JSON.parse(cooked_res?.candidates?.[0]?.content?.parts?.[0]?.text?.toString().replaceAll("```json", "").replaceAll("```", "")) || {};
            } catch (e) {
                consolePrint('[Blatant] AI request error: ' + e.message);
                return {};
            }
        }

        const sendAnswer = async (playerName, question_id, question_type, question_response) => {
            let decided_response = question_response;
            switch (question_type) {
                case "MCQ": decided_response = Number(question_response) || 0; break;
                case "MSQ": decided_response = question_response || [0]; break;
                case "BLANK": case "OPEN": decided_response = { media: null, text: question_response, version: "2.0" }; break;
            }
            try {
                const res = await fetch("https://game.quizizz.com/play-api/v4/proceedGame", {
                    credentials: "include",
                    headers: { "Accept": "application/json", "Content-Type": "application/json", "Credentials": "include", "experiment-name": "canary_exp" },
                    referrer: "https://quizizz.com/",
                    body: JSON.stringify({
                        roomHash: getRoomHash(), playerId: playerName,
                        response: { attempt: 0, questionId: question_id, questionType: question_type, response: decided_response, responseType: "original", timeTaken: 0, answer: [], isEvaluated: false, state: "attempted", provisional: { scores: { correct: 600, incorrect: 0 }, scoreBreakups: { correct: { base: 600, timer: 0, streak: 0, total: 600, powerups: [] }, incorrect: { base: 0, timer: 0, streak: 0, total: 0, powerups: [] } }, teamAdjustments: { correct: 0, incorrect: 0 } } },
                        questionId: question_id, powerupEffects: { destroy: [] }, quizVersionId: get_quizVersionId()
                    }),
                    method: "POST", mode: "cors"
                });
                return await res.json() || {};
            } catch (e) { consolePrint('[Blatant] sendAnswer error: ' + e.message); return {}; }
        }

        const joinRequest = async (playerName) => {
            try {
                await fetch("https://game.quizizz.com/play-api/v5/join", {
                    credentials: "omit",
                    headers: { "Accept": "application/json", "Content-Type": "application/json", "Credentials": "include", "experiment-name": "main_main" },
                    referrer: "https://quizizz.com/",
                    body: JSON.stringify({
                        roomHash: getRoomHash(),
                        player: { id: playerName || generateString(50), name: "", origin: "web", isGoogleAuth: false, avatarId: -1, startSource: "joinRoom", userAgent: "", uid: "", expName: "main_main", expSlot: "16" },
                        powerupInternalVersion: "20", ip: "1.1.1.1", "user-agent": "", socketId: "", authCookie: null, socketExperiment: "authRevamp"
                    }),
                    method: "POST", mode: "cors"
                });
            } catch (e) { consolePrint('[Blatant] joinRequest error: ' + e.message); }
        }

        const getPlayerData = async (playerName) => {
            try {
                const res = await fetch("https://game.quizizz.com/play-api/v6/rejoinGame", {
                    credentials: "include",
                    headers: { "Accept": "application/json", "Content-Type": "application/json", "Credentials": "include", "experiment-name": "main_main" },
                    referrer: "https://quizizz.com/",
                    body: JSON.stringify({
                        roomHash: getRoomHash(), playerId: playerName?.toString() || "", startSource: "rejoin.param.routeData",
                        powerupInternalVersion: "20", type: "live", soloApis: "v2", serverId: "", ip: "1.1.1.1", "user-agent": "", socketId: "", authCookie: null, socketExperiment: "authRevamp"
                    }),
                    method: "POST", mode: "cors"
                });
                return await res.json();
            } catch (e) { consolePrint('[Blatant] getPlayerData error: ' + e.message); return {}; }
        }

        _blGlobals.sendAnswer = sendAnswer;
        _blGlobals.joinRequest = joinRequest;
        _blGlobals.getPlayerData = getPlayerData;
        _blGlobals.generateString = generateString;
        _blGlobals.ai_request = ai_request;
        _blGlobals.booleanify = booleanify;
        _blGlobals.o_setTimeout = o_setTimeout;
        _blGlobals.o_setInterval = o_setInterval;

        // --- Auto Answer ---
        document.getElementById('bl-start').addEventListener('click', async () => {
            const gameQuestions = getGameQuestions();
            if (!gameQuestions) { consolePrint('[Blatant] Error: Game not started or questions not loaded.'); return; }
            const currentPlayerData = await getPlayerData(get_playerName());
            const answered_question = currentPlayerData?.player?.totalResponses || 0;
            const delay = parseInt(document.getElementById('bl-delay').value) || 5000;
            const total_time = Object.keys(gameQuestions).length * delay;
            consolePrint(`[Blatant] Starting auto answer. Total: ${Object.keys(gameQuestions).length} | Delay: ${delay}ms | Est: ${(total_time/1000).toFixed(1)}s`);

            const gameQuestions_keys = Object.keys(gameQuestions);
            let actualCounter = 0;
            for (let counter = answered_question || 0; counter < gameQuestions_keys.length; counter++) {
                const current_counter = counter;
                const question_name = gameQuestions_keys[current_counter];
                setTimeout(async () => {
                    const question = gameQuestions[question_name];
                    const ai_response = await ai_request(question?.text || "", question?.type || "MCQ", question?.options || null);
                    const answer_res = await sendAnswer(get_playerName(), question?.id, question?.type || "MCQ", ai_response["question_answer"] || 0);
                    consolePrint(`#${current_counter} Q: "${question?.text}" | A: ${ai_response["question_answer"] || 0} | Result: ${answer_res?.response?.result || "?"}`);
                }, actualCounter * delay);
                actualCounter++;
            }
        });

        // --- Send Bots ---
        document.getElementById('bl-sendbot').addEventListener('click', async () => {
            const n_bot = parseInt(document.getElementById('bl-botcount').value) || 0;
            if (n_bot <= 0) return;
            consolePrint(`[Blatant] Sending ${n_bot} bots...`);
            const startTime = Date.now();
            for (let i = 0; i < n_bot; i++) {
                await joinRequest(generateString(50));
            }
            consolePrint(`[Blatant] Done sending ${n_bot} bots. Took ${Date.now() - startTime}ms`);
        });

        // --- Fake Player ---
        document.getElementById('bl-applyfake').addEventListener('click', () => {
            const name = document.getElementById('bl-fakeplayer').value?.trim();
            if (!name) return;
            try {
                get_vueRoot().player.playerId._rawValue = name;
                get_vueRoot().player.playerId._value = name;
                consolePrint('[Blatant] Fake player set to: ' + name);
            } catch (e) { consolePrint('[Blatant] Error: ' + e.message); }
        });

        // --- Game Control Buttons ---
        document.getElementById('bl-start-cmd').addEventListener('click', async () => {
            try {
                await fetch("https://quizizz.com/_api/main/game/start", { credentials: "include", headers: { "Accept": "application/json", "Content-Type": "application/json" }, body: JSON.stringify({ roomHash: getRoomHash() }), method: "POST", mode: "cors" });
                consolePrint('[Blatant] Game started.');
            } catch (e) { consolePrint('[Blatant] Start error: ' + e.message); }
        });

        document.getElementById('bl-pause-cmd').addEventListener('click', async () => {
            try {
                await fetch("https://quizizz.com/_api/main/game/pause", { credentials: "include", headers: { "Accept": "application/json", "Content-Type": "application/json" }, body: JSON.stringify({ pauseFor: 600, roomHash: getRoomHash() }), method: "POST", mode: "cors" });
                consolePrint('[Blatant] Game paused.');
            } catch (e) { consolePrint('[Blatant] Pause error: ' + e.message); }
        });

        document.getElementById('bl-resume-cmd').addEventListener('click', async () => {
            try {
                await fetch("https://quizizz.com/_api/main/game/pause", { credentials: "include", headers: { "Accept": "application/json", "Content-Type": "application/json" }, body: JSON.stringify({ pauseFor: 0, roomHash: getRoomHash() }), method: "POST", mode: "cors" });
                consolePrint('[Blatant] Game resumed.');
            } catch (e) { consolePrint('[Blatant] Resume error: ' + e.message); }
        });

        // --- Kick ---
        document.getElementById('bl-kick').addEventListener('click', async () => {
            const name = document.getElementById('bl-kickname').value?.trim();
            if (!name) return;
            try {
                await fetch(`https://quizizz.com/_api/main/game/${getRoomHash()}/player`, { credentials: "include", headers: { "Accept": "application/json", "Content-Type": "application/json" }, body: JSON.stringify({ playerId: name }), method: "DELETE", mode: "cors" });
                consolePrint('[Blatant] Kicked: ' + name);
            } catch (e) { consolePrint('[Blatant] Kick error: ' + e.message); }
        });

        // --- Finish ---
        document.getElementById('bl-finish').addEventListener('click', async () => {
            const name = document.getElementById('bl-finishname').value?.trim();
            if (!name) return;
            try {
                await fetch("https://game.quizizz.com/play-api/v2/playerGameOver", {
                    credentials: "include",
                    headers: { "Accept": "application/json", "Content-Type": "application/json", "Credentials": "include", "experiment-name": "main_main" },
                    referrer: "https://quizizz.com/",
                    body: JSON.stringify({ roomHash: getRoomHash(), playerId: name, endedAt: Date.now(), serverId: "", ip: "1.1.1.1", "user-agent": "", socketId: "", authCookie: null, socketExperiment: "authRevamp" }),
                    method: "POST", mode: "cors"
                });
                consolePrint('[Blatant] Finished player: ' + name);
            } catch (e) { consolePrint('[Blatant] Finish error: ' + e.message); }
        });

        consolePrint('[Blatant] Module initialized. Room: ' + getRoomHash());
    }

    // Auto-init blatant when tab is clicked
    tabButtons['Blatant'].addEventListener('click', () => initBlatant());

    // =====================================================
    //  CONSOLE INPUT HANDLER
    // =====================================================
    consoleInput.addEventListener('keydown', async (e) => {
        if (e.key !== 'Enter') return;
        const val = consoleInput.value?.trim();
        if (!val) return;
        consoleInput.value = '';
        consolePrint('> ' + val);

        const parts = val.split(' ');
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);

        if (cmd === 'help' || cmd === 'h') {
            consolePrint('Commands: help, clear, autoanswer, aa, getplayers, gp, kick <name>, finish <name>, fakeplayer <name>, start, pause, resume, sendbot <n>, viewanswer <name>, copyanswer <name>');
        } else if (cmd === 'clear' || cmd === 'clr') {
            consoleLog.textContent = '';
        } else if (cmd === 'autoanswer' || cmd === 'aa') {
            document.getElementById('bl-start').click();
        } else if (cmd === 'getplayers' || cmd === 'gp') {
            if (_blGlobals.getAllPlayers) {
                const players = _blGlobals.getAllPlayers();
                if (players) players.forEach(p => consolePrint(`Rank #${p.rank || "?"} | ${p.id || "?"}`));
            } else consolePrint('Blatant module not initialized. Switch to Blatant tab first.');
        } else if (cmd === 'kick') {
            if (args[0]) { document.getElementById('bl-kickname').value = args.join(' '); document.getElementById('bl-kick').click(); }
            else consolePrint('Usage: kick <playerName>');
        } else if (cmd === 'finish' || cmd === 'f') {
            if (args[0]) { document.getElementById('bl-finishname').value = args.join(' '); document.getElementById('bl-finish').click(); }
            else consolePrint('Usage: finish <playerName>');
        } else if (cmd === 'fakeplayer') {
            if (args[0]) { document.getElementById('bl-fakeplayer').value = args.join(' '); document.getElementById('bl-applyfake').click(); }
            else consolePrint('Usage: fakeplayer <playerName>');
        } else if (cmd === 'start') {
            document.getElementById('bl-start-cmd').click();
        } else if (cmd === 'pause') {
            document.getElementById('bl-pause-cmd').click();
        } else if (cmd === 'resume') {
            document.getElementById('bl-resume-cmd').click();
        } else if (cmd === 'sendbot') {
            if (args[0]) { document.getElementById('bl-botcount').value = args[0]; document.getElementById('bl-sendbot').click(); }
            else consolePrint('Usage: sendbot <count>');
        } else if (cmd === 'anticheat') {
            document.getElementById('ac-apply').click();
        } else if (cmd === 'spoof') {
            if (args[0]) { document.getElementById('ls-playerid').value = args.join(' '); document.getElementById('ls-apply').click(); }
            else consolePrint('Usage: spoof <playerName>');
        } else {
            consolePrint('Unknown command. Type "help" for list.');
        }
    });

    consolePrint('All modules loaded. Window ready.');
})();
