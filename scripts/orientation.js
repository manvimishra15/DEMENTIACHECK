document.getElementById("orientationForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let score = 0;
    let total = 5;
    let currentDate = new Date();

    // Q1 - Date
    let dateAnswer = document.getElementById("q1").value;
    let today = currentDate.toISOString().split("T")[0];
    if (dateAnswer === today) score++;

    // Q2 - Time (approx check within 1 hour)
    let timeAnswer = document.getElementById("q2").value;
    if (timeAnswer) {
        let [hours, minutes] = timeAnswer.split(":").map(Number);
        let currentHours = currentDate.getHours();
        if (Math.abs(hours - currentHours) <= 1) score++;
    }

    // Q3 - City (not strict, just checks if entered something)
    let cityAnswer = document.getElementById("q3").value.trim();
    if (cityAnswer.length > 0) score++;

    // Q4 - Season
    let seasonAnswer = document.getElementById("q4").value;
    if (seasonAnswer) score++;

    // Q5 - Day of week
    let dayAnswer = document.getElementById("q5").value;
    let days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    if (dayAnswer === days[currentDate.getDay()]) score++;

    // Result
    let resultBox = document.getElementById("result");
    resultBox.style.display = "block";
    if (score === total) {
        resultBox.style.background = "#d4edda";
        resultBox.style.color = "#155724";
        resultBox.textContent = `Perfect! 🎉 You scored ${score}/${total}`;
    } else {
        resultBox.style.background = "#f8d7da";
        resultBox.style.color = "#721c24";
        resultBox.textContent = `You scored ${score}/${total}. Keep practicing!`;
    }
});
