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
popSound.volume = 0.3; // rebaja el volumen
const riseSound = document.getElementById("rise-sound");
riseSound.volume = 0.2; // más bajo
// Conectar slider
const volumeSlider = document.getElementById("volume-slider");
if (volumeSlider) {
  volumeSlider.addEventListener("input", (e) => {
    const vol = parseFloat(e.target.value);
    popSound.volume = vol;
    riseSound.volume = vol;
  });
}



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
  { img: "img/css-logo.png", text: "El CSS actúa como el diseño o la pintura que le da vida y estilo" },
  { img: "img/html-logo.png", text: "1989: Tim Berners-Lee inventa la Web con HTML como lenguaje de publicación." },
  { img: "img/www-logo.png", text: "World Wide Web - WWW" },
  { img: "img/js-logo.png", text: "JavaScript se creó en un tiempo récord de 10 días en 1995 por Brendan Eich" },
  { img: "img/html-logo.png", text: "HTML se considera el lenguaje web más importante"},
  { img: "img/html-logo2.png", text: "HTML y CSS son los pilares de Internet." },
  { img: "img/html-logo2.png", text: "HTML funciona como el esqueleto o la estructura de un sitio web" }
];

const FLOAT_DURATION = 10000;
const SPAWN_INTERVAL = 1800;
const EXPLODE_DURATION = 450;

const spawnTimer = setInterval(spawnBubble, SPAWN_INTERVAL);

/* ---------------- spawnBubble ---------------- */ // Comentario: Cabecera que indica el inicio de la función spawnBubble
function spawnBubble() { // Crea una nueva burbuja en pantalla; función principal que genera el DOM y la lógica de interacción
  const bubble = document.createElement("div"); // Crea un elemento <div> que representará la burbuja en el DOM
  bubble.className = "bubble"; // Asigna la clase CSS "bubble" para estilos y animaciones

  const size = Math.floor(Math.random() * 30) + 50; // Calcula un tamaño aleatorio entre 50 y 79 px; Math.random()*30 -> 0..29.999, +50 -> 50..79
  bubble.style.width = size + "px"; // Aplica el ancho calculado a la burbuja en píxeles
  bubble.style.height = size + "px"; // Aplica la altura calculada a la burbuja en píxeles (burbuja cuadrada que luego CSS puede redondear)
  bubble.style.left = Math.random() * (window.innerWidth - size) + "px"; // Posiciona horizontalmente la burbuja en un punto aleatorio dentro del ancho de la ventana, restando su tamaño para que no salga del viewport

  const isInformative = Math.random() < 0.6; // Booleano que decide si la burbuja llevará contenido informativo (60% de probabilidad)
  let messageText = null; // Variable para almacenar el texto informativo que puede mostrar la burbuja; inicializada a null
  let imageSrc = null; // Variable para almacenar la ruta/URL de la imagen asociada a la burbuja; inicializada a null

  if (isInformative) { // Si la burbuja debe ser informativa, se extrae un elemento aleatorio de bubbleData y se construyen nodos hijos
    const idx = Math.floor(Math.random() * bubbleData.length); // Índice aleatorio dentro del array bubbleData
    const data = bubbleData[idx]; // Obtiene el objeto de datos seleccionado (debe contener propiedades como img y text)
    imageSrc = data.img; // Guarda la ruta de la imagen en imageSrc para usarla más adelante (por ejemplo al explotar)

    const icon = document.createElement("img"); // Crea un elemento <img> que actuará como icono dentro de la burbuja
    icon.className = "bubble-icon"; // Asigna la clase CSS "bubble-icon" para estilos específicos del icono
    icon.src = data.img; // Establece la fuente de la imagen al valor proporcionado por data.img
    icon.alt = "logo"; // Texto alternativo para accesibilidad; aquí se usa "logo"
    bubble.appendChild(icon); // Inserta el icono dentro del elemento burbuja

    const message = document.createElement("div"); // Crea un <div> que contendrá el texto informativo
    message.className = "info-message"; // Asigna la clase CSS "info-message" para estilos del mensaje
    message.textContent = data.text; // Rellena el contenido textual del mensaje con data.text
    bubble.appendChild(message); // Inserta el mensaje dentro de la burbuja

    messageText = data.text; // Guarda el texto en messageText para usarlo en la explosión o en mensajes flotantes
  } // Fin del bloque que añade contenido informativo a la burbuja

  // Línea en blanco intencional para separar la creación del elemento de la lógica de interacción

  bubble.addEventListener("click", () => { // Añade un listener para el evento 'click' que detonará la "explosión" manual
    if (bubble.dataset.popped) return; // Si la burbuja ya fue marcada como explotada (dataset.popped), salir para evitar doble ejecución
    bubble.dataset.popped = "true"; // Marca la burbuja como explotada para evitar reentradas

    try { riseSound.currentTime = 0; riseSound.play(); } catch (e) { } // Intenta reproducir el sonido de subida (riseSound); captura errores silenciosamente si el audio no existe o está bloqueado

    const bubbleRect = bubble.getBoundingClientRect(); // Obtiene las coordenadas y tamaño actuales de la burbuja en pantalla para posicionar efectos (fragmentos, mensajes, imágenes)

    if (messageText) createFloatingMessageAtRect(bubbleRect, messageText); // Si hay texto informativo, crea un mensaje flotante en la posición de la burbuja
    createFragmentsAtRect(bubbleRect); // Crea fragmentos/partículas en la posición de la burbuja para la animación de explosión

    bubble.classList.add("exploded"); // Añade la clase "exploded" para activar estilos/animaciones CSS de explosión
    try { popSound.currentTime = 0; popSound.play(); } catch (e) { } // Intenta reproducir el sonido de "pop"; captura errores silenciosamente

    // dentro del click handler
    if (imageSrc) createFallingImageAtRect(bubbleRect, imageSrc, size, messageText); // Si la burbuja tiene imagen asociada, crea una imagen que cae desde la posición de la burbuja

    if (bubble.dataset.timeoutId) clearTimeout(Number(bubble.dataset.timeoutId)); // Si existía un timeout programado para la explosión automática, lo limpia para evitar doble ejecución
    setTimeout(() => { if (bubble.parentElement) bubble.remove(); }, EXPLODE_DURATION); // Tras la duración de la animación (EXPLODE_DURATION), elimina el nodo burbuja del DOM si aún está presente
  }); // Fin del click handler

  const timeoutId = setTimeout(() => { // Programa una explosión automática tras FLOAT_DURATION (comportamiento que hace que exploten solas)
    if (bubble.dataset.popped) return; // Si ya fue explotada manualmente, salir para no repetir
    bubble.dataset.popped = "true"; // Marca como explotada para bloquear reentradas

    const bubbleRect = bubble.getBoundingClientRect(); // Obtiene la posición actual para efectos
    if (messageText) createFloatingMessageAtRect(bubbleRect, messageText); // Crea mensaje flotante si corresponde
    createFragmentsAtRect(bubbleRect); // Crea fragmentos/partículas para la explosión

    bubble.classList.add("exploded"); // Activa la clase CSS de explosión
    try { popSound.currentTime = 0; popSound.play(); } catch (e) { } // Reproduce el sonido de pop si está disponible

    // llamada dentro del timeout
    // dentro del timeout
    if (imageSrc) { // Si la burbuja tenía imagen asociada, también la hace caer en la explosión automática
      createFallingImageAtRect(bubbleRect, imageSrc, size, messageText); // Crea la imagen que cae desde la posición de la burbuja
    }
    setTimeout(() => { if (bubble.parentElement) bubble.remove(); }, EXPLODE_DURATION); // Elimina la burbuja tras la animación de explosión
  }, FLOAT_DURATION); // FLOAT_DURATION define el tiempo en ms hasta que la burbuja explota automáticamente

  bubble.dataset.timeoutId = timeoutId; // Guarda el id del timeout en dataset para poder cancelarlo si el usuario hace click antes
  container.appendChild(bubble); // Añade la burbuja al contenedor principal (container debe ser una referencia al elemento DOM donde se muestran las burbujas)
} // Fin de la función spawnBubble


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
  //openModalWithImage(el.src, text);
  //onClickForModal
}

/* ---------------- Modal helpers (actualizada) ---------------- */
function openModalWithImage(src, text = "") {
  modalImg.src = src;
  modalImg.style.width = "500px";
  modalImg.style.height = "500px";

  const caption = document.getElementById("modal-caption");
  if (caption) {
    if (text && text.trim() !== "") {
      caption.textContent = text;
      caption.style.display = "block";
    } else {
      caption.textContent = "";
      caption.style.display = "none";
    }
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
//Animacion pulpo
window.addEventListener("load", () => {
  // Elementos del pulpo/overlay
  const overlay = document.getElementById("intro-overlay");
  const pageContent = document.getElementById("page-content");

  // Elementos del control de volumen (puede ser null)
  const volumeControl = document.getElementById("volume-control");
  const volumeSlider = document.getElementById("volume-slider");
  const popSound = document.getElementById("pop-sound");
  const riseSound = document.getElementById("rise-sound");

  // Seguridad: si no existe overlay o pageContent, abortar y loggear
  if (!overlay || !pageContent) {
    console.warn("Falta #intro-overlay o #page-content en el DOM.");
    return;
  }

  // Asegurar estado inicial del control (si existe)
  if (volumeControl) {
    volumeControl.classList.remove("visible");
    // Evitar que interfiera con la animación inicial
    volumeControl.style.pointerEvents = "auto";
  }

  // Mostrar overlay después de 1s
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

      // Mostrar control de volumen con fade-in si existe
      if (volumeControl) {
        // usar clase para animación CSS
        volumeControl.classList.add("visible");
      }
    }, 6000);
  }, 1000);

  // --- Inicializar slider y sonidos (si existen) ---
  if (popSound) popSound.volume = 0.3;
  if (riseSound) riseSound.volume = 0.3;

  if (volumeSlider) {
    volumeSlider.addEventListener("input", (e) => {
      const vol = parseFloat(e.target.value);
      if (popSound) popSound.volume = vol;
      if (riseSound) riseSound.volume = vol;
    });
  }

  // --- Hacer arrastrable el control SOLO si existe ---
  if (volumeControl) {
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    // Soportar pointer events (mouse + touch) de forma simple
    volumeControl.addEventListener("pointerdown", (e) => {
      isDragging = true;
      // pointer events usan clientX/clientY igual que mouse
      offsetX = e.clientX - volumeControl.offsetLeft;
      offsetY = e.clientY - volumeControl.offsetTop;
      volumeControl.style.transition = "none";
      // capturar el pointer para evitar perder el drag fuera del elemento
      volumeControl.setPointerCapture(e.pointerId);
    });

    window.addEventListener("pointermove", (e) => {
      if (!isDragging) return;
      // limitar para que no se salga demasiado de la ventana (opcional)
      const newLeft = Math.max(6, Math.min(window.innerWidth - volumeControl.offsetWidth - 6, e.clientX - offsetX));
      const newTop  = Math.max(6, Math.min(window.innerHeight - volumeControl.offsetHeight - 6, e.clientY - offsetY));
      volumeControl.style.left = newLeft + "px";
      volumeControl.style.top  = newTop + "px";
      volumeControl.style.bottom = "auto";
    });

    window.addEventListener("pointerup", (e) => {
      if (!isDragging) return;
      isDragging = false;
      volumeControl.style.transition = "opacity 0.6s ease";
      try { volumeControl.releasePointerCapture(e.pointerId); } catch (err) {}
    });
  }
});


//Detectar visibilidad de pagina
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    // La pestaña está oculta → pausar burbujas y sonidos
    clearInterval(bubbleInterval); // ejemplo: detener creación de burbujas
    // Opcional: pausar sonidos
    popSound.pause();
    riseSound.pause();
  } else {
    // La pestaña vuelve a estar visible → reanudar
    iniciarBurbujas(); // tu función que reinicia la animación
  }
});
//// Selecciona todos los enlaces de proyectos
document.querySelectorAll('section#proyectos a').forEach(link => {
  link.addEventListener('click', (e) => {
    // Antes de abrir el link, detener burbujas y sonidos
    detenerBurbujasYSonidos();

    // El navegador igual abrirá el link en otra pestaña por target="_blank"
    // No necesitas hacer nada más aquí
  });
});

/* //
function detenerBurbujasYSonidos() {
  // Detener el intervalo que crea burbujas
  if (typeof bubbleInterval !== "undefined") {
    clearInterval(bubbleInterval);
  }

  // Pausar sonidos
  const popSound = document.getElementById("pop-sound");
  const riseSound = document.getElementById("rise-sound");
  if (popSound) popSound.pause();
  if (riseSound) riseSound.pause();

  // Opcional: limpiar burbujas visibles
  const container = document.querySelector(".bubble-container");
  if (container) container.innerHTML = "";
}

//Reanudar automáticamente al volver a la pestaña
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    // La pestaña vuelve a estar visible → reiniciar burbujas
    iniciarBurbujas();
  }
});

//Función para iniciar burbujas
function iniciarBurbujas() {
  // Reinicia sonidos
  const popSound = document.getElementById("pop-sound");
  const riseSound = document.getElementById("rise-sound");
  if (popSound) popSound.currentTime = 0;
  if (riseSound) riseSound.currentTime = 0;

  // Reinicia animación de burbujas
  bubbleInterval = setInterval(() => {
    crearBurbuja(); // tu función que crea y anima burbujas
  }, 1500);
} */

 /* ---------- Bloque seguro para visibilidad y enlaces (reemplazar aquí) ---------- */
let bubbleInterval = null;
let isBubblesRunning = false; 
/* Variables (no redeclarar si ya existen en otro sitio) */
if (typeof bubbleInterval === "undefined") bubbleInterval = null;
if (typeof isBubblesRunning === "undefined") isBubblesRunning = false;

/* Referencias al DOM: se asignan en load sin redeclarar variables globales */
window.addEventListener("load", () => {
  // Asignar referencias solo si aún no existen
  if (typeof popSound === "undefined" || popSound === null) {
    popSound = document.getElementById("pop-sound");
  }
  if (typeof riseSound === "undefined" || riseSound === null) {
    riseSound = document.getElementById("rise-sound");
  }
  if (typeof bubbleContainer === "undefined" || bubbleContainer === null) {
    bubbleContainer = document.querySelector(".bubble-container");
  }

  // Instalar handlers (seguro si el script se ejecuta varias veces)
  setupVisibilityHandler();
  setupProjectLinks();

  // Iniciar burbujas si la pestaña está visible y el contenedor existe
  if (!document.hidden && bubbleContainer) iniciarBurbujas();
});

/* Manejo de visibilidad (evita duplicados) */
function setupVisibilityHandler() {
  if (window.__visibilityHandlerInstalled) return;
  window.__visibilityHandlerInstalled = true;

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      // Pestaña oculta → detener todo de forma segura
      detenerBurbujasYSonidos();
    } else {
      // Pestaña visible → reanudar solo si el contenedor existe
      if (bubbleContainer) iniciarBurbujas();
    }
  });
}

/* Interceptar clicks en enlaces de proyectos (una sola vez) */
function setupProjectLinks() {
  if (window.__projectLinksHandlerInstalled) return;
  window.__projectLinksHandlerInstalled = true;

  document.querySelectorAll('section#proyectos a').forEach(link => {
    link.addEventListener('click', () => {
      // Antes de abrir la nueva pestaña, detener burbujas y sonidos
      detenerBurbujasYSonidos();
      // No hacemos preventDefault: dejamos que abra target="_blank"
    });
  });
}

/* Detener burbujas y sonidos (versión robusta) */
function detenerBurbujasYSonidos() {
  if (bubbleInterval) {
    clearInterval(bubbleInterval);
    bubbleInterval = null;
  }
  isBubblesRunning = false;

  if (typeof popSound !== "undefined" && popSound) {
    try { popSound.pause(); popSound.currentTime = 0; } catch (e) {}
  }
  if (typeof riseSound !== "undefined" && riseSound) {
    try { riseSound.pause(); riseSound.currentTime = 0; } catch (e) {}
  }

  if (bubbleContainer) bubbleContainer.innerHTML = "";
}

/* Reanudar/iniciar burbujas (asegura un solo intervalo) */
function iniciarBurbujas() {
  if (isBubblesRunning) return;
  if (!bubbleContainer) return; // no iniciar si no hay contenedor

  isBubblesRunning = true;

  if (bubbleInterval) {
    clearInterval(bubbleInterval);
    bubbleInterval = null;
  }

  // Reiniciar audios si existen
  if (typeof popSound !== "undefined" && popSound) try { popSound.currentTime = 0; } catch(e) {}
  if (typeof riseSound !== "undefined" && riseSound) try { riseSound.currentTime = 0; } catch(e) {}

  bubbleInterval = setInterval(() => {
    const maxOnScreen = 12;
    const currentOnScreen = bubbleContainer ? bubbleContainer.children.length : 0;
    if (!bubbleContainer || currentOnScreen < maxOnScreen) {
      spawnBubble();
    }
  }, 1500);
}


