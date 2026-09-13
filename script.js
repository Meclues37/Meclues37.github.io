import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
  runTransaction
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

document.addEventListener("DOMContentLoaded", () => {
  console.log("Photography portfolio loaded.");

  /* MOBILE NAVIGATION */
  const navbar = document.querySelector(".navbar");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelectorAll("#primary-nav a");

  if (navbar && navToggle) {
    navToggle.addEventListener("click", () => {
      const isOpen = navbar.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    });

    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        navbar.classList.remove("nav-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Open navigation");
      });
    });
  }
  /* CARD CURSOR */
  const cards = document.querySelectorAll(".photo-card, .place-card");

  cards.forEach(card => {
    card.addEventListener("mouseenter", () => {
      card.style.cursor = "pointer";
    });
  });

  /* FEATURED EDITORIAL SPREAD */
  const editorial = document.getElementById("featuredEditorial");
  if (editorial && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const sets = [
      ["yosemite_revised_1.jpg", "tahoe1.JPG", "JNP1.JPG"],
      ["yellowstone/yellowstone-4931.jpg", "spain-portugal/spain-portugal-hero-casa-batllo-courtyard.jpg", "cruise-lighthouse.jpg"],
      ["guilin/guilin-da-mian-shan-hero.jpg", "yellowstone/yellowstone-5305-2.jpg", "yunnan1.jpg"]
    ].map(set => set.map(path => `https://meclues37-photo-1447476321.cos.ap-hongkong.myqcloud.com/images/${path}`));
    const slots = ["main", "side-one", "side-two"].map(name => editorial.querySelector(`[data-editorial-image="${name}"]`));
    const count = editorial.querySelector(".editorial-count b");
    sets.flat().slice(3).forEach(src => { const preload = new Image(); preload.src = src; });
    let current = 0;
    let paused = false;
    editorial.addEventListener("mouseenter", () => { paused = true; });
    editorial.addEventListener("mouseleave", () => { paused = false; });
    window.setInterval(() => {
      if (paused) return;
      editorial.classList.add("is-transitioning");
      window.setTimeout(() => {
        current = (current + 1) % sets.length;
        slots.forEach((image, index) => { image.src = sets[current][index]; });
        count.textContent = String(current + 1).padStart(2, "0");
        editorial.dataset.layout = current;
        editorial.classList.remove("is-transitioning");
      }, 550);
    }, 8500);
  }

  /* FIREBASE LIKE BUTTON */
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

  /* LIGHTBOX */
 const images = document.querySelectorAll(
  ".photo-section img, .photo-grid-horizontal img, .photo-grid-vertical img, .cancun-gallery img, .loscabos-gallery img"
);
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const closeBtn = document.querySelector(".lightbox-close");

  if (lightbox && lightboxImg && closeBtn) {
    images.forEach(img => {
      img.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        lightbox.style.display = "flex";
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || "Full size photo";
      });
    });

    closeBtn.addEventListener("click", () => {
      lightbox.style.display = "none";
    });

    lightbox.addEventListener("click", (event) => {
      if (event.target !== lightboxImg) {
        lightbox.style.display = "none";
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        lightbox.style.display = "none";
      }
    });
  }
});
