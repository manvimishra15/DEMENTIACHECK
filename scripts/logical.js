const input = document.getElementById("logicalAnswer");
const submitBtn = document.getElementById("submitLogical");

submitBtn.addEventListener("click", () => {
  const userAnswer = parseInt(input.value);
  const correctAnswer = 32;

  if (userAnswer === correctAnswer) {
    alert("✅ Correct! You have strong reasoning skills.");
  } else {
    alert("❌ Incorrect! The correct answer is 32.");
  }

  window.location.href = "reaction.html";
});
