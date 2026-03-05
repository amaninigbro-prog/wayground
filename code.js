javascript:(function(){
    // -- Fungsi untuk membuat elemen floating --
    function createFloatingWindow() {
        let floatDiv = document.createElement('div');
        floatDiv.id = 'omegas-float-window';
        Object.assign(floatDiv.style, {
            position: 'fixed', top: '100px', left: '100px', width: '900px', height: '650px',
            backgroundColor: '#222', color: '#eee', fontFamily: 'sans-serif',
            border: '1px solid #444', borderRadius: '5px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.5)', zIndex: 999999,
            overflow: 'hidden', display: 'flex', flexDirection: 'column'
        });

        // -- Header dengan tombol --
        let header = document.createElement('div');
        Object.assign(header.style, {
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            backgroundColor: '#333', padding: '5px 10px', cursor: 'grab', userSelect: 'none'
        });
        header.innerHTML = '<span>🔍 Omega's Cheat Network Viewer</span><div id="header-buttons" style="display: flex; align-items: center;"></div>';
        let headerButtons = header.querySelector('#header-buttons');

        // Tombol Open di tab baru (FALLBACK UTAMA)
        let openBtn = document.createElement('button');
        openBtn.textContent = '✅ Buka di Tab Baru (Disarankan)';
        Object.assign(openBtn.style, {
            backgroundColor: '#2ecc71', color: 'white', border: 'none', padding: '5px 12px',
            marginLeft: '5px', cursor: 'pointer', borderRadius: '3px', fontSize: '0.9em', fontWeight: 'bold'
        });
        openBtn.addEventListener('mouseenter',()=> openBtn.style.backgroundColor = '#27ae60');
        openBtn.addEventListener('mouseleave',()=> openBtn.style.backgroundColor = '#2ecc71');
        openBtn.addEventListener('click', ()=>{
            window.open('https://cheatnetwork.eu/services/quizizz', '_blank');
        });

        // Tombol minimize
        let minimizeBtn = document.createElement('button');
        minimizeBtn.textContent = '🗕';
        Object.assign(minimizeBtn.style, { backgroundColor: '#555', color: 'white', border: 'none', padding: '5px 10px', marginLeft: '5px', cursor: 'pointer', borderRadius: '3px', fontSize: '0.9em' });
        minimizeBtn.addEventListener('mouseenter', () => minimizeBtn.style.backgroundColor = '#777');
        minimizeBtn.addEventListener('mouseleave', () => minimizeBtn.style.backgroundColor = '#555');

        // Tombol close
        let closeBtn = document.createElement('button');
        closeBtn.textContent = '🗙';
        Object.assign(closeBtn.style, { backgroundColor: '#555', color: 'white', border: 'none', padding: '5px 10px', marginLeft: '5px', cursor: 'pointer', borderRadius: '3px', fontSize: '0.9em' });
        closeBtn.addEventListener('mouseenter', () => closeBtn.style.backgroundColor = '#e94560');
        closeBtn.addEventListener('mouseleave', () => closeBtn.style.backgroundColor = '#555');

        headerButtons.appendChild(openBtn);
        headerButtons.appendChild(minimizeBtn);
        headerButtons.appendChild(closeBtn);

        // -- Konten Utama: Iframe + Pesan Peringatan --
        let contentWrapper = document.createElement('div');
        Object.assign(contentWrapper.style, {
            flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '0', position: 'relative'
        });

        // Buat iframe
        let iframe = document.createElement('iframe');
        iframe.src = 'https://cheatnetwork.eu/services/quizizz';
        Object.assign(iframe.style, {
            width: '100%', height: '100%', border: 'none', backgroundColor: '#fff'
        });

        // Buat overlay/pesan peringatan jika iframe gagal (opsional, hanya sebagai info)
        let overlayMessage = document.createElement('div');
        Object.assign(overlayMessage.style, {
            position: 'absolute', bottom: '10px', left: '10px', right: '10px',
            backgroundColor: 'rgba(0,0,0,0.8)', color: '#f1c40f', padding: '8px 15px',
            borderRadius: '20px', fontSize: '0.9em', textAlign: 'center', zIndex: 10,
            pointerEvents: 'none', backdropFilter: 'blur(5px)', border: '1px solid #f39c12'
        });
        overlayMessage.innerHTML = '⚠️ Situs ini memblokir tampilan Iframe. <strong>Gunakan tombol hijau "Buka di Tab Baru"</strong> untuk akses penuh.';

        contentWrapper.appendChild(iframe);
        contentWrapper.appendChild(overlayMessage);

        // Placeholder saat minimize
        let minimizedPlaceholder = document.createElement('div');
        Object.assign(minimizedPlaceholder.style, {
            display: 'none', textAlign: 'center', paddingTop: '10px', fontSize: '0.9em', cursor: 'pointer'
        });
        minimizedPlaceholder.innerHTML = '<span>⏸️ Jendela Di-minimize</span> <button id="restoreButton" style="background-color:#e94560; color:white; border:none; padding:5px 10px; margin-left:5px; cursor:pointer; border-radius:3px;">Kembalikan</button>';

        floatDiv.appendChild(header);
        floatDiv.appendChild(contentWrapper);
        floatDiv.appendChild(minimizedPlaceholder);
        document.body.appendChild(floatDiv);

        return { floatDiv, header, minimizeBtn, closeBtn, contentWrapper, minimizedPlaceholder };
    }

    // -- Inisialisasi Elemen dan State --
    const elements = createFloatingWindow();
    const floatDiv = elements.floatDiv;
    const header = elements.header;
    const minimizeBtn = elements.minimizeBtn;
    const closeBtn = elements.closeBtn;
    const contentWrapper = elements.contentWrapper;
    const minimizedPlaceholder = elements.minimizedPlaceholder;

    let isMinimized = false;
    const originalWidth = 900, originalHeight = 650, minimizedWidth = 220, minimizedHeight = 70;

    function resizeContainer(w, h) {
        floatDiv.style.width = w + 'px';
        floatDiv.style.height = h + 'px';
    }

    // -- Event Listeners --
    minimizeBtn.addEventListener('click', () => {
        if (!isMinimized) {
            contentWrapper.style.display = 'none';
            minimizedPlaceholder.style.display = 'block';
            minimizeBtn.textContent = '🗖';
            floatDiv.querySelector('span').textContent = '🗕 Viewer (Tersembunyi)';
            resizeContainer(minimizedWidth, minimizedHeight);
        } else {
            contentWrapper.style.display = 'flex';
            minimizedPlaceholder.style.display = 'none';
            minimizeBtn.textContent = '🗕';
            floatDiv.querySelector('span').textContent = '🔍 Omega's Cheat Network Viewer';
            resizeContainer(originalWidth, originalHeight);
        }
        isMinimized = !isMinimized;
    });

    minimizedPlaceholder.querySelector('#restoreButton').addEventListener('click', () => {
        contentWrapper.style.display = 'flex';
        minimizedPlaceholder.style.display = 'none';
        minimizeBtn.textContent = '🗕';
        floatDiv.querySelector('span').textContent = '🔍 Omega's Cheat Network Viewer';
        resizeContainer(originalWidth, originalHeight);
        isMinimized = false;
    });

    closeBtn.addEventListener('click', () => { floatDiv.remove(); });

    // -- Fitur Drag (sama seperti sebelumnya) --
    let isDragging = false, startX, startY, startLeft, startTop;
    header.addEventListener('mousedown', (e) => {
        e.preventDefault();
        isDragging = true;
        startX = e.clientX; startY = e.clientY;
        startLeft = floatDiv.offsetLeft; startTop = floatDiv.offsetTop;
        header.style.cursor = 'grabbing';
    });
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        let dx = e.clientX - startX, dy = e.clientY - startY;
        let newLeft = startLeft + dx, newTop = startTop + dy;
        newLeft = Math.max(0, Math.min(window.innerWidth - floatDiv.offsetWidth, newLeft));
        newTop = Math.max(0, Math.min(window.innerHeight - floatDiv.offsetHeight, newTop));
        floatDiv.style.left = newLeft + 'px'; floatDiv.style.top = newTop + 'px';
    });
    document.addEventListener('mouseup', () => {
        if (isDragging) { isDragging = false; header.style.cursor = 'grab'; }
    });
    header.addEventListener('mouseleave', () => { if (!isDragging) header.style.cursor = 'grab'; });
})();
