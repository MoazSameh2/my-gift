const CORRECT_PASSWORD = "13122008";

const loveLetterText = `حبيبتي...
النهارده يوم مميز، لأنه يوم ميلادك انتِ.
كل ما بيعدي وقت وانا حاسس إني أسعد وأنا جنبك.
ضحكتك بتنور يومي، ووجودك بيريحني.
يارب دايمًا أشوفك مبسوطة وكل أحلامك تتحقق. كل سنة وانتِ أحلى حاجة حصلت في حياتي كل سنه وانتي في حياتي
 كل سنه وانتي مليه الدنيا عليه وماليه عيني
 كل سنه وانتي في حياتي ومفرحاني العمر كلو ياحببتي 💖 
بحبك من كل قلبي، وكل سنة وانتي طيبة يا حياتي.`;

function checkPassword() {
  const input = document.getElementById("password-input").value.trim();
  const errorMsg = document.getElementById("error-msg");

  if (input === CORRECT_PASSWORD) {
    document.getElementById("login-screen").classList.add("hidden");
    document.getElementById("message-screen").classList.remove("hidden");
    startMusic();
    startTypewriter();
  } else {
    errorMsg.textContent = "كلمة السر غلط، جربي تاني 💔";
  }
}

function startTypewriter() {
  const el = document.getElementById("love-letter");
  let i = 0;
  el.textContent = "";
  function type() {
  if (i < loveLetterText.length) {
    el.textContent += loveLetterText.charAt(i);
    i++;
    document.querySelector(".letter-box").scrollTop = document.querySelector(".letter-box").scrollHeight;
    setTimeout(type, 35);
  } else {
    document.getElementById("surprise-btn").classList.remove("hidden");
  }

  }
  type();
}
function showSurprise() {
  document.getElementById("surprise").classList.remove("hidden");
}

// حركة القلوب في الخلفية
function createHeart() {
  const heart = document.createElement("div");
  heart.classList.add("heart");
  heart.textContent = "❤";
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.fontSize = 15 + Math.random() * 20 + "px";
  heart.style.animationDuration = 4 + Math.random() * 4 + "s";
  document.getElementById("hearts-bg").appendChild(heart);
  setTimeout(() => heart.remove(), 8000);
}

setInterval(createHeart, 400);

// السماح بالدخول بالضغط على Enter
document.getElementById("password-input").addEventListener("keypress", function(e) {
  if (e.key === "Enter") checkPassword();
});
// ===== الصور والكلام اللي تحتها =====
// غيّر الأسماء والكلام زي ما تحب، وضيف أو امسح براحتك
const photos = [
  { src: "images/1.jpg", text: "أول صورة لينا 💕 اكتب هنا أي كلام تحبه" },
  { src: "images/2.jpg", text: "اليوم ده مبنساهوش أبدًا 🌹" },
  { src: "images/3.jpg", text: "معاكي كل يوم أحلى من اللي قبله ❤" }
];

let currentPhoto = 0;

function showGallery() {
  document.getElementById("message-screen").classList.add("hidden");
  document.getElementById("gallery-screen").classList.remove("hidden");
  currentPhoto = 0;
  updatePhoto();
}

function updatePhoto() {
  const photo = document.getElementById("photo");
  photo.style.animation = "none";
  photo.offsetHeight;
  photo.style.animation = "";
  photo.src = photos[currentPhoto].src;
  document.getElementById("photo-caption").textContent = photos[currentPhoto].text;
  document.getElementById("photo-counter").textContent =
    (currentPhoto + 1) + " / " + photos.length;

  document.getElementById("prev-btn").disabled = (currentPhoto === 0);
  document.getElementById("next-btn").disabled = (currentPhoto === photos.length - 1);
}

function prevPhoto() {
  if (currentPhoto > 0) {
    currentPhoto--;
    updatePhoto();
  }
}

function nextPhoto() {
  if (currentPhoto < photos.length - 1) {
    currentPhoto++;
    updatePhoto();
  }
}
// ===== الزوم =====
let zoom = 1;
let posX = 0, posY = 0;
let dragging = false;
let startX = 0, startY = 0;

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxArea = document.getElementById("lightbox-area");

function applyTransform() {
  lightboxImg.style.transform =
    `translate(${posX}px, ${posY}px) scale(${zoom})`;
}

function openLightbox() {
  lightboxImg.src = photos[currentPhoto].src;
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

// زوم بعجلة الماوس
lightboxArea.addEventListener("wheel", function (e) {
  e.preventDefault();
  if (e.deltaY < 0) zoomIn(); else zoomOut();
}, { passive: false });

// سحب الصورة بالماوس
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

// اللمس على الموبايل: سحب بصباع + زوم بصباعين
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

// إغلاق بزرار Escape
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") closeLightbox();
});
// ===== الموسيقى =====
const music = document.getElementById("bg-music");
const musicBtn = document.getElementById("music-btn");
music.volume = 0.4; // مستوى الصوت من 0 لـ 1

function startMusic() {
  music.play().then(function () {
    musicBtn.classList.remove("hidden");
    musicBtn.textContent = "🔊";
  }).catch(function () {
    // لو المتصفح منع التشغيل، الزرار يظهر عشان تشغلها يدوي
    musicBtn.classList.remove("hidden");
    musicBtn.textContent = "🔇";
  });
}

function toggleMusic() {
  if (music.paused) {
    music.play();
    musicBtn.textContent = "🔊";
  } else {
    music.pause();
    musicBtn.textContent = "🔇";
  }
};