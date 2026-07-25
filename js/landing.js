const lens = document.querySelector(".glass-lens");
const logo = document.querySelector(".logo");
const letters = document.querySelectorAll(".logo span:not(.space)");

let position = -80;

function animateLens(){

    position += 1.5;

    if(position > logo.offsetWidth + 80){
        position = -80;
    }

    lens.style.left = position + "px";

    letters.forEach(letter => {

        const center = letter.offsetLeft + (letter.offsetWidth / 2);

        const distance = Math.abs(position - center);

        if(distance < 25){

            const scale = 1.35 - (distance / 25) * 0.35;

            letter.style.transform = `scale(${scale}) translateY(-2px)`;
            letter.style.filter = "brightness(1.6)";

        }else{

            letter.style.transform = "scale(1)";
            letter.style.filter = "brightness(1)";

        }

    });

    requestAnimationFrame(animateLens);

}

animateLens();
