const lens = document.querySelector(".glass-lens");
const letters = document.querySelectorAll(".logo span:not(.space)");

let position = -120;

function animateLens() {

    position += 2;

    if (position > 320) {
        position = -120;
    }

    lens.style.left = position + "px";

    letters.forEach(letter => {

        const rect = letter.getBoundingClientRect();

        const logo = document.querySelector(".logo").getBoundingClientRect();

        const x = rect.left - logo.left;

        if (Math.abs(position - x) < 20) {

            letter.style.transform = "scale(1.25) translateY(-2px)";
            letter.style.filter = "brightness(1.5)";

        } else {

            letter.style.transform = "scale(1)";
            letter.style.filter = "brightness(1)";

        }

    });

    requestAnimationFrame(animateLens);

}

animateLens();
