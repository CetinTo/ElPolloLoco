/**
 * Core game functionality module
 * Contains essential game initialization and management functions
 */

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
 * Reset game state
 */
function resetGame() {
    keyboard = new Keyboard();
    intervals = [];
    world = null;
}

/**
 * Get list of critical game images to preload
 * @returns {string[]} - Array of image paths
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
 * @param {string} src - Image source path
 * @param {Object} loadedImages - Counter object
 * @param {number} totalImages - Total images to load
 * @param {Function} resolve - Promise resolve function
 */
function loadSingleImage(src, loadedImages, totalImages, resolve) {
    const img = new Image();
    img.onload = () => handleImageLoad(loadedImages, totalImages, resolve);
    img.onerror = () => handleImageLoad(loadedImages, totalImages, resolve);
    img.src = src;
}

/**
 * Handle individual image load completion
 * @param {Object} loadedImages - Counter object
 * @param {number} totalImages - Total images to load
 * @param {Function} resolve - Promise resolve function
 */
function handleImageLoad(loadedImages, totalImages, resolve) {
    loadedImages.count++;
    if (loadedImages.count === totalImages) {
        resolve();
    }
}

/**
 * Preload all important game images to prevent black screen
 * @returns {Promise} - Promise that resolves when all images are loaded
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
 * Set up canvas for game rendering
 * @returns {boolean} - True if canvas setup successful
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
 * Start the game
 */
function startGame() {
    currentScreen = 'game';
    const elements = getMenuElements();
    elements.finaleScreen.style.display = 'none';
    elements.gameArea.style.display = 'block';
    elements.mainMenu.style.display = 'none';
    elements.navPanel.style.display = 'none';
    elements.gameControls.style.display = 'block';
    
    if (typeof playBackgroundMusic === 'function') {
        playBackgroundMusic();
    }
}

/**
 * Clear canvas
 */
function clearCanvas() {
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

/**
 * Restart the game
 */
function restart() {
    clearAllIntervals();
    resetWorldState();
    clearCanvas();
    init();
}

/**
 * Prepare for restart
 */
function prepareRestart() {
    if (typeof stopAllGameSounds === 'function') {
        stopAllGameSounds();
    }
    clearAllIntervals();
    gameActive = true;
}

/**
 * Clear all intervals and timeouts
 */
function clearAllIntervals() {
    intervals.forEach(interval => {
        if (interval && typeof interval === 'number') {
            clearInterval(interval);
        }
    });
    intervals = [];
    
    timeouts.forEach(timeout => {
        if (timeout && typeof timeout === 'number') {
            clearTimeout(timeout);
        }
    });
    timeouts = [];
}

/**
 * Add interval to tracking array
 * @param {number} interval - Interval ID
 */
function addInterval(interval) {
    intervals.push(interval);
}

/**
 * Add timeout to tracking array
 * @param {number} timeout - Timeout ID
 */
function addTimeout(timeout) {
    timeouts.push(timeout);
}

/**
 * Reset world state
 */
function resetWorldState() {
    if (world) {
        world.character = null;
        world.level = null;
        world.collectedCoins = 0;
        world.availableBottles = 0;
        world.throwableObjects = [];
        world.gameOver = false;
        world.camera_x = 0;
    }
    keyboard = new Keyboard();
} 