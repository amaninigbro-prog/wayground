javascript:(function(){
    // Initial smaller dimensions for the floating window
    let initialWidth = 400;
    let initialHeight = 300;
    // Even smaller dimensions when "minimized"
    let minimizedWidth = 180;
    let minimizedHeight = 60;

    let floatWindow = window.open("", "_blank", `width=${initialWidth},height=${initialHeight},resizable=yes,scrollbars=yes,status=yes`);
    if (floatWindow) {
        floatWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Quizizz Cheats (Omega Style)</title>
                <style>
                    body, html { margin: 0; padding: 0; overflow: hidden; font-family: sans-serif; background-color: #222; color: #eee; }
                    #header { display: flex; justify-content: space-between; align-items: center; background-color: #333; padding: 5px 10px; cursor: grab; user-select: none; }
                    #header-buttons button { background-color: #555; color: white; border: none; padding: 5px 10px; margin-left: 5px; cursor: pointer; border-radius: 3px; }
                    #header-buttons button:hover { background-color: #777; }
                    #content-wrapper { width: 100%; height: calc(100% - 35px); } /* Adjust height for header */
                    iframe { width: 100%; height: 100%; border: none; display: block; }
                    #minimized-placeholder { display: none; text-align: center; padding-top: 10px; font-size: 0.9em; cursor: pointer; }
                    #minimized-placeholder button { background-color: #e94560; color: white; border: none; padding: 3px 8px; margin-left: 5px; cursor: pointer; border-radius: 3px; font-size: 0.8em;}
                    #minimized-placeholder button:hover { background-color: #c93550; }
                </style>
            </head>
            <body>
                <div id="header">
                    <span>Omega's Tool</span>
                    <div id="header-buttons">
                        <button id="minimizeButton">_</button> <!-- Changed text to a single underscore for smaller appearance -->
                        <button onclick="window.close()">X</button>
                    </div>
                </div>
                <div id="content-wrapper">
                    <iframe id="quizizzFrame" src="https://cheatnetwork.eu/services/quizizz"></iframe>
                </div>
                <div id="minimized-placeholder">
                    <span>Hidden!</span> <button id="restoreButton">Restore</button>
                </div>

                <script>
                    const minimizeButton = floatWindow.document.getElementById('minimizeButton');
                    const restoreButton = floatWindow.document.getElementById('restoreButton');
                    const quizizzFrame = floatWindow.document.getElementById('quizizzFrame');
                    const contentWrapper = floatWindow.document.getElementById('content-wrapper');
                    const minimizedPlaceholder = floatWindow.document.getElementById('minimized-placeholder');
                    const header = floatWindow.document.getElementById('header');

                    let isMinimized = false;
                    let originalWidth = ${initialWidth}; // Use template literal for initial values
                    let originalHeight = ${initialHeight};

                    // Initial state: maximized, but content might be hidden if it fails to load
                    contentWrapper.style.display = 'block';
                    minimizedPlaceholder.style.display = 'none';

                    minimizeButton.addEventListener('click', () => {
                        if (!isMinimized) {
                            contentWrapper.style.display = 'none';
                            minimizedPlaceholder.style.display = 'block';
                            minimizeButton.textContent = '☐'; // Change to a square for maximize
                            floatWindow.document.title = 'Omega (Hidden)';
                            try { floatWindow.resizeTo(${minimizedWidth}, ${minimizedHeight}); } catch (e) { console.warn('Resize to minimized blocked:', e); }
                        } else {
                            contentWrapper.style.display = 'block';
                            minimizedPlaceholder.style.display = 'none';
                            minimizeButton.textContent = '_'; // Change back to underscore for minimize
                            floatWindow.document.title = 'Quizizz Cheats (Omega Style)';
                            try { floatWindow.resizeTo(originalWidth, originalHeight); } catch (e) { console.warn('Resize to original blocked:', e); }
                        }
                        isMinimized = !isMinimized;
                    });

                    restoreButton.addEventListener('click', () => {
                        contentWrapper.style.display = 'block';
                        minimizedPlaceholder.style.display = 'none';
                        minimizeButton.textContent = '_';
                        floatWindow.document.title = 'Quizizz Cheats (Omega Style)';
                        isMinimized = false;
                        try { floatWindow.resizeTo(originalWidth, originalHeight); } catch (e) { console.warn('Restore resize blocked:', e); }
                    });

                    // Simple drag functionality for the header (within the pop-up window)
                    let isDragging = false;
                    let offsetX, offsetY;

                    header.addEventListener('mousedown', (e) => {
                        isDragging = true;
                        offsetX = e.clientX;
                        offsetY = e.clientY;
                        header.style.cursor = 'grabbing';
                    });

                    floatWindow.document.addEventListener('mousemove', (e) => {
                        if (!isDragging) return;
                        const deltaX = e.clientX - offsetX;
                        const deltaY = e.clientY - offsetY;
                        floatWindow.moveBy(deltaX, deltaY);
                        offsetX = e.clientX;
                        offsetY = e.clientY;
                    });

                    floatWindow.document.addEventListener('mouseup', () => {
                        isDragging = false;
                        header.style.cursor = 'grab';
                    });

                </script>
            </body>
            </html>
        `);
        floatWindow.document.close();
    } else {
        floatWindow.alert("Yo, your browser blocked the pop-up! You gotta allow it, or this sweet hack ain't gonna fly! 😤");
    }
})();
