let canvas;
let world;
let keyboard = new Keyboard();
let currentScreen = 'main-menu';
let gameActive = true;
let intervals = [];
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
 * Preload all important game images to prevent black screen
 */
function preloadImages() {
    const imagesToPreload = [
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
    let loadedImages = 0;
    const totalImages = imagesToPreload.length;
    return new Promise((resolve) => {
        if (totalImages === 0) {
            resolve();
            return;
        }
        imagesToPreload.forEach(src => {
            const img = new Image();
            img.onload = () => {
                loadedImages++;
                if (loadedImages === totalImages) {
                    resolve();
                }
            };
            img.onerror = () => {
                loadedImages++;
                if (loadedImages === totalImages) {
                    resolve();
                }
            };
            img.src = src;
        });
    });
}

/**
 * Initialize game and set up game world
 */
async function init() {
    const finaleScreen = document.getElementById('finale-screen');
    if (finaleScreen) {
        finaleScreen.style.display = 'none';
        finaleScreen.className = 'finale-screen';
    }
    gameActive = false;
    clearAllIntervals();
    resetGame();
    gameActive = true;
    await preloadImages();
    initLevel();
    if (typeof playBackgroundMusic === 'function') {
        playBackgroundMusic();
    }
    canvas = document.getElementById('game-canvas');
    if (!canvas) {
        return;
    }
    canvas.width = 720;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'green';
    ctx.fillRect(10, 10, 100, 100);
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('CANVAS TEST', 20, 50);
    world = new World(canvas, keyboard, level1);
    startGame();
    toggleRotateScreen();
    mobileButtonTouch();
    toggleIngameMenu();
    toggleMobileButtonContainer();
    if (typeof muteSounds === 'function') {
        muteSounds();
    }
}

/**
 * Show main menu
 */
function showMenu() {
    if (gameActive) {
        if (typeof stopBackgroundMusic === 'function') {
            stopBackgroundMusic();
        }
        gameActive = false;
    }
    const finaleScreen = document.getElementById('finale-screen');
    const gameArea = document.getElementById('game-area');
    const mainMenu = document.getElementById('main-menu');
    const navPanel = document.getElementById('navigation-panel');
    const gameControls = document.getElementById('game-controls');
    if (finaleScreen) {
        finaleScreen.style.display = 'none';
        finaleScreen.className = 'finale-screen';
    }
    if (gameArea) {
        gameArea.style.display = 'none';
    }
    if (mainMenu) {
        mainMenu.style.display = 'flex';
    }
    if (navPanel) {
        navPanel.style.display = 'flex';
    }
    if (gameControls) {
        gameControls.style.display = 'none';
    }
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
        endScreen.className = 'finale-screen game-lost-screen';
        if (typeof gameLostSound === 'function') {
            gameLostSound();
            setTimeout(() => {
                stopAllEndSounds();
                clearAllIntervals();
            }, 3000);
        }
    } else {
        endScreen.className = 'finale-screen game-won-screen';
        if (typeof gameWonSound === 'function') {
            gameWonSound();
            setTimeout(() => {
                stopAllEndSounds();
                clearAllIntervals();
            }, 3000);
        }
    }
}

/**
 * Stops all running game sounds completely (except end sounds)
 */
function stopAllGameSounds() {
    if (typeof stopBackgroundMusic === 'function') {
        stopBackgroundMusic();
    }
    if (typeof backgroundMusic !== 'undefined' && backgroundMusic) {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
        backgroundMusic.muted = true;
    }
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
    if (world && world.level && world.level.endboss) {
        world.level.endboss.forEach((boss) => {
            if (boss.alert_sound) {
                boss.alert_sound.pause();
                boss.alert_sound.currentTime = 0;
                boss.alert_sound.muted = true;
            }
            if (boss.hurt_sound) {
                boss.hurt_sound.pause();
                boss.hurt_sound.currentTime = 0;
                boss.hurt_sound.muted = true;
            }
            if (boss.dead_sound) {
                boss.dead_sound.pause();
                boss.dead_sound.currentTime = 0;
                boss.dead_sound.muted = true;
            }
            if (boss.attack_sound) {
                boss.attack_sound.pause();
                boss.attack_sound.currentTime = 0;
                boss.attack_sound.muted = true;
            }
        });
    }
    if (world && world.level && world.level.enemies) {
        world.level.enemies.forEach((enemy) => {
            if (enemy.death_sound) {
                enemy.death_sound.pause();
                enemy.death_sound.currentTime = 0;
                enemy.death_sound.muted = true;
            }
            if (enemy.walking_sound) {
                enemy.walking_sound.pause();
                enemy.walking_sound.currentTime = 0;
                enemy.walking_sound.muted = true;
            }
        });
    }
    if (world && world.throwableObjects) {
        world.throwableObjects.forEach((bottle) => {
            if (bottle.bottle_shatter_sound) {
                bottle.bottle_shatter_sound.pause();
                bottle.bottle_shatter_sound.currentTime = 0;
                bottle.bottle_shatter_sound.muted = true;
            }
            if (bottle.throw_sound) {
                bottle.throw_sound.pause();
                bottle.throw_sound.currentTime = 0;
                bottle.throw_sound.muted = true;
            }
        });
    }
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
 * Restart game
 */
function restart() {
    gameActive = false;
    clearAllIntervals();
    stopAllGameSounds();
    stopAllEndSounds();
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
    const canvas = document.getElementById('game-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
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
 * Test functions for browser console
 */
function testMenuButton() {
    console.log('Menu button clicked');
}

function testRestartButton() {
    console.log('Restart button clicked');
}

function testShowEndScreen() {
    showEndScreen();
}


window.testMenuButton = testMenuButton;
window.testRestartButton = testRestartButton;
window.testShowEndScreen = testShowEndScreen;
window.returnToMenu = returnToMenu;
window.init = init;


