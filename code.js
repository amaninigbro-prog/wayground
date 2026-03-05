javascript:(function(){
    // Buat elemen floating container
    let floatDiv = document.createElement('div');
    floatDiv.id = 'omegas-float-window';
    Object.assign(floatDiv.style, {
        position: 'fixed',
        top: '100px',
        left: '100px',
        width: '400px',
        height: '300px',
        backgroundColor: '#222',
        color: '#eee',
        fontFamily: 'sans-serif',
        border: '1px solid #444',
        borderRadius: '5px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
        zIndex: 999999,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
    });

    // Header dengan judul dan tombol
    let header = document.createElement('div');
    Object.assign(header.style, {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#333',
        padding: '5px 10px',
        cursor: 'grab',
        userSelect: 'none'
    });
    header.innerHTML = '<span>Omega\'s Tool</span><div id="header-buttons" style="display: flex; align-items: center;"></div>';

    // Container untuk tombol
    let headerButtons = header.querySelector('#header-buttons');

    // Tombol Open Cheat Network
    let openBtn = document.createElement('button');
    openBtn.textContent = 'Open Cheat Network';
    Object.assign(openBtn.style, {
        backgroundColor: '#e94560',
        color: 'white',
        border: 'none',
        padding: '5px 10px',
        marginLeft: '5px',
        cursor: 'pointer',
        borderRadius: '3px',
        fontSize: '0.9em'
    });
    openBtn.addEventListener('mouseenter', () => openBtn.style.backgroundColor = '#c93550');
    openBtn.addEventListener('mouseleave', () => openBtn.style.backgroundColor = '#e94560');

    // Tombol Minimize
    let minimizeBtn = document.createElement('button');
    minimizeBtn.textContent = '_';
    Object.assign(minimizeBtn.style, {
        backgroundColor: '#555',
        color: 'white',
        border: 'none',
        padding: '5px 10px',
        marginLeft: '5px',
        cursor: 'pointer',
        borderRadius: '3px',
        fontSize: '0.9em'
    });
    minimizeBtn.addEventListener('mouseenter', () => minimizeBtn.style.backgroundColor = '#777');
    minimizeBtn.addEventListener('mouseleave', () => minimizeBtn.style.backgroundColor = '#555');

    // Tombol Close
    let closeBtn = document.createElement('button');
    closeBtn.textContent = 'X';
    Object.assign(closeBtn.style, {
        backgroundColor: '#555',
        color: 'white',
        border: 'none',
        padding: '5px 10px',
        marginLeft: '5px',
        cursor: 'pointer',
        borderRadius: '3px',
        fontSize: '0.9em'
    });
    closeBtn.addEventListener('mouseenter', () => closeBtn.style.backgroundColor = '#777');
    closeBtn.addEventListener('mouseleave', () => closeBtn.style.backgroundColor = '#555');

    headerButtons.appendChild(openBtn);
    headerButtons.appendChild(minimizeBtn);
    headerButtons.appendChild(closeBtn);

    // Wrapper konten utama (menampilkan pesan)
    let contentWrapper = document.createElement('div');
    Object.assign(contentWrapper.style, {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        textAlign: 'center',
        padding: '10px'
    });
    contentWrapper.innerHTML = `
        <div style="color: #e94560; font-size: 1.1em; margin: 15px;">
            Site "cheatnetwork.eu" blocks embedding.<br>
            <small style="display: block; margin-top: 5px; font-size: 0.8em; color: #aaa;">Click "Open Cheat Network" button above to view in a new tab.</small>
        </div>
    `;

    // Placeholder saat minimized
    let minimizedPlaceholder = document.createElement('div');
    Object.assign(minimizedPlaceholder.style, {
        display: 'none',
        textAlign: 'center',
        paddingTop: '10px',
        fontSize: '0.9em',
        cursor: 'pointer'
    });
    minimizedPlaceholder.innerHTML = '<span>Hidden!</span> <button id="restoreButton" style="background-color:#e94560; color:white; border:none; padding:3px 8px; margin-left:5px; cursor:pointer; border-radius:3px;">Restore</button>';

    // Gabungkan semua elemen ke floatDiv
    floatDiv.appendChild(header);
    floatDiv.appendChild(contentWrapper);
    floatDiv.appendChild(minimizedPlaceholder);
    document.body.appendChild(floatDiv);

    // State
    let isMinimized = false;
    const originalWidth = 400;
    const originalHeight = 300;
    const minimizedWidth = 180;
    const minimizedHeight = 60;

    // Fungsi untuk resize container
    function resizeContainer(w, h) {
        floatDiv.style.width = w + 'px';
        floatDiv.style.height = h + 'px';
    }

    // Event listeners tombol
    minimizeBtn.addEventListener('click', () => {
        if (!isMinimized) {
            // Minimize
            contentWrapper.style.display = 'none';
            minimizedPlaceholder.style.display = 'block';
            minimizeBtn.textContent = '☐';
            floatDiv.querySelector('span').textContent = 'Omega (Hidden)';
            resizeContainer(minimizedWidth, minimizedHeight);
        } else {
            // Restore
            contentWrapper.style.display = 'flex';
            minimizedPlaceholder.style.display = 'none';
            minimizeBtn.textContent = '_';
            floatDiv.querySelector('span').textContent = "Omega's Tool";
            resizeContainer(originalWidth, originalHeight);
        }
        isMinimized = !isMinimized;
    });

    // Tombol restore di dalam placeholder
    let restoreBtn = minimizedPlaceholder.querySelector('#restoreButton');
    restoreBtn.addEventListener('click', () => {
        contentWrapper.style.display = 'flex';
        minimizedPlaceholder.style.display = 'none';
        minimizeBtn.textContent = '_';
        floatDiv.querySelector('span').textContent = "Omega's Tool";
        resizeContainer(originalWidth, originalHeight);
        isMinimized = false;
    });

    // Tombol open (buka tab baru)
    openBtn.addEventListener('click', () => {
        window.open('https://cheatnetwork.eu/services/quizizz', '_blank');
    });

    // Tombol close (hapus elemen)
    closeBtn.addEventListener('click', () => {
        floatDiv.remove();
        // Bersihkan event listener drag jika perlu (akan terhapus bersama elemen)
    });

    // ---- Drag functionality ----
    let isDragging = false;
    let startX, startY, startLeft, startTop;

    header.addEventListener('mousedown', (e) => {
        e.preventDefault(); // Mencegah seleksi teks
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        startLeft = floatDiv.offsetLeft;
        startTop = floatDiv.offsetTop;
        header.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        let dx = e.clientX - startX;
        let dy = e.clientY - startY;
        let newLeft = startLeft + dx;
        let newTop = startTop + dy;

        // Batasi agar tidak keluar viewport (opsional)
        newLeft = Math.max(0, Math.min(window.innerWidth - floatDiv.offsetWidth, newLeft));
        newTop = Math.max(0, Math.min(window.innerHeight - floatDiv.offsetHeight, newTop));

        floatDiv.style.left = newLeft + 'px';
        floatDiv.style.top = newTop + 'px';
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            header.style.cursor = 'grab';
        }
    });

    // Pastikan cursor kembali normal jika mouse leave saat drag (opsional)
    header.addEventListener('mouseleave', () => {
        if (!isDragging) header.style.cursor = 'grab';
    });
})();
