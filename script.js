// ================== الإعدادات (غيّريها براحتك) ==================

// اليوم والشهر المميز
const CORRECT_DAY = 13;
const CORRECT_MONTH = 12;

// الرسالة
const loveLetterText = `حبيبتي...
النهارده يوم مميز، لأنه يوم ميلادك انتِ.
كل ما بيعدي وقت وانا حاسس إني أسعد وأنا جنبك.
ضحكتك بتنور يومي، ووجودك بيريحني.
يارب دايمًا أشوفك مبسوطة وكل أحلامك تتحقق.
كل سنة وانتِ أحلى حاجة حصلت في حياتي 💕`;

// الصور والكلام اللي تحتها (ضيف أو امسح براحتك)
const photos = [
  { src: "images/1.jpg", text: "ياختي حلوه سكرر 🙈💖" },
  { src: "images/2.jpg", text: "يلهوي علي الضحكه ياناسسسس🥹🥹💖" },
  { src: "images/3.jpg", text: "اقدر علي اي حاجه في الدنيا الا عيونك 🥲🥲💖" },
  { src: "images/4.jpg", text: "أجمل ذكرياتنا مع بعض 💖" }
];

// ================== قفل وفتح السكرول ==================
let locked = false;

function lockScroll() {
  locked = true;
  document.documentElement.classList.add("locked");
  document.body.classList.add("locked");
}

function unlockScroll() {
  locked = false;
  document.documentElement.classList.remove("locked");
  document.body.classList.remove("locked");
}

window.addEventListener("touchmove", function (e) {
  if (locked) e.preventDefault();
}, { passive: false });

window.addEventListener("wheel", function (e) {
  if (locked) e.preventDefault();
}, { passive: false });

window.addEventListener("keydown", function (e) {
  const keys = ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "End", "Home", " "];
  if (locked && keys.includes(e.key)) e.preventDefault();
});

// ================== شاشة الدخول ==================
const dayInput = document.getElementById("day-input");
const monthInput = document.getElementById("month-input");

dayInput.addEventListener("input", function () {
  dayInput.value = dayInput.value.replace(/\D/g, "");
  if (dayInput.value.length === 2) monthInput.focus();
});

monthInput.addEventListener("input", function () {
  monthInput.value = monthInput.value.replace(/\D/g, "");
});

monthInput.addEventListener("keydown", function (e) {
  if (e.key === "Backspace" && monthInput.value === "") dayInput.focus();
  if (e.key === "Enter") checkDate();
});

dayInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") checkDate();
});

function checkDate() {
  const d = parseInt(dayInput.value, 10);
  const m = parseInt(monthInput.value, 10);
  const errorMsg = document.getElementById("error-msg");
  const box = document.getElementById("date-inputs");

  if (d === CORRECT_DAY && m === CORRECT_MONTH) {
    document.getElementById("login-screen").classList.add("hidden");
    document.getElementById("main-page").classList.remove("hidden");
    window.scrollTo(0, 0);
  } else {
    errorMsg.textContent = "غلط ياروحي جربي تاني 💖";
    box.classList.remove("shake");
    void box.offsetWidth;
    box.classList.add("shake");
  }
}

// ================== الصور ==================
const gallery = document.getElementById("gallery");

photos.forEach(function (p) {
  const fig = document.createElement("figure");
  fig.className = "memory reveal";
  fig.innerHTML =
    '<div class="photo-frame"><img src="' + p.src + '" alt="ذكرى" loading="lazy"></div>' +
    '<figcaption class="caption">' + p.text + '</figcaption>';
  fig.querySelector("img").addEventListener("click", function () {
    openLightbox(p.src);
  });
  gallery.appendChild(fig);
});

// ================== ظهور العناصر واحدة واحدة ==================
const observer = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll(".reveal").forEach(function (el) {
  observer.observe(el);
});

// ================== كارت الموسيقى ==================
const song = document.getElementById("song");
const playBtn = document.getElementById("play-btn");
const disc = document.getElementById("disc");
const seek = document.getElementById("seek");
const timeEl = document.getElementById("time");
const durationEl = document.getElementById("duration");
let seeking = false;

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return m + ":" + (sec < 10 ? "0" : "") + sec;
}

function setFill() {
  seek.style.setProperty("--fill", seek.value + "%");
}

function togglePlay() {
  if (song.paused) {
    song.play().then(function () {
      playBtn.textContent = "⏸";
      disc.classList.add("spinning");
    }).catch(function () {
      timeEl.textContent = "❌";
    });
  } else {
    song.pause();
    playBtn.textContent = "▶";
    disc.classList.remove("spinning");
  }
}

song.addEventListener("loadedmetadata", function () {
  durationEl.textContent = formatTime(song.duration);
});

song.addEventListener("timeupdate", function () {
  if (!song.duration || seeking) return;
  seek.value = (song.currentTime / song.duration) * 100;
  setFill();
  timeEl.textContent = formatTime(song.currentTime);
});

seek.addEventListener("input", function () {
  seeking = true;
  setFill();
  if (song.duration) {
    timeEl.textContent = formatTime((seek.value / 100) * song.duration);
  }
});

seek.addEventListener("change", function () {
  if (song.duration) {
    song.currentTime = (seek.value / 100) * song.duration;
  }
  seeking = false;
});

song.addEventListener("ended", function () {
  playBtn.textContent = "▶";
  disc.classList.remove("spinning");
  seek.value = 0;
  setFill();
  timeEl.textContent = "0:00";
});

// ================== فتح الرسالة وكتابتها ==================
function openLetter() {
  document.getElementById("open-letter-wrap").classList.add("hidden");
  document.getElementById("letter-section").classList.remove("hidden");
  lockScroll();
  startTypewriter();
}

function startTypewriter() {
  const el = document.getElementById("love-letter");
  let i = 0;
  el.textContent = "";

  function type() {
    if (i < loveLetterText.length) {
      el.textContent += loveLetterText.charAt(i);
      i++;
      if (i % 8 === 0) {
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" });
      }
      setTimeout(type, 35);
    } else {
      finishLetter();
    }
  }
  type();
}

function finishLetter() {
  document.getElementById("final").classList.remove("hidden");
  unlockScroll();
  window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
}

// ================== القلوب والنجوم ==================
function createHeart() {
  const heart = document.createElement("div");
  heart.classList.add("heart");
  heart.textContent = "❤";
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.fontSize = 15 + Math.random() * 20 + "px";
  heart.style.animationDuration = 4 + Math.random() * 4 + "s";
  document.getElementById("hearts-bg").appendChild(heart);
  setTimeout(function () { heart.remove(); }, 8000);
}

setInterval(createHeart, 400);

function createStars() {
  const container = document.getElementById("stars-bg");
  for (let i = 0; i < 60; i++) {
    const s = document.createElement("span");
    s.className = "star";
    s.textContent = "✦";
    s.style.left = Math.random() * 100 + "%";
    s.style.top = Math.random() * 100 + "%";
    s.style.fontSize = 8 + Math.random() * 14 + "px";
    s.style.animationDuration = 2 + Math.random() * 3 + "s";
    s.style.animationDelay = Math.random() * 3 + "s";
    container.appendChild(s);
  }
}

createStars();

// ================== الزوم على الصورة ==================
let zoom = 1;
let posX = 0, posY = 0;
let dragging = false;
let startX = 0, startY = 0;

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxArea = document.getElementById("lightbox-area");

function applyTransform() {
  lightboxImg.style.transform =
    "translate(" + posX + "px, " + posY + "px) scale(" + zoom + ")";
}

function openLightbox(src) {
  lightboxImg.src = src;
  resetZoom();
  lightbox.classList.remove("hidden");
}

function closeLightbox() {
  lightbox.classList.add("hidden");
}

function zoomIn() {
  zoom = Math.min(zoom + 0.5, 5);
  applyTransform();
}

function zoomOut() {
  zoom = Math.max(zoom - 0.5, 1);
  if (zoom === 1) { posX = 0; posY = 0; }
  applyTransform();
}

function resetZoom() {
  zoom = 1; posX = 0; posY = 0;
  applyTransform();
}

lightboxArea.addEventListener("wheel", function (e) {
  e.preventDefault();
  if (e.deltaY < 0) zoomIn(); else zoomOut();
}, { passive: false });

lightboxImg.addEventListener("mousedown", function (e) {
  if (zoom === 1) return;
  dragging = true;
  startX = e.clientX - posX;
  startY = e.clientY - posY;
  lightboxImg.classList.add("dragging");
});

window.addEventListener("mousemove", function (e) {
  if (!dragging) return;
  posX = e.clientX - startX;
  posY = e.clientY - startY;
  applyTransform();
});

window.addEventListener("mouseup", function () {
  dragging = false;
  lightboxImg.classList.remove("dragging");
});

let lastDist = 0;

lightboxArea.addEventListener("touchstart", function (e) {
  if (e.touches.length === 1 && zoom > 1) {
    dragging = true;
    startX = e.touches[0].clientX - posX;
    startY = e.touches[0].clientY - posY;
  } else if (e.touches.length === 2) {
    dragging = false;
    lastDist = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
  }
}, { passive: true });

lightboxArea.addEventListener("touchmove", function (e) {
  if (e.touches.length === 2) {
    const dist = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
    zoom = Math.min(Math.max(zoom * (dist / lastDist), 1), 5);
    lastDist = dist;
    if (zoom === 1) { posX = 0; posY = 0; }
    applyTransform();
  } else if (e.touches.length === 1 && dragging) {
    posX = e.touches[0].clientX - startX;
    posY = e.touches[0].clientY - startY;
    applyTransform();
  }
}, { passive: true });

lightboxArea.addEventListener("touchend", function () {
  dragging = false;
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") closeLightbox();
});
