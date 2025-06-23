/**
 * Canvas element for game rendering
 * @type {HTMLCanvasElement}
 */
let canvas;

/**
 * Game world instance
 * @type {World}
 */
let world;

/**
 * Keyboard input handler
 * @type {Keyboard}
 */
let keyboard = new Keyboard();

/**
 * Current screen state
 * @type {string}
 */
let currentScreen = 'main-menu';

/**
 * Game active status
 * @type {boolean}
 */
let gameActive = true;

/**
 * Array to track active intervals
 * @type {Array<number>}
 */
let intervals = [];

/**
 * Array to track active timeouts
 * @type {Array<number>}
 */
let timeouts = [];

/**
 * Reset game
 */
function resetGame() {
    keyboard = new Keyboard();
    intervals = [];
    world = null;
}

/**
 * Get list of critical game images to preload
 */
function getCriticalImages() {
    return [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/5_background/layers/air.png',
        'img/5_background/layers/3_third_layer/1.png',
        'img/5_background/layers/2_second_layer/1.png',
        'img/5_background/layers/1_first_layer/1.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png',
        'img/8_coin/coin_1.png',
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png'
    ];
}

/**
 * Load single image and track progress
 */
function loadSingleImage(src, loadedImages, totalImages, resolve) {
    const img = new Image();
    img.onload = () => handleImageLoad(loadedImages, totalImages, resolve);
    img.onerror = () => handleImageLoad(loadedImages, totalImages, resolve);
    img.src = src;
}

/**
 * Handle individual image load completion
 */
function handleImageLoad(loadedImages, totalImages, resolve) {
    loadedImages.count++;
    if (loadedImages.count === totalImages) {
        resolve();
    }
}

/**
 * Preload all important game images to prevent black screen
 */
function preloadImages() {
    const imagesToPreload = getCriticalImages();
    const loadedImages = { count: 0 };
    const totalImages = imagesToPreload.length;
    return new Promise((resolve) => {
        if (totalImages === 0) {
            resolve();
            return;
        }
        imagesToPreload.forEach(src => {
            loadSingleImage(src, loadedImages, totalImages, resolve);
        });
    });
}

/**
 * Reset finale screen to default state
 */
function resetFinaleScreen() {
    const finaleScreen = document.getElementById('finale-screen');
    if (finaleScreen) {
        finaleScreen.style.display = 'none';
        finaleScreen.className = 'finale-screen';
    }
}

/**
 * Set up canvas for game rendering
 */
function setupCanvas() {
    canvas = document.getElementById('game-canvas');
    if (!canvas) {
        return false;
    }
    canvas.width = 720;
    canvas.height = 480;
    drawCanvasTest();
    return true;
}

/**
 * Draw test content on canvas
 */
function drawCanvasTest() {
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'green';
    ctx.fillRect(10, 10, 100, 100);
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('CANVAS TEST', 20, 50);
}

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
 * Initialize game and set up game world
 */
async function init() {
    resetFinaleScreen();
    gameActive = false;
    clearAllIntervals();
    resetGame();
    gameActive = true;
    await preloadImages();
    initLevel();
    if (!setupCanvas()) {
        return;
    }
    world = new World(canvas, keyboard, level1);
    startGame();
    initializeUI();
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
 * Get menu screen elements
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
 * Update menu screen visibility
 */
function updateMenuVisibility(elements) {
    if (elements.finaleScreen) {
        elements.finaleScreen.style.display = 'none';
        elements.finaleScreen.className = 'finale-screen';
    }
    if (elements.gameArea) {
        elements.gameArea.style.display = 'none';
    }
    if (elements.mainMenu) {
        elements.mainMenu.style.display = 'flex';
    }
    if (elements.navPanel) {
        elements.navPanel.style.display = 'flex';
    }
    if (elements.gameControls) {
        elements.gameControls.style.display = 'none';
    }
}

/**
 * Show main menu
 */
function showMenu() {
    stopGameForMenu();
    const elements = getMenuElements();
    updateMenuVisibility(elements);
}

/**
 * Hide start screen and show game content
 */
function startGame() {
    const mainMenu = document.getElementById('main-menu');
    const gameArea = document.getElementById('game-area');
    const finaleScreen = document.getElementById('finale-screen');
    if (mainMenu) {
        mainMenu.style.display = 'none';
    }
    if (gameArea) {
        gameArea.style.display = 'block';
    }
    if (finaleScreen) {
        finaleScreen.style.display = 'none';
    }
    
    // Start background music only when the actual game starts
    if (typeof playBackgroundMusic === 'function') {
        playBackgroundMusic();
    }
}

/**
 * Handle game loss scenario
 */
function handleGameLoss(endScreen) {
    endScreen.className = 'finale-screen game-lost-screen';
    if (typeof gameLostSound === 'function') {
        gameLostSound();
        setTimeout(() => {
            stopAllEndSounds();
            clearAllIntervals();
        }, 3000);
    }
}

/**
 * Handle game won scenario
 */
function handleGameWon(endScreen) {
    endScreen.className = 'finale-screen game-won-screen';
    if (typeof gameWonSound === 'function') {
        gameWonSound();
        setTimeout(() => {
            stopAllEndSounds();
            clearAllIntervals();
        }, 3000);
    }
}

/**
 * Show end screen with appropriate styling based on game result
 */
function showEndScreen() {
    stopAllGameSounds();
    const endScreen = document.getElementById('finale-screen');
    if (!endScreen) {
        return;
    }
    gameActive = false;
    if (world) {
        world.gameOver = true;
    }
    endScreen.style.display = 'flex';
    if (world && world.character && world.character.energy <= 0) {
        handleGameLoss(endScreen);
    } else {
        handleGameWon(endScreen);
    }
}

/**
 * Stop background music and main audio
 */
function stopBackgroundAudio() {
    if (typeof stopBackgroundMusic === 'function') {
        stopBackgroundMusic();
    }
    if (typeof backgroundMusic !== 'undefined' && backgroundMusic) {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
        backgroundMusic.muted = true;
    }
}

/**
 * Stop character audio sounds
 */
function stopCharacterAudio() {
    if (world && world.character) {
        if (world.character.walking_sound) {
            world.character.walking_sound.pause();
            world.character.walking_sound.currentTime = 0;
            world.character.walking_sound.muted = true;
        }
        if (world.character.hurt_sound) {
            world.character.hurt_sound.pause();
            world.character.hurt_sound.currentTime = 0;
            world.character.hurt_sound.muted = true;
        }
        if (world.character.jumping_sound) {
            world.character.jumping_sound.pause();
            world.character.jumping_sound.currentTime = 0;
            world.character.jumping_sound.muted = true;
        }
    }
}

/**
 * Stop single audio element
 */
function stopSingleAudio(audio) {
    if (audio) {
        audio.pause();
        audio.currentTime = 0;
        audio.muted = true;
    }
}

/**
 * Stop boss audio sounds
 */
function stopBossAudio() {
    if (world && world.level && world.level.endboss) {
        world.level.endboss.forEach((boss) => {
            stopSingleAudio(boss.alert_sound);
            stopSingleAudio(boss.hurt_sound);
            stopSingleAudio(boss.dead_sound);
            stopSingleAudio(boss.attack_sound);
        });
    }
}

/**
 * Stop enemy audio sounds
 */
function stopEnemyAudio() {
    if (world && world.level && world.level.enemies) {
        world.level.enemies.forEach((enemy) => {
            stopSingleAudio(enemy.death_sound);
            stopSingleAudio(enemy.walking_sound);
        });
    }
}

/**
 * Stop throwable object audio sounds
 */
function stopThrowableAudio() {
    if (world && world.throwableObjects) {
        world.throwableObjects.forEach((bottle) => {
            stopSingleAudio(bottle.bottle_shatter_sound);
            stopSingleAudio(bottle.throw_sound);
        });
    }
}

/**
 * Stops all running game sounds completely (except end sounds)
 */
function stopAllGameSounds() {
    stopBackgroundAudio();
    stopCharacterAudio();
    stopBossAudio();
    stopEnemyAudio();
    stopThrowableAudio();
}

/**
 * Stops ALL end sounds (Game Won/Lost) completely
 */
function stopAllEndSounds() {
    if (typeof gameWon !== 'undefined' && gameWon) {
        gameWon.pause();
        gameWon.currentTime = 0;
        gameWon.muted = true;
    }
    if (typeof gameLost !== 'undefined' && gameLost) {
        gameLost.pause();
        gameLost.currentTime = 0;
        gameLost.muted = true;
    }
    const allAudio = document.querySelectorAll('audio');
    allAudio.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
        audio.muted = true;
    });
}

/**
 * Return to main menu
 */
function returnToMenu() {
    gameActive = false;
    clearAllIntervals();
    stopAllGameSounds();
    stopAllEndSounds();
    if (world) {
        world.gameOver = true;
        world = null;
    }
    prepareRestart();
    showMenu();
    currentScreen = 'main-menu';
}

/**
 * Reset world state for restart
 */
function resetWorldState() {
    if (world) {
        world.gameOver = true;
        if (typeof world.resetWorld === 'function') {
            try {
                world.resetWorld();
            } catch(e) {
            }
        }
        world = null;
    }
}

/**
 * Clear canvas for restart
 */
function clearCanvas() {
    const canvas = document.getElementById('game-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

/**
 * Restart game
 */
function restart() {
    gameActive = false;
    clearAllIntervals();
    stopAllGameSounds();
    stopAllEndSounds();
    resetWorldState();
    clearCanvas();
    keyboard = new Keyboard();
    setTimeout(() => {
        init();
    }, 100);
}

/**
 * Open controls screen and hide menu
 */
function openControls() {
    document.getElementById('keys-info').style.display = 'block';
    document.getElementById('navigation-panel').style.display = 'none';
}

/**
 * Close controls screen and show menu again
 */
function closeControls() {
    document.getElementById('keys-info').style.display = 'none';
    document.getElementById('navigation-panel').style.display = 'flex';
}

/**
 * Open settings screen and hide menu
 */
function openSettings() {
    document.getElementById('config-panel').style.display = 'block';
    document.getElementById('navigation-panel').style.display = 'none';
}

/**
 * Close settings screen and show menu again
 */
function closeSettings() {
    document.getElementById('config-panel').style.display = 'none';
    document.getElementById('navigation-panel').style.display = 'flex';
}

/**
 * Open story screen and hide menu
 */
function openStory() {
    document.getElementById('lore-panel').style.display = 'flex';
    document.getElementById('navigation-panel').style.display = 'none';
}

/**
 * Close story screen and show menu again
 */
function closeStory() {
    document.getElementById('lore-panel').style.display = 'none';
    document.getElementById('navigation-panel').style.display = 'flex';
}

/**
 * Toggle fullscreen mode for the game
 */
function toggleFullScreen() {
    let container = document.getElementById('game-wrapper');
    if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement && !document.msFullscreenElement) {
        if (container.requestFullscreen) {
            container.requestFullscreen();
        } else if (container.webkitRequestFullscreen) {
            container.webkitRequestFullscreen();
        } else if (container.mozRequestFullScreen) {
            container.mozRequestFullScreen();
        } else if (container.msRequestFullscreen) {
            container.msRequestFullscreen();
        }
        showMobileButtons();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        hideMobileButtons();
    }
}

/**
 * Prepare restart
 */
function prepareRestart() {
    if (world) {
        world.resetWorld();
    }
}

/**
 * Clear all intervals and timeouts
 */
function clearAllIntervals() {
    intervals.forEach(interval => {
        if (interval) {
            clearInterval(interval);
        }
    });
    intervals = [];
    timeouts.forEach(timeout => {
        if (timeout) {
            clearTimeout(timeout);
        }
    });
    timeouts = [];
    if (typeof requestAnimationFrameId !== 'undefined' && requestAnimationFrameId) {
        cancelAnimationFrame(requestAnimationFrameId);
        requestAnimationFrameId = 0;
    }
    for (let i = 1; i < 99999; i++) {
        clearInterval(i);
        clearTimeout(i);
    }
}

/**
 * Show mobile control buttons
 */
function showMobileButtons() {
    document.querySelector('.touch-interface').style.display = 'flex';
}

/**
 * Hide mobile control buttons
 */
function hideMobileButtons() {
    document.querySelector('.touch-interface').style.display = 'none';
}

/**
 * Add interval to list
 */
function addInterval(interval) {
    intervals.push(interval);
}

/**
 * Add timeout to list
 */
function addTimeout(timeout) {
    timeouts.push(timeout);
}

/**
 * Check if device is in portrait mode
 */
function isPortraitMode() {
    return window.innerHeight > window.innerWidth;
}

/**
 * Handle fullscreen change events
 */
function handleFullscreenChange() {
    if (document.fullscreenElement || document.webkitFullscreenElement || 
        document.mozFullScreenElement || document.msFullscreenElement) {
        if (isPortraitMode()) {
            showRotateScreen();
        } else {
            hideRotateScreen();
            showMobileButtons();
        }
    } else {
        hideRotateScreen();
        hideMobileButtons();
    }
}

/**
 * Show screen rotation message
 */
function showRotateScreen() {
    document.querySelector('.rotate-container').style.display = 'flex';
}

/**
 * Hide screen rotation message
 */
function hideRotateScreen() {
    document.querySelector('.rotate-container').style.display = 'none';
}

/**
 * Handle orientation change events
 */
function handleOrientationChange() {
    setTimeout(() => {
        if (document.fullscreenElement || document.webkitFullscreenElement || 
            document.mozFullScreenElement || document.msFullscreenElement) {
            if (isPortraitMode()) {
                showRotateScreen();
                hideMobileButtons();
            } else {
                hideRotateScreen();
                showMobileButtons();
            }
        }
    }, 100);
}

/**
 * Hide various screens
 */
function hideScreens() {
    const mainMenu = document.getElementById('main-menu');
    const gameArea = document.getElementById('game-area');
    const finaleScreen = document.getElementById('finale-screen');
    if (mainMenu) mainMenu.style.display = 'none';
    if (gameArea) gameArea.style.display = 'none';
    if (finaleScreen) finaleScreen.style.display = 'none';
}

/**
 * Toggle rotation screen based on window dimensions
 */
function toggleRotateScreen() {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);
}

/**
 * Toggle mobile button container based on window dimensions
 */
function toggleMobileButtonContainer() {
    let touchInterface = document.querySelector('.touch-interface');
    if (touchInterface) {
        if (window.innerWidth <= 1366) {
            touchInterface.style.display = 'flex';
        } else {
            touchInterface.style.display = 'none';
        }
    }
}

/**
 * Show game menu
 */
function toggleIngameMenu() {
    const gameControls = document.getElementById('game-controls');
    if (gameControls) {
        gameControls.style.display = 'block';
    }
}

/**
 * Test functions for browser console debugging
 * Test menu button functionality
 */
function testMenuButton() {
    console.log('Menu button clicked');
}

/**
 * Test restart button functionality
 */
function testRestartButton() {
    console.log('Restart button clicked');
}

/**
 * Test end screen display functionality
 */
function testShowEndScreen() {
    showEndScreen();
}

/**
 * Expose test functions to global window object for console debugging
 */
window.testMenuButton = testMenuButton;
window.testRestartButton = testRestartButton;
window.testShowEndScreen = testShowEndScreen;
window.returnToMenu = returnToMenu;
window.init = init;




