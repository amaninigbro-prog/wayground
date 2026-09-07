// Wayground Direct Scraper - Tanpa API Pihak Ketiga
// Scrape jawaban langsung dari server Wayground/Quizizz
// Fitur: Tampilkan Jawaban + Auto Jawab

(async () => {
  const VERSION = "2.0.0";

  function wait(ms) {
    return new Promise(r => setTimeout(r, ms));
  }

  // ===== ANTI DETEKSI =====
  function setupAntiDetection() {
    try {
      Object.defineProperty(document, "visibilityState", { get: () => "visible", configurable: true });
      Object.defineProperty(document, "hidden", { get: () => false, configurable: true });
      if (typeof document.webkitVisibilityState !== "undefined") {
        Object.defineProperty(document, "webkitVisibilityState", { get: () => "visible", configurable: true });
      }

      const blockEvents = ["visibilitychange", "webkitvisibilitychange", "blur", "focus", "contextmenu", "copy", "paste", "cut"];
      blockEvents.forEach(evt => {
        window.addEventListener(evt, e => e.stopImmediatePropagation(), true);
        document.addEventListener(evt, e => e.stopImmediatePropagation(), true);
      });

      const origSetInterval = window.setInterval;
      window.setInterval = function (fn, delay) {
        return origSetInterval(function () {
          try {
            Object.defineProperty(document, "visibilityState", { get: () => "visible", configurable: true });
            Object.defineProperty(document, "hidden", { get: () => false, configurable: true });
          } catch (e) {}
          fn();
        }, delay);
      };

      document.hasFocus = () => true;
      Object.defineProperty(document, "fullscreenElement", { get: () => document.documentElement, configurable: true });
    } catch (e) {}
  }

  // ===== OVERLAY / MODAL =====
  function makeOverlay(html) {
    const div = document.createElement("div");
    Object.assign(div.style, {
      position: "fixed", inset: "0", background: "rgba(0,0,0,0.5)",
      backdropFilter: "blur(4px)", zIndex: "9999999", display: "flex",
      alignItems: "center", justifyContent: "center",
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif"
    });
    div.innerHTML = html;
    document.body.appendChild(div);
    return div;
  }

  // ===== STRIP HTML =====
  function stripHTML(html = "") {
    const d = document.createElement("div");
    d.innerHTML = html;
    return d.textContent || "";
  }

  // ===== AMBIL PIN DARI USER =====
  async function askPin() {
    return new Promise(resolve => {
      const overlay = makeOverlay(`
        <div style="background:#1a1a2e;padding:28px;border-radius:16px;width:380px;text-align:center;box-shadow:0 8px 32px rgba(0,0,0,.4);border:1px solid rgba(255,255,255,0.1)">
          <div style="font-size:28px;margin-bottom:8px">🎓</div>
          <h2 style="margin:0 0 4px;color:#fff;font-size:20px;font-weight:700">Wayground Scraper v${VERSION}</h2>
          <p style="margin:0 0 20px;color:#94a3b8;font-size:13px">Scrape jawaban langsung dari server Wayground</p>
          
          <input id="pinInput" placeholder="Masukkan PIN Game (6 digit)" 
            style="width:100%;padding:12px;border:1px solid #334155;border-radius:10px;margin-bottom:12px;font-size:15px;background:#0f172a;color:#fff;box-sizing:border-box;outline:none"
            maxlength="6" inputmode="numeric">
          
          <div style="display:flex;gap:10px;margin-bottom:12px">
            <button id="btnTampil" style="flex:1;padding:12px;background:linear-gradient(135deg,#10b981,#059669);color:#fff;border:none;border-radius:10px;font-weight:700;cursor:pointer;font-size:14px;transition:transform .1s">
              📋 Tampilkan Jawaban
            </button>
            <button id="btnAuto" style="flex:1;padding:12px;background:linear-gradient(135deg,#8b5cf6,#7c3aed);color:#fff;border:none;border-radius:10px;font-weight:700;cursor:pointer;font-size:14px;transition:transform .1s">
              🤖 Auto Jawab
            </button>
          </div>
          
          <button id="btnCancel" style="width:100%;padding:10px;background:transparent;color:#64748b;border:1px solid #334155;border-radius:10px;cursor:pointer;font-size:13px">Batal</button>
          
          <div id="msg" style="margin-top:12px;font-size:13px;color:#ef4444;min-height:18px"></div>
        </div>
      `);

      const pinInput = overlay.querySelector("#pinInput");
      const btnTampil = overlay.querySelector("#btnTampil");
      const btnAuto = overlay.querySelector("#btnAuto");
      const btnCancel = overlay.querySelector("#btnCancel");
      const msg = overlay.querySelector("#msg");

      pinInput.focus();

      pinInput.addEventListener("keydown", e => {
        if (e.key === "Enter") btnTampil.click();
      });

      btnTampil.addEventListener("click", () => {
        const pin = pinInput.value.trim();
        if (!pin || pin.length < 4) {
          msg.textContent = "PIN minimal 4 digit!";
          return;
        }
        overlay.remove();
        resolve({ pin, mode: "tampil" });
      });

      btnAuto.addEventListener("click", () => {
        const pin = pinInput.value.trim();
        if (!pin || pin.length < 4) {
          msg.textContent = "PIN minimal 4 digit!";
          return;
        }
        overlay.remove();
        resolve({ pin, mode: "auto" });
      });

      btnCancel.addEventListener("click", () => {
        overlay.remove();
        resolve(null);
      });
    });
  }

  // ===== SCRAPE DARI API WAYGROUND =====
  async function scrapeWayground(pin) {
    // Step 1: Check Room
    const checkRes = await fetch("https://game.quizizz.com/play-api/v4/checkRoom", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomCode: pin })
    });

    if (!checkRes.ok) {
      // Fallback: coba method lama
      return await scrapeLegacy(pin);
    }

    const checkData = await checkRes.json();
    const roomHash = checkData.room?.hash;
    const roomType = checkData.room?.options?.type || "classic";

    if (!roomHash) throw new Error("Room tidak ditemukan atau PIN salah.");

    // Step 2: Get Questions
    const qRes = await fetch("https://game.quizizz.com/play-api/v4/getQuestions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomHash, type: roomType })
    });

    if (!qRes.ok) throw new Error("Gagal mengambil soal dari server.");

    const qData = await qRes.json();
    return parseQuestions(qData);
  }

  // ===== SCRAPE LEGACY (METHOD LAMA) =====
  async function scrapeLegacy(pin) {
    // Coba join via method lama
    const joinRes = await fetch("https://game.quizizz.com/play-api/v2/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomCode: pin })
    });

    if (!joinRes.ok) {
      // Coba via REST API
      const restRes = await fetch(`https://quizizz.com/_api/main/game/${pin}`);
      if (!restRes.ok) throw new Error("PIN tidak valid atau server tidak merespons.");
      const restData = await restRes.json();
      return parseLegacyQuestions(restData);
    }

    const joinData = await joinRes.json();
    const roomHash = joinData.roomHash || joinData.room?.hash;

    if (!roomHash) throw new Error("Room tidak ditemukan.");

    const qRes = await fetch("https://game.quizizz.com/play-api/v4/getQuestions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomHash, type: "classic" })
    });

    if (!qRes.ok) throw new Error("Gagal mengambil soal.");
    const qData = await qRes.json();
    return parseQuestions(qData);
  }

  // ===== PARSE SOAL V4 =====
  function parseQuestions(data) {
    const questions = [];
    const qObj = data.questions || {};

    for (const [id, q] of Object.entries(qObj)) {
      const struct = q.structure || {};
      const kind = struct.kind || "MSQ";
      const query = struct.query || {};
      const options = struct.options || [];
      const answerRaw = struct.answer;

      let correctAnswer = "";
      let correctIndex = -1;

      if (kind === "BLANK") {
        // Isian: answer berupa string/number
        correctAnswer = String(answerRaw);
      } else if (Array.isArray(answerRaw)) {
        // Multiple select: answer berupa array index
        correctIndex = answerRaw;
        correctAnswer = answerRaw.map(i => options[i]?.text || "").join(", ");
      } else if (typeof answerRaw === "number") {
        // Single choice: answer berupa index
        correctIndex = answerRaw;
        correctAnswer = options[answerRaw]?.text || "";
      }

      questions.push({
        id: q._id || id,
        kind,
        question: stripHTML(query.text || ""),
        questionHTML: query.text || "",
        questionMedia: (query.media || []).map(m => m.url || m.pdfUrl || "").filter(Boolean),
        options: options.map((opt, i) => ({
          text: stripHTML(opt.text || ""),
          textHTML: opt.text || "",
          media: (opt.media || []).map(m => m.url || "").filter(Boolean),
          isCorrect: Array.isArray(correctIndex)
            ? correctIndex.includes(i)
            : i === correctIndex
        })),
        correctAnswer,
        correctIndex
      });
    }

    return questions;
  }

  // ===== PARSE SOAL LEGACY =====
  function parseLegacyQuestions(data) {
    const questions = [];
    const qList = data.data?.questions || data.questions || [];

    for (const q of qList) {
      const struct = q.structure || {};
      const kind = struct.kind || "MSQ";
      const query = struct.query || {};
      const options = struct.options || [];
      const answerRaw = struct.answer;

      let correctAnswer = "";
      let correctIndex = -1;

      if (kind === "BLANK") {
        correctAnswer = String(answerRaw);
      } else if (Array.isArray(answerRaw)) {
        correctIndex = answerRaw;
        correctAnswer = answerRaw.map(i => options[i]?.text || "").join(", ");
      } else if (typeof answerRaw === "number") {
        correctIndex = answerRaw;
        correctAnswer = options[answerRaw]?.text || "";
      }

      questions.push({
        id: q._id,
        kind,
        question: stripHTML(query.text || ""),
        questionHTML: query.text || "",
        questionMedia: (query.media || []).map(m => m.url || m.pdfUrl || "").filter(Boolean),
        options: options.map((opt, i) => ({
          text: stripHTML(opt.text || ""),
          textHTML: opt.text || "",
          media: (opt.media || []).map(m => m.url || "").filter(Boolean),
          isCorrect: Array.isArray(correctIndex)
            ? correctIndex.includes(i)
            : i === correctIndex
        })),
        correctAnswer,
        correctIndex
      });
    }

    return questions;
  }

  // ===== FLOATING FRAME =====
  function createFrame(questions, mode) {
    const old = document.getElementById("wg-scraper-frame");
    if (old) old.remove();

    const container = document.createElement("div");
    container.id = "wg-scraper-frame";
    Object.assign(container.style, {
      position: "fixed", top: "60px", right: "30px", width: "380px", height: "620px",
      zIndex: "9999998", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px",
      overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      background: "#0f172a", resize: "both", display: "flex", flexDirection: "column",
      touchAction: "none", userSelect: "none", fontFamily: "'Inter', system-ui, sans-serif"
    });

    // Header
    const header = document.createElement("div");
    Object.assign(header.style, {
      height: "48px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
      cursor: "move", color: "#fff", display: "flex", alignItems: "center",
      justifyContent: "space-between", padding: "0 14px", userSelect: "none"
    });

    const titleText = document.createElement("span");
    titleText.style.cssText = "font-weight:700;font-size:14px";
    titleText.textContent = `🎓 Wayground Scraper [${mode === "auto" ? "AUTO" : "VIEW"}]`;

    const controls = document.createElement("div");
    controls.style.cssText = "display:flex;gap:8px;align-items:center";

    const minimizeBtn = document.createElement("span");
    minimizeBtn.textContent = "—";
    minimizeBtn.style.cssText = "cursor:pointer;font-size:16px;opacity:0.8";

    const closeBtn = document.createElement("span");
    closeBtn.textContent = "✕";
    closeBtn.style.cssText = "cursor:pointer;font-size:14px;background:rgba(255,255,255,0.2);padding:2px 8px;border-radius:6px";

    controls.append(minimizeBtn, closeBtn);
    header.append(titleText, controls);
    container.appendChild(header);

    // Content
    const content = document.createElement("div");
    Object.assign(content.style, {
      flex: "1", overflowY: "auto", padding: "14px", background: "#0f172a", color: "#e2e8f0"
    });

    // Search
    const searchWrap = document.createElement("div");
    searchWrap.style.cssText = "position:sticky;top:0;z-index:10;background:#0f172a;padding-bottom:10px";

    const searchInput = document.createElement("input");
    Object.assign(searchInput.style, {
      width: "100%", padding: "10px 12px", borderRadius: "10px",
      border: "1px solid #334155", background: "#1e293b", color: "#fff",
      fontSize: "13px", outline: "none", boxSizing: "border-box"
    });
    searchInput.placeholder = "🔍 Cari soal...";

    searchWrap.appendChild(searchInput);
    content.appendChild(searchWrap);

    // Stats
    const statsDiv = document.createElement("div");
    statsDiv.style.cssText = "font-size:12px;color:#64748b;margin-bottom:12px;padding:8px 10px;background:#1e293b;border-radius:8px";
    statsDiv.textContent = `Total: ${questions.length} soal`;
    content.appendChild(statsDiv);

    // Results
    const resultsWrap = document.createElement("div");
    content.appendChild(resultsWrap);

    container.appendChild(content);
    document.body.appendChild(container);

    // Minimize
    let minimized = false;
    minimizeBtn.onclick = () => {
      minimized = !minimized;
      content.style.display = minimized ? "none" : "block";
      container.style.height = minimized ? "48px" : "620px";
      minimizeBtn.textContent = minimized ? "□" : "—";
    };

    // Close (hide, bisa dibuka lagi)
    closeBtn.onclick = () => {
      container.style.display = "none";
      // Tambah tombol show
      if (!document.getElementById("wg-scraper-showbtn")) {
        const showBtn = document.createElement("div");
        showBtn.id = "wg-scraper-showbtn";
        Object.assign(showBtn.style, {
          position: "fixed", top: "60px", right: "30px", zIndex: "9999997",
          background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff",
          padding: "8px 14px", borderRadius: "10px", cursor: "pointer",
          fontSize: "13px", fontWeight: "700", boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          fontFamily: "'Inter', system-ui, sans-serif"
        });
        showBtn.textContent = "🎓 Show";
        showBtn.onclick = () => {
          container.style.display = "flex";
          showBtn.remove();
        };
        document.body.appendChild(showBtn);
      }
    };

    // Drag
    let isDragging = false, ox, oy;
    header.addEventListener("mousedown", e => {
      if (e.target === minimizeBtn || e.target === closeBtn) return;
      isDragging = true;
      ox = e.clientX - container.offsetLeft;
      oy = e.clientY - container.offsetTop;
    });
    document.addEventListener("mousemove", e => {
      if (!isDragging) return;
      container.style.left = (e.clientX - ox) + "px";
      container.style.top = (e.clientY - oy) + "px";
      container.style.right = "auto";
    });
    document.addEventListener("mouseup", () => isDragging = false);

    // Resize handle
    const resizeHandle = document.createElement("div");
    Object.assign(resizeHandle.style, {
      position: "absolute", bottom: "0", right: "0", width: "20px", height: "20px",
      cursor: "nwse-resize", zIndex: "100"
    });
    container.appendChild(resizeHandle);

    // Render cards
    function renderCards(items) {
      resultsWrap.innerHTML = "";
      if (!items.length) {
        resultsWrap.innerHTML = '<div style="text-align:center;color:#64748b;padding:20px">Tidak ada hasil</div>';
        return;
      }

      items.forEach((item, idx) => {
        const card = document.createElement("div");
        card.style.cssText = "background:#1e293b;border-radius:12px;padding:14px;margin-bottom:12px;border:1px solid #334155";

        // Question
        const qRow = document.createElement("div");
        qRow.style.cssText = "display:flex;justify-content:space-between;align-items:flex-start;gap:8px;cursor:pointer";

        const qText = document.createElement("div");
        qText.style.cssText = "font-size:14px;line-height:1.5;flex:1";
        qText.innerHTML = `<span style="color:#8b5cf6;font-weight:700">#${idx + 1}</span> <span style="color:#e2e8f0">${item.question || "(Tanpa teks)"}</span>`;

        const badge = document.createElement("span");
        badge.style.cssText = `font-size:10px;padding:2px 6px;border-radius:4px;font-weight:600;white-space:nowrap;${
          item.kind === "BLANK" ? "background:#f59e0b22;color:#f59e0b" :
          item.kind === "MSQ" ? "background:#3b82f622;color:#3b82f6" :
          "background:#8b5cf622;color:#8b5cf6"
        }`;
        badge.textContent = item.kind === "BLANK" ? "ISIAN" : item.kind === "MSQ" ? "PILIHAN" : item.kind;

        qRow.append(qText, badge);

        // Question media
        if (item.questionMedia.length) {
          item.questionMedia.forEach(url => {
            if (url) {
              const img = document.createElement("img");
              img.src = url;
              img.style.cssText = "max-width:100%;border-radius:8px;margin-top:8px;max-height:150px;object-fit:contain";
              qRow.appendChild(img);
            }
          });
        }

        card.appendChild(qRow);

        // Answer
        const answerDiv = document.createElement("div");
        answerDiv.style.cssText = "margin-top:10px;display:block";

        if (item.kind === "BLANK") {
          // Isian
          const ansBox = document.createElement("div");
          ansBox.style.cssText = "padding:8px 12px;border-radius:8px;background:#10b98122;border:1px solid #10b981;color:#10b981;font-weight:600;font-size:13px";
          ansBox.textContent = `✅ ${item.correctAnswer}`;
          answerDiv.appendChild(ansBox);
        } else {
          // Pilihan
          const optGrid = document.createElement("div");
          optGrid.style.cssText = "display:grid;gap:6px;margin-top:6px";

          item.options.forEach((opt, i) => {
            const optDiv = document.createElement("div");
            const isCorrect = opt.isCorrect;
            optDiv.style.cssText = `padding:8px 10px;border-radius:8px;font-size:13px;border:1px solid ${
              isCorrect ? "#10b981" : "#334155"
            };background:${isCorrect ? "#10b98122" : "#0f172a"};color:${
              isCorrect ? "#10b981" : "#94a3b8"
            };font-weight:${isCorrect ? "700" : "400"}`;

            const letter = String.fromCharCode(65 + i);
            optDiv.innerHTML = `${letter}. ${opt.text || "(kosong)"}`;

            if (opt.media.length) {
              opt.media.forEach(url => {
                if (url) {
                  const img = document.createElement("img");
                  img.src = url;
                  img.style.cssText = "max-width:160px;border-radius:6px;margin-top:4px;display:block";
                  optDiv.appendChild(img);
                }
              });
            }

            if (isCorrect) {
              optDiv.innerHTML = `✅ ${optDiv.innerHTML}`;
            }

            optGrid.appendChild(optDiv);
          });

          answerDiv.appendChild(optGrid);
        }

        card.appendChild(answerDiv);
        resultsWrap.appendChild(card);
      });
    }

    renderCards(questions);

    // Search
    searchInput.addEventListener("input", () => {
      const q = searchInput.value.toLowerCase();
      const filtered = questions.filter(item =>
        item.question.toLowerCase().includes(q) ||
        item.options.some(o => o.text.toLowerCase().includes(q))
      );
      renderCards(filtered);
      statsDiv.textContent = q ? `Hasil: ${filtered.length}/${questions.length} soal` : `Total: ${questions.length} soal`;
    });

    return { container, content, resultsWrap, searchInput };
  }

  // ===== AUTO JAWAB =====
  function startAutoJawab(questions) {
    setupAntiDetection();

    const answerMap = {};
    questions.forEach(q => {
      const key = q.question.trim().toLowerCase();
      if (key) answerMap[key] = q;
    });

    console.log("[Wayground Scraper] Auto Jawab aktif. Jawaban loaded:", questions.length, "soal");

    const autoInterval = setInterval(() => {
      try {
        // Cari soal yang sedang ditampilkan
        const questionEl = document.querySelector(
          '[class*="question-text"], [data-testid*="question"], .question-container, [class*="QuestionText"], [class*="questionText"]'
        );
        if (!questionEl) return;

        const qText = questionEl.textContent.trim().toLowerCase();
        if (!qText) return;

        const matched = answerMap[qText];
        if (!matched) return;

        // Cari opsi jawaban
        const options = document.querySelectorAll(
          '[class*="answer"], [data-testid*="answer"], .answer-option, [class*="AnswerOption"], [class*="answerOption"]'
        );
        if (!options.length) return;

        // Klik jawaban yang benar
        for (const opt of options) {
          const optText = opt.textContent.trim().toLowerCase();
          const correctText = matched.correctAnswer.trim().toLowerCase();

          if (
            optText === correctText ||
            optText.includes(correctText) ||
            correctText.includes(optText)
          ) {
            opt.click();
            console.log("[Wayground Scraper] Auto jawab:", matched.question.substring(0, 50), "=>", matched.correctAnswer.substring(0, 30));
            break;
          }
        }
      } catch (e) {}
    }, 400);

    // Cleanup on page unload
    window.addEventListener("beforeunload", () => clearInterval(autoInterval));

    return autoInterval;
  }

  // ===== MAIN =====
  async function main() {
    const host = window.location.hostname;
    const validHosts = ["www.wayground.com", "wayground.com", "quizizz.com", "www.quizizz.com"];

    if (!validHosts.includes(host)) {
      // Tidak di Wayground, tawarkan redirect
      const go = confirm("Kamu belum berada di Wayground.\n\nKlik OK untuk ke Wayground Join, atau Cancel untuk tetap di sini.");
      if (go) {
        window.location.href = "https://www.wayground.com/join";
        return;
      }
    }

    const result = await askPin();
    if (!result) return;

    const { pin, mode } = result;

    // Buat loading overlay
    const loadingOverlay = makeOverlay(`
      <div style="background:#1a1a2e;padding:24px;border-radius:16px;text-align:center;box-shadow:0 8px 32px rgba(0,0,0,.4);border:1px solid rgba(255,255,255,0.1)">
        <div style="font-size:32px;margin-bottom:12px;animation:spin 1s linear infinite;display:inline-block">⚙️</div>
        <p style="color:#e2e8f0;font-size:14px;margin:0">Sedang scrape jawaban dari Wayground...</p>
        <p style="color:#64748b;font-size:12px;margin:8px 0 0">PIN: ${pin}</p>
        <style>@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}</style>
      </div>
    `);

    try {
      // Scrape data
      const questions = await scrapeWayground(pin);

      // Hapus loading
      loadingOverlay.remove();

      if (!questions || !questions.length) {
        alert("Tidak ditemukan soal untuk PIN ini.");
        return;
      }

      console.log(`[Wayground Scraper] Berhasil scrape ${questions.length} soal`);

      // Buat frame
      const frame = createFrame(questions, mode);

      // Jika mode auto, mulai auto jawab
      if (mode === "auto") {
        startAutoJawab(questions);

        // Tambah status auto jawab
        const statusDiv = document.createElement("div");
        statusDiv.style.cssText = "padding:8px 12px;background:#10b98122;border:1px solid #10b981;color:#10b981;font-size:12px;border-radius:8px;margin-bottom:12px;font-weight:600";
        statusDiv.textContent = "🤖 Auto Jawab AKTIF - Menunggu soal muncul...";
        frame.resultsWrap.insertBefore(statusDiv, frame.resultsWrap.firstChild);
      }

    } catch (err) {
      loadingOverlay.remove();
      console.error("[Wayground Scraper] Error:", err);
      alert("Gagal scrape jawaban:\n" + err.message);
    }
  }

  main();
})();
