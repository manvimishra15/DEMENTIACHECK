// Stroop Test Script - scripts/attention.js

const words = [
  { text: "Red", color: "blue" },
  { text: "Green", color: "red" },
  { text: "Blue", color: "yellow" },
  { text: "Yellow", color: "green" }
];

let currentIndex = 0;
let correct = 0;

const wordElement = document.getElementById("stroop-word");
const buttons = document.querySelectorAll(".color-buttons button");
const nextBtn = document.getElementById("next-stroop");

function displayStroop(index) {
  const item = words[index];
  wordElement.textContent = item.text;
  wordElement.style.color = item.color;
  nextBtn.classList.add("hidden");
}

buttons.forEach(button => {
  button.addEventListener("click", function () {
    const selected = this.getAttribute("data-color");
    if (selected === words[currentIndex].color) {
      correct++;
    }

    nextBtn.classList.remove("hidden");
  });
});

nextBtn.addEventListener("click", () => {
  currentIndex++;
  if (currentIndex < words.length) {
    displayStroop(currentIndex);
  } else {
    alert(`Stroop Test Complete! Score: ${correct}/${words.length}`);
    localStorage.setItem("attentionScore", correct);
    window.location.href = "language.html";
  }
});

displayStroop(currentIndex);
