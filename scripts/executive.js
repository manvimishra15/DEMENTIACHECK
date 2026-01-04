// scripts/executive.js

document.getElementById("submitExecutive").addEventListener("click", function () {
  const seriesAnswer = document.getElementById("seriesInput").value.trim();
  const oddShape = document.getElementById("oddShapeSelect").value;

  let score = 0;

  if (seriesAnswer === "10") score++;
  if (oddShape === "3") score++;

  localStorage.setItem("executiveScore", score);

  alert(`Executive Function Test Complete! Score: ${score}/2`);
  window.location.href = "mood.html";
});
