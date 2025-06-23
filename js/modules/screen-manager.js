/**
 * Screen and menu management module
 * Handles all screen transitions, menu states, and UI visibility
 */

/**
 * Current screen state
 * @type {string}
 */
let currentScreen = 'main-menu';

/**
 * Reset finale screen to default state
 */
function resetFinaleScreen() {
    const finaleScreen = document.getElementById('finale-screen');
    if (finaleScreen) {
        finaleScreen.style.display = 'none';
        finaleScreen.className = 'finale-screen';
        const endTextDiv = finaleScreen.querySelector('.end-text');
        if (endTextDiv) {
            endTextDiv.innerHTML = '';
        }
    }
}

/**
 * Get menu screen elements
 * @returns {Object} - Object containing menu elements
 */
function getMenuElements() {
    return {
        finaleScreen: document.getElementById('finale-screen'),
        gameArea: document.getElementById('game-area'),
        mainMenu: document.getElementById('main-menu'),
        navPanel: document.getElementById('navigation-panel'),
        gameControls: document.getElementById('game-controls')
    };
}

/**
 * Update menu visibility based on elements object
 * @param {Object} elements - Menu elements object
 */
function updateMenuVisibility(elements) {
    if (elements.finaleScreen) elements.finaleScreen.style.display = 'none';
    if (elements.gameArea) elements.gameArea.style.display = 'none';
    if (elements.mainMenu) elements.mainMenu.style.display = 'flex';
    if (elements.navPanel) elements.navPanel.style.display = 'flex';
    if (elements.gameControls) elements.gameControls.style.display = 'none';
}

/**
 * Show main menu screen
 */
function showMenu() {
    if (typeof stopGameForMenu === 'function') {
        stopGameForMenu();
    }
    resetFinaleScreen();
    hideAllOverlayPanels();
    window.currentScreen = 'main-menu';
    const elements = getMenuElements();
    updateMenuVisibility(elements);
}

/**
 * Hide all overlay panels (controls, settings, story)
 */
function hideAllOverlayPanels() {
    const panels = ['keys-info', 'config-panel', 'lore-panel'];
    panels.forEach(panelId => {
        const panel = document.getElementById(panelId);
        if (panel) {
            panel.style.display = 'none';
        }
    });
}

/**
 * Handle game loss scenario
 * @param {HTMLElement} endScreen - End screen element
 */
function handleGameLoss(endScreen) {
    endScreen.classList.add('game-lost-screen');
    if (typeof gameLostSound === 'function') {
        gameLostSound();
    }
}

/**
 * Handle game won scenario
 * @param {HTMLElement} endScreen - End screen element
 */
function handleGameWon(endScreen) {
    endScreen.classList.add('game-won-screen');
    if (typeof gameWonSound === 'function') {
        gameWonSound();
    }
}

/**
 * Show end screen based on game outcome
 */
function showEndScreen() {
    const endScreen = document.getElementById('finale-screen');
    const gameArea = document.getElementById('game-area');
    
    if (endScreen && gameArea) {
        gameArea.style.display = 'none';
        endScreen.style.display = 'flex';
        
        if (world && world.gameManager) {
            if (world.gameManager.isEndbossDefeated()) {
                handleGameWon(endScreen);
            } else if (world.gameManager.isCharacterDead()) {
                handleGameLoss(endScreen);
            }
        }
    }
    
    if (typeof stopAllEndSounds === 'function') {
        stopAllEndSounds();
    }
}

/**
 * Return to main menu
 */
function returnToMenu() {
    if (typeof prepareRestart === 'function') {
        prepareRestart();
    }
    showMenu();
}

/**
 * Open controls screen
 */
function openControls() {
    document.getElementById('keys-info').style.display = 'block';
}

/**
 * Close controls screen
 */
function closeControls() {
    document.getElementById('keys-info').style.display = 'none';
}

/**
 * Open settings screen
 */
function openSettings() {
    document.getElementById('config-panel').style.display = 'block';
}

/**
 * Close settings screen
 */
function closeSettings() {
    document.getElementById('config-panel').style.display = 'none';
}

/**
 * Open story screen
 */
function openStory() {
    document.getElementById('lore-panel').style.display = 'block';
}

/**
 * Close story screen
 */
function closeStory() {
    document.getElementById('lore-panel').style.display = 'none';
}

/**
 * Toggle fullscreen mode
 */
function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().then(() => {
            handleFullscreenChange();
        }).catch(err => {
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen().then(() => {
                handleFullscreenChange();
            }).catch(err => {
            });
        }
    }
}

/**
 * Handle fullscreen change events
 */
function handleFullscreenChange() {
    const fullscreenButton = document.getElementById('fullscreen-btn');
    const fullscreenIcon = document.getElementById('fullscreen-icon');
    
    if (document.fullscreenElement) {
        if (fullscreenButton) fullscreenButton.innerText = 'Exit Fullscreen';
        if (fullscreenIcon) fullscreenIcon.src = './img/12_icons/FULLSCREEN_OFF_icon.png';
    } else {
        if (fullscreenButton) fullscreenButton.innerText = 'Fullscreen';
        if (fullscreenIcon) fullscreenIcon.src = './img/12_icons/FULLSCREEN_ON_icon.png';
    }
}

/**
 * Check if device is in portrait mode
 * @returns {boolean} - True if in portrait mode
 */
function isPortraitMode() {
    return window.innerHeight > window.innerWidth;
}

/**
 * Show rotate screen overlay
 */
function showRotateScreen() {
    const rotateScreen = document.getElementById('rotate-screen');
    if (rotateScreen) {
        rotateScreen.style.display = 'flex';
    }
}

/**
 * Hide rotate screen overlay
 */
function hideRotateScreen() {
    const rotateScreen = document.getElementById('rotate-screen');
    if (rotateScreen) {
        rotateScreen.style.display = 'none';
    }
}

/**
 * Handle orientation change
 */
function handleOrientationChange() {
    setTimeout(() => {
        if (isPortraitMode()) {
            showRotateScreen();
            hideMobileButtons();
        } else {
            hideRotateScreen();
            showMobileButtons();
        }
    }, 100);
}

/**
 * Hide all screens temporarily
 */
function hideScreens() {
    const screens = ['main-menu', 'game-area', 'controls-screen', 'settings-screen', 'story-screen'];
    screens.forEach(screenId => {
        const screen = document.getElementById(screenId);
        if (screen) screen.style.display = 'none';
    });
}

/**
 * Toggle rotate screen based on orientation
 */
function toggleRotateScreen() {
    if (window.innerWidth <= 768) {
        handleOrientationChange();
        window.addEventListener('orientationchange', handleOrientationChange);
        window.addEventListener('resize', handleOrientationChange);
    }
}

window.currentScreen = currentScreen;
window.returnToMenu = returnToMenu;
window.showMenu = showMenu;
window.getMenuElements = getMenuElements;
window.updateMenuVisibility = updateMenuVisibility;
window.resetFinaleScreen = resetFinaleScreen;
window.showEndScreen = showEndScreen;
window.hideAllOverlayPanels = hideAllOverlayPanels;
window.handleGameLoss = handleGameLoss;
window.handleGameWon = handleGameWon;
window.openControls = openControls;
window.closeControls = closeControls;
window.openSettings = openSettings;
window.closeSettings = closeSettings;
window.openStory = openStory;
window.closeStory = closeStory;
window.toggleFullScreen = toggleFullScreen;
window.handleFullscreenChange = handleFullscreenChange;
window.isPortraitMode = isPortraitMode;
window.showRotateScreen = showRotateScreen;
window.hideRotateScreen = hideRotateScreen;
window.handleOrientationChange = handleOrientationChange;
window.hideScreens = hideScreens;
window.toggleRotateScreen = toggleRotateScreen; 