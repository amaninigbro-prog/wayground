// Zulfa Cheat - Wayground Answer Finder

(function(){
    if (window._zcLoaded) return;
    window._zcLoaded = true;

    let floatDiv = document.createElement('div');
    floatDiv.id = 'zc-float';
    Object.assign(floatDiv.style, {
        position: 'fixed', top: '80px', left: '50%', transform: 'translateX(-50%)',
        width: '520px', maxHeight: '85vh', backgroundColor: '#1a1a2e', color: '#eee',
        fontFamily: 'sans-serif', border: '1px solid #444', borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.6)', zIndex: 999999, overflow: 'hidden',
        display: 'flex', flexDirection: 'column'
    });

    let header = document.createElement('div');
    Object.assign(header.style, {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        backgroundColor: '#16213e', padding: '8px 14px', cursor: 'grab', userSelect: 'none',
        borderBottom: '1px solid #0f3460'
    });
    header.innerHTML = '<span style="font-weight:bold;font-size:15px;color:#e94560;">Zulfa Cheat</span>';
    let closeBtn = document.createElement('button');
    closeBtn.textContent = 'X';
    Object.assign(closeBtn.style, { backgroundColor: '#e94560', color: 'white', border: 'none', padding: '4px 10px', cursor: 'pointer', borderRadius: '3px', fontSize: '12px' });
    closeBtn.addEventListener('click', () => floatDiv.remove());
    header.appendChild(closeBtn);

    let body = document.createElement('div');
    Object.assign(body.style, { padding: '12px', overflowY: 'auto', flex: '1' });
    body.innerHTML =
        '<div style="display:flex;gap:6px;margin-bottom:10px;">' +
        '<button id="zc-find" style="flex:1;padding:10px;background:#e94560;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:13px;font-weight:bold;">🔍 Cari Semua Jawaban</button>' +
        '<button id="zc-debug" style="padding:10px;background:#0f3460;color:#e94560;border:1px solid #e94560;border-radius:4px;cursor:pointer;font-size:13px;">🐛 Debug</button>' +
        '</div>' +
        '<div id="zc-status" style="color:#888;font-size:12px;margin-bottom:8px;">Klik tombol untuk mencari jawaban</div>' +
        '<div id="zc-results" style="background:#0a0a0a;padding:10px;border-radius:4px;font-family:monospace;font-size:11px;color:#0f0;white-space:pre-wrap;word-break:break-all;max-height:60vh;overflow-y:auto;"></div>';

    floatDiv.appendChild(header);
    floatDiv.appendChild(body);
    document.body.appendChild(floatDiv);

    let isDragging = false, dragX, dragY;
    header.addEventListener('mousedown', e => {
        if (e.target === closeBtn) return;
        isDragging = true; dragX = e.clientX; dragY = e.clientY; header.style.cursor = 'grabbing';
    });
    document.addEventListener('mousemove', e => {
        if (!isDragging) return;
        floatDiv.style.left = (floatDiv.offsetLeft + e.clientX - dragX) + 'px';
        floatDiv.style.top = (floatDiv.offsetTop + e.clientY - dragY) + 'px';
        floatDiv.style.transform = 'none';
        dragX = e.clientX; dragY = e.clientY;
    });
    document.addEventListener('mouseup', () => { isDragging = false; header.style.cursor = 'grab'; });

    function getState() {
        try {
            const root = document.querySelector('#root');
            const vueApp = root?.__vue_app__;
            const pinia = vueApp?.config?.globalProperties?.$pinia;
            return pinia?.state?._rawValue;
        } catch { return null; }
    }

    function debugData() {
        const status = document.getElementById('zc-status');
        const results = document.getElementById('zc-results');
        status.textContent = 'Debugging...'; status.style.color = '#e94560';

        const state = getState();
        if (!state) { status.textContent = 'State tidak ditemukan'; status.style.color = '#e94560'; return; }

        const questions = state?.gameQuestions?.list?._rawValue;
        if (!questions) { status.textContent = 'Tidak ada pertanyaan'; status.style.color = '#e94560'; return; }

        const keys = Object.keys(questions);
        const firstQ = questions[keys[0]];

        let debug = '=== STRUKTUR SOAL PERTAMA ===\n\n';
        debug += 'Keys pada soal: ' + Object.keys(firstQ).join(', ') + '\n\n';
        debug += 'Full JSON (soal 1):\n' + JSON.stringify(firstQ, null, 2) + '\n\n';

        if (firstQ.options) {
            debug += '=== OPSI (soal 1) ===\n';
            debug += 'Jumlah opsi: ' + firstQ.options.length + '\n';
            firstQ.options.forEach((o, i) => {
                debug += 'Opsi ' + i + ': ' + JSON.stringify(o) + '\n';
            });
        }

        debug += '\n=== SEMUA PROPERTI YANG MENGANDUNG "correct" / "answer" ===\n';
        const str = JSON.stringify(firstQ);
        const matches = str.match(/"[^"]*(?:correct|answer|right|benar)[^"]*"\s*:\s*[^,}]+/gi);
        if (matches) matches.forEach(m => debug += m + '\n');
        else debug += 'Tidak ditemukan properti serupa\n';

        results.textContent = debug;
        status.textContent = 'Debug selesai - lihat struktur di bawah';
        status.style.color = '#4ecdc4';
    }

    function findAnswers() {
        const status = document.getElementById('zc-status');
        const results = document.getElementById('zc-results');
        status.textContent = 'Mencari jawaban...'; status.style.color = '#e94560';
        results.textContent = '';

        const state = getState();
        if (!state) {
            status.textContent = 'State tidak ditemukan. Pastikan di halaman game.';
            status.style.color = '#e94560';
            return;
        }

        const questions = state?.gameQuestions?.list?._rawValue;
        const roomHash = state?.gameData?.roomHash?._rawValue;
        const players = state?.gameData?.players?._rawValue;

        if (!questions) {
            status.textContent = 'Pertanyaan belum dimuat. Mulai game dulu.';
            status.style.color = '#e94560';
            return;
        }

        const keys = Object.keys(questions);
        let output = '';
        if (roomHash) output += 'Room: ' + roomHash + '\n';
        if (players) output += 'Pemain: ' + players.length + '\n';
        output += 'Total Soal: ' + keys.length + '\n';
        output += '═'.repeat(40) + '\n\n';

        let found = 0;

        keys.forEach((k, i) => {
            const q = questions[k];
            const qText = q?.questionText || q?.text || 'Soal #' + (i+1);
            const qType = q?.type || 'MCQ';
            const options = q?.options || [];

            let answer = '?';

            if (options.length) {
                // Cari jawaban benar dengan berbagai kemungkinan nama properti
                const correct = options.filter(o =>
                    o.isCorrect === true ||
                    o.correct === true ||
                    o.is_correct === true ||
                    o.right === true ||
                    o.answer === true
                );

                if (correct.length) {
                    answer = correct.map(o => o.text || o.value || o.label || o.id).join(', ');
                    found++;
                } else {
                    // Coba cari dari index / correctIndex
                    const ci = q.correctIndex ?? q.correctAnswer ?? q.answerIndex ?? q.answer;
                    if (ci !== undefined && ci !== null) {
                        if (typeof ci === 'number' && options[ci]) {
                            answer = options[ci].text || options[ci].value || 'Index ' + ci;
                            found++;
                        } else {
                            answer = 'correctIndex: ' + JSON.stringify(ci);
                        }
                    } else {
                        // Fallback: dump opsi pertama
                        answer = 'opsi[0]: ' + JSON.stringify(options[0]);
                    }
                }
            } else {
                answer = q?.answer || q?.correctAnswer || q?.correctAnswers?.[0] || 'Tidak ada opsi';
            }

            output += '#' + (i+1) + ' [' + qType + '] ' + qText.replace(/<[^>]+>/g, '') + '\n';
            output += '   ✅ ' + answer + '\n\n';
        });

        output += '═'.repeat(40) + '\n';
        output += 'Ditemukan: ' + found + '/' + keys.length + '\n';

        results.textContent = output;
        status.textContent = 'Selesai! ' + keys.length + ' soal diproses.';
        status.style.color = found > 0 ? '#4ecdc4' : '#e94560';
    }

    document.getElementById('zc-find').addEventListener('click', findAnswers);
    document.getElementById('zc-debug').addEventListener('click', debugData);
})();
