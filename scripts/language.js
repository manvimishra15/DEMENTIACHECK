// scripts/language.js

document.getElementById("submitLanguage").addEventListener("click", function () {
  const naming = document.getElementById("namingInput").value.trim().toLowerCase();
  const sentence = document.getElementById("sentenceInput").value.trim();

  let score = 0;

  if (naming === "apple") score++;
  if (sentence.length >= 5) score++;

  localStorage.setItem("languageScore", score);

  alert(`Language Test Complete! Score: ${score}/2`);
  window.location.href = "executive.html";
});
