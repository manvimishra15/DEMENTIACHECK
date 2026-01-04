console.log("MindCare homepage loaded.");

// Example: scroll reveal animation
document.addEventListener("DOMContentLoaded", () => {
    const elements = document.querySelectorAll(".card, ol li");
    elements.forEach((el, index) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(20px)";
        setTimeout(() => {
            el.style.transition = "all 0.6s ease";
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
        }, index * 100);
    });
});
