// scripts/mood.js

document.getElementById("moodForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const q1 = parseInt(document.querySelector('select[name="q1"]').value);
  const q2 = parseInt(document.querySelector('select[name="q2"]').value);

  const moodScore = q1 + q2;
  localStorage.setItem("moodScore", moodScore);

  alert(`Mood survey complete! Total score: ${moodScore}/6`);
  window.location.href = "patterns.html";
});
