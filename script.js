// =============================
// TRASH SORTING GAME SCRIPT
// One item at a time for 7 rounds
// =============================

const allItems = [
  { emoji: "🧃", type: "plastic" },
  { emoji: "🍼", type: "plastic" },
  { emoji: "🥤", type: "plastic" },
  { emoji: "📦", type: "plastic" },
  { emoji: "🍎", type: "organic" },
  { emoji: "🍌", type: "organic" },
  { emoji: "🥕", type: "organic" },
  { emoji: "🍂", type: "organic" },
  { emoji: "🥫", type: "metal" },
  { emoji: "🍴", type: "metal" },
  { emoji: "🥄", type: "metal" },
  { emoji: "⚙️", type: "metal" }
];

let score = 0;
let round = 0;
const totalRounds = 7;
let itemsQueue = [];
let selectedItem = null;

// -----------------------------
// Create random queue of items
// -----------------------------
function makeItemsQueue() {
  let shuffled = [...allItems].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, totalRounds);
}

// -----------------------------
// Render ONE item on screen
// -----------------------------
function renderNextItem() {
  const itemsContainer = document.querySelector(".items");
  itemsContainer.innerHTML = "";

  if (round < itemsQueue.length) {
    const item = itemsQueue[round];
    const div = document.createElement("div");
    div.classList.add("item");
    div.setAttribute("draggable", "true");
    div.setAttribute("data-type", item.type);
    div.textContent = item.emoji;

    // drag events
    div.addEventListener("dragstart", dragStart);
    div.addEventListener("dragend", dragEnd);

    // mobile tap select
    div.addEventListener("click", () => selectThisItem(div));

    itemsContainer.appendChild(div);
  }
}

// -----------------------------
// Helper: select item
// -----------------------------
function selectThisItem(div) {
  document.querySelectorAll(".item").forEach(i => i.classList.remove("selected"));
  div.classList.add("selected");
  selectedItem = div;
}

// -----------------------------
// Drag handlers
// -----------------------------
function dragStart(e) {
  const type = e.target.getAttribute("data-type");
  e.dataTransfer.setData("type", type);
  e.dataTransfer.setData("text/plain", type);
  e.target.classList.add("dragging");
  selectedItem = null;
}

function dragEnd(e) {
  e.target.classList.remove("dragging");
}

// -----------------------------
// Bin handling
// -----------------------------
const bins = document.querySelectorAll(".bin");
bins.forEach(bin => {
  bin.addEventListener("dragover", (e) => e.preventDefault());
  bin.addEventListener("drop", (e) => {
    e.preventDefault();
    const type = (e.dataTransfer.getData("type") || "").toString();
    const draggedItem = document.querySelector(".dragging");
    handlePlacement(bin, draggedItem, type);
  });

  bin.addEventListener("click", () => {
    if (selectedItem) {
      handlePlacement(bin, selectedItem, selectedItem.getAttribute("data-type"));
      selectedItem = null;
    }
  });
});

// -----------------------------
// Placement logic
// -----------------------------
function handlePlacement(bin, item, type) {
  if (!item) return;

  const binType = (bin.dataset.type || "").toLowerCase();
  const itemType = (type || "").toLowerCase();

  if (binType === itemType) {
    score++;
    showPopup("✅ Correct!");
  } else {
    score = Math.max(0, score - 1);
    showPopup("❌ Wrong bin!");
  }

  document.getElementById("score").textContent = `Score: ${score}`;
}

// -----------------------------
// Popup handling
// -----------------------------
function showPopup(message, isGameOver = false) {
  const popup = document.getElementById("popup");
  const popupMessage = document.getElementById("popup-message");
  const popupButtons = popup.querySelector(".popup-buttons");

  popupMessage.textContent = message;
  popupButtons.innerHTML = "";

  if (isGameOver) {
    const homeBtn = document.createElement("button");
    homeBtn.textContent = "🏠 Back to Home";
    homeBtn.onclick = () => (window.location.href = "index.html");
    popupButtons.appendChild(homeBtn);
  } else {
    const okBtn = document.createElement("button");
    okBtn.textContent = "OK";
    okBtn.onclick = closePopup;
    popupButtons.appendChild(okBtn);
  }

  popup.style.display = "flex";
  setTimeout(() => popup.classList.add("show"), 10);
}

function closePopup() {
  const popup = document.getElementById("popup");
  popup.classList.remove("show");

  setTimeout(() => {
    popup.style.display = "none";

    round++;
    if (round < totalRounds) {
      renderNextItem();
    } else {
      showPopup(`🏆 Game Over! Final Score: ${score}`, true);
    }
  }, 300);
}

// -----------------------------
// Init game
// -----------------------------
document.addEventListener("DOMContentLoaded", () => {
  itemsQueue = makeItemsQueue();
  renderNextItem();

  const bins = document.querySelectorAll(".bin");
  bins.forEach(bin => {
    bin.addEventListener("dragover", (e) => e.preventDefault());
    bin.addEventListener("drop", (e) => {
      e.preventDefault();
      const type = (e.dataTransfer.getData("type") || "").toString();
      const draggedItem = document.querySelector(".dragging");
      handlePlacement(bin, draggedItem, type);
    });

    bin.addEventListener("click", () => {
      if (selectedItem) {
        handlePlacement(bin, selectedItem, selectedItem.getAttribute("data-type"));
        selectedItem = null;
      }
    });
  });
});
