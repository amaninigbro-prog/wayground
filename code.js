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
                <title>Omega's Stealth Tool</title>
                <style>
                    body, html { margin: 0; padding: 0; overflow: hidden; font-family: sans-serif; background-color: #222; color: #eee; }
                    #header { display: flex; justify-content: space-between; align-items: center; background-color: #333; padding: 5px 10px; cursor: grab; user-select: none; }
                    #header-buttons { display: flex; align-items: center; }
                    #header-buttons button { background-color: #555; color: white; border: none; padding: 5px 10px; margin-left: 5px; cursor: pointer; border-radius: 3px; font-size: 0.9em; }
                    #header-buttons button.action-button { background-color: #e94560; } /* Highlight main action button */
                    #header-buttons button.action-button:hover { background-color: #c93550; }
                    #header-buttons button:hover { background-color: #777; }

                    #content-wrapper { width: 100%; height: calc(100% - 35px); display: flex; justify-content: center; align-items: center; flex-direction: column; text-align: center; } /* Modified for messages */
                    iframe { width: 100%; height: 100%; border: none; display: block; }
                    .blocked-message { color: #e94560; font-size: 1.1em; margin: 15px; }
                    .blocked-message small { display: block; margin-top: 5px; font-size: 0.8em; color: #aaa; }

                    #minimized-placeholder { display: none; text-align: center; padding-top: 10px; font-size: 0.9em; cursor: pointer; }
                    #minimized-placeholder button { background-color: #e94560; color: white; border: none; padding: 3px 8px; margin-left: 5px; cursor: pointer; border-radius: 3px; font-size: 0.8em;}
                    #minimized-placeholder button:hover { background-color: #c93550; }
                </style>
            </head>
            <body>
                <div id="header">
                    <span>Omega's Tool</span>
                    <div id="header-buttons">
                        <button id="openCheatsButton" class="action-button">Open Cheat Network</button>
                        <button id="minimizeButton">_</button>
                        <button onclick="window.close()">X</button>
                    </div>
                </div>
                <div id="content-wrapper">
                    <!-- The iframe content will be replaced by a message if blocked -->
                    <div class="blocked-message">
                        Site "cheatnetwork.eu" blocks embedding.<br>
                        <small>Click "Open Cheat Network" button above to view in a new tab.</small>
                    </div>
                    <!-- Keeping the iframe here, but it will likely still show refusal -->
                    <iframe id="quizizzFrame" src="https://cheatnetwork.eu/services/quizizz" style="display:none;"></iframe>
                </div>
                <div id="minimized-placeholder">
                    <span>Hidden!</span> <button id="restoreButton">Restore</button>
                </div>

                <script>
                    const minimizeButton = floatWindow.document.getElementById('minimizeButton');
                    const restoreButton = floatWindow.document.getElementById('restoreButton');
                    const openCheatsButton = floatWindow.document.getElementById('openCheatsButton');
                    const quizizzFrame = floatWindow.document.getElementById('quizizzFrame');
                    const contentWrapper = floatWindow.document.getElementById('content-wrapper');
                    const minimizedPlaceholder = floatWindow.document.getElementById('minimized-placeholder');
                    const header = floatWindow.document.getElementById('header');

                    let isMinimized = false;
                    let originalWidth = ${initialWidth}; // Use template literal for initial values
                    let originalHeight = ${initialHeight};

                    // Initial state: maximized, but content will show blocked message
                    contentWrapper.style.display = 'flex'; // Use flex for center alignment of message
                    minimizedPlaceholder.style.display = 'none';

                    minimizeButton.addEventListener('click', () => {
                        if (!isMinimized) {
                            contentWrapper.style.display = 'none';
                            minimizedPlaceholder.style.display = 'block';
                            minimizeButton.textContent = '☐'; // Change to a square for maximize
                            floatWindow.document.title = 'Omega (Hidden)';
                            try { floatWindow.resizeTo(${minimizedWidth}, ${minimizedHeight}); } catch (e) { console.warn('Resize to minimized blocked:', e); }
                        } else {
                            contentWrapper.style.display = 'flex'; // Back to flex for message
                            minimizedPlaceholder.style.display = 'none';
                            minimizeButton.textContent = '_'; // Change back to underscore for minimize
                            floatWindow.document.title = 'Omega\'s Stealth Tool';
                            try { floatWindow.resizeTo(originalWidth, originalHeight); } catch (e) { console.warn('Resize to original blocked:', e); }
                        }
                        isMinimized = !isMinimized;
                    });

                    restoreButton.addEventListener('click', () => {
                        contentWrapper.style.display = 'flex';
                        minimizedPlaceholder.style.display = 'none';
                        minimizeButton.textContent = '_';
                        floatWindow.document.title = 'Omega\'s Stealth Tool';
                        isMinimized = false;
                        try { floatWindow.resizeTo(originalWidth, originalHeight); } catch (e) { console.warn('Restore resize blocked:', e); }
                    });

                    openCheatsButton.addEventListener('click', () => {
                        floatWindow.open('https://cheatnetwork.eu/services/quizizz', '_blank');
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
