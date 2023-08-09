document.addEventListener("DOMContentLoaded", function () {
    const typingElement = document.querySelector(".typing-animation");
    const text = "Alexander Lemos";
    let index = 0;

    function typeText() {
        if (index < text.length) {
            typingElement.textContent += text[index];
            index++;
            setTimeout(typeText, 100); // Ajusta la velocidad de escritura según tus preferencias
        }
    }

    typeText();
});
