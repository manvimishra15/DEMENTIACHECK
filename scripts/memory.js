document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("startMemoryTest");
  const wordListContainer = document.getElementById("wordList");
  const memoryTestArea = document.getElementById("memoryTestArea");
  const nextBtn = document.getElementById("nextToRecall");
  const recallArea = document.getElementById("recallArea");
  const submitRecall = document.getElementById("submitRecall");
  const recallInput = document.getElementById("recallInput");

  const words = ["Apple", "Chair", "House", "River", "Book", "Flower", "Phone", "Car"];
  let recallTime;

  startBtn.addEventListener("click", () => {
    document.querySelector(".hero").style.display = "none";
    memoryTestArea.style.display = "block";
    wordListContainer.innerHTML = "";
    words.forEach(word => {
      const card = document.createElement("div");
      card.className = "card";
      card.textContent = word;
      wordListContainer.appendChild(card);
    });
    setTimeout(() => {
      wordListContainer.innerHTML = "<p>Time's up! Let's see what you remember.</p>";
      nextBtn.style.display = "inline-block";
    }, 5000);
  });

  nextBtn.addEventListener("click", () => {
    memoryTestArea.style.display = "none";
    recallArea.style.display = "block";
    recallTime = new Date();
  });

  submitRecall.addEventListener("click", () => {
    const answers = recallInput.value.trim().split(/\s+/);
    let score = 0;
    answers.forEach(ans => {
      if (words.includes(ans)) score++;
    });
    alert(`You recalled ${score} out of ${words.length} words.`);
    window.location.href = "visual.html";
  });
});
