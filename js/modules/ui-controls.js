/**
 * UI controls and mobile interface management module
 * Handles mobile buttons, touch controls, and UI initialization
 */

/**
 * Initialize UI components and controls
 */
function initializeUI() {
    toggleRotateScreen();
    mobileButtonTouch();
    toggleIngameMenu();
    toggleMobileButtonContainer();
    if (typeof muteSounds === 'function') {
        muteSounds();
    }
}

/**
 * Stop game and music when returning to menu
 */
function stopGameForMenu() {
    if (gameActive) {
        if (typeof stopBackgroundMusic === 'function') {
            stopBackgroundMusic();
        }
        gameActive = false;
    }
}

/**
 * Show mobile control buttons
 */
function showMobileButtons() {
    const mobileButtonContainer = document.getElementById('mobile-button-container');
    if (mobileButtonContainer && window.innerWidth <= 768 && !isPortraitMode()) {
        mobileButtonContainer.style.display = 'flex';
    }
}

/**
 * Hide mobile control buttons
 */
function hideMobileButtons() {
    const mobileButtonContainer = document.getElementById('mobile-button-container');
    if (mobileButtonContainer) {
        mobileButtonContainer.style.display = 'none';
    }
}

/**
 * Toggle mobile button container visibility
 */
function toggleMobileButtonContainer() {
    if (window.innerWidth <= 768) {
        if (isPortraitMode()) {
            hideMobileButtons();
        } else {
            showMobileButtons();
        }
    } else {
        hideMobileButtons();
    }
}

/**
 * Toggle ingame menu visibility
 */
function toggleIngameMenu() {
    const ingameMenu = document.getElementById('ingame-menu');
    if (ingameMenu) {
        const isVisible = ingameMenu.style.display === 'block';
        ingameMenu.style.display = isVisible ? 'none' : 'block';
    }
}

/**
 * Mobile button touch functionality
 */
function mobileButtonTouch() {
    const buttons = getMobileButtons();
    
    Object.keys(buttons).forEach(key => {
        const button = buttons[key];
        if (button) {
            setupButtonTouch(button, key);
        }
    });
}

/**
 * Set up touch events for a mobile button
 * @param {HTMLElement} button - Button element
 * @param {string} keyProperty - Keyboard property name
 */
function setupButtonTouch(button, keyProperty) {
    button.addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard[keyProperty] = true;
    });
    
    button.addEventListener('touchend', (e) => {
        e.preventDefault();
        keyboard[keyProperty] = false;
    });
    
    button.addEventListener('mousedown', (e) => {
        e.preventDefault();
        keyboard[keyProperty] = true;
    });
    
    button.addEventListener('mouseup', (e) => {
        e.preventDefault();
        keyboard[keyProperty] = false;
    });
}

/**
 * Get mobile button elements
 * @returns {Object} - Object containing mobile button elements
 */
function getMobileButtons() {
    return {
        LEFT: document.getElementById('mobile-btn-left'),
        RIGHT: document.getElementById('mobile-btn-right'),
        SPACE: document.getElementById('mobile-btn-jump'),
        D: document.getElementById('mobile-btn-throw')
    };
}


window.initializeUI = initializeUI;
window.stopGameForMenu = stopGameForMenu;
window.showMobileButtons = showMobileButtons;
window.hideMobileButtons = hideMobileButtons;
window.toggleMobileButtonContainer = toggleMobileButtonContainer; 