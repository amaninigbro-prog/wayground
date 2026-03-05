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
        width: Math.min(400, window.innerWidth * 0.9) + 'px',
        height: Math.min(500, window.innerHeight * 0.8) + 'px',
        backgroundColor: '#222',
        color: '#eee',
        fontFamily: 'sans-serif',
        border: '1px solid #444',
        borderRadius: '5px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
        zIndex: 999999,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        touchAction: 'none'
    });

    // --- Header (dengan tombol tambahan Auto Answer) ---
    let header = document.createElement('div');
    Object.assign(header.style, {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#333',
        padding: '5px 10px',
        cursor: 'grab',
        userSelect: 'none',
        touchAction: 'none'
    });
    header.innerHTML = '<span>Quizit Viewer</span><div id="header-buttons" style="display: flex; align-items: center;"></div>';
    let headerButtons = header.querySelector('#header-buttons');

    // Tombol Auto Answer (gear)
    let autoBtn = document.createElement('button');
    autoBtn.textContent = '⚙️';
    Object.assign(autoBtn.style, {
        backgroundColor: '#555', color: 'white', border: 'none', padding: '5px 10px',
        marginLeft: '5px', cursor: 'pointer', borderRadius: '3px', fontSize: '0.9em',
        touchAction: 'manipulation'
    });
    autoBtn.addEventListener('mouseenter', () => autoBtn.style.backgroundColor = '#777');
    autoBtn.addEventListener('mouseleave', () => autoBtn.style.backgroundColor = '#555');

    // Tombol Minimize
    let minimizeBtn = document.createElement('button');
    minimizeBtn.textContent = '_';
    Object.assign(minimizeBtn.style, {
        backgroundColor: '#555', color: 'white', border: 'none', padding: '5px 10px',
        marginLeft: '5px', cursor: 'pointer', borderRadius: '3px', fontSize: '0.9em',
        touchAction: 'manipulation'
    });
    minimizeBtn.addEventListener('mouseenter', () => minimizeBtn.style.backgroundColor = '#777');
    minimizeBtn.addEventListener('mouseleave', () => minimizeBtn.style.backgroundColor = '#555');

    // Tombol Close
    let closeBtn = document.createElement('button');
    closeBtn.textContent = 'X';
    Object.assign(closeBtn.style, {
        backgroundColor: '#555', color: 'white', border: 'none', padding: '5px 10px',
        marginLeft: '5px', cursor: 'pointer', borderRadius: '3px', fontSize: '0.9em',
        touchAction: 'manipulation'
    });
    closeBtn.addEventListener('mouseenter', () => closeBtn.style.backgroundColor = '#777');
    closeBtn.addEventListener('mouseleave', () => closeBtn.style.backgroundColor = '#555');

    headerButtons.appendChild(autoBtn);
    headerButtons.appendChild(minimizeBtn);
    headerButtons.appendChild(closeBtn);

    // --- Panel Auto Answer (tanpa input selector) ---
    let autoPanel = document.createElement('div');
    Object.assign(autoPanel.style, {
        display: 'none',
        padding: '10px',
        backgroundColor: '#333',
        borderTop: '1px solid #444',
        fontSize: '0.9em',
        color: '#eee'
    });
    autoPanel.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 5px;">
            <label>Delay (detik): <input type="number" id="auto-delay" min="0.5" step="0.5" value="2" style="width: 60px; background:#444; color:white; border:1px solid #555; padding:2px;"></label>
            <div style="display: flex; gap: 5px;">
                <button id="auto-start" style="background:#4CAF50; color:white; border:none; padding:5px; border-radius:3px; cursor:pointer;">Start Auto Jawab</button>
                <button id="auto-stop" style="background:#f44336; color:white; border:none; padding:5px; border-radius:3px; cursor:pointer;">Stop</button>
                <button id="auto-copy" style="background:#2196F3; color:white; border:none; padding:5px; border-radius:3px; cursor:pointer;">Copy Soal</button>
            </div>
            <div id="auto-status" style="font-size:0.8em; color:#aaa;">Status: idle</div>
        </div>
    `;

    // --- Konten iframe ---
    let contentWrapper = document.createElement('div');
    Object.assign(contentWrapper.style, {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
    });
    let iframe = document.createElement('iframe');
    iframe.src = 'https://quizit.online/services/quizizz';
    Object.assign(iframe.style, {
        width: '100%',
        height: '100%',
        border: 'none',
        backgroundColor: '#fff'
    });
    contentWrapper.appendChild(iframe);

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
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderBottomRightRadius: '5px',
        zIndex: 10,
        touchAction: 'none',
        color: '#aaa',
        fontSize: '16px',
        lineHeight: '16px',
        textAlign: 'center',
        userSelect: 'none'
    });
    resizeHandle.innerHTML = '▗';

    // Gabungkan elemen utama
    floatDiv.appendChild(header);
    floatDiv.appendChild(autoPanel);
    floatDiv.appendChild(contentWrapper);
    floatDiv.appendChild(resizeHandle);
    document.body.appendChild(floatDiv);

    // --- Tombol restore (lingkaran kecil semi-transparan) ---
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
        color: 'rgba(255,255,255,0.6)',
        fontSize: '20px',
        cursor: 'pointer',
        zIndex: 1000000,
        userSelect: 'none',
        border: '1px solid rgba(255,255,255,0.2)',
        backdropFilter: 'blur(2px)',
        transition: 'background-color 0.2s'
    });
    restoreBtn.textContent = 'Q';
    restoreBtn.title = 'Klik untuk mengembalikan jendela';
    restoreBtn.addEventListener('mouseenter', () => restoreBtn.style.backgroundColor = 'rgba(233, 69, 96, 0.5)');
    restoreBtn.addEventListener('mouseleave', () => restoreBtn.style.backgroundColor = 'rgba(233, 69, 96, 0.25)');
    document.body.appendChild(restoreBtn);

    // --- State ---
    let isMinimized = false;
    const minWidth = 200, minHeight = 150;
    const maxWidth = window.innerWidth * 0.9, maxHeight = window.innerHeight * 0.9;
    let originalWidth = parseFloat(floatDiv.style.width);
    let originalHeight = parseFloat(floatDiv.style.height);

    let autoInterval = null;
    let autoDelay = 2000;
    let statusDiv = autoPanel.querySelector('#auto-status');
    let delayInput = autoPanel.querySelector('#auto-delay');
    let startBtn = autoPanel.querySelector('#auto-start');
    let stopBtn = autoPanel.querySelector('#auto-stop');
    let copyBtn = autoPanel.querySelector('#auto-copy');

    // Daftar selector umum untuk elemen pilihan jawaban (diurutkan berdasarkan prioritas)
    const answerSelectors = [
        '.option', '.answer', '[data-cy="option"]', '.choice', '.quiz-option', 
        'button.option', '.options-container button', '.response-btn', 
        '.answer-choice', '.selectable-option', '.multiple-choice-option',
        '.option-item', '.btn-option', '.quiz-answer-option'
    ];

    // Daftar selector umum untuk elemen soal
    const questionSelectors = [
        '.question-text', '[data-cy="question-text"]', '.question', '.quiz-question',
        '.question-title', '.question-content', '.quiz-question-text',
        '.question-display', '.question-container .text'
    ];

    // Fungsi untuk menemukan elemen pilihan jawaban
    function findAnswerElements() {
        for (let sel of answerSelectors) {
            let elements = document.querySelectorAll(sel);
            if (elements.length > 0) {
                return elements;
            }
        }
        // Jika tidak ada yang cocok, coba cari elemen dengan class mengandung kata "option" atau "answer"
        let all = document.querySelectorAll('[class*="option"], [class*="answer"], [class*="choice"]');
        if (all.length > 0) return all;
        return [];
    }

    // Fungsi untuk menemukan elemen soal
    function findQuestionElement() {
        for (let sel of questionSelectors) {
            let el = document.querySelector(sel);
            if (el) return el;
        }
        // Jika tidak ada, cari elemen yang mungkin berisi teks panjang (heuristik)
        let candidates = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, div');
        for (let el of candidates) {
            let text = el.innerText?.trim() || '';
            if (text.length > 20 && !el.querySelector('input, button, a')) {
                return el;
            }
        }
        return null;
    }

    // Fungsi untuk auto answer
    function autoAnswer() {
        let options = findAnswerElements();
        if (options.length === 0) {
            statusDiv.textContent = 'Status: tidak menemukan pilihan jawaban';
            return;
        }
        // Pilih acak
        let randomIndex = Math.floor(Math.random() * options.length);
        options[randomIndex].click();
        statusDiv.textContent = `Status: memilih jawaban ${randomIndex+1}/${options.length}`;
    }

    // Fungsi untuk menyalin teks soal
    function copyQuestion() {
        let questionEl = findQuestionElement();
        if (questionEl) {
            let text = questionEl.innerText || questionEl.textContent;
            navigator.clipboard.writeText(text).then(() => {
                statusDiv.textContent = 'Soal disalin ke clipboard';
            }).catch(err => {
                statusDiv.textContent = 'Gagal menyalin: ' + err;
            });
        } else {
            statusDiv.textContent = 'Tidak menemukan elemen soal';
        }
    }

    // --- Event listeners untuk tombol header ---
    autoBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (autoPanel.style.display === 'none') {
            autoPanel.style.display = 'block';
        } else {
            autoPanel.style.display = 'none';
        }
    });

    minimizeBtn.addEventListener('click', () => {
        if (!isMinimized) {
            floatDiv.style.display = 'none';
            restoreBtn.style.display = 'flex';
            isMinimized = true;
        }
    });

    restoreBtn.addEventListener('click', () => {
        restoreBtn.style.display = 'none';
        floatDiv.style.display = 'flex';
        resizeContainer(originalWidth, originalHeight);
        isMinimized = false;
    });

    closeBtn.addEventListener('click', () => {
        if (autoInterval) clearInterval(autoInterval);
        floatDiv.remove();
        restoreBtn.remove();
    });

    // --- Drag untuk jendela utama ---
    let isDragging = false;
    let dragStartX, dragStartY, dragStartLeft, dragStartTop;

    function onDragStart(e) {
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

    function onDragEnd(e) {
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

    header.addEventListener('mouseleave', () => {
        if (!isDragging) header.style.cursor = 'grab';
    });

    // --- Resize via handle ---
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
        resizeHandle.style.cursor = 'se-resize';
    }

    function onResizeMove(e) {
        if (!isResizing) return;
        e.preventDefault();
        let pos = getClientPos(e);
        let dx = pos.x - resizeStartX;
        let dy = pos.y - resizeStartY;
        let newWidth = resizeStartWidth + dx;
        let newHeight = resizeStartHeight + dy;
        resizeContainer(newWidth, newHeight);
    }

    function onResizeEnd(e) {
        if (isResizing) {
            isResizing = false;
            resizeHandle.style.cursor = 'se-resize';
        }
    }

    resizeHandle.addEventListener('mousedown', onResizeStart);
    resizeHandle.addEventListener('touchstart', onResizeStart, { passive: false });
    document.addEventListener('mousemove', onResizeMove);
    document.addEventListener('touchmove', onResizeMove, { passive: false });
    document.addEventListener('mouseup', onResizeEnd);
    document.addEventListener('touchend', onResizeEnd);
    document.addEventListener('touchcancel', onResizeEnd);

    resizeHandle.addEventListener('mousedown', (e) => e.stopPropagation());
    resizeHandle.addEventListener('touchstart', (e) => e.stopPropagation());

    // --- Fungsi resize container ---
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

    // --- Event listener untuk auto answer ---
    startBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (autoInterval) clearInterval(autoInterval);
        autoDelay = parseFloat(delayInput.value) * 1000;
        if (isNaN(autoDelay) || autoDelay < 500) autoDelay = 2000;
        autoInterval = setInterval(autoAnswer, autoDelay);
        statusDiv.textContent = `Status: auto answer berjalan (delay ${delayInput.value} detik)`;
    });

    stopBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (autoInterval) {
            clearInterval(autoInterval);
            autoInterval = null;
            statusDiv.textContent = 'Status: dihentikan';
        }
    });

    copyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        copyQuestion();
    });

    // Mencegah event drag pada tombol dan input
    [startBtn, stopBtn, copyBtn, delayInput].forEach(el => {
        el.addEventListener('mousedown', (e) => e.stopPropagation());
        el.addEventListener('touchstart', (e) => e.stopPropagation());
    });

})();
