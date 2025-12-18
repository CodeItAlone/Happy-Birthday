let audioContext;
let analyser;
let microphone;
let dataArray;
let listening = false;
let candleBlown = false;

/* Utility */
function hide(id) {
  document.getElementById(id).classList.add('hidden');
}

function show(id) {
  document.getElementById(id).classList.remove('hidden');
}

/* STEP 1 → Reveal */
function revealBirthday() {
  hide('surprise-container');
  show('intro-message');
  startMusic();
  confettiBurst();

  setTimeout(() => {
    hide('intro-message');
    show('cake-section');
    initMicrophone(); // mic starts here
  }, 3500);
}

/* Microphone setup */
async function initMicrophone() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    microphone = audioContext.createMediaStreamSource(stream);

    analyser.fftSize = 256;
    dataArray = new Uint8Array(analyser.frequencyBinCount);

    microphone.connect(analyser);
    listening = true;

    detectBlow();
  } catch (err) {
    console.warn("Microphone access denied");
  }
}

/* Blow detection */
function detectBlow() {
  if (!listening || candleBlown) return;

  analyser.getByteFrequencyData(dataArray);

  let volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

  // Threshold tuned for mobile
  if (volume > 45) {
    extinguishCandle();
    return;
  }

  requestAnimationFrame(detectBlow);
}

/* Candle extinguish */
function extinguishCandle() {
  candleBlown = true;
  listening = false;

  const flame = document.querySelector('.flame');
  flame.classList.add('fade-out');

  confettiBurst();

  setTimeout(() => {
    hide('cake-section');
    show('message-section');

    setTimeout(() => {
      hide('message-section');
      show('final-message');
    }, 3500);
  }, 1200);
}

/* Extras */
function startMusic() {
  const music = document.getElementById('bg-music');
  music.volume = 0.4;
  music.play().catch(() => {});
}

function confettiBurst() {
  confetti({
    particleCount: 160,
    spread: 110,
    origin: { y: 0.7 }
  });
}
