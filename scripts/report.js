// scripts/report.js

document.addEventListener("DOMContentLoaded", () => {
  const reportDiv = document.getElementById("reportContent");

  const testKeys = {
    memoryScore: "Memory",
    visualScore: "Visual-Spatial",
    orientationScore: "Orientation",
    attentionScore: "Attention",
    languageScore: "Language",
    executiveScore: "Executive Function",
    moodScore: "Mood"
  };

  const summary = [];

  Object.entries(testKeys).forEach(([key, label]) => {
    const score = parseInt(localStorage.getItem(key)) || 0;
    let remark = "";

    if (score >= 5) remark = "Excellent";
    else if (score >= 3) remark = "Average";
    else remark = "Needs Improvement";

    summary.push(`<li><strong>${label}</strong>: ${score}/6 → <em>${remark}</em></li>`);
  });

  const total = Object.keys(testKeys).reduce((sum, key) => {
    return sum + (parseInt(localStorage.getItem(key)) || 0);
  }, 0);

  const overallRemark = total >= 35 ? "High Cognitive Function" :
                        total >= 20 ? "Moderate Cognitive Performance" :
                        "Cognitive Areas Need Attention";

  reportDiv.innerHTML = `
    <h2>Final Summary</h2>
    <ul class="summary-list">
      ${summary.join("")}
    </ul>
    <hr>
    <h3>Total Score: ${total}/42</h3>
    <p><strong>Overall Remark:</strong> ${overallRemark}</p>
    <p class="small">Note: This is a basic cognitive aid, not a diagnostic tool.</p>
  `;
});
