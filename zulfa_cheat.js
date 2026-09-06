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
        '<div style="margin-bottom:10px;">' +
        '<button id="zc-find" style="width:100%;padding:10px;background:#e94560;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:13px;font-weight:bold;">🔍 Cari Semua Jawaban (API Teacher)</button>' +
        '</div>' +
        '<div id="zc-status" style="color:#888;font-size:12px;margin-bottom:8px;">Klik tombol untuk mengambil jawaban dari API</div>' +
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

    const _fetch = async (url, opts) => {
        const r = await fetch(url, opts);
        const t = await r.text();
        try { return JSON.parse(t); } catch { return { _raw: t, _status: r.status }; }
    };

    function getState() {
        try {
            const root = document.querySelector('#root');
            return root?.__vue_app__?.config?.globalProperties?.$pinia?.state?._rawValue;
        } catch { return null; }
    }

    async function findAnswers() {
        const status = document.getElementById('zc-status');
        const results = document.getElementById('zc-results');
        status.textContent = 'Mengambil data dari API...'; status.style.color = '#e94560';
        results.textContent = '';

        const state = getState();
        if (!state) { status.textContent = 'State tidak ditemukan'; status.style.color = '#e94560'; return; }

        const questions = state?.gameQuestions?.list?._rawValue;
        const roomHash = state?.gameData?.roomHash?._rawValue;
        const players = state?.gameData?.players?._rawValue;
        const quizId = state?.gameData?.quizId?._rawValue || state?.gameData?.quizVersionId?._rawValue;

        if (!questions) { status.textContent = 'Pertanyaan belum dimuat'; status.style.color = '#e94560'; return; }

        const keys = Object.keys(questions);

        // Coba ambil data quiz dari API teacher
        let teacherData = null;
        const endpoints = [
            quizId ? 'https://quizizz.com/api/v2/admin/quiz/' + quizId + '?includeSource=true' : null,
            quizId ? 'https://quizizz.com/api/v2/quiz/' + quizId : null,
            roomHash ? 'https://game.quizizz.com/play-api/v4/gameState/' + roomHash : null,
        ].filter(Boolean);

        for (const ep of endpoints) {
            try {
                const d = await _fetch(ep, { credentials: 'include', headers: { 'Accept': 'application/json' } });
                if (d && !d._raw) {
                    teacherData = d;
                    break;
                }
            } catch {}
        }

        // Jika quizId tidak ditemukan, cari dari URL atau state lain
        if (!quizId) {
            // Coba dari URL
            const urlMatch = window.location.pathname.match(/\/quiz\/(\d+)/);
            if (urlMatch) {
                try {
                    const d = await _fetch('https://quizizz.com/api/v2/admin/quiz/' + urlMatch[1] + '?includeSource=true', { credentials: 'include', headers: { 'Accept': 'application/json' } });
                    if (d && !d._raw) teacherData = d;
                } catch {}
            }
        }

        // Bangun map jawaban dari teacher data
        let answerMap = {};

        if (teacherData) {
            const tQuestions = teacherData?.quiz?.questions || teacherData?.questions || [];
            tQuestions.forEach((tq, i) => {
                const opts = tq?.options || [];
                const correctIdx = [];
                opts.forEach((o, j) => {
                    if (o.isCorrect || o.correct) correctIdx.push(j);
                });
                if (correctIdx.length) {
                    const qText = (tq?.questionText || tq?.text || '').replace(/<[^>]+>/g, '').trim();
                    answerMap[qText.substring(0, 60)] = correctIdx;
                    // Simpan juga dengan index
                    answerMap['q' + i] = correctIdx;
                }
            });
        }

        // Output
        let output = '';
        if (roomHash) output += 'Room: ' + roomHash + '\n';
        if (quizId) output += 'Quiz ID: ' + quizId + '\n';
        if (players) output += 'Pemain: ' + players.length + '\n';
        output += 'Total Soal: ' + keys.length + '\n';
        output += 'Teacher API: ' + (teacherData ? 'OK' : 'Gagal') + '\n';
        output += 'Jawaban ditemukan: ' + Object.keys(answerMap).length + '\n';
        output += '═'.repeat(40) + '\n\n';

        let found = 0;

        keys.forEach((k, i) => {
            const q = questions[k];
            const qText = (q?.questionText || q?.text || '').replace(/<[^>]+>/g, '');
            const qType = q?.type || 'MCQ';
            const options = q?.options || [];

            let answer = '?';
            let answerIdx = -1;

            // Cari dari answerMap berdasarkan text
            const mapKey = qText.substring(0, 60);
            if (answerMap[mapKey]) {
                answerIdx = answerMap[mapKey][0];
            } else if (answerMap['q' + i]) {
                answerIdx = answerMap['q' + i][0];
            }

            if (answerIdx >= 0 && options[answerIdx]) {
                answer = options[answerIdx].text || options[answerIdx].value || 'Index ' + answerIdx;
                found++;
            } else {
                // Fallback: cari di local data
                const ci = q.correctIndex ?? q.correctAnswer ?? q.answerIndex;
                if (ci !== undefined && ci !== null && ci >= 0 && options[ci]) {
                    answer = options[ci].text || 'Index ' + ci;
                    found++;
                } else {
                    // List semua opsi
                    answer = options.map((o, j) => j + ': ' + (o.text || o.value || '?')).join(' | ');
                }
            }

            output += '#' + (i+1) + ' [' + qType + '] ' + qText.substring(0, 80) + (qText.length > 80 ? '...' : '') + '\n';
            output += '   ✅ ' + answer + '\n\n';
        });

        output += '═'.repeat(40) + '\n';
        output += 'Ditemukan: ' + found + '/' + keys.length + '\n';

        results.textContent = output;
        status.textContent = 'Selesai! ' + found + '/' + keys.length + ' jawaban ditemukan.';
        status.style.color = found === keys.length ? '#4ecdc4' : '#e94560';
    }

    document.getElementById('zc-find').addEventListener('click', findAnswers);
})();
