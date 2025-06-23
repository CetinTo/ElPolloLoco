/**
 * Event listener for keydown events
 * Handles keyboard input for game controls (arrow keys, space, D key)
 * @listens document#keydown
 */
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

/**
 * Event listener for keyup events
 * Handles keyboard input release for game controls
 * @listens document#keyup
 */
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
 * @param {HTMLElement} button - The button element to setup touch events for
 * @param {string} keyProperty - The keyboard property to control
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
 * Get mobile button elements from the DOM
 * @returns {Object} Object containing references to mobile control buttons
 * @returns {HTMLElement} returns.leftButton - Left movement button
 * @returns {HTMLElement} returns.rightButton - Right movement button
 * @returns {HTMLElement} returns.jumpButton - Jump button
 * @returns {HTMLElement} returns.throwButton - Throw button
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
 * Sets up touch controls for all mobile interface buttons
 */
function mobileButtonTouch() {
    const buttons = getMobileButtons();
    
    setupButtonTouch(buttons.leftButton, 'LEFT');
    setupButtonTouch(buttons.rightButton, 'RIGHT');
    setupButtonTouch(buttons.jumpButton, 'SPACE');
    setupButtonTouch(buttons.throwButton, 'D');
}

/**
 * Event listener for DOM content loaded
 * Initializes mobile touch controls when the page is fully loaded
 * @listens document#DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', () => {
    mobileButtonTouch();
});

