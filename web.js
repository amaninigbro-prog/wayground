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

    // --- Header ---
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

    // Tombol Panel Jawaban (gear)
    let panelBtn = document.createElement('button');
    panelBtn.textContent = '⚙️';
    Object.assign(panelBtn.style, {
        backgroundColor: '#555', color: 'white', border: 'none', padding: '5px 10px',
        marginLeft: '5px', cursor: 'pointer', borderRadius: '3px', fontSize: '0.9em',
        touchAction: 'manipulation'
    });
    panelBtn.addEventListener('mouseenter', () => panelBtn.style.backgroundColor = '#777');
    panelBtn.addEventListener('mouseleave', () => panelBtn.style.backgroundColor = '#555');

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

    headerButtons.appendChild(panelBtn);
    headerButtons.appendChild(minimizeBtn);
    headerButtons.appendChild(closeBtn);

    // --- Panel Jawaban (tanpa copy-paste, dengan pencarian Google) ---
    let panel = document.createElement('div');
    Object.assign(panel.style, {
        display: 'none',
        padding: '10px',
        backgroundColor: '#333',
        borderTop: '1px solid #444',
        fontSize: '0.9em',
        color: '#eee',
        maxHeight: '200px',
        overflowY: 'auto'
    });
    panel.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 8px;">
            <div style="font-weight:bold;">Soal terdeteksi:</div>
            <div id="detected-question" style="background:#444; padding:5px; border-radius:3px; word-break:break-word; max-height:80px; overflow-y:auto;">(mencari...)</div>
            <div style="display: flex; gap: 5px; margin-top:5px;">
                <button id="search-google" style="background:#4285F4; color:white; border:none; padding:8px; border-radius:3px; cursor:pointer; flex:1;">🔍 Cari di Google</button>
                <button id="open-quizit" style="background:#E95459; color:white; border:none; padding:8px; border-radius:3px; cursor:pointer; flex:1;">🌐 Buka Quizit</button>
            </div>
            <div style="display: flex; gap: 5px; align-items: center; margin-top:5px;">
                <label>Jawaban (huruf):</label>
                <input type="text" id="answer-letter" maxlength="1" style="width: 40px; background:#444; color:white; border:1px solid #555; padding:5px; text-transform:uppercase;" placeholder="A">
                <button id="answer-submit" style="background:#4CAF50; color:white; border:none; padding:5px 10px; border-radius:3px; cursor:pointer;">Jawab</button>
            </div>
            <div id="auto-status" style="font-size:0.8em; color:#aaa;">Status: siap</div>
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

    // --- Handle resize ---
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
    floatDiv.appendChild(panel);
    floatDiv.appendChild(contentWrapper);
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

    let statusDiv = panel.querySelector('#auto-status');
    let detectedDiv = panel.querySelector('#detected-question');
    let letterInput = panel.querySelector('#answer-letter');
    let submitBtn = panel.querySelector('#answer-submit');
    let searchGoogleBtn = panel.querySelector('#search-google');
    let openQuizitBtn = panel.querySelector('#open-quizit');

    // Daftar selector umum untuk elemen pilihan jawaban
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
        // Heuristik: cari elemen dengan teks panjang
        let candidates = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, div');
        for (let el of candidates) {
            let text = el.innerText?.trim() || '';
            if (text.length > 20 && !el.querySelector('input, button, a')) {
                return el;
            }
        }
        return null;
    }

    // Fungsi untuk memperbarui teks soal yang terdeteksi
    function updateDetectedQuestion() {
        let q = findQuestionElement();
        if (q) {
            let text = q.innerText || q.textContent;
            detectedDiv.textContent = text.substring(0, 200) + (text.length > 200 ? '...' : '');
        } else {
            detectedDiv.textContent = '(soal tidak ditemukan)';
        }
    }

    // Panggil pertama kali
    updateDetectedQuestion();

    // Fungsi untuk mengklik jawaban berdasarkan huruf
    function answerByLetter(letter) {
        let options = findAnswerElements();
        if (options.length === 0) {
            statusDiv.textContent = 'Tidak menemukan pilihan jawaban';
            return;
        }

        let upperLetter = letter.toUpperCase().trim();
        let foundIndex = -1;
        for (let i = 0; i < options.length; i++) {
            let opt = options[i];
            let text = opt.innerText || opt.textContent || '';
            if (text.trim().toUpperCase().startsWith(upperLetter) || 
                text.trim().toUpperCase().startsWith(upperLetter + '.') ||
                text.trim().toUpperCase().startsWith(upperLetter + ')') ||
                text.trim().toUpperCase().startsWith(upperLetter + ' ')) {
                foundIndex = i;
                break;
            }
        }

        if (foundIndex === -1) {
            let letterIndex = upperLetter.charCodeAt(0) - 65;
            if (letterIndex >= 0 && letterIndex < options.length) {
                foundIndex = letterIndex;
            } else {
                statusDiv.textContent = `Huruf ${upperLetter} tidak valid (hanya ${options.length} pilihan)`;
                return;
            }
        }

        options[foundIndex].click();
        statusDiv.textContent = `Menjawab ${upperLetter}`;
        // Update soal untuk pertanyaan berikutnya (jika berubah)
        setTimeout(updateDetectedQuestion, 1000);
    }

    // --- Event listeners untuk tombol header ---
    panelBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (panel.style.display === 'none') {
            panel.style.display = 'block';
            updateDetectedQuestion(); // refresh saat dibuka
        } else {
            panel.style.display = 'none';
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
        updateDetectedQuestion();
    });

    closeBtn.addEventListener('click', () => {
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

    // --- Event listener untuk tombol panel ---
    submitBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        let letter = letterInput.value.trim();
        if (letter) {
            answerByLetter(letter);
            letterInput.value = ''; // kosongkan untuk soal berikutnya
        } else {
            statusDiv.textContent = 'Masukkan huruf jawaban';
        }
    });

    searchGoogleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        let q = findQuestionElement();
        if (q) {
            let text = q.innerText || q.textContent;
            let query = encodeURIComponent(text + ' quizizz answer');
            window.open('https://www.google.com/search?q=' + query, '_blank');
            statusDiv.textContent = 'Membuka Google...';
        } else {
            statusDiv.textContent = 'Tidak dapat menemukan soal';
        }
    });

    openQuizitBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        // Buka quizit.online di tab baru
        window.open('https://quizit.online/services/quizizz', '_blank');
        statusDiv.textContent = 'Membuka Quizit...';
    });

    // Mencegah event drag pada tombol dan input
    [submitBtn, searchGoogleBtn, openQuizitBtn, letterInput].forEach(el => {
        el.addEventListener('mousedown', (e) => e.stopPropagation());
        el.addEventListener('touchstart', (e) => e.stopPropagation());
    });

    // Refresh soal setiap beberapa detik (misal saat soal berganti)
    setInterval(updateDetectedQuestion, 3000);
})();
