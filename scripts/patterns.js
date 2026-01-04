// scripts/patterns.js

document.addEventListener("DOMContentLoaded", () => {
  const tests = [
    "memoryScore",
    "visualScore",
    "orientationScore",
    "attentionScore",
    "languageScore",
    "executiveScore",
    "moodScore"
  ];

  const labels = [
    "Memory",
    "Visual",
    "Orientation",
    "Attention",
    "Language",
    "Executive",
    "Mood"
  ];

  const scores = tests.map((key) => parseInt(localStorage.getItem(key)) || 0);

  // Display numerical summary
  const summaryDiv = document.getElementById("scoreSummary");
  summaryDiv.innerHTML = labels.map((label, i) => `
    <p><strong>${label}</strong>: ${scores[i]}</p>
  `).join("");

  // Render chart
  const ctx = document.getElementById("chartCanvas").getContext("2d");
  new Chart(ctx, {
    type: "radar",
    data: {
      labels,
      datasets: [{
        label: "Your Scores",
        data: scores,
        fill: true,
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgb(54, 162, 235)",
        pointBackgroundColor: "rgb(54, 162, 235)"
      }]
    },
    options: {
      responsive: true,
      scales: {
        r: {
          suggestedMin: 0,
          suggestedMax: 6
        }
      }
    }
  });
});
