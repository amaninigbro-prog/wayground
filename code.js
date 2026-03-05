javascript:(function(){
    let initialWidth = 600;
    let initialHeight = 400;
    let minimizedWidth = 220;
    let minimizedHeight = 80;

    let floatWindow = window.open("", "_blank", `width=${initialWidth},height=${initialHeight},resizable=yes,scrollbars=yes,status=yes`);
    if (floatWindow) {
        floatWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Quizizz/Wayground Answer Tool</title>
                <style>
                    body, html { margin: 0; padding: 0; overflow: hidden; font-family: sans-serif; background-color: #222; color: #eee; display: flex; flex-direction: column; height: 100%; }
                    #header { display: flex; justify-content: space-between; align-items: center; background-color: #333; padding: 5px 10px; cursor: grab; user-select: none; flex-shrink: 0; }
                    #header-buttons { display: flex; align-items: center; }
                    #header-buttons button { background-color: #555; color: white; border: none; padding: 5px 10px; margin-left: 5px; cursor: pointer; border-radius: 3px; font-size: 0.9em; }
                    #header-buttons button.action-button { background-color: #e94560; }
                    #header-buttons button.action-button:hover { background-color: #c93550; }
                    #header-buttons button:hover { background-color: #777; }

                    #content-area { flex-grow: 1; padding: 10px; display: flex; flex-direction: column; }
                    textarea { width: 100%; flex-grow: 1; background-color: #333; color: #eee; border: 1px solid #555; padding: 8px; font-family: 'Cascadia Code', 'Fira Code', monospace; font-size: 0.9em; resize: none; box-sizing: border-box; margin-bottom: 10px; }
                    #runScriptButton { background-color: #4CAF50; color: white; border: none; padding: 10px 15px; cursor: pointer; border-radius: 3px; font-size: 1em; width: 100%; box-sizing: border-box; }
                    #runScriptButton:hover { background-color: #45a049; }
                    #output { margin-top: 10px; background-color: #333; border: 1px solid #555; padding: 8px; min-height: 50px; max-height: 150px; overflow-y: auto; font-family: monospace; font-size: 0.85em; white-space: pre-wrap; word-break: break-word; }
                    #output.error { color: #ff6347; }

                    #minimized-placeholder { display: none; text-align: center; padding-top: 10px; font-size: 0.9em; cursor: pointer; flex-shrink: 0; }
                    #minimized-placeholder button { background-color: #e94560; color: white; border: none; padding: 3px 8px; margin-left: 5px; cursor: pointer; border-radius: 3px; font-size: 0.8em;}
                    #minimized-placeholder button:hover { background-color: #c93550; }
                </style>
            </head>
            <body>
                <div id="header">
                    <span>Quizizz/Wayground Tool</span>
                    <div id="header-buttons">
                        <button id="minimizeButton">_</button>
                        <button onclick="window.close()">X</button>
                    </div>
                </div>
                <div id="content-area">
                    <p style="font-size:0.85em; margin-top:0; margin-bottom: 10px;">Paste JavaScript below and click 'Run' to find answers on the main page.</p>
                    <textarea id="scriptInput" placeholder="// Paste your Quizizz/Wayground answer script here.
// Example:
// let answerElements = document.querySelectorAll('.answer-option.is-correct');
// if(answerElements.length > 0) {
//   return 'Found answers: ' + Array.from(answerElements).map(el => el.innerText).join(', ');
// } else {
//   return 'No correct answers found with this script.';
// }"></textarea>
                    <button id="runScriptButton">Run Script on Main Page</button>
                    <div id="output">Output will appear here.</div>
                </div>
                <div id="minimized-placeholder">
                    <span>Tool (Hidden)</span> <button id="restoreButton">Restore</button>
                </div>

                <script>
                    const minimizeButton = floatWindow.document.getElementById('minimizeButton');
                    const restoreButton = floatWindow.document.getElementById('restoreButton');
                    const runScriptButton = floatWindow.document.getElementById('runScriptButton');
                    const scriptInput = floatWindow.document.getElementById('scriptInput');
                    const outputDiv = floatWindow.document.getElementById('output');
                    const header = floatWindow.document.getElementById('header');
                    const contentArea = floatWindow.document.getElementById('content-area');

                    let isMinimized = false;
                    let originalWidth = ${initialWidth};
                    let originalHeight = ${initialHeight};

                    // Initial state
                    contentArea.style.display = 'flex';
                    minimizedPlaceholder.style.display = 'none';

                    minimizeButton.addEventListener('click', () => {
                        if (!isMinimized) {
                            contentArea.style.display = 'none';
                            minimizedPlaceholder.style.display = 'flex'; // Use flex for placeholder
                            minimizeButton.textContent = '☐';
                            floatWindow.document.title = 'Tool (Hidden)';
                            try { floatWindow.resizeTo(${minimizedWidth}, ${minimizedHeight}); } catch (e) { console.warn('Resize to minimized blocked:', e); }
                        } else {
                            contentArea.style.display = 'flex';
                            minimizedPlaceholder.style.display = 'none';
                            minimizeButton.textContent = '_';
                            floatWindow.document.title = 'Quizizz/Wayground Answer Tool';
                            try { floatWindow.resizeTo(originalWidth, originalHeight); } catch (e) { console.warn('Resize to original blocked:', e); }
                        }
                        isMinimized = !isMinimized;
                    });

                    restoreButton.addEventListener('click', () => {
                        contentArea.style.display = 'flex';
                        minimizedPlaceholder.style.display = 'none';
                        minimizeButton.textContent = '_';
                        floatWindow.document.title = 'Quizizz/Wayground Answer Tool';
                        isMinimized = false;
                        try { floatWindow.resizeTo(originalWidth, originalHeight); } catch (e) { console.warn('Restore resize blocked:', e); }
                    });

                    runScriptButton.addEventListener('click', () => {
                        const scriptCode = scriptInput.value;
                        outputDiv.innerText = 'Executing script...';
                        outputDiv.classList.remove('error');

                        try {
                            // Execute the script in the context of the main parent window
                            // This uses a technique to inject and run code securely in the main page
                            const result = window.opener.eval(scriptCode);
                            outputDiv.innerText = 'Success:\n' + (result !== undefined ? result : 'Script executed, no explicit return value.');
                        } catch (e) {
                            outputDiv.innerText = 'Error:\n' + e.message;
                            outputDiv.classList.add('error');
                            console.error('Script execution error in main window:', e);
                        }
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
        alert("Wah, browser Anda memblokir pop-up! Anda harus mengizinkannya agar alat ini bisa berfungsi. 😤");
    }
})();
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
                    <iframe id="quizizzFrame" src="https://quizit.online/services/quizizz" style="display:none;"></iframe>
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
