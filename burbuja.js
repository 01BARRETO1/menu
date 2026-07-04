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

// burbuja.js (versión actualizada: imagen que cae y se puede atrapar)
const container = document.querySelector(".bubble-container");
const popSound = document.getElementById("pop-sound");
const riseSound = document.getElementById("rise-sound");

const bubbleData = [
  { img: "img/js-logo.png", text: "JavaScript: lenguaje para la web." },
  { img: "img/html-logo.png", text: "HTML: estructura de páginas." },
  { img: "img/css-logo.png", text: "CSS: estilos y diseño." },
  { img: "img/node-logo.png", text: "Node.js: JavaScript en servidor." },
  { img: "img/js-logo.png", text: "JavaScript se creó en un tiempo récord de 10 días en 1995 por Brendan Eich" },
  { img: "img/html-logo.png", text: "HTML se considera el lenguaje web más importante y su invención crucial para el surgimiento, desarrollo y expansión de la World Wide Web (WWW)" },
  { img: "img/react-logo.png", text: "React: UI basada en componentes." }
];

const FLOAT_DURATION = 10000; // ms (coincidir con tu animación CSS)
const SPAWN_INTERVAL = 1800;  // ms entre burbujas
const EXPLODE_DURATION = 450; // ms, debe coincidir con la animación .exploded

const spawnTimer = setInterval(spawnBubble, SPAWN_INTERVAL);

function spawnBubble() {
  const bubble = document.createElement("div");
  bubble.className = "bubble";

  // tamaño aleatorio
  const size = Math.floor(Math.random() * 30) + 50; // 50-80px
  bubble.style.width = size + "px";
  bubble.style.height = size + "px";

  // posición horizontal aleatoria
  bubble.style.left = Math.random() * (window.innerWidth - size) + "px";

  // decidir si es burbuja informativa o vacía
  const isInformative = Math.random() < 0.6; // 60% informativas, 40% vacías

  let messageText = null;
  let imageSrc = null;

  if (isInformative) {
    // elegir datos aleatorios
    const idx = Math.floor(Math.random() * bubbleData.length);
    const data = bubbleData[idx];

    imageSrc = data.img;

    // icono dentro de la burbuja (tamaño controlado por CSS)
    const icon = document.createElement("img");
    icon.className = "bubble-icon";
    icon.src = data.img;
    icon.alt = "logo";
    bubble.appendChild(icon);

    // mensaje dentro (solo referencia)
    const message = document.createElement("div");
    message.className = "info-message";
    message.textContent = data.text;
    // no lo mostramos dentro; sirve como referencia
    bubble.appendChild(message);

    messageText = data.text;
  }

  // sonido al salir
  try { riseSound.currentTime = 0; riseSound.play(); } catch (e) {}

  /* CLICK HANDLER */
  bubble.addEventListener("click", () => {
    if (bubble.dataset.popped) return;
    bubble.dataset.popped = "true";

    // medir posición ANTES de aplicar la animación explode
    const bubbleRect = bubble.getBoundingClientRect();

    // si es informativa, mostrar mensaje
    if (messageText) {
      createFloatingMessageAtRect(bubbleRect, messageText);
    }
    // fragmentos visuales
    createFragmentsAtRect(bubbleRect);

    // aplicar animación y sonido
    bubble.classList.add("exploded");
    try { popSound.currentTime = 0; popSound.play(); } catch (e) {}

    // si tiene imagen, crear la imagen que cae (un poco más grande que la burbuja)
    if (imageSrc) {
      createFallingImageAtRect(bubbleRect, imageSrc, size);
    }

    // cancelar timeout si existe
    if (bubble.dataset.timeoutId) {
      clearTimeout(Number(bubble.dataset.timeoutId));
    }

    setTimeout(() => { if (bubble.parentElement) bubble.remove(); }, EXPLODE_DURATION);
  });

  /* TIMEOUT: explota sola */
  const timeoutId = setTimeout(() => {
    if (bubble.dataset.popped) return;
    bubble.dataset.popped = "true";

    const bubbleRect = bubble.getBoundingClientRect();

    if (messageText) {
      createFloatingMessageAtRect(bubbleRect, messageText);
    }
    createFragmentsAtRect(bubbleRect);

    bubble.classList.add("exploded");
    try { popSound.currentTime = 0; popSound.play(); } catch (e) {}

    if (imageSrc) {
      createFallingImageAtRect(bubbleRect, imageSrc, size);
    }

    setTimeout(() => { if (bubble.parentElement) bubble.remove(); }, EXPLODE_DURATION);
  }, FLOAT_DURATION);

  bubble.dataset.timeoutId = timeoutId;
  container.appendChild(bubble);
}

/* Crea mensaje fijo en body usando un DOMRect (getBoundingClientRect) */
function createFloatingMessageAtRect(rect, text) {
  const msg = document.createElement("div");
  msg.className = "info-message";
  msg.textContent = text;

  // oculto para medir
  msg.style.visibility = "hidden";
  msg.style.opacity = "0";
  document.body.appendChild(msg);

  const msgWidth = msg.offsetWidth;
  const msgHeight = msg.offsetHeight;

  // calcular posición centrada respecto a la burbuja (viewport)
  let left = rect.left + (rect.width / 2) - (msgWidth / 2);
  let top  = rect.top - msgHeight - 8; // 8px por encima

  // evitar salirse de la pantalla
  const padding = 8;
  left = Math.max(padding, Math.min(left, window.innerWidth - msgWidth - padding));
  top  = Math.max(padding, Math.min(top, window.innerHeight - msgHeight - padding));

  // aplicar y mostrar
  msg.style.left = `${left}px`;
  msg.style.top  = `${top}px`;
  msg.classList.add("show");
  msg.style.visibility = "visible";

  // eliminar después de 5s (coincide con animación slowRise)
  setTimeout(() => { if (msg.parentElement) msg.remove(); }, 5000);
}

/* Crea fragmentos en body usando un DOMRect (posicion fija) */
function createFragmentsAtRect(rect) {
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  for (let i = 0; i < 6; i++) {
    const frag = document.createElement("div");
    frag.className = "fragment";
    frag.style.left = `${cx}px`;
    frag.style.top  = `${cy}px`;

    const dx = (Math.random() * 160 - 80) + "px";
    const dy = (Math.random() * -120 - 20) + "px";
    frag.style.setProperty('--dx', dx);
    frag.style.setProperty('--dy', dy);

    document.body.appendChild(frag);
    setTimeout(() => { if (frag.parentElement) frag.remove(); }, 800);
  }
}

/* Crea una imagen que cae desde la posición rect (DOMRect), con control de agarre */
function createFallingImageAtRect(rect, src, bubbleSize) {
  const img = document.createElement("img");
  img.className = "falling-image";
  img.src = src;
  img.alt = "logo";

  // tamaño: un poco más grande que la burbuja
  const scale = 1.4; // 140% del tamaño de la burbuja
  const imgSize = Math.round(bubbleSize * scale);
  img.style.width = imgSize + "px";
  img.style.height = imgSize + "px";

  // posición inicial centrada en la burbuja (viewport coords)
  const startLeft = rect.left + (rect.width / 2) - (imgSize / 2);
  const startTop  = rect.top + (rect.height / 2) - (imgSize / 2);

  img.style.left = `${startLeft}px`;
  img.style.top  = `${startTop}px`;

  // añadir al body
  document.body.appendChild(img);

  // iniciar la física de caída y control de agarre
  startFallLoop(img);
}

/* Loop de física simple: gravedad, colisión con suelo, y soporte de "agarrar" con pointer */
function startFallLoop(el) {
  let vx = 0;
  let vy = 0;
  const gravity = 0.6;      // aceleración por frame
  const floorPadding = 8;   // margen desde el bottom
  let isHeld = false;
  let holdOffsetX = 0;
  let holdOffsetY = 0;

  // obtener posición inicial desde estilos
  let left = parseFloat(el.style.left);
  let top  = parseFloat(el.style.top);

  // pointer handlers para agarrar y soltar (funciona con mouse y touch)
  function onPointerDown(e) {
    e.preventDefault();
    isHeld = true;
    try { el.setPointerCapture?.(e.pointerId); } catch (err) {}
    const px = (e.clientX !== undefined) ? e.clientX : (e.touches && e.touches[0].clientX);
    const py = (e.clientY !== undefined) ? e.clientY : (e.touches && e.touches[0].clientY);
    holdOffsetX = px - left;
    holdOffsetY = py - top;
    vx = 0;
    vy = 0;
    // pequeño efecto visual
    el.style.transform = "scale(1.03)";
  }

  function onPointerMove(e) {
    if (!isHeld) return;
    const px = (e.clientX !== undefined) ? e.clientX : (e.touches && e.touches[0].clientX);
    const py = (e.clientY !== undefined) ? e.clientY : (e.touches && e.touches[0].clientY);
    left = px - holdOffsetX;
    top  = py - holdOffsetY;
    // aplicar posición inmediatamente
    el.style.left = `${left}px`;
    el.style.top  = `${top}px`;
  }

  function onPointerUp(e) {
    if (!isHeld) return;
    isHeld = false;
    try { el.releasePointerCapture?.(e.pointerId); } catch (err) {}
    // al soltar, dar una pequeña velocidad vertical para reanudar caída
    vy = 2;
    el.style.transform = "";
  }

  // attach pointer events
  el.style.touchAction = "none"; // evitar scroll mientras se arrastra
  el.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);

  // soporte básico para touch (por compatibilidad)
  function touchStartHandler(ev) { onPointerDown(ev.changedTouches ? ev.changedTouches[0] : ev); }
  function touchMoveHandler(ev) { onPointerMove(ev.changedTouches ? ev.changedTouches[0] : ev); }
  function touchEndHandler(ev) { onPointerUp(ev.changedTouches ? ev.changedTouches[0] : ev); }

  el.addEventListener("touchstart", touchStartHandler, { passive: false });
  window.addEventListener("touchmove", touchMoveHandler, { passive: false });
  window.addEventListener("touchend", touchEndHandler);

  let rafId = null;

  function step() {
    if (!isHeld) {
      // aplicar gravedad
      vy += gravity;
      top += vy;
      left += vx;
      // límites laterales (mantener dentro de viewport)
      const maxLeft = window.innerWidth - el.offsetWidth - 4;
      if (left < 4) { left = 4; vx *= -0.3; }
      if (left > maxLeft) { left = maxLeft; vx *= -0.3; }
      // suelo: si toca el bottom, detener y eliminar
      const groundY = window.innerHeight - el.offsetHeight - floorPadding;
      if (top >= groundY) {
        top = groundY;
        // pequeño rebote
        vy = -vy * 0.25;
        // si la velocidad tras rebote es pequeña, eliminar
        if (Math.abs(vy) < 1) {
          cleanupAndRemove();
          return;
        }
      }
      el.style.left = `${left}px`;
      el.style.top  = `${top}px`;
    }
    rafId = requestAnimationFrame(step);
  }

  // limpiar listeners y cancelar RAF
  function cleanupAndRemove() {
    cancelAnimationFrame(rafId);
    el.removeEventListener("pointerdown", onPointerDown);
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
    try {
      el.removeEventListener("touchstart", touchStartHandler);
      window.removeEventListener("touchmove", touchMoveHandler);
      window.removeEventListener("touchend", touchEndHandler);
    } catch (e) {}
    if (el.parentElement) el.parentElement.removeChild(el);
  }

  // iniciar loop
  rafId = requestAnimationFrame(step);
}

/* Opcional: limpiar interval al salir de la página (buena práctica) */
window.addEventListener("beforeunload", () => {
  clearInterval(spawnTimer);
});

