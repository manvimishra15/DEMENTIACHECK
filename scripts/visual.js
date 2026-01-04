/* scripts/visual.js */
document.addEventListener("DOMContentLoaded", () => {
  // --- Helpers for HiDPI canvas scaling ---
  function makeHiDPICanvas(canvas) {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return ctx;
  }

  // --- Clock Test setup ---
  const clockFace = document.getElementById("clockFace");
  const clockDraw = document.getElementById("clockDraw");
  // ensure canvas CSS size present (in case user resized)
  clockFace.style.width = "400px";
  clockFace.style.height = "400px";
  clockDraw.style.width = "400px";
  clockDraw.style.height = "400px";

  const clockFaceCtx = makeHiDPICanvas(clockFace);
  const clockDrawCtx = makeHiDPICanvas(clockDraw);

  // generate random time
  const randomHour = Math.floor(Math.random() * 12) + 1;
  const randomMinute = Math.floor(Math.random() * 60);
  document.getElementById("clock-time").textContent = `${randomHour}:${String(randomMinute).padStart(2, "0")}`;

  function drawClockFace(ctx, size = 400, hour = randomHour, minute = randomMinute) {
    // Clear
    ctx.clearRect(0, 0, size, size);
    const cx = size / 2;
    const cy = size / 2;
    const radius = Math.min(cx, cy) - 10;

    // outer circle
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#cbd5e0";
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();

    // ticks and numbers (light)
    ctx.fillStyle = "#9aa6b2";
    ctx.font = "16px Poppins, sans-serif";
    for (let n = 1; n <= 12; n++) {
      const angle = (n / 12) * Math.PI * 2 - Math.PI / 2;
      const x = cx + Math.cos(angle) * (radius - 28);
      const y = cy + Math.sin(angle) * (radius - 28) + 6;
      ctx.fillText(String(n), x - 6, y);
    }
    // faint center dot
    ctx.beginPath();
    ctx.fillStyle = "#cbd5e0";
    ctx.arc(cx, cy, 2, 0, Math.PI * 2);
    ctx.fill();
    // optionally draw faint example hands (commented out so user draws)
    // (we leave face empty so user draws everything)
  }

  // initial draw
  drawClockFace(clockFaceCtx, 400);

  // --- Drawing behavior (pointer events) ---
  function enableDrawing(drawCanvas, drawCtx) {
    let drawing = false;

    function getPointer(e) {
      const rect = drawCanvas.getBoundingClientRect();
      // use clientX/Y to handle touch
      return {
        x: (e.clientX - rect.left),
        y: (e.clientY - rect.top)
      };
    }

    drawCanvas.addEventListener("pointerdown", (e) => {
      drawing = true;
      drawCanvas.setPointerCapture(e.pointerId);
      const p = getPointer(e);
      drawCtx.beginPath();
      drawCtx.moveTo(p.x, p.y);
    });

    drawCanvas.addEventListener("pointermove", (e) => {
      if (!drawing) return;
      const p = getPointer(e);
      drawCtx.lineTo(p.x, p.y);
      drawCtx.strokeStyle = "#0b3550";
      drawCtx.lineWidth = 3;
      drawCtx.lineCap = "round";
      drawCtx.lineJoin = "round";
      drawCtx.stroke();
      drawCtx.beginPath();
      drawCtx.moveTo(p.x, p.y);
    });

    function stopDraw(e) {
      drawing = false;
      try { drawCanvas.releasePointerCapture(e.pointerId); } catch (err) {}
      drawCtx.beginPath();
    }
    drawCanvas.addEventListener("pointerup", stopDraw);
    drawCanvas.addEventListener("pointercancel", stopDraw);
    drawCanvas.addEventListener("pointerleave", stopDraw);
  }

  enableDrawing(clockDraw, clockDrawCtx);

  // Clear button for clock: clears drawing canvas (keeps face)
  document.getElementById("clearClock").addEventListener("click", () => {
    // clear only drawing layer
    const ctx = clockDrawCtx;
    ctx.clearRect(0, 0, clockDraw.width, clockDraw.height);
    // redraw face in case anything overlapped (face is on different canvas so optional)
    drawClockFace(clockFaceCtx, 400);
  });

  // Save clock: store dataURL of combined image (face + drawing)
  document.getElementById("saveClock").addEventListener("click", () => {
    // create a temporary canvas to merge face + drawing
    const tmp = document.createElement("canvas");
    tmp.width = 400;
    tmp.height = 400;
    const tctx = tmp.getContext("2d");

    // draw face (clockFace is hiDPI-scaled but we use CSS sizes)
    // Draw face canvas scaled down by devicePixelRatio -> easiest: drawImage using element
    tctx.drawImage(clockFace, 0, 0, tmp.width, tmp.height);
    tctx.drawImage(clockDraw, 0, 0, tmp.width, tmp.height);

    // detect non-empty pixels on combined canvas (simple heuristic)
    const img = tctx.getImageData(0, 0, tmp.width, tmp.height).data;
    let nonEmpty = 0;
    for (let i = 3; i < img.length; i += 4) {
      if (img[i] !== 0) nonEmpty++;
    }

    const dataURL = tmp.toDataURL("image/png");
    localStorage.setItem("visual_clock", dataURL);
    localStorage.setItem("visual_clock_nonempty", nonEmpty > 50 ? "1" : "0");

    // show shape section and scroll to it
    document.getElementById("shape-section").style.display = "block";
    document.getElementById("shape-section").scrollIntoView({ behavior: "smooth" });
  });

  // ===== Shape test setup =====
  const shapeRef = document.getElementById("shapeRef");
  const shapeDraw = document.getElementById("shapeDraw");
  shapeRef.style.width = "220px";
  shapeRef.style.height = "220px";
  shapeDraw.style.width = "420px";
  shapeDraw.style.height = "420px";

  const shapeRefCtx = makeHiDPICanvas(shapeRef);
  const shapeDrawCtx = makeHiDPICanvas(shapeDraw);

  // function to draw specific reference shapes
  const shapeTypes = ["triangle", "square", "house", "star", "circle-cross"];
  let currentShape = 0;

  function drawReference(type) {
    const ctx = shapeRefCtx;
    const W = shapeRef.width / (window.devicePixelRatio || 1);
    const H = shapeRef.height / (window.devicePixelRatio || 1);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.save();
    ctx.translate(0, 0);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#1a365d";

    if (type === "triangle") {
      ctx.beginPath();
      ctx.moveTo(W * 0.5, H * 0.15);
      ctx.lineTo(W * 0.85, H * 0.85);
      ctx.lineTo(W * 0.15, H * 0.85);
      ctx.closePath();
      ctx.stroke();
    } else if (type === "square") {
      ctx.beginPath();
      ctx.rect(W * 0.18, H * 0.18, W * 0.64, H * 0.64);
      ctx.stroke();
    } else if (type === "house") {
      ctx.beginPath();
      ctx.rect(W * 0.2, H * 0.45, W * 0.6, H * 0.4);
      ctx.moveTo(W * 0.2, H * 0.45);
      ctx.lineTo(W * 0.5, H * 0.12);
      ctx.lineTo(W * 0.8, H * 0.45);
      ctx.stroke();
    } else if (type === "star") {
      const cx = W * 0.5, cy = H * 0.45, r = Math.min(W, H) * 0.28;
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const a = (i * 2 * Math.PI) / 5 - Math.PI / 2;
        ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
        const a2 = ((i + 0.5) * 2 * Math.PI) / 5 - Math.PI / 2;
        ctx.lineTo(cx + (r * 0.45) * Math.cos(a2), cy + (r * 0.45) * Math.sin(a2));
      }
      ctx.closePath();
      ctx.stroke();
    } else if (type === "circle-cross") {
      ctx.beginPath();
      ctx.arc(W * 0.5, H * 0.5, Math.min(W, H) * 0.28, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(W * 0.5, H * 0.2);
      ctx.lineTo(W * 0.5, H * 0.8);
      ctx.moveTo(W * 0.2, H * 0.5);
      ctx.lineTo(W * 0.8, H * 0.5);
      ctx.stroke();
    }
    ctx.restore();
  }

  function pickRandomShape() {
    currentShape = Math.floor(Math.random() * shapeTypes.length);
    drawReference(shapeTypes[currentShape]);
  }

  pickRandomShape();

  // enable drawing in shape draw canvas
  enableDrawing(shapeDraw, shapeDrawCtx);

  document.getElementById("clearShape").addEventListener("click", () => {
    shapeDrawCtx.clearRect(0, 0, shapeDraw.width, shapeDraw.height);
  });

  document.getElementById("newShape").addEventListener("click", () => {
    pickRandomShape();
    shapeDrawCtx.clearRect(0, 0, shapeDraw.width, shapeDraw.height);
  });

  // Save shape: merge reference + drawing or just save drawing and type
  document.getElementById("saveShape").addEventListener("click", () => {
    // merge reference (drawn on shapeRef) and user drawing (shapeDraw) into temp canvas
    const tmp = document.createElement("canvas");
    tmp.width = 420;
    tmp.height = 420;
    const tctx = tmp.getContext("2d");
    // draw scaled reference onto left top of the merged canvas (or ignore—we save only user drawing)
    tctx.fillStyle = "#fff";
    tctx.fillRect(0, 0, tmp.width, tmp.height);
    // draw user drawing scaled
    tctx.drawImage(shapeDraw, 0, 0, tmp.width, tmp.height);

    // heuristic non-empty check
    const img = tctx.getImageData(0, 0, tmp.width, tmp.height).data;
    let nonEmpty = 0;
    for (let i = 3; i < img.length; i += 4) {
      if (img[i] !== 0) nonEmpty++;
    }

    localStorage.setItem("visual_shape", tmp.toDataURL("image/png"));
    localStorage.setItem("visual_shape_type", shapeTypes[currentShape]);
    localStorage.setItem("visual_shape_nonempty", nonEmpty > 50 ? "1" : "0");

    // move to next test (orientation.html) — pages are in same folder
    window.location.href = "orientation.html";
  });

  // make sure canvases redraw face when window resized (optional)
  window.addEventListener("resize", () => {
    // reinitialize hi-dpi canvases (optional heavy; you may skip)
    // keep simple: no resizing at runtime to avoid complexity
  });
});
