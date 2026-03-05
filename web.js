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
    header.innerHTML = '<span>Quizit Viewer + Auto Answer</span><div id="header-buttons" style="display: flex; align-items: center;"></div>';
    let headerButtons = header.querySelector('#header-buttons');

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

    headerButtons.appendChild(minimizeBtn);
    headerButtons.appendChild(closeBtn);

    // --- Panel kontrol auto answer (di bawah header) ---
    let controlPanel = document.createElement('div');
    Object.assign(controlPanel.style, {
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        padding: '5px 10px',
        backgroundColor: '#444',
        borderBottom: '1px solid #555'
    });
    controlPanel.innerHTML = `
        <span style="color:#eee; font-size:0.9rem;">Auto Answer:</span>
        <input id="omegas-delay" type="number" min="0.5" step="0.5" value="2" style="width:60px; padding:3px; border-radius:3px; border:none;">
        <span style="color:#eee;">s</span>
        <button id="omegas-toggle-auto" style="background:#4CAF50; color:white; border:none; padding:5px 10px; border-radius:3px; cursor:pointer;">Start</button>
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
    floatDiv.appendChild(controlPanel);
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

    // --- State untuk auto answer ---
    let isMinimized = false;
    let isAutoAnswering = false;
    let autoAnswerInterval = null;

    // Fungsi memuat script highlight jawaban (dari repositori gbaranski)
    function loadHighlightScript() {
        return new Promise((resolve, reject) => {
            if (window.quizizzCheatLoaded) {
                resolve();
                return;
            }
            fetch("https://raw.githubusercontent.com/gbaranski/quizizz-cheat/master/dist/bundle.js")
                .then(r => r.text())
                .then(code => {
                    try {
                        eval(code);
                        window.quizizzCheatLoaded = true;
                        resolve();
                    } catch (e) {
                        reject(e);
                    }
                })
                .catch(reject);
        });
    }

    // Fungsi auto answer
    async function startAutoAnswer(delaySec) {
        if (isAutoAnswering) return;
        await loadHighlightScript().catch(e => console.error("Gagal load highlight", e));
        isAutoAnswering = true;
        toggleBtn.style.background = '#f44336';
        toggleBtn.textContent = 'Stop';

        // Set untuk melacak soal yang sudah diproses
        let processedQuestions = new Set();

        autoAnswerInterval = setInterval(() => {
            // Cari soal aktif
            let questionContainer = document.querySelector('.question-container, .question, [data-testid="question"]');
            if (!questionContainer) return;

            // Dapatkan ID unik soal (misal dari teks atau atribut)
            let questionId = questionContainer.innerText.substring(0, 50); // sederhana
            if (processedQuestions.has(questionId)) return; // sudah diproses

            // Cari jawaban benar yang sudah di-highlight
            let correctAnswers = document.querySelectorAll('.answer--correct, .correct, [data-correct="true"]');
            if (correctAnswers.length === 0) return;

            // Tandai bahwa soal ini akan diproses
            processedQuestions.add(questionId);

            // Klik jawaban setelah delay
            setTimeout(() => {
                correctAnswers.forEach(ans => {
                    if (!ans.classList.contains('disabled') && !ans.classList.contains('selected')) {
                        ans.click();
                    }
                });
            }, delaySec * 1000);
        }, 500);
    }

    function stopAutoAnswer() {
        if (autoAnswerInterval) {
            clearInterval(autoAnswerInterval);
            autoAnswerInterval = null;
        }
        isAutoAnswering = false;
        toggleBtn.style.background = '#4CAF50';
        toggleBtn.textContent = 'Start';
    }

    // Tombol toggle auto answer
    let toggleBtn = document.getElementById('omegas-toggle-auto');
    toggleBtn.addEventListener('click', () => {
        if (isAutoAnswering) {
            stopAutoAnswer();
        } else {
            let delay = parseFloat(document.getElementById('omegas-delay').value) || 2;
            startAutoAnswer(delay);
        }
    });

    // --- State floating window ---
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

    // --- Event listeners minimize/restore ---
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
        floatDiv.remove();
        restoreBtn.remove();
        stopAutoAnswer();
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

    // --- Drag untuk lingkaran minimize ---
    let isDraggingCircle = false;
    let circleDragStartX, circleDragStartY, circleStartLeft, circleStartTop;

    function onCircleDragStart(e) {
        e.preventDefault();
        let pos = getClientPos(e);
        isDraggingCircle = true;
        circleDragStartX = pos.x;
        circleDragStartY = pos.y;
        circleStartLeft = restoreBtn.offsetLeft;
        circleStartTop = restoreBtn.offsetTop;
        restoreBtn.style.cursor = 'grabbing';
    }

    function onCircleDragMove(e) {
        if (!isDraggingCircle) return;
        e.preventDefault();
        let pos = getClientPos(e);
        let dx = pos.x - circleDragStartX;
        let dy = pos.y - circleDragStartY;
        let newLeft = circleStartLeft + dx;
        let newTop = circleStartTop + dy;
        newLeft = Math.max(0, Math.min(window.innerWidth - 50, newLeft));
        newTop = Math.max(0, Math.min(window.innerHeight - 50, newTop));
        restoreBtn.style.left = newLeft + 'px';
        restoreBtn.style.top = newTop + 'px';
    }

    function onCircleDragEnd(e) {
        if (isDraggingCircle) {
            isDraggingCircle = false;
            restoreBtn.style.cursor = 'pointer';
        }
    }

    restoreBtn.addEventListener('mousedown', onCircleDragStart);
    restoreBtn.addEventListener('touchstart', onCircleDragStart, { passive: false });
    document.addEventListener('mousemove', onCircleDragMove);
    document.addEventListener('touchmove', onCircleDragMove, { passive: false });
    document.addEventListener('mouseup', onCircleDragEnd);
    document.addEventListener('touchend', onCircleDragEnd);
    document.addEventListener('touchcancel', onCircleDragEnd);
})();
