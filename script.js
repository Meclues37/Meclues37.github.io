import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
  runTransaction
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

console.log("Photography portfolio loaded.");

const cards = document.querySelectorAll(".photo-card, .place-card");

cards.forEach(card => {
  card.addEventListener("mouseenter", () => {
    card.style.cursor = "pointer";
  });
});

const firebaseConfig = {
  apiKey: "AIzaSyDxz6MLWVbtuCPnLPDA1V1X9UB-YMb1jx0",
  authDomain: "log1-a334f.firebaseapp.com",
  databaseURL: "https://log1-a334f-default-rtdb.firebaseio.com",
  projectId: "log1-a334f",
  storageBucket: "log1-a334f.firebasestorage.app",
  messagingSenderId: "387877176052",
  appId: "1:387877176052:web:e1b332e96487d59ed8d4a1"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const likeBtn = document.getElementById("likeBtn");
const likeCount = document.getElementById("likeCount");

if (likeBtn && likeCount) {
  const likesRef = ref(db, "portfolioLikes/count");

  onValue(likesRef, (snapshot) => {
    likeCount.textContent = snapshot.val() || 0;
  });

  if (localStorage.getItem("likedPortfolio")) {
    likeBtn.classList.add("liked");
    likeBtn.disabled = true;
  }

  likeBtn.addEventListener("click", () => {
    if (localStorage.getItem("likedPortfolio")) return;

    runTransaction(likesRef, (count) => {
      return (count || 0) + 1;
    });

    localStorage.setItem("likedPortfolio", "true");
    likeBtn.classList.add("liked");
    likeBtn.disabled = true;
  });
}

// LIGHTBOX

const images = document.querySelectorAll(".photo-grid-horizontal img, .photo-grid-vertical img, .cancun-gallery img");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const closeBtn = document.querySelector(".lightbox-close");

images.forEach(img => {
  img.addEventListener("click", () => {
    lightbox.style.display = "flex";
    lightboxImg.src = img.src;
  });
});

closeBtn.addEventListener("click", () => {
  lightbox.style.display = "none";
});

lightbox.addEventListener("click", (e) => {
  if (e.target !== lightboxImg) {
    lightbox.style.display = "none";
  }
});
