/* const container = document.querySelector(".bubble-container");
const popSound = document.getElementById("pop-sound");
const riseSound = document.getElementById("rise-sound");

// Generar burbujas cada cierto tiempo
setInterval(() => {
  const bubble = document.createElement("div");
  bubble.classList.add("bubble");

  // Posición horizontal aleatoria
  bubble.style.left = Math.random() * (window.innerWidth - 70) + "px";

  // Mensaje dentro de la burbuja
  const message = document.createElement("div");
  message.classList.add("info-message");
  message.textContent = "¡Has atrapado una burbuja! Aquí va tu información.";
  bubble.appendChild(message);

  // Sonido al salir
  riseSound.currentTime = 0;
  riseSound.play();

  // Evento de click (aplastar burbuja)
  bubble.addEventListener("click", () => {
    bubble.classList.add("active");
    popSound.currentTime = 0;
    popSound.play();

    // Mantener mensaje visible 5 segundos
    setTimeout(() => {
      bubble.remove();
    }, 9000);
  });

  container.appendChild(bubble);

  // Eliminar burbuja si no se atrapa
  setTimeout(() => {
    if (!bubble.classList.contains("active")) {
      bubble.remove();
    }
  }, 10000);
}, 2500);

 */
// burbuja.js (actualizado con tu bubbleData original)
const container = document.querySelector(".bubble-container");
const popSound = document.getElementById("pop-sound");
const riseSound = document.getElementById("rise-sound");

const depositArea = document.getElementById("deposit-area");
const depositSlot = document.getElementById("deposit-slot");
const depositClose = document.getElementById("deposit-close");

const modal = document.getElementById("img-modal");
const modalImg = document.getElementById("modal-img");
const modalClose = document.getElementById("modal-close");

const bubbleData = [
  { img: "img/js-logo.png", text: "JavaScript: lenguaje para la web." },
  { img: "img/html-logo.png", text: "HTML: estructura de páginas." },
  { img: "img/css-logo.png", text: "CSS: estilos y diseño." },
  { img: "img/html-logo.png", text: "1989: Tim Berners-Lee inventa la Web con HTML como lenguaje de publicación." },
  { img: "img/www-logo.png", text: "World Wide Web - www" },
  { img: "img/js-logo.png", text: "JavaScript se creó en un tiempo récord de 10 días en 1995 por Brendan Eich" },
  { img: "img/html-logo.png", text: "HTML se considera el lenguaje web más importante y su invención crucial para el surgimiento, desarrollo y expansión de la World Wide Web (WWW)" },
  { img: "img/react-logo.png", text: "React: UI basada en componentes." }
];

const FLOAT_DURATION = 10000;
const SPAWN_INTERVAL = 1800;
const EXPLODE_DURATION = 450;

const spawnTimer = setInterval(spawnBubble, SPAWN_INTERVAL);

/* ---------------- spawnBubble ---------------- */
function spawnBubble() {
  const bubble = document.createElement("div");
  bubble.className = "bubble";

  const size = Math.floor(Math.random() * 30) + 50;
  bubble.style.width = size + "px";
  bubble.style.height = size + "px";
  bubble.style.left = Math.random() * (window.innerWidth - size) + "px";

  const isInformative = Math.random() < 0.6;
  let messageText = null;
  let imageSrc = null;

  if (isInformative) {
    const idx = Math.floor(Math.random() * bubbleData.length);
    const data = bubbleData[idx];
    imageSrc = data.img;

    const icon = document.createElement("img");
    icon.className = "bubble-icon";
    icon.src = data.img;
    icon.alt = "logo";
    bubble.appendChild(icon);

    const message = document.createElement("div");
    message.className = "info-message";
    message.textContent = data.text;
    bubble.appendChild(message);

    messageText = data.text;
  }

  try { riseSound.currentTime = 0; riseSound.play(); } catch (e) { }

  bubble.addEventListener("click", () => {
    if (bubble.dataset.popped) return;
    bubble.dataset.popped = "true";

    const bubbleRect = bubble.getBoundingClientRect();

    if (messageText) createFloatingMessageAtRect(bubbleRect, messageText);
    createFragmentsAtRect(bubbleRect);

    bubble.classList.add("exploded");
    try { popSound.currentTime = 0; popSound.play(); } catch (e) { }

    // dentro del click handler
    if (imageSrc) createFallingImageAtRect(bubbleRect, imageSrc, size, messageText);

    if (bubble.dataset.timeoutId) clearTimeout(Number(bubble.dataset.timeoutId));
    setTimeout(() => { if (bubble.parentElement) bubble.remove(); }, EXPLODE_DURATION);
  });

  const timeoutId = setTimeout(() => {
    if (bubble.dataset.popped) return;
    bubble.dataset.popped = "true";

    const bubbleRect = bubble.getBoundingClientRect();
    if (messageText) createFloatingMessageAtRect(bubbleRect, messageText);
    createFragmentsAtRect(bubbleRect);

    bubble.classList.add("exploded");
    try { popSound.currentTime = 0; popSound.play(); } catch (e) { }

    // llamada dentro del timeout
    // dentro del timeout
    if (imageSrc) {
      createFallingImageAtRect(bubbleRect, imageSrc, size, messageText);
    }
    setTimeout(() => { if (bubble.parentElement) bubble.remove(); }, EXPLODE_DURATION);
  }, FLOAT_DURATION);

  bubble.dataset.timeoutId = timeoutId;
  container.appendChild(bubble);
}

/* ---------------- Mensaje y fragmentos ---------------- */
function createFloatingMessageAtRect(rect, text) {
  const msg = document.createElement("div");
  msg.className = "info-message";
  msg.textContent = text;
  msg.style.visibility = "hidden";
  msg.style.opacity = "0";
  document.body.appendChild(msg);

  const msgWidth = msg.offsetWidth;
  const msgHeight = msg.offsetHeight;

  let left = rect.left + (rect.width / 2) - (msgWidth / 2);
  let top = rect.top - msgHeight - 8;

  const padding = 8;
  left = Math.max(padding, Math.min(left, window.innerWidth - msgWidth - padding));
  top = Math.max(padding, Math.min(top, window.innerHeight - msgHeight - padding));

  msg.style.left = `${left}px`;
  msg.style.top = `${top}px`;
  msg.classList.add("show");
  msg.style.visibility = "visible";

  setTimeout(() => { if (msg.parentElement) msg.remove(); }, 5000);
}

function createFragmentsAtRect(rect) {
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  for (let i = 0; i < 6; i++) {
    const frag = document.createElement("div");
    frag.className = "fragment";
    frag.style.left = `${cx}px`;
    frag.style.top = `${cy}px`;

    const dx = (Math.random() * 160 - 80) + "px";
    const dy = (Math.random() * -120 - 20) + "px";
    frag.style.setProperty('--dx', dx);
    frag.style.setProperty('--dy', dy);

    document.body.appendChild(frag);
    setTimeout(() => { if (frag.parentElement) frag.remove(); }, 800);
  }
}

/* ---------------- Falling image + deposit + modal y texto---------------- */
function createFallingImageAtRect(rect, src, bubbleSize, text = "") {
  const img = document.createElement("img");
  img.className = "falling-image";
  img.src = src;
  img.alt = "logo";

  // guardar texto asociado para usarlo luego en el modal
  img.dataset.text = text || "";

  const scale = 1.4;
  const imgSize = Math.round(bubbleSize * scale);
  img.style.width = imgSize + "px";
  img.style.height = imgSize + "px";

  const startLeft = rect.left + (rect.width / 2) - (imgSize / 2);
  const startTop = rect.top + (rect.height / 2) - (imgSize / 2);

  img.style.left = `${startLeft}px`;
  img.style.top = `${startTop}px`;

  document.body.appendChild(img);

  startFallLoop(img);
}

/* startFallLoop: física simple + depósito + doble click para modal */
function startFallLoop(el) {
  let vx = 0, vy = 0;
  const gravity = 0.6;
  const floorPadding = 8;
  let isHeld = false;
  let holdOffsetX = 0, holdOffsetY = 0;
  let left = parseFloat(el.style.left);
  let top = parseFloat(el.style.top);

  let lastPointerX = 0, lastPointerY = 0, lastPointerTime = 0;

  function onPointerDown(e) {
    e.preventDefault();
    isHeld = true;
    try { el.setPointerCapture?.(e.pointerId); } catch (err) { }
    const px = (e.clientX !== undefined) ? e.clientX : (e.touches && e.touches[0].clientX);
    const py = (e.clientY !== undefined) ? e.clientY : (e.touches && e.touches[0].clientY);
    holdOffsetX = px - left;
    holdOffsetY = py - top;
    vx = 0; vy = 0;
    el.style.transform = "scale(1.03)";
    showDepositArea(); // mostramos el depósito al empezar a arrastrar
    lastPointerX = px; lastPointerY = py; lastPointerTime = performance.now();
  }

  function onPointerMove(e) {
    if (!isHeld) return;
    const px = (e.clientX !== undefined) ? e.clientX : (e.touches && e.touches[0].clientX);
    const py = (e.clientY !== undefined) ? e.clientY : (e.touches && e.touches[0].clientY);
    left = px - holdOffsetX;
    top = py - holdOffsetY;
    el.style.left = `${left}px`;
    el.style.top = `${top}px`;
    lastPointerX = px; lastPointerY = py; lastPointerTime = performance.now();
  }

  function onPointerUp(e) {
    if (!isHeld) return;
    isHeld = false;
    try { el.releasePointerCapture?.(e.pointerId); } catch (err) { }
    el.style.transform = "";
    const now = performance.now();
    const dt = Math.max(1, now - lastPointerTime);
    vx = (lastPointerX - (left + holdOffsetX)) / (dt / 16.67);
    vy = 2;

    // Si está sobre el slot, depositar inmediatamente
    if (isOverDeposit(el)) {
      depositImage(el);
      hideDepositArea();
      return;
    }

    // Si no depositó, dejamos el depósito visible y esperamos a que el usuario lo use.
    // Se ocultará automáticamente cuando el cursor salga del área (ver listeners de depositArea).
    // No llamamos a hideDepositArea() aquí para dar tiempo al usuario.
  }

  // doble click para abrir modal con imagen + texto
  let lastClick = 0;
  function onClickForModal(e) {
    const now = Date.now();
    if (now - lastClick < 350) {
      // recupera el texto guardado en el dataset (si existe)
      const text = el.dataset && el.dataset.text ? el.dataset.text : "";
      openModalWithImage(el.src, text);
    }
    lastClick = now;
  }


  el.style.touchAction = "none";
  el.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
  el.addEventListener("click", onClickForModal);

  function touchStartHandler(ev) { onPointerDown(ev.changedTouches ? ev.changedTouches[0] : ev); }
  function touchMoveHandler(ev) { onPointerMove(ev.changedTouches ? ev.changedTouches[0] : ev); }
  function touchEndHandler(ev) { onPointerUp(ev.changedTouches ? ev.changedTouches[0] : ev); }

  el.addEventListener("touchstart", touchStartHandler, { passive: false });
  window.addEventListener("touchmove", touchMoveHandler, { passive: false });
  window.addEventListener("touchend", touchEndHandler);

  let rafId = null;

  function step() {
    if (!isHeld) {
      vy += gravity;
      top += vy;
      left += vx;
      const maxLeft = window.innerWidth - el.offsetWidth - 4;
      if (left < 4) { left = 4; vx *= -0.3; }
      if (left > maxLeft) { left = maxLeft; vx *= -0.3; }
      const groundY = window.innerHeight - el.offsetHeight - floorPadding;
      if (top >= groundY) {
        top = groundY;
        vy = -vy * 0.25;
        if (Math.abs(vy) < 1) {
          cleanupAndRemove();
          return;
        }
      }
      el.style.left = `${left}px`;
      el.style.top = `${top}px`;
    }
    rafId = requestAnimationFrame(step);
  }

  function cleanupAndRemove() {
    cancelAnimationFrame(rafId);
    el.removeEventListener("pointerdown", onPointerDown);
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
    el.removeEventListener("click", onClickForModal);
    try {
      el.removeEventListener("touchstart", touchStartHandler);
      window.removeEventListener("touchmove", touchMoveHandler);
      window.removeEventListener("touchend", touchEndHandler);
    } catch (e) { }
    if (el.parentElement) el.parentElement.removeChild(el);
  }

  rafId = requestAnimationFrame(step);
}

/* ---------------- Deposit helpers ---------------- */
let depositHideTimeout = null;
const DEPOSIT_HIDE_DELAY = 1200; // ms: tiempo tras salir para ocultar

function showDepositArea() {
  // cancelar cualquier timeout de ocultado
  if (depositHideTimeout) { clearTimeout(depositHideTimeout); depositHideTimeout = null; }
  depositArea.classList.remove("deposit-hidden");
  depositArea.setAttribute("aria-hidden", "false");
}

function hideDepositAreaImmediate() {
  // oculta sin delay
  if (depositHideTimeout) { clearTimeout(depositHideTimeout); depositHideTimeout = null; }
  depositArea.classList.add("deposit-hidden");
  depositArea.setAttribute("aria-hidden", "true");
}

function scheduleHideDepositArea() {
  // programa ocultado tras un pequeño delay
  if (depositHideTimeout) clearTimeout(depositHideTimeout);
  depositHideTimeout = setTimeout(() => {
    depositArea.classList.add("deposit-hidden");
    depositArea.setAttribute("aria-hidden", "true");
    depositHideTimeout = null;
  }, DEPOSIT_HIDE_DELAY);
}

function hideDepositArea() {
  depositArea.classList.add("deposit-hidden");
  depositArea.setAttribute("aria-hidden", "true");
}

function isOverDeposit(el) {
  // si el depositSlot no existe aún, devolver false
  if (!depositSlot) return false;
  const slotRect = depositSlot.getBoundingClientRect();
  const elRect = el.getBoundingClientRect();
  const cx = elRect.left + elRect.width / 2;
  const cy = elRect.top + elRect.height / 2;
  return (cx >= slotRect.left && cx <= slotRect.right && cy >= slotRect.top && cy <= slotRect.bottom);
}

/* ---------------- Deposit helpers (actualizada) ---------------- */
function depositImage(el) {
  // contenedor para miniatura + botones
  const item = document.createElement("div");
  item.className = "deposit-item";

  const thumb = document.createElement("img");
  thumb.className = "deposited";
  thumb.src = el.src;
  thumb.alt = "Deposited";

  // recuperar texto asociado (si existe)
  const text = el.dataset?.text || "";

  // botón "Ver imagen" que abre modal en 500x500
  const viewBtn = document.createElement("button");
  viewBtn.className = "view-btn";
  viewBtn.type = "button";
  viewBtn.textContent = "Ver imagen";

  // al hacer click en la miniatura o en Ver imagen, abrir modal con texto
  thumb.addEventListener("click", () => openModalWithImage(thumb.src, text));
  viewBtn.addEventListener("click", () => openModalWithImage(thumb.src, text));

  // añadir elementos al slot
  item.appendChild(thumb);
  item.appendChild(viewBtn);
  depositSlot.appendChild(item);

  // eliminar la imagen que cae
  if (el.parentElement) el.parentElement.removeChild(el);

  hideDepositAreaImmediate();
  openModalWithImage(el.src, text);
  //onClickForModal
}

/* ---------------- Modal helpers (actualizada) ---------------- */
function openModalWithImage(src, text = "") {
  modalImg.src = src;
  modalImg.style.width = "500px";
  modalImg.style.height = "500px";

  const caption = document.getElementById("modal-caption");
  if (caption) {
    caption.textContent = text || "";
    // si no hay texto, ocultar el contenedor para que quede solo la imagen
    caption.style.display = text ? "block" : "none";
  }

  modal.classList.remove("img-modal-hidden");
  modal.setAttribute("aria-hidden", "false");
}

// cerrar modal y limpiar src
function closeModal() {
  modal.classList.add("img-modal-hidden");
  modal.setAttribute("aria-hidden", "true");
  setTimeout(() => {
    modalImg.src = ""; modalImg.style.width = ""; modalImg.style.height = "";
    const caption = document.getElementById("modal-caption"); if (caption) caption.textContent = "";
  }, 180);
}
/* Eventos UI para cerrar deposit y modal */
depositClose?.addEventListener("click", () => hideDepositArea());
modalClose?.addEventListener("click", () => closeModal());
// cerrar al click en el backdrop
document.querySelector(".img-modal-backdrop")?.addEventListener("click", () => closeModal());
modalClose?.addEventListener("click", () => closeModal());
// cerrar con tecla Esc
window.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

/* Limpiar interval al salir */
window.addEventListener("beforeunload", () => {
  clearInterval(spawnTimer);
});

// Inicializar listeners del deposit area (ejecutar una vez)
if (depositArea) {
  depositArea.addEventListener("mouseenter", () => {
    // cancelar ocultado si el cursor vuelve
    if (depositHideTimeout) { clearTimeout(depositHideTimeout); depositHideTimeout = null; }
    depositArea.classList.remove("deposit-hidden");
    depositArea.setAttribute("aria-hidden", "false");
  });

  depositArea.addEventListener("mouseleave", () => {
    // programar ocultado cuando el cursor salga
    scheduleHideDepositArea();
  });
}


//PULPO ANIMACIÓN, OCULPTAR OVERLAY
window.addEventListener("load", () => {
  const overlay = document.getElementById("intro-overlay");
  const pageContent = document.getElementById("page-content");

  // Mostrar overlay después de 1 segundo
  setTimeout(() => {
    overlay.style.display = "flex";

    // Al llegar al último frame (~4s), empujar contenido
    setTimeout(() => {
      pageContent.classList.add("exit");
    }, 4000);

    // Ocultar overlay y resetear después de 6s
    setTimeout(() => {
      overlay.style.display = "none";
      pageContent.classList.remove("exit");
    }, 6000);
  }, 1000);
});
