
document.addEventListener("keydown", (event) => {
    if (!gameActive) return;
    if (event.code == 'ArrowRight') {
        keyboard.RIGHT = true;
    }
    if (event.code == 'ArrowLeft') {
        keyboard.LEFT = true;
    }
    if (event.code == 'Space') {
        keyboard.SPACE = true;
    }
    if (event.code == 'KeyD') {
        keyboard.D = true;
    }
});

document.addEventListener("keyup", (event) => {
    if (!gameActive) return;
    if (event.code == 'ArrowRight') {
        keyboard.RIGHT = false;
    }
    if (event.code == 'ArrowLeft') {
        keyboard.LEFT = false;
    }
    if (event.code == 'Space') {
        keyboard.SPACE = false;
    }
    if (event.code == 'KeyD') {
        keyboard.D = false;
    }
});

/**
 * Handles touch events for mobile buttons
 */
function mobileButtonTouch() {
    const leftButton = document.getElementById("touch-left");
    const rightButton = document.getElementById("touch-right");
    const jumpButton = document.getElementById("touch-jump");
    const throwButton = document.getElementById("touch-throw");

    if (leftButton) {
        leftButton.addEventListener("touchstart", (e) => {
            e.preventDefault();
            keyboard.LEFT = true;
        });

        leftButton.addEventListener("touchend", (e) => {
            e.preventDefault();
            keyboard.LEFT = false;
        });
    }

    if (rightButton) {
        rightButton.addEventListener("touchstart", (e) => {
            e.preventDefault();
            keyboard.RIGHT = true;
        });

        rightButton.addEventListener("touchend", (e) => {
            e.preventDefault();
            keyboard.RIGHT = false;
        });
    }

    if (jumpButton) {
        jumpButton.addEventListener("touchstart", (e) => {
            e.preventDefault();
            keyboard.SPACE = true;
        });

        jumpButton.addEventListener("touchend", (e) => {
            e.preventDefault();
            keyboard.SPACE = false;
        });
    }

    if (throwButton) {
        throwButton.addEventListener("touchstart", (e) => {
            e.preventDefault();
            keyboard.D = true;
        });

        throwButton.addEventListener("touchend", (e) => {
            e.preventDefault();
            keyboard.D = false;
        });
    }
}


document.addEventListener('DOMContentLoaded', () => {
    mobileButtonTouch();
});

