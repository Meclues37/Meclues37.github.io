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

  /* FEATURED CINEMATIC REEL */
  const reel = document.getElementById("cinematicReel");
  if (reel && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const frames = [
      "yosemite_revised_1.jpg", "yellowstone/yellowstone-4931.jpg",
      "guilin/guilin-da-mian-shan-hero.jpg", "spain-portugal/spain-portugal-hero-casa-batllo-courtyard.jpg",
      "yellowstone/yellowstone-5305-2.jpg", "JNP1.JPG", "tahoe1.JPG", "Tibet1.jpg",
      "yunnan1.jpg", "cruise-lighthouse.jpg"
    ].map(path => `https://meclues37-photo-1447476321.cos.ap-hongkong.myqcloud.com/images/${path}`);
    const image = reel.querySelector(".cinematic-reel__image");
    const count = reel.querySelector(".cinematic-reel__count b");
    frames.slice(1).forEach(src => { const preload = new Image(); preload.src = src; });
    let current = 0;
    let paused = false;
    reel.addEventListener("mouseenter", () => { paused = true; });
    reel.addEventListener("mouseleave", () => { paused = false; });
    window.setInterval(() => {
      if (paused) return;
      reel.classList.add("is-transitioning");
      window.setTimeout(() => {
        current = (current + 1) % frames.length;
        image.src = frames[current];
        count.textContent = String(current + 1).padStart(2, "0");
        reel.classList.remove("is-transitioning");
      }, 750);
    }, 7000);
  }

  /* TRAVEL MAP */
  const mapElement = document.getElementById("travelMap");
  if (mapElement && window.L) {
    const map = L.map(mapElement, { scrollWheelZoom: false }).setView([25, -15], 2);
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19
    }).addTo(map);

    const pin = L.divIcon({
      className: "",
      html: '<span style="display:block;width:13px;height:13px;border:2px solid #17130e;border-radius:50%;background:#e3b768;box-shadow:0 0 0 2px rgba(227,183,104,.35)"></span>',
      iconSize: [13, 13],
      iconAnchor: [6, 6]
    });
    const destinations = [
      [21.1619, -86.8515, "Cancún", "Mexico", "cancun.html"],
      [28.1413, 86.8550, "Mount Everest", "Tibet, China", "tibet.html"],
      [25.2742, 110.2905, "Guilin", "Guangxi, China", "guilin.html"],
      [37.8651, -119.5383, "Yosemite", "California, USA", "yosemite.html"],
      [39.0968, -120.0324, "Lake Tahoe", "California / Nevada, USA", "laketahoe.html"],
      [47.6062, -122.3321, "Seattle", "Washington, USA", "seattle.html"],
      [34.1347, -116.3131, "Joshua Tree", "California, USA", "joshuatree.html"],
      [33.6846, -117.8265, "The Great Crossing — start", "Irvine, California", "greatcrossing.html"],
      [40.7128, -74.0060, "The Great Crossing — finish", "New York, USA", "greatcrossing.html"],
      [22.8905, -109.9167, "Los Cabos", "Mexico", "loscabos.html"],
      [25.0000, 101.5000, "Yunnan", "China", "yunnan.html"],
      [40.4168, -3.7038, "Spain & Portugal — start", "Madrid, Spain", "spain-portugal.html"],
      [41.1579, -8.6291, "Spain & Portugal", "Porto, Portugal", "spain-portugal.html"],
      [41.3874, 2.1686, "Spain & Portugal — finish", "Barcelona, Spain", "spain-portugal.html"],
      [44.4280, -110.5885, "Yellowstone", "Wyoming, USA", "yellowstone.html"],
      [43.7904, -110.6818, "Grand Teton", "Wyoming, USA", "yellowstone.html"],
      [32.7157, -117.1611, "San Diego", "California, USA", "sandiego.html"],
      [25.7617, -80.1918, "Caribbean cruise — start", "Miami, Florida", "cruise.html"],
      [25.4205, -79.2698, "Caribbean cruise", "Ocean Cay, The Bahamas", "cruise.html"],
      [39.2904, -76.6122, "Baltimore", "Maryland, USA", "baltimore.html"],
      [38.5655, -78.2936, "Shenandoah", "Old Rag Mountain, Virginia", "baltimore.html"]
    ];
    destinations.forEach(([lat, lng, title, place, page]) => {
      L.marker([lat, lng], { icon: pin })
        .bindPopup(`<strong>${title}</strong>${place}<br><a href="${page}">Open story</a>`)
        .addTo(map);
    });
    L.polyline([[33.6846, -117.8265], [40.7128, -74.0060]], { color: "#e3b768", dashArray: "5 9", weight: 2, opacity: 0.65 }).addTo(map);
    L.polyline([[40.4168, -3.7038], [41.1579, -8.6291], [41.3874, 2.1686]], { color: "#e3b768", dashArray: "5 9", weight: 2, opacity: 0.65 }).addTo(map);
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
