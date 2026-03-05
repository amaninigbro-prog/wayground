javascript:(function(){
    let floatWindow = window.open("", "_blank", "width=800,height=600,resizable=yes,scrollbars=yes,status=yes");
    if (floatWindow) {
        floatWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Quizizz Cheats (Omega Style)</title>
                <style>
                    body, html { margin: 0; padding: 0; overflow: hidden; font-family: sans-serif; background-color: #222; color: #eee; }
                    #header { display: flex; justify-content: space-between; align-items: center; background-color: #333; padding: 5px 10px; cursor: grab; }
                    #header-buttons button { background-color: #555; color: white; border: none; padding: 5px 10px; margin-left: 5px; cursor: pointer; border-radius: 3px; }
                    #header-buttons button:hover { background-color: #777; }
                    #content-wrapper { width: 100%; height: calc(100% - 35px); } /* Adjust height for header */
                    iframe { width: 100%; height: 100%; border: none; display: block; }
                    #minimized-placeholder { display: none; text-align: center; padding-top: 20px; font-size: 1.2em; }
                </style>
            </head>
            <body>
                <div id="header">
                    <span>Quizizz Power-Up!</span>
                    <div id="header-buttons">
                        <button id="minimizeButton">Minimize</button>
                        <button onclick="window.close()">X</button>
                    </div>
                </div>
                <div id="content-wrapper">
                    <iframe id="quizizzFrame" src="https://cheatnetwork.eu/services/quizizz"></iframe>
                </div>
                <div id="minimized-placeholder" style="display: none;">
                    Content Minimized! <button id="restoreButton">Restore</button>
                </div>

                <script>
                    const minimizeButton = floatWindow.document.getElementById('minimizeButton');
                    const restoreButton = floatWindow.document.getElementById('restoreButton');
                    const quizizzFrame = floatWindow.document.getElementById('quizizzFrame');
                    const contentWrapper = floatWindow.document.getElementById('content-wrapper');
                    const minimizedPlaceholder = floatWindow.document.getElementById('minimized-placeholder');
                    const header = floatWindow.document.getElementById('header');

                    let isMinimized = false;

                    minimizeButton.addEventListener('click', () => {
                        if (!isMinimized) {
                            contentWrapper.style.display = 'none';
                            minimizedPlaceholder.style.display = 'block';
                            minimizeButton.textContent = 'Maximize';
                            floatWindow.document.title = 'Quizizz (Minimized)';
                            // Optional: resize the window to a smaller size, though direct resizeTo is often blocked
                            try { floatWindow.resizeTo(300, 100); } catch (e) { console.log('Resize blocked:', e); }
                        } else {
                            contentWrapper.style.display = 'block';
                            minimizedPlaceholder.style.display = 'none';
                            minimizeButton.textContent = 'Minimize';
                            floatWindow.document.title = 'Quizizz Power-Up!';
                            // Optional: restore window size
                            try { floatWindow.resizeTo(800, 600); } catch (e) { console.log('Resize blocked:', e); }
                        }
                        isMinimized = !isMinimized;
                    });

                    restoreButton.addEventListener('click', () => {
                        contentWrapper.style.display = 'block';
                        minimizedPlaceholder.style.display = 'none';
                        minimizeButton.textContent = 'Minimize';
                        floatWindow.document.title = 'Quizizz Power-Up!';
                        isMinimized = false;
                        // Optional: restore window size
                        try { floatWindow.resizeTo(800, 600); } catch (e) { console.log('Resize blocked:', e); }
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
