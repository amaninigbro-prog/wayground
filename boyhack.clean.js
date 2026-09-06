// BOY ShowAnswer - Clean Version
// Supports: Wayground, Kahoot, Auto Jawab

localStorage.removeItem("authToken");
(async () => {
  let cokicoki = null;

  function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function makeOverlay(html) {
    const div = document.createElement("div");
    Object.assign(div.style, {
      position: "fixed",
      inset: "0",
      background: "rgba(0,0,0,0.45)",
      backdropFilter: "blur(3px)",
      zIndex: "999999",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Inter, system-ui, sans-serif"
    });
    div.innerHTML = html;
    document.body.appendChild(div);
    return div;
  }

  function setupAntiDetection() {
    Object.defineProperty(document, "visibilityState", { get: () => "visible", configurable: true });
    Object.defineProperty(document, "hidden", { get: () => false, configurable: true });
    Object.defineProperty(document, "webkitVisibilityState", { get: () => "visible", configurable: true });

    const blockedEvents = ["visibilitychange", "webkitvisibilitychange", "blur", "focus", "resize", "mouseleave", "contextmenu", "copy", "paste"];
    blockedEvents.forEach(eventName => {
      window.addEventListener(eventName, e => e.stopImmediatePropagation(), true);
      document.addEventListener(eventName, e => e.stopImmediatePropagation(), true);
    });

    const originalSetInterval = window.setInterval;
    window.setInterval = function (fn, delay) {
      return originalSetInterval(function () {
        Object.defineProperty(document, "visibilityState", { get: () => "visible", configurable: true });
        Object.defineProperty(document, "hidden", { get: () => false, configurable: true });
        fn();
      }, delay);
    };

    Object.defineProperty(document, "fullscreenElement", { get: () => document.documentElement, configurable: true });
    document.addEventListener("fullscreenchange", e => e.stopImmediatePropagation(), true);
    document.hasFocus = () => true;

    const frozenTime = performance.now();
    Object.defineProperty(window.performance, "now", { value: () => frozenTime + 100, configurable: true });
  }

  async function askToken() {
    return new Promise(resolve => {
      const overlay = makeOverlay(`
        <div style="background:#fff;padding:24px;border-radius:12px;width:340px;text-align:center;box-shadow:0 6px 20px rgba(0,0,0,.2)">
          <h2 style="margin-bottom:16px">Login Token</h2>
          <input id="tokenInput" placeholder="Masukkan token Anda" style="width:100%;padding:10px;border:1px solid #ccc;border-radius:8px;margin-bottom:10px;font-size:14px">
          <button id="loginBtn" style="width:100%;padding:10px;background:#2563eb;color:#fff;border:none;border-radius:8px;font-weight:600;cursor:pointer">Login</button>
          <div id="msg" style="margin-top:10px;font-size:13px;color:#ef4444"></div>
        </div>
      `);
      const tokenInput = overlay.querySelector("#tokenInput");
      const loginBtn = overlay.querySelector("#loginBtn");
      const msg = overlay.querySelector("#msg");
      let token;

      loginBtn.addEventListener("click", async () => {
        token = tokenInput.value.trim();
        if (!tokenInput.value) token = "kosong";
        msg.style.color = "#333";
        msg.textContent = "Memeriksa token...";

        const deviceId = localStorage.getItem("device_id") || "null";
        try {
          const response = await fetch("https://api.boystore.my.id/cektoken/" + token + "/" + deviceId, { cache: "no-store" });
          const data = await response.json();
          if (!data.valid) {
            msg.style.color = "#ef4444";
            msg.textContent = data.pesan;
            return;
          }
          cokicoki = data.cookie;
          localStorage.setItem("authToken", token);

          if (data.valid === "daftar") {
            localStorage.setItem("device_id", data.deviceId);
            msg.textContent = "device didaftarkan";
            await wait(600);
          }

          setupAntiDetection();
          msg.style.color = "green";
          msg.textContent = "Login berhasil!";
          await wait(600);
          overlay.remove();
          resolve(token);
        } catch (err) {
          msg.style.color = "red";
          msg.textContent = "Gagal terhubung ke server. Coba lagi.";
        }
      });
    });
  }

  async function askPin() {
    return new Promise(resolve => {
      const overlay = makeOverlay(`
        <div style="background:#fff;padding:24px;border-radius:12px;width:340px;text-align:center;box-shadow:0 6px 20px rgba(0,0,0,.2)">
          <h2 style="margin-bottom:16px">Masukkan Data</h2>
          <input id="pinInput" placeholder="Code Class (PIN)" style="width:100%;padding:10px;border:1px solid #ccc;border-radius:8px;margin-bottom:10px;font-size:14px">
          <select id="tipeGame" style="width:100%;padding:10px;border:1px solid #ccc;border-radius:8px;margin-bottom:10px;font-size:14px">
            <option value="default" selected>Jenis Game</option>
            <option value="quizizz">Wayground</option>
            <option value="kahoot">Kahoot</option>
            <option value="autoJawab">Auto Jawab</option>
          </select>
          <div id="tombol">
            <button id="startBtn" style="width:100%;padding:10px;background:#10b981;color:#fff;border:none;border-radius:8px;font-weight:600;cursor:pointer">Lihat Jawaban</button>
          </div>
          <div id="msg" style="margin-top:10px;font-size:13px;color:#ef4444"></div>
        </div>
      `);

      const pinInput = overlay.querySelector("#pinInput");
      const tipeGame = overlay.querySelector("#tipeGame");
      const startBtn = overlay.querySelector("#startBtn");
      const msg = overlay.querySelector("#msg");
      const tombolDiv = document.getElementById("tombol");

      const logoutBtn = document.createElement("span");
      logoutBtn.textContent = "Logout";
      logoutBtn.style.cursor = "pointer";
      logoutBtn.style.display = "inline-block";
      logoutBtn.style.width = "100%";
      logoutBtn.style.padding = "10px";
      logoutBtn.style.marginTop = "8px";
      logoutBtn.style.backgroundColor = "#f56565";
      logoutBtn.style.color = "#fff";
      logoutBtn.style.border = "none";
      logoutBtn.style.borderRadius = "8px";
      logoutBtn.style.fontWeight = "bold";
      logoutBtn.style.fontFamily = "Arial, sans-serif";
      logoutBtn.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("authToken");
        overlay.remove();
        location.reload();
      });
      tombolDiv.append(logoutBtn);

      startBtn.addEventListener("click", () => {
        const pin = pinInput.value.trim();
        const gameType = tipeGame.value;
        if (!pin || gameType === "default") {
          msg.textContent = "PIN & Jenis Game tidak boleh kosong.";
          pinInput.style.borderColor = "red";
          return;
        }
        msg.textContent = "Menjalankan...";
        setTimeout(() => {
          overlay.remove();
          resolve({ pin, a: gameType });
        }, 500);
      });
    });
  }

  function stripHTMLExceptImg(html = "") {
    const div = document.createElement("div");
    div.innerHTML = html;
    div.querySelectorAll("*").forEach(el => {
      if (el.tagName.toLowerCase() !== "img") {
        el.replaceWith(document.createTextNode(el.textContent || ""));
      }
    });
    return div.innerHTML;
  }

  // ===== FLOATING FRAME =====
  function showFloatingFrame(id, jenisGame) {
    const old = document.getElementById("khanswers-frame");
    if (old) old.remove();

    const container = document.createElement("div");
    container.id = "khanswers-frame";
    container.setAttribute("translate", "no");
    Object.assign(container.style, {
      position: "fixed", top: "50px", right: "50px", width: "340px", height: "600px",
      zIndex: "999999", border: "2px solid #4b4b4b", borderRadius: "12px", overflow: "hidden",
      boxShadow: "0 6px 20px rgba(0,0,0,0.3)", background: "#fff", resize: "both",
      display: "flex", flexDirection: "column", touchAction: "none", userSelect: "none"
    });

    // Resize handle
    const resizeHandle = document.createElement("div");
    Object.assign(resizeHandle.style, {
      position: "absolute", bottom: "2px", right: "2px", width: "24px", height: "24px",
      cursor: "nwse-resize", background: "rgba(0,0,0,0.15)", borderTopLeftRadius: "6px",
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#fff", fontSize: "14px", fontWeight: "bold", zIndex: "1000000"
    });
    resizeHandle.textContent = "\u2198";
    container.appendChild(resizeHandle);

    let isResizing = false, startX, startY, startWidth, startHeight;
    resizeHandle.addEventListener("mousedown", e => {
      e.preventDefault(); isResizing = true;
      startX = e.clientX; startY = e.clientY;
      startWidth = parseInt(getComputedStyle(container).width, 10);
      startHeight = parseInt(getComputedStyle(container).height, 10);
      document.documentElement.style.cursor = "nwse-resize";
    });
    document.addEventListener("mousemove", e => {
      if (!isResizing) return;
      container.style.width = startWidth + (e.clientX - startX) + "px";
      container.style.height = startHeight + (e.clientY - startY) + "px";
    });
    document.addEventListener("mouseup", () => { if (isResizing) { isResizing = false; document.documentElement.style.cursor = ""; } });
    resizeHandle.addEventListener("touchstart", e => {
      e.preventDefault(); isResizing = true;
      startX = e.touches[0].clientX; startY = e.touches[0].clientY;
      startWidth = parseInt(getComputedStyle(container).width, 10);
      startHeight = parseInt(getComputedStyle(container).height, 10);
    }, { passive: false });
    document.addEventListener("touchmove", e => {
      if (!isResizing) return;
      container.style.width = startWidth + (e.touches[0].clientX - startX) + "px";
      container.style.height = startHeight + (e.touches[0].clientY - startY) + "px";
      e.preventDefault();
    }, { passive: false });
    document.addEventListener("touchend", () => { isResizing = false; });

    // Header
    const header = document.createElement("div");
    Object.assign(header.style, {
      height: "44px", background: "#4b4bff", cursor: "move", color: "white",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 10px", userSelect: "none", touchAction: "none"
    });
    const title = document.createElement("span");
    title.textContent = "BOY ShowAnswer " + jenisGame;
    header.appendChild(title);

    const controls = document.createElement("div");
    const minimizeBtn = document.createElement("span");
    minimizeBtn.textContent = "\u2014";
    minimizeBtn.style.marginRight = "10px";
    minimizeBtn.style.cursor = "pointer";
    const closeBtn = document.createElement("span");
    closeBtn.textContent = "Hide";
    Object.assign(closeBtn.style, {
      cursor: "pointer", display: "inline-block", padding: "5px", marginRight: "1px",
      backgroundColor: "#65f567ff", color: "#fff", border: "none", borderRadius: "8px",
      fontWeight: "bold", fontFamily: "Arial, sans-serif", boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
    });
    controls.append(minimizeBtn, closeBtn);
    header.appendChild(controls);

    let minimized = false;
    minimizeBtn.onclick = () => {
      minimized = !minimized;
      content.style.display = minimized ? "none" : "block";
      container.style.height = minimized ? "40px" : "600px";
      minimizeBtn.textContent = minimized ? "\u25A2" : "\u2014";
    };

    // Content area
    const content = document.createElement("div");
    content.id = "powerup";
    Object.assign(content.style, {
      flex: "1", overflowY: "auto", padding: "12px",
      background: "#f9fafb", color: "#111", fontFamily: "Inter, system-ui, sans-serif"
    });

    // Search bar
    const searchWrap = document.createElement("div");
    Object.assign(searchWrap.style, {
      position: "sticky", top: "0", display: "flex", alignItems: "center",
      width: "100%", background: "#f9fafb", marginBottom: "12px"
    });
    const searchBar = document.createElement("input");
    Object.assign(searchBar.style, {
      flex: "1", padding: "8px 10px", borderRadius: "8px 0 0 8px",
      border: "1px solid #ccc", borderRight: "none", fontSize: "14px"
    });
    searchBar.placeholder = "Cari soal...";

    const clearBtn = document.createElement("button");
    clearBtn.textContent = "\u2715";
    Object.assign(clearBtn.style, {
      width: "40px", height: "100%", background: "#e5e7eb", border: "1px solid #ccc",
      borderLeft: "none", borderRadius: "0 8px 8px 0", cursor: "pointer",
      fontSize: "16px", fontWeight: "bold", color: "#555", display: "none"
    });
    searchWrap.appendChild(searchBar);
    searchWrap.appendChild(clearBtn);
    content.appendChild(searchWrap);

    const resultsWrap = document.createElement("div");
    content.appendChild(resultsWrap);

    clearBtn.addEventListener("click", () => {
      searchBar.value = "";
      clearBtn.style.display = "none";
    });

    container.appendChild(header);
    container.appendChild(content);
    document.body.appendChild(container);

    // Hide button - re-attach to bars button
    let babibu = 0;
    closeBtn.onclick = () => {
      let barsBtn = document.querySelector('button[aria-label="bars"]');
      if (!barsBtn) { console.warn("Tombol bars tidak ditemukan."); return; }
      babibu++;
      if (babibu === 1 && document.contains(barsBtn)) {
        barsBtn.replaceWith(barsBtn.cloneNode(true));
        const newBarsBtn = document.querySelector('button[aria-label="bars"]');
        newBarsBtn.addEventListener("click", () => {
          document.getElementById("khanswers-frame").style.display = "flex";
        });
      }
      document.getElementById("khanswers-frame").style.display = "none";
    };

    // Drag
    let isDragging = false, offsetX, offsetY;
    function startDrag(x, y) {
      isDragging = true;
      offsetX = x - container.offsetLeft;
      offsetY = y - container.offsetTop;
      document.body.style.userSelect = "none";
    }
    function doDrag(x, y) {
      if (isDragging) {
        container.style.left = x - offsetX + "px";
        container.style.top = y - offsetY + "px";
        container.style.right = "auto";
      }
    }
    function stopDrag() { isDragging = false; document.body.style.userSelect = "auto"; }
    header.addEventListener("mousedown", e => startDrag(e.clientX, e.clientY));
    document.addEventListener("mousemove", e => doDrag(e.clientX, e.clientY));
    document.addEventListener("mouseup", stopDrag);
    header.addEventListener("touchstart", e => startDrag(e.touches[0].clientX, e.touches[0].clientY), { passive: false });
    document.addEventListener("touchmove", e => { if (!isDragging) return; doDrag(e.touches[0].clientX, e.touches[0].clientY); e.preventDefault(); }, { passive: false });
    document.addEventListener("touchend", stopDrag);

    function renderCards(items, makeCard) {
      resultsWrap.innerHTML = "";
      if (!items.length) { resultsWrap.textContent = "Tidak ada hasil pencarian."; return; }
      items.forEach((item, index) => {
        const card = makeCard(item, index);
        if (card) resultsWrap.appendChild(card);
      });
    }

    // ===== AUTO JAWAB =====
    if (jenisGame === "autoJawab") {
      (async function autoJawab() {
        try {
          resultsWrap.textContent = "Sedang ambil data...";

          // Fetch answers
          const raw = localStorage.getItem("answerauto");
          const cachedData = raw ? JSON.parse(raw) : null;
          let answers;

          if (cachedData && cachedData.pin == id) {
            answers = cachedData.data.answers;
          } else {
            const res = await fetch("https://api.boystore.my.id/api/quizizz?pin=" + encodeURIComponent(id) + "&buah=" + cokicoki);
            const json = await res.json();
            if (!res.ok) { alert(json.pesan || "Terjadi kesalahan."); return; }
            answers = json.data.answers;
            localStorage.setItem("answerauto", JSON.stringify(json));
          }

          // Setup anti-detection
          setupAntiDetection();
          globalThis.OriginalDateBackup = Date;
          const OriginalDate = Date;
          const frozenTime = new OriginalDate().getTime();
          function FakeDate(...args) {
            if (this instanceof FakeDate) {
              if (args.length === 0) return new OriginalDate(frozenTime);
              return new OriginalDate(...args);
            }
            return new OriginalDate(frozenTime).toString();
          }
          FakeDate.now = () => frozenTime;
          FakeDate.parse = OriginalDate.parse;
          FakeDate.UTC = OriginalDate.UTC;
          FakeDate.prototype = OriginalDate.prototype;
          globalThis.Date = FakeDate;

          // Build answer lookup: question text -> answer
          const answerMap = {};
          answers.forEach(item => {
            const q = (item.petanyaan?.text || "").trim().toLowerCase();
            if (q) answerMap[q] = item;
          });

          resultsWrap.innerHTML = "";
          const statusDiv = document.createElement("div");
          statusDiv.style.cssText = "padding:8px;background:#dcfce7;border-radius:8px;font-weight:600;color:#166534;margin-bottom:8px";
          statusDiv.textContent = "Auto Jawab aktif - Menunggu soal...";
          resultsWrap.appendChild(statusDiv);

          const logDiv = document.createElement("div");
          logDiv.style.cssText = "font-size:12px;color:#666;max-height:200px;overflow-y:auto";
          resultsWrap.appendChild(logDiv);

          function log(msg) {
            const line = document.createElement("div");
            line.textContent = new Date().toLocaleTimeString() + " - " + msg;
            logDiv.appendChild(line);
            logDiv.scrollTop = logDiv.scrollHeight;
          }

          // Auto-answer interval
          const autoInterval = setInterval(async () => {
            try {
              // Try to find current question on Wayground
              const questionEl = document.querySelector('[class*="question-text"], [data-testid*="question"], .question-container');
              if (!questionEl) return;

              const questionText = questionEl.textContent.trim().toLowerCase();
              if (!questionText) return;

              const matched = answerMap[questionText];
              if (!matched) { return; }

              // Try to find and click correct answer
              const options = document.querySelectorAll('[class*="answer"], [data-testid*="answer"], .answer-option');
              if (!options.length) return;

              let clicked = false;
              const correctText = (matched.jawaban?.text || "").trim().toLowerCase();

              options.forEach(opt => {
                const optText = opt.textContent.trim().toLowerCase();
                if (optText === correctText || optText.includes(correctText) || correctText.includes(optText)) {
                  opt.click();
                  clicked = true;
                  log("Jawab: " + (matched.jawaban?.text || "").substring(0, 50));
                }
              });

              if (clicked) {
                statusDiv.textContent = "Auto Jawab - Soal terjawab!";
                statusDiv.style.background = "#dcfce7";
              }
            } catch (e) {
              // Silently continue
            }
          }, 500);

          // Cleanup on page unload
          window.addEventListener("beforeunload", () => clearInterval(autoInterval));

        } catch (e) {
          console.error(e);
          resultsWrap.textContent = "Terjadi kesalahan saat mengambil data.";
        }
      })();
    }

    // ===== QUIZIZZ (Wayground) =====
    if (jenisGame === "quizizz") {
      (async function loadAnswersQuizizz() {
        resultsWrap.textContent = "Sedang ambil data...";
        const cached = localStorage.getItem("answershow");
        const cachedData = cached ? JSON.parse(cached) : null;
        let answers;

        try {
          if (cachedData && cachedData.pin == id) {
            answers = cachedData.data;
          } else {
            const res = await fetch("https://api.boystore.my.id/quiziz?pin=" + encodeURIComponent(id) + "&buah=" + cokicoki);
            const json = await res.json();
            if (!res.ok) { resultsWrap.textContent = json.pesan || "Terjadi kesalahan."; return; }
            answers = json.data;
            localStorage.setItem("answershow", JSON.stringify(json));
          }

          const makeCardQuizizz = (item, index) => {
            const card = document.createElement("div");
            Object.assign(card.style, {
              background: "#fff", borderRadius: "12px", marginBottom: "16px",
              padding: "16px", boxShadow: "0 3px 8px rgba(0,0,0,0.1)"
            });

            const headerRow = document.createElement("div");
            Object.assign(headerRow.style, {
              display: "flex", justifyContent: "space-between", alignItems: "center",
              cursor: "pointer", marginBottom: "8px"
            });

            const questionDiv = document.createElement("div");
            questionDiv.innerHTML = "<b>" + (index + 1) + ".</b> " + (stripHTMLExceptImg(item.petanyaan.text) || "(Tanpa teks)");
            Object.assign(questionDiv.style, { fontSize: "16px", color: "#111" });

            if (item.petanyaan.media) {
              const img = document.createElement("img");
              img.src = item.petanyaan.media;
              Object.assign(img.style, { maxWidth: "100%", borderRadius: "10px", marginTop: "8px" });
              questionDiv.appendChild(img);
            }

            const toggleBtn = document.createElement("button");
            toggleBtn.textContent = "-";
            Object.assign(toggleBtn.style, {
              background: "#e5e7eb", border: "none", borderRadius: "6px",
              padding: "2px 8px", cursor: "pointer", fontWeight: "bold"
            });

            headerRow.appendChild(questionDiv);
            headerRow.appendChild(toggleBtn);
            card.appendChild(headerRow);

            const answerArea = document.createElement("div");
            const answerContent = document.createElement("div");
            Object.assign(answerContent.style, { marginTop: "10px" });

            const answer = item.jawaban;
            const answerBox = document.createElement("div");
            Object.assign(answerBox.style, {
              padding: "6px 10px", borderRadius: "6px", marginBottom: "6px",
              background: "#dcfce7", border: "1px solid #16a34a", color: "#15803d", fontWeight: "600"
            });

            if (answer.text) {
              const textDiv = document.createElement("div");
              textDiv.innerHTML = stripHTMLExceptImg(answer.text);
              answerBox.appendChild(textDiv);
            }
            if (answer.media) {
              const img = document.createElement("img");
              img.src = answer.media;
              Object.assign(img.style, { maxWidth: "200px", borderRadius: "8px", marginTop: "6px" });
              answerBox.appendChild(img);
            }

            answerContent.appendChild(answerBox);
            answerArea.appendChild(answerContent);
            card.appendChild(answerArea);

            toggleBtn.addEventListener("click", () => {
              const isVisible = answerArea.style.display === "none";
              answerArea.style.display = isVisible ? "block" : "none";
              toggleBtn.textContent = isVisible ? "-" : "+";
            });

            return card;
          };

          renderCards(answers, makeCardQuizizz);
          searchBar.addEventListener("input", () => {
            const query = searchBar.value.toLowerCase();
            const filtered = answers.filter(item => (item.petanyaan.text || "").toLowerCase().includes(query));
            renderCards(filtered, makeCardQuizizz);
          });
          clearBtn.addEventListener("click", () => {
            searchBar.value = "";
            clearBtn.style.display = "none";
            renderCards(answers, makeCardQuizizz);
          });
        } catch (err) {
          console.error(err);
          resultsWrap.textContent = "Terjadi kesalahan saat mengambil data.";
        }
      })();
    }

    // ===== KAHOOT =====
    if (jenisGame === "kahoot") {
      (async function loadAnswersKahoot() {
        try {
          resultsWrap.textContent = "Sedang ambil data...";
          const res = await fetch("https://api.boystore.my.id/api/kahoot?pin=" + encodeURIComponent(id) + "&buah=" + cokicoki);
          const json = await res.json();
          console.log(json);

          if (!res.ok) { resultsWrap.textContent = "" + json.pesan; return; }

          const message = json?.message;

          const makeCardKahoot = (item, index) => {
            if (!item || !item.question) return null;

            const card = document.createElement("div");
            Object.assign(card.style, {
              background: "#fff", borderRadius: "12px",
              boxShadow: "0 3px 8px rgba(0,0,0,0.1)", marginBottom: "16px", padding: "16px"
            });

            const headerRow = document.createElement("div");
            Object.assign(headerRow.style, {
              display: "flex", justifyContent: "space-between", alignItems: "center",
              cursor: "pointer", marginBottom: "8px"
            });

            const questionDiv = document.createElement("div");
            questionDiv.innerHTML = "<b>" + (index + 1) + ".</b> " + item.question;
            Object.assign(questionDiv.style, { fontSize: "16px", color: "#111" });

            if (Array.isArray(item.media) && item.media.length) {
              item.media.forEach(m => {
                if (m.type === "image" && m.url) {
                  const img = document.createElement("img");
                  img.src = m.url;
                  Object.assign(img.style, { maxWidth: "100%", borderRadius: "10px", marginTop: "8px", display: "block" });
                  questionDiv.appendChild(img);
                }
              });
            }

            const toggleBtn = document.createElement("button");
            toggleBtn.textContent = "-";
            Object.assign(toggleBtn.style, {
              background: "#e5e7eb", border: "none", borderRadius: "6px",
              padding: "2px 8px", cursor: "pointer", fontWeight: "bold"
            });

            headerRow.appendChild(questionDiv);
            headerRow.appendChild(toggleBtn);
            card.appendChild(headerRow);

            const answerArea = document.createElement("div");
            const optionsGrid = document.createElement("div");
            Object.assign(optionsGrid.style, { display: "grid", gap: "6px", marginTop: "6px" });

            if (Array.isArray(item.options)) {
              const correctIndices = Array.isArray(item.answer) ? item.answer : [];
              item.options.forEach((option, optIndex) => {
                const isCorrect = correctIndices.includes(optIndex);
                const optDiv = document.createElement("div");
                Object.assign(optDiv.style, {
                  padding: "8px 10px", borderRadius: "6px",
                  background: isCorrect ? "#dcfce7" : "#f3f4f6",
                  border: isCorrect ? "1px solid #22c55e" : "1px solid #e5e7eb",
                  color: isCorrect ? "#166534" : "#111",
                  fontWeight: isCorrect ? "600" : "400"
                });
                if (option.text) optDiv.innerHTML = option.text;
                if (option.media && option.media.type === "image" && option.media.url) {
                  const img = document.createElement("img");
                  img.src = option.media.url;
                  Object.assign(img.style, { maxWidth: "180px", borderRadius: "8px", marginTop: "6px", display: "block" });
                  optDiv.appendChild(img);
                }
                if (!option.text && !option.media) optDiv.textContent = "(tanpa teks)";
                optionsGrid.appendChild(optDiv);
              });
            }

            answerArea.appendChild(optionsGrid);
            card.appendChild(answerArea);

            toggleBtn.addEventListener("click", () => {
              const isVisible = answerArea.style.display === "none";
              answerArea.style.display = isVisible ? "block" : "none";
              toggleBtn.textContent = isVisible ? "-" : "+";
            });

            return card;
          };

          if (message === "Connection established") {
            resultsWrap.textContent = "Tunggu soal pertama selesai kemudian klik tombol di bawah ini";
            const fetchBtn = document.createElement("button");
            fetchBtn.textContent = "Fetch Ulang Jawaban";
            Object.assign(fetchBtn.style, {
              padding: "8px 12px", marginTop: "12px", borderRadius: "6px",
              border: "none", background: "#3b82f6", color: "#fff", cursor: "pointer", fontWeight: "bold"
            });
            resultsWrap.appendChild(fetchBtn);

            fetchBtn.addEventListener("click", async () => {
              fetchBtn.disabled = true;
              fetchBtn.textContent = "Loading...";
              try {
                const refetch = await fetch("https://api.boystore.my.id/api/kahoot?pin=" + encodeURIComponent(id) + "&buah=" + cokicoki);
                const refetchJson = await refetch.json();
                if (!refetch.ok) { resultsWrap.textContent = refetchJson.pesan; return; }
                if (refetchJson.message === "Answers retrieved") {
                  const kahootAnswers = Array.isArray(refetchJson.answers) ? refetchJson.answers : [];
                  if (!kahootAnswers.length) { resultsWrap.textContent = "Tidak ada data jawaban."; return; }
                  resultsWrap.innerHTML = "";
                  renderCards(kahootAnswers, makeCardKahoot);
                } else {
                  resultsWrap.textContent = "Tunggu soal pertama selesai dulu";
                }
              } catch (err) {
                console.error(err);
                resultsWrap.textContent = "Terjadi kesalahan saat mengambil data.";
              } finally {
                fetchBtn.disabled = false;
                fetchBtn.textContent = "Fetch Ulang Jawaban";
              }
            });
            return;
          }

          if (message === "Answers retrieved") {
            const kahootAnswers = Array.isArray(json.answers) ? json.answers : [];
            if (!kahootAnswers.length) { resultsWrap.textContent = "Tidak ada data jawaban."; return; }
            renderCards(kahootAnswers, makeCardKahoot);
            searchBar.addEventListener("input", () => {
              const query = searchBar.value.toLowerCase();
              const filtered = kahootAnswers.filter(item => (item.question || "").toLowerCase().includes(query));
              renderCards(filtered, makeCardKahoot);
            });
          }
        } catch (err) {
          console.error(err);
          resultsWrap.textContent = "Terjadi kesalahan saat mengambil data.";
        }
      })();
    }
  }

  // ===== FLOW =====
  if (window.location.hostname !== "www.wayground.com" && window.location.hostname !== "wayground.com" && window.location.hostname !== "www.kahoot.it" && window.location.hostname !== "kahoot.it") {
    while (true) {
      let pilihan = prompt("Kamu belum berada di Wayground atau Kahoot.\n\nKetik 1 untuk pindah ke Wayground\nKetik 2 untuk pindah ke Kahoot");
      if (pilihan === "1") {
        alert("Silahkan jalankan ulang setelah pindah ke Wayground.");
        window.location.href = "https://www.wayground.com/join";
        break;
      } else if (pilihan === "2") {
        alert("Silahkan jalankan ulang setelah pindah ke Kahoot.");
        window.location.href = "https://www.kahoot.it/";
        break;
      } else {
        alert("Input tidak valid. Silakan coba lagi.");
      }
    }
  } else {
    let token = localStorage.getItem("authToken");
    const res = await fetch("https://api.boystore.my.id/cektoken/kosong/null", { cache: "no-store" });
    const ok = await res.json();
    if (!token || !ok.valid) {
      token = await askToken();
    } else {
      cokicoki = ok.cookie;
    }
    const { pin, a } = await askPin();
    showFloatingFrame(pin, a);
  }
})();
