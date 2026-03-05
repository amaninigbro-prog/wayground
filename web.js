javascript:(function(){
    // --- Fungsi utilitas ---
    function getClientPos(e) {
        if (e.touches) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
        return { x: e.clientX, y: e.clientY };
    }

    // --- Buat floating window cheatnetwork (sama seperti versi terbaik) ---
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
    header.innerHTML = '<span>CheatNetwork + Auto Answer</span><div id="header-buttons" style="display: flex; align-items: center;"></div>';
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

    // --- Konten iframe (cheatnetwork) ---
    let contentWrapper = document.createElement('div');
    Object.assign(contentWrapper.style, {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
    });
    let iframe = document.createElement('iframe');
    iframe.src = 'https://cheatnetwork.eu/services/quizizz';
    Object.assign(iframe.style, {
        width: '100%',
        flex: '1 1 auto',
        border: 'none',
        backgroundColor: '#fff'
    });

    // Panel fallback (jika iframe diblokir)
    let fallbackPanel = document.createElement('div');
    Object.assign(fallbackPanel.style, {
        padding: '12px',
        backgroundColor: '#2a2a2a',
        borderTop: '1px solid #444',
        textAlign: 'center'
    });
    fallbackPanel.innerHTML = `
        <div style="color: #ffaa00; margin-bottom: 8px; font-size: 0.9rem;">
            ⚠️ Jika konten tidak tampil (diblokir situs), buka di tab baru:
        </div>
        <button id="open-new-tab-btn" style="
            background-color: #e94560;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            font-size: 1rem;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            touch-action: manipulation;
        ">🚀 Buka di Tab Baru</button>
    `;

    contentWrapper.appendChild(iframe);
    contentWrapper.appendChild(fallbackPanel);

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

    floatDiv.appendChild(header);
    floatDiv.appendChild(contentWrapper);
    floatDiv.appendChild(resizeHandle);
    document.body.appendChild(floatDiv);

    // --- Lingkaran minimize ---
    let circleDiv = document.createElement('div');
    circleDiv.id = 'omegas-minimized-circle';
    Object.assign(circleDiv.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '50px',
        height: '50px',
        backgroundColor: '#e94560',
        borderRadius: '50%',
        boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
        display: 'none',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        fontSize: '24px',
        fontWeight: 'bold',
        fontFamily: 'sans-serif',
        cursor: 'pointer',
        zIndex: 1000000,
        userSelect: 'none',
        touchAction: 'none'
    });
    circleDiv.textContent = 'C';
    circleDiv.title = 'Klik untuk mengembalikan jendela';
    document.body.appendChild(circleDiv);

    // --- State ---
    let isMinimized = false;
    const minWidth = 250, minHeight = 200;
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

    // --- Event listeners ---
    minimizeBtn.addEventListener('click', () => {
        if (!isMinimized) {
            let rect = floatDiv.getBoundingClientRect();
            circleDiv.style.left = rect.left + 'px';
            circleDiv.style.top = rect.top + 'px';
            floatDiv.style.display = 'none';
            circleDiv.style.display = 'flex';
            isMinimized = true;
        }
    });

    circleDiv.addEventListener('click', (e) => {
        e.stopPropagation();
        circleDiv.style.display = 'none';
        floatDiv.style.display = 'flex';
        resizeContainer(originalWidth, originalHeight);
        isMinimized = false;
    });

    document.getElementById('open-new-tab-btn')?.addEventListener('click', () => {
        window.open('https://cheatnetwork.eu/services/quizizz', '_blank');
    });

    closeBtn.addEventListener('click', () => {
        floatDiv.remove();
        circleDiv.remove();
    });

    // --- Drag header ---
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

    // --- Resize handle ---
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

    // --- Drag lingkaran minimize ---
    let isDraggingCircle = false;
    let circleDragStartX, circleDragStartY, circleStartLeft, circleStartTop;

    function onCircleDragStart(e) {
        e.preventDefault();
        let pos = getClientPos(e);
        isDraggingCircle = true;
        circleDragStartX = pos.x;
        circleDragStartY = pos.y;
        circleStartLeft = circleDiv.offsetLeft;
        circleStartTop = circleDiv.offsetTop;
        circleDiv.style.cursor = 'grabbing';
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
        circleDiv.style.left = newLeft + 'px';
        circleDiv.style.top = newTop + 'px';
    }

    function onCircleDragEnd(e) {
        if (isDraggingCircle) {
            isDraggingCircle = false;
            circleDiv.style.cursor = 'pointer';
        }
    }

    circleDiv.addEventListener('mousedown', onCircleDragStart);
    circleDiv.addEventListener('touchstart', onCircleDragStart, { passive: false });
    document.addEventListener('mousemove', onCircleDragMove);
    document.addEventListener('touchmove', onCircleDragMove, { passive: false });
    document.addEventListener('mouseup', onCircleDragEnd);
    document.addEventListener('touchend', onCircleDragEnd);
    document.addEventListener('touchcancel', onCircleDragEnd);

    // --- Fitur cheat jawaban (tanpa bot) di halaman utama ---
    // Gunakan metode dari gbaranski/quizizz-cheat (fetch bundle.js)
    // Dilakukan setelah floating window selesai dibuat, dengan sedikit jeda
    setTimeout(() => {
        fetch("https://raw.githubusercontent.com/gbaranski/quizizz-cheat/master/dist/bundle.js")
            .then(res => res.text())
            .then(text => {
                try {
                    eval(text);
                } catch (e) {
                    console.error("Cheat error:", e);
                }
            })
            .catch(err => console.error("Gagal memuat cheat:", err));
    }, 500); // Jeda 500ms untuk memastikan DOM siap
})();
