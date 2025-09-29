// vistas.js — COMPLETO
let player = null;
let bubblesStarted = false;
let bubblesInterval = null;

document.addEventListener('DOMContentLoaded', () => {
  // ELEMENTOS PRINCIPALES
  const loginScreen = document.getElementById('login-screen');
  const mainContent = document.getElementById('main-content');
  const loginBtn = document.getElementById('login-btn');
  const openBtn = document.getElementById('open-btn');
  const startScreen = document.getElementById('start-screen');
  const surpriseScreen = document.getElementById('surprise-screen');
  const musicBtn = document.getElementById('music-btn');
  const musicContainer = document.getElementById('music-container');
  const optionsWrap = document.getElementById('options');
  const finalBtn = document.getElementById('final-btn');

  const inputName = document.getElementById('initial');
  const errorEl = document.getElementById('error');

  // CONFIG
  const REQUIRED_NAME = 'beatriz';
  const TOTAL_OPTIONS = 4;
  const visited = new Set();

  // LOGIN
  loginBtn.addEventListener('click', () => {
    const name = inputName.value.trim().toLowerCase();
    if (name === REQUIRED_NAME) {
      loginScreen.classList.add('hidden');
      mainContent.classList.remove('hidden');
      errorEl.textContent = '';
    } else {
      errorEl.textContent = '❌ Clave incorrecta';
    }
  });

  // ABRIR SORPRESA
  openBtn.addEventListener('click', () => {
    startScreen.classList.add('hidden');
    surpriseScreen.classList.remove('hidden');
    startBubbles();
  });

  // YouTube API
  window.onYouTubeIframeAPIReady = function () {
    player = new YT.Player('yt-player', {
      playerVars: {
        controls: 0,
        modestbranding: 1,
        rel: 0,
        loop: 1,
        playlist: '1H6rHMWwCSA'
      }
    });
  };

  // MÚSICA
  musicBtn.addEventListener('click', () => {
    if (musicContainer.classList.contains('hidden')) {
      musicContainer.classList.remove('hidden');
    }

    if (!player || typeof player.getPlayerState !== 'function') {
      musicBtn.textContent = '⏸️ Pausar música';
      const tryPlay = setInterval(() => {
        if (player && player.playVideo) {
          clearInterval(tryPlay);
          player.playVideo();
        }
      }, 300);
      return;
    }

    const state = player.getPlayerState();
    if (state !== YT.PlayerState.PLAYING) {
      player.playVideo();
      musicBtn.textContent = '⏸️ Pausar música';
    } else {
      player.pauseVideo();
      musicBtn.textContent = '🎶 Activar música';
    }
  });

  // OPCIONES -> abrir modal
  const optionButtons = document.querySelectorAll('.option-btn');
  optionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const n = parseInt(btn.dataset.option, 10);
      openModal(n);
    });
  });

  // BOTONES CERRAR MODAL
  const closeButtons = document.querySelectorAll('.close-modal');
  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal');
      if (modal) modal.classList.add('hidden');
    });
  });

  // FUNCIONES MODALES
  function openModal(n) {
    const modal = document.getElementById(`modal-${n}`);
    if (modal) modal.classList.remove('hidden');

    visited.add(n);
    if (visited.size >= TOTAL_OPTIONS) {
      finalBtn.classList.remove('hidden');
      finalBtn.animate(
        [{ transform: 'scale(.95)' }, { transform: 'scale(1.02)' }],
        { duration: 300, iterations: 1 }
      );
    }
  }

  // ----------------- JUEGO DEL CORAZÓN -----------------
  const modalFinal = document.getElementById('modal-final');
  const finalMsg = document.getElementById('final-msg');
  const finalClose = document.getElementById('final-close');
  const heartGame = document.getElementById('game');
  const heartEl = document.getElementById('heart');

  let attempts = 0;
  const maxEscapes = 4;

  // abrir modal final
  finalBtn.addEventListener('click', () => {
    modalFinal.classList.remove('hidden');
    placeHeartCenter();
  });

  // mover corazón aleatoriamente
  function moveHeartRandom() {
    const containerRect = heartGame.getBoundingClientRect();
    const heartRect = heartEl.getBoundingClientRect();

    const maxLeft = containerRect.width - heartRect.width;
    const maxTop = containerRect.height - heartRect.height;

    const left = Math.random() * maxLeft;
    const top = Math.random() * maxTop;

    heartEl.style.left = left + 'px';
    heartEl.style.top = top + 'px';
  }

  // colocar al centro al iniciar
  function placeHeartCenter() {
    attempts = 0;
    finalMsg.textContent = '';
    heartEl.style.display = 'inline-block';
    heartEl.style.left = '50%';
    heartEl.style.top = '50%';
    heartEl.style.transform = 'translate(-50%,-50%)';
    setTimeout(() => (heartEl.style.transform = ''), 100);
  }

  // efecto mensaje final
  function showFinalMessage() {
    const text = '💖 Gracias por aparecer en mi vida Beatriz 💖';
    finalMsg.textContent = '';
    let i = 0;
    const t = setInterval(() => {
      finalMsg.textContent += text[i] || '';
      i++;
      if (i >= text.length) clearInterval(t);
    }, 90);
  }

  // atrapar corazón
  function catchHeart() {
    if (attempts >= maxEscapes) {
      heartEl.style.display = 'none';
      showFinalMessage();
    } else {
      // animación de rebote
      heartEl.animate(
        [{ transform: 'scale(1)' }, { transform: 'scale(0.9)' }, { transform: 'scale(1)' }],
        { duration: 220 }
      );
    }
  }

  // Eventos en PC
  heartEl.addEventListener('mouseenter', () => {
    if (attempts < maxEscapes) {
      moveHeartRandom();
      attempts++;
    }
  });
  heartEl.addEventListener('click', catchHeart);

  // Eventos en móvil
  heartEl.addEventListener(
    'touchstart',
    e => {
      if (attempts < maxEscapes) {
        moveHeartRandom();
        attempts++;
      }
    },
    { passive: true }
  );
  heartEl.addEventListener(
    'touchend',
    e => {
      e.preventDefault();
      catchHeart();
    },
    { passive: false }
  );

  // cerrar modal final
  finalClose.addEventListener('click', () => {
    modalFinal.classList.add('hidden');
    finalMsg.textContent = '';
  });


  // ----------------- BURBUJAS -----------------
  function startBubbles() {
    if (bubblesStarted) return;
    bubblesStarted = true;

    const canvas = document.getElementById('bubbles');
    const ctx = canvas.getContext('2d');

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const bubbles = Array.from({ length: 30 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 6 + 2,
      d: Math.random() * 1 + 0.4
    }));

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(255,255,255,0.45)';
      for (const b of bubbles) {
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      }
      for (const b of bubbles) {
        b.y -= b.d;
        if (b.y < -10) {
          b.y = canvas.height + 10;
          b.x = Math.random() * canvas.width;
        }
      }
    }

    bubblesInterval = setInterval(draw, 30);
  }
});

// Funciones globales (para volver en final-screen si quieres usarlo más adelante)
function goBack() {
  document.getElementById('final-screen').classList.add('hidden');
  document.getElementById('surprise-screen').classList.remove('hidden');
  document.getElementById('options').classList.remove('hidden');
}

function goToStart() {
  document.getElementById('final-screen').classList.add('hidden');
  document.getElementById('surprise-screen').classList.add('hidden');
  document.getElementById('start-screen').classList.remove('hidden');
}
