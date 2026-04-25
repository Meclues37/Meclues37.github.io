console.log("Photography portfolio loaded.");

const cards = document.querySelectorAll(".photo-card, .place-card");

cards.forEach(card => {
  card.addEventListener("mouseenter", () => {
    card.style.cursor = "pointer";
  });
});
