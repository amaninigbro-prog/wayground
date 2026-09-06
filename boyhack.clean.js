// BOY ShowAnswer - Private Version (No Login)
// Supports: Wayground, Kahoot, Auto Jawab

(async () => {
  const cokicoki = null;

  function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function makeOverlay(html) {
    const div = document.createElement("div");
    Object.assign(div.style, {
      position: "fixed", inset: "0", background: "rgba(0,0,0,0.45)",
      backdropFilter: "blur(3px)", zIndex: "999999", display: "flex",
      alignItems: "center", justifyContent: "center",
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

    ["visibilitychange", "webkitvisibilitychange", "blur", "focus", "resize", "mouseleave", "contextmenu", "copy", "paste"].forEach(e => {
      window.addEventListener(e, ev => ev.stopImmediatePropagation(), true);
      document.addEventListener(e, ev => ev.stopImmediatePropagation(), true);
    });

    const orig = window.setInterval;
    window.setInterval = function (fn, delay) {
      return orig(function () {
        Object.defineProperty(document, "visibilityState", { get: () => "visible", configurable: true });
        Object.defineProperty(document, "hidden", { get: () => false, configurable: true });
        fn();
      }, delay);
    };

    Object.defineProperty(document, "fullscreenElement", { get: () => document.documentElement, configurable: true });
    document.addEventListener("fullscreenchange", e => e.stopImmediatePropagation(), true);
    document.hasFocus = () => true;

    const t = performance.now();
    Object.defineProperty(window.performance, "now", { value: () => t + 100, configurable: true });
  }

  async function askPin() {
    return new Promise(resolve => {
      const overlay = makeOverlay(`
        <div style="background:#fff;padding:24px;border-radius:12px;width:340px;text-align:center;box-shadow:0 6px 20px rgba(0,0,0,.2)">
          <h2 style="margin-bottom:16px">Masukkan PIN</h2>
          <input id="pinInput" placeholder="Code Class (PIN)" style="width:100%;padding:10px;border:1px solid #ccc;border-radius:8px;margin-bottom:10px;font-size:14px">
          <select id="tipeGame" style="width:100%;padding:10px;border:1px solid #ccc;border-radius:8px;margin-bottom:10px;font-size:14px">
            <option value="default" selected>Jenis Game</option>
            <option value="quizizz">Wayground</option>
            <option value="kahoot">Kahoot</option>
            <option value="autoJawab">Auto Jawab</option>
          </select>
          <button id="startBtn" style="width:100%;padding:10px;background:#10b981;color:#fff;border:none;border-radius:8px;font-weight:600;cursor:pointer">Mulai</button>
          <div id="msg" style="margin-top:10px;font-size:13px;color:#ef4444"></div>
        </div>
      `);

      const pinInput = overlay.querySelector("#pinInput");
      const tipeGame = overlay.querySelector("#tipeGame");
      const startBtn = overlay.querySelector("#startBtn");
      const msg = overlay.querySelector("#msg");

      startBtn.addEventListener("click", () => {
        const pin = pinInput.value.trim();
        const gameType = tipeGame.value;
        if (!pin || gameType === "default") {
          msg.textContent = "PIN & Jenis Game tidak boleh kosong.";
          return;
        }
        overlay.remove();
        resolve({ pin, a: gameType });
      });
    });
  }

  function stripHTMLExceptImg(html = "") {
    const div = document.createElement("div");
    div.innerHTML = html;
    div.querySelectorAll("*").forEach(el => {
      if (el.tagName.toLowerCase() !== "img") el.replaceWith(document.createTextNode(el.textContent || ""));
    });
    return div.innerHTML;
  }

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

    const resizeHandle = document.createElement("div");
    Object.assign(resizeHandle.style, {
      position: "absolute", bottom: "2px", right: "2px", width: "24px", height: "24px",
      cursor: "nwse-resize", background: "rgba(0,0,0,0.15)", borderTopLeftRadius: "6px",
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#fff", fontSize: "14px", fontWeight: "bold", zIndex: "1000000"
    });
    resizeHandle.textContent = "\u2198";
    container.appendChild(resizeHandle);

    let isResizing = false, sx, sy, sw, sh;
    resizeHandle.addEventListener("mousedown", e => { e.preventDefault(); isResizing = true; sx = e.clientX; sy = e.clientY; sw = parseInt(getComputedStyle(container).width); sh = parseInt(getComputedStyle(container).height); });
    document.addEventListener("mousemove", e => { if (!isResizing) return; container.style.width = sw + (e.clientX - sx) + "px"; container.style.height = sh + (e.clientY - sy) + "px"; });
    document.addEventListener("mouseup", () => isResizing = false);
    resizeHandle.addEventListener("touchstart", e => { e.preventDefault(); isResizing = true; sx = e.touches[0].clientX; sy = e.touches[0].clientY; sw = parseInt(getComputedStyle(container).width); sh = parseInt(getComputedStyle(container).height); }, { passive: false });
    document.addEventListener("touchmove", e => { if (!isResizing) return; container.style.width = sw + (e.touches[0].clientX - sx) + "px"; container.style.height = sh + (e.touches[0].clientY - sy) + "px"; e.preventDefault(); }, { passive: false });
    document.addEventListener("touchend", () => isResizing = false);

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
    minimizeBtn.style.cssText = "margin-right:10px;cursor:pointer";
    const closeBtn = document.createElement("span");
    closeBtn.textContent = "Hide";
    Object.assign(closeBtn.style, {
      cursor: "pointer", display: "inline-block", padding: "5px", marginRight: "1px",
      backgroundColor: "#65f567ff", color: "#fff", border: "none", borderRadius: "8px",
      fontWeight: "bold", fontFamily: "Arial, sans-serif"
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

    const content = document.createElement("div");
    content.id = "powerup";
    Object.assign(content.style, {
      flex: "1", overflowY: "auto", padding: "12px",
      background: "#f9fafb", color: "#111", fontFamily: "Inter, system-ui, sans-serif"
    });

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

    container.appendChild(header);
    container.appendChild(content);
    document.body.appendChild(container);

    let babibu = 0;
    closeBtn.onclick = () => {
      let barsBtn = document.querySelector('button[aria-label="bars"]');
      if (!barsBtn) return;
      babibu++;
      if (babibu === 1 && document.contains(barsBtn)) {
        barsBtn.replaceWith(barsBtn.cloneNode(true));
        document.querySelector('button[aria-label="bars"]').addEventListener("click", () => {
          document.getElementById("khanswers-frame").style.display = "flex";
        });
      }
      container.style.display = "none";
    };

    let isDragging = false, ox, oy;
    header.addEventListener("mousedown", e => { isDragging = true; ox = e.clientX - container.offsetLeft; oy = e.clientY - container.offsetTop; });
    document.addEventListener("mousemove", e => { if (!isDragging) return; container.style.left = (e.clientX - ox) + "px"; container.style.top = (e.clientY - oy) + "px"; container.style.right = "auto"; });
    document.addEventListener("mouseup", () => isDragging = false);
    header.addEventListener("touchstart", e => { isDragging = true; ox = e.touches[0].clientX - container.offsetLeft; oy = e.touches[0].clientY - container.offsetTop; }, { passive: false });
    document.addEventListener("touchmove", e => { if (!isDragging) return; container.style.left = (e.touches[0].clientX - ox) + "px"; container.style.top = (e.touches[0].clientY - oy) + "px"; e.preventDefault(); }, { passive: false });
    document.addEventListener("touchend", () => isDragging = false);

    function renderCards(items, makeCard) {
      resultsWrap.innerHTML = "";
      if (!items.length) { resultsWrap.textContent = "Tidak ada hasil pencarian."; return; }
      items.forEach((item, i) => { const card = makeCard(item, i); if (card) resultsWrap.appendChild(card); });
    }

    // ===== AUTO JAWAB =====
    if (jenisGame === "autoJawab") {
      (async () => {
        try {
          resultsWrap.textContent = "Sedang ambil data...";
          const raw = localStorage.getItem("answerauto");
          const cached = raw ? JSON.parse(raw) : null;
          let answers;

          if (cached && cached.pin == id) {
            answers = cached.data.answers;
          } else {
            const res = await fetch("https://api.boystore.my.id/api/quizizz?pin=" + encodeURIComponent(id) + "&buah=" + (cokicoki || ""));
            const json = await res.json();
            if (!res.ok) { alert(json.pesan || "Terjadi kesalahan."); return; }
            answers = json.data.answers;
            localStorage.setItem("answerauto", JSON.stringify({ pin: id, data: json }));
          }

          setupAntiDetection();

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
          logDiv.style.cssText = "font-size:12px;color:#666;max-height:300px;overflow-y:auto";
          resultsWrap.appendChild(logDiv);

          function log(msg) {
            const d = document.createElement("div");
            d.textContent = new Date().toLocaleTimeString() + " - " + msg;
            logDiv.appendChild(d);
            logDiv.scrollTop = logDiv.scrollHeight;
          }

          log("Jawaban loaded: " + answers.length + " soal");

          const autoInterval = setInterval(async () => {
            try {
              const questionEl = document.querySelector('[class*="question-text"], [data-testid*="question"], .question-container');
              if (!questionEl) return;
              const qText = questionEl.textContent.trim().toLowerCase();
              if (!qText) return;
              const matched = answerMap[qText];
              if (!matched) return;

              const options = document.querySelectorAll('[class*="answer"], [data-testid*="answer"], .answer-option');
              if (!options.length) return;

              const correctText = (matched.jawaban?.text || "").trim().toLowerCase();
              options.forEach(opt => {
                const t = opt.textContent.trim().toLowerCase();
                if (t === correctText || t.includes(correctText) || correctText.includes(t)) {
                  opt.click();
                  log("Jawab: " + (matched.jawaban?.text || "").substring(0, 60));
                }
              });

              statusDiv.textContent = "Auto Jawab - Soal terjawab!";
            } catch (e) {}
          }, 500);

          window.addEventListener("beforeunload", () => clearInterval(autoInterval));
        } catch (e) {
          console.error(e);
          resultsWrap.textContent = "Terjadi kesalahan saat mengambil data.";
        }
      })();
    }

    // ===== QUIZIZZ (Wayground) =====
    if (jenisGame === "quizizz") {
      (async () => {
        resultsWrap.textContent = "Sedang ambil data...";
        const cached = localStorage.getItem("answershow");
        const cachedData = cached ? JSON.parse(cached) : null;
        let answers;

        try {
          if (cachedData && cachedData.pin == id) {
            answers = cachedData.data;
          } else {
            const res = await fetch("https://api.boystore.my.id/quiziz?pin=" + encodeURIComponent(id) + "&buah=" + (cokicoki || ""));
            const json = await res.json();
            if (!res.ok) { resultsWrap.textContent = json.pesan || "Terjadi kesalahan."; return; }
            answers = json.data;
            localStorage.setItem("answershow", JSON.stringify({ pin: id, data: json }));
          }

          const makeCard = (item, index) => {
            const card = document.createElement("div");
            Object.assign(card.style, { background: "#fff", borderRadius: "12px", marginBottom: "16px", padding: "16px", boxShadow: "0 3px 8px rgba(0,0,0,0.1)" });

            const headerRow = document.createElement("div");
            Object.assign(headerRow.style, { display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", marginBottom: "8px" });

            const qDiv = document.createElement("div");
            qDiv.innerHTML = "<b>" + (index + 1) + ".</b> " + (stripHTMLExceptImg(item.petanyaan.text) || "(Tanpa teks)");
            Object.assign(qDiv.style, { fontSize: "16px", color: "#111" });
            if (item.petanyaan.media) {
              const img = document.createElement("img");
              img.src = item.petanyaan.media;
              Object.assign(img.style, { maxWidth: "100%", borderRadius: "10px", marginTop: "8px" });
              qDiv.appendChild(img);
            }

            const toggleBtn = document.createElement("button");
            toggleBtn.textContent = "-";
            Object.assign(toggleBtn.style, { background: "#e5e7eb", border: "none", borderRadius: "6px", padding: "2px 8px", cursor: "pointer", fontWeight: "bold" });

            headerRow.appendChild(qDiv);
            headerRow.appendChild(toggleBtn);
            card.appendChild(headerRow);

            const answerArea = document.createElement("div");
            const aDiv = document.createElement("div");
            Object.assign(aDiv.style, { marginTop: "10px" });
            const aBox = document.createElement("div");
            Object.assign(aBox.style, { padding: "6px 10px", borderRadius: "6px", background: "#dcfce7", border: "1px solid #16a34a", color: "#15803d", fontWeight: "600" });

            if (item.jawaban.text) {
              const t = document.createElement("div");
              t.innerHTML = stripHTMLExceptImg(item.jawaban.text);
              aBox.appendChild(t);
            }
            if (item.jawaban.media) {
              const img = document.createElement("img");
              img.src = item.jawaban.media;
              Object.assign(img.style, { maxWidth: "200px", borderRadius: "8px", marginTop: "6px" });
              aBox.appendChild(img);
            }

            aDiv.appendChild(aBox);
            answerArea.appendChild(aDiv);
            card.appendChild(answerArea);

            toggleBtn.addEventListener("click", () => {
              const vis = answerArea.style.display === "none";
              answerArea.style.display = vis ? "block" : "none";
              toggleBtn.textContent = vis ? "-" : "+";
            });

            return card;
          };

          renderCards(answers, makeCard);
          searchBar.addEventListener("input", () => {
            const q = searchBar.value.toLowerCase();
            renderCards(answers.filter(i => (i.petanyaan.text || "").toLowerCase().includes(q)), makeCard);
          });
          clearBtn.addEventListener("click", () => { searchBar.value = ""; clearBtn.style.display = "none"; renderCards(answers, makeCard); });
          searchBar.addEventListener("input", () => clearBtn.style.display = searchBar.value ? "block" : "none");
        } catch (err) {
          console.error(err);
          resultsWrap.textContent = "Terjadi kesalahan saat mengambil data.";
        }
      })();
    }

    // ===== KAHOOT =====
    if (jenisGame === "kahoot") {
      (async () => {
        try {
          resultsWrap.textContent = "Sedang ambil data...";
          const res = await fetch("https://api.boystore.my.id/api/kahoot?pin=" + encodeURIComponent(id) + "&buah=" + (cokicoki || ""));
          const json = await res.json();
          console.log(json);

          if (!res.ok) { resultsWrap.textContent = "" + json.pesan; return; }

          const message = json?.message;

          const makeCard = (item, index) => {
            if (!item || !item.question) return null;
            const card = document.createElement("div");
            Object.assign(card.style, { background: "#fff", borderRadius: "12px", boxShadow: "0 3px 8px rgba(0,0,0,0.1)", marginBottom: "16px", padding: "16px" });

            const headerRow = document.createElement("div");
            Object.assign(headerRow.style, { display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", marginBottom: "8px" });

            const qDiv = document.createElement("div");
            qDiv.innerHTML = "<b>" + (index + 1) + ".</b> " + item.question;
            Object.assign(qDiv.style, { fontSize: "16px", color: "#111" });
            if (Array.isArray(item.media)) {
              item.media.forEach(m => {
                if (m.type === "image" && m.url) {
                  const img = document.createElement("img");
                  img.src = m.url;
                  Object.assign(img.style, { maxWidth: "100%", borderRadius: "10px", marginTop: "8px", display: "block" });
                  qDiv.appendChild(img);
                }
              });
            }

            const toggleBtn = document.createElement("button");
            toggleBtn.textContent = "-";
            Object.assign(toggleBtn.style, { background: "#e5e7eb", border: "none", borderRadius: "6px", padding: "2px 8px", cursor: "pointer", fontWeight: "bold" });

            headerRow.appendChild(qDiv);
            headerRow.appendChild(toggleBtn);
            card.appendChild(headerRow);

            const answerArea = document.createElement("div");
            const grid = document.createElement("div");
            Object.assign(grid.style, { display: "grid", gap: "6px", marginTop: "6px" });

            if (Array.isArray(item.options)) {
              const correct = Array.isArray(item.answer) ? item.answer : [];
              item.options.forEach((opt, i) => {
                const isCorrect = correct.includes(i);
                const d = document.createElement("div");
                Object.assign(d.style, {
                  padding: "8px 10px", borderRadius: "6px",
                  background: isCorrect ? "#dcfce7" : "#f3f4f6",
                  border: isCorrect ? "1px solid #22c55e" : "1px solid #e5e7eb",
                  color: isCorrect ? "#166534" : "#111",
                  fontWeight: isCorrect ? "600" : "400"
                });
                if (opt.text) d.innerHTML = opt.text;
                if (opt.media && opt.media.url) {
                  const img = document.createElement("img");
                  img.src = opt.media.url;
                  Object.assign(img.style, { maxWidth: "180px", borderRadius: "8px", marginTop: "6px", display: "block" });
                  d.appendChild(img);
                }
                if (!opt.text && !opt.media) d.textContent = "(tanpa teks)";
                grid.appendChild(d);
              });
            }

            answerArea.appendChild(grid);
            card.appendChild(answerArea);
            toggleBtn.addEventListener("click", () => {
              const vis = answerArea.style.display === "none";
              answerArea.style.display = vis ? "block" : "none";
              toggleBtn.textContent = vis ? "-" : "+";
            });
            return card;
          };

          if (message === "Connection established") {
            resultsWrap.textContent = "Tunggu soal pertama selesai, lalu klik tombol di bawah";
            const btn = document.createElement("button");
            btn.textContent = "Fetch Ulang Jawaban";
            Object.assign(btn.style, { padding: "8px 12px", marginTop: "12px", borderRadius: "6px", border: "none", background: "#3b82f6", color: "#fff", cursor: "pointer", fontWeight: "bold" });
            resultsWrap.appendChild(btn);

            btn.addEventListener("click", async () => {
              btn.disabled = true;
              btn.textContent = "Loading...";
              try {
                const r = await fetch("https://api.boystore.my.id/api/kahoot?pin=" + encodeURIComponent(id) + "&buah=" + (cokicoki || ""));
                const j = await r.json();
                if (!r.ok) { resultsWrap.textContent = j.pesan; return; }
                if (j.message === "Answers retrieved") {
                  const a = Array.isArray(j.answers) ? j.answers : [];
                  if (!a.length) { resultsWrap.textContent = "Tidak ada data jawaban."; return; }
                  resultsWrap.innerHTML = "";
                  renderCards(a, makeCard);
                } else {
                  resultsWrap.textContent = "Tunggu soal pertama selesai dulu";
                }
              } catch (err) { resultsWrap.textContent = "Terjadi kesalahan."; }
              finally { btn.disabled = false; btn.textContent = "Fetch Ulang Jawaban"; }
            });
            return;
          }

          if (message === "Answers retrieved") {
            const a = Array.isArray(json.answers) ? json.answers : [];
            if (!a.length) { resultsWrap.textContent = "Tidak ada data jawaban."; return; }
            renderCards(a, makeCard);
            searchBar.addEventListener("input", () => {
              const q = searchBar.value.toLowerCase();
              renderCards(a.filter(i => (i.question || "").toLowerCase().includes(q)), makeCard);
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
  const host = window.location.hostname;
  const validHosts = ["www.wayground.com", "wayground.com", "www.kahoot.it", "kahoot.it"];

  if (!validHosts.includes(host)) {
    while (true) {
      const pilihan = prompt("Kamu belum berada di Wayground atau Kahoot.\n\nKetik 1 = Wayground\nKetik 2 = Kahoot");
      if (pilihan === "1") { window.location.href = "https://www.wayground.com/join"; break; }
      if (pilihan === "2") { window.location.href = "https://www.kahoot.it/"; break; }
      alert("Input tidak valid.");
    }
  } else {
    const { pin, a } = await askPin();
    showFloatingFrame(pin, a);
  }
})();
