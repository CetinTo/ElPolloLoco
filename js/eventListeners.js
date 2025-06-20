
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
 * Setup touch events for a specific button
 */
function setupButtonTouch(button, keyProperty) {
    if (button) {
        button.addEventListener("touchstart", (e) => {
            e.preventDefault();
            keyboard[keyProperty] = true;
        });

        button.addEventListener("touchend", (e) => {
            e.preventDefault();
            keyboard[keyProperty] = false;
        });
    }
}

/**
 * Get mobile button elements
 */
function getMobileButtons() {
    return {
        leftButton: document.getElementById("touch-left"),
        rightButton: document.getElementById("touch-right"),
        jumpButton: document.getElementById("touch-jump"),
        throwButton: document.getElementById("touch-throw")
    };
}

/**
 * Handles touch events for mobile buttons
 */
function mobileButtonTouch() {
    const buttons = getMobileButtons();
    
    setupButtonTouch(buttons.leftButton, 'LEFT');
    setupButtonTouch(buttons.rightButton, 'RIGHT');
    setupButtonTouch(buttons.jumpButton, 'SPACE');
    setupButtonTouch(buttons.throwButton, 'D');
}


document.addEventListener('DOMContentLoaded', () => {
    mobileButtonTouch();
});

