let canvas;
let world;
let keyboard = new Keyboard();
let currentScreen = 'main-menu';
let gameActive = true;
let intervals = [];
let timeouts = [];

/**
 * Spiel zurücksetzen
 */
function resetGame() {
    keyboard = new Keyboard();
    intervals = [];
    world = null;
}

/**
 * Alle wichtigen Spielbilder vorladen um schwarzen Bildschirm zu verhindern
 */
function preloadImages() {
    const imagesToPreload = [
        // Charakter-Bilder
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/1_idle/idle/I-1.png',
        
        // Hintergrund-Bilder
        'img/5_background/layers/air.png',
        'img/5_background/layers/3_third_layer/1.png',
        'img/5_background/layers/2_second_layer/1.png',
        'img/5_background/layers/1_first_layer/1.png',
        
        // UI-Bilder
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png',
        
        // Spiel-Objekte
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
 * Spiel initialisieren und Spielwelt einrichten
 */
async function init() {
    resetGame();
    gameActive = true;
    
    // Bilder zuerst vorladen um schwarzen Bildschirm zu verhindern
    await preloadImages();
    
    initLevel();
    playBackgroundMusic();
    canvas = document.getElementById('game-canvas');
    world = new World(canvas, keyboard, level1);
    hideScreens();
    toggleRotateScreen();
    mobileButtonTouch();
    toggleIngameMenu();
    toggleMobileButtonContainer();
    muteSounds();
}

/**
 * Hauptmenü anzeigen
 */
function showMenu() {
    if (gameActive) {
        stopBackgroundMusic();
        gameActive = false;
    }
    
    document.getElementById('finale-screen').style.display = 'none';
    document.getElementById('main-menu').style.display = 'flex';
    document.getElementById('navigation-panel').style.display = 'flex';
    document.getElementById('game-controls').style.display = 'none';
}

/**
 * Startbildschirm verstecken und Spielinhalt anzeigen
 */
function startGame() {
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('game-area').style.display = 'block';
    document.getElementById('finale-screen').style.display = 'none';
}

/**
 * Endbildschirm mit entsprechendem Styling basierend auf Spielergebnis anzeigen
 */
function showEndScreen() {
    const endScreen = document.getElementById('finale-screen');
    endScreen.style.display = 'flex';
    
    if (world && world.character.energy <= 0) {
        endScreen.className = 'finale-screen game-lost-screen';
        if (typeof gameLostSound === 'function') {
            gameLostSound();
        }
    } else {
        endScreen.className = 'finale-screen game-won-screen';
        if (typeof gameWonSound === 'function') {
            gameWonSound();
        }
    }
    
    gameActive = false;
    
    if (typeof stopBackgroundMusic === 'function') {
        stopBackgroundMusic();
    }
    
    clearAllIntervals();
}

/**
 * Zurück zum Hauptmenü
 */
function returnToMenu() {
    clearAllIntervals();
    prepareRestart();
    showMenu();
    currentScreen = 'main-menu';
}

/**
 * Spiel neu starten
 */
function restart() {
    clearAllIntervals();
    prepareRestart();
    init();
}

/**
 * Steuerungsbildschirm öffnen und Menü verstecken
 */
function openControls() {
    document.getElementById('keys-info').style.display = 'block';
    document.getElementById('navigation-panel').style.display = 'none';
}

/**
 * Steuerungsbildschirm schließen und Menü wieder anzeigen
 */
function closeControls() {
    document.getElementById('keys-info').style.display = 'none';
    document.getElementById('navigation-panel').style.display = 'flex';
}

/**
 * Einstellungsbildschirm öffnen und Menü verstecken
 */
function openSettings() {
    document.getElementById('config-panel').style.display = 'block';
    document.getElementById('navigation-panel').style.display = 'none';
}

/**
 * Einstellungsbildschirm schließen und Menü wieder anzeigen
 */
function closeSettings() {
    document.getElementById('config-panel').style.display = 'none';
    document.getElementById('navigation-panel').style.display = 'flex';
}

/**
 * Story-Bildschirm öffnen und Menü verstecken
 */
function openStory() {
    document.getElementById('lore-panel').style.display = 'flex';
    document.getElementById('navigation-panel').style.display = 'none';
}

/**
 * Story-Bildschirm schließen und Menü wieder anzeigen
 */
function closeStory() {
    document.getElementById('lore-panel').style.display = 'none';
    document.getElementById('navigation-panel').style.display = 'flex';
}

/**
 * Vollbildmodus für das Spiel umschalten
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
 * Neustart vorbereiten
 */
function prepareRestart() {
    if (world) {
        world.resetWorld();
    }
}

/**
 * Alle Intervalle und Timeouts löschen
 */
function clearAllIntervals() {
    intervals.forEach(interval => clearInterval(interval));
    intervals = [];
    
    timeouts.forEach(timeout => clearTimeout(timeout));
    timeouts = [];
    
    if (typeof requestAnimationFrameId !== 'undefined' && requestAnimationFrameId) {
        cancelAnimationFrame(requestAnimationFrameId);
        requestAnimationFrameId = 0;
    }
}

/**
 * Mobile Steuerungsbuttons anzeigen
 */
function showMobileButtons() {
    document.querySelector('.touch-interface').style.display = 'flex';
}

/**
 * Mobile Steuerungsbuttons verstecken
 */
function hideMobileButtons() {
    document.querySelector('.touch-interface').style.display = 'none';
}

/**
 * Intervall zur Liste hinzufügen
 */
function addInterval(interval) {
    intervals.push(interval);
}

/**
 * Timeout zur Liste hinzufügen
 */
function addTimeout(timeout) {
    timeouts.push(timeout);
}

/**
 * Prüfen ob Gerät im Hochformat ist
 */
function isPortraitMode() {
    return window.innerHeight > window.innerWidth;
}

/**
 * Vollbild-Änderungsereignisse behandeln
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
 * Bildschirm-Rotations-Nachricht anzeigen
 */
function showRotateScreen() {
    document.querySelector('.rotate-container').style.display = 'flex';
}

/**
 * Bildschirm-Rotations-Nachricht verstecken
 */
function hideRotateScreen() {
    document.querySelector('.rotate-container').style.display = 'none';
}

/**
 * Orientierungsänderungsereignisse behandeln
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
 * Verschiedene Bildschirme verstecken
 */
function hideScreens() {
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
 * Rotations-Bildschirm basierend auf Fensterdimensionen umschalten
 */
function toggleRotateScreen() {
    const rotateContainer = document.querySelector('.rotate-container');

    if (window.innerWidth <= 1300 && window.innerHeight > window.innerWidth) {
        rotateContainer.style.display = 'flex';
    } else {
        rotateContainer.style.display = 'none';
    }
}

/**
 * Mobile Button-Container basierend auf Fensterdimensionen umschalten
 */
function toggleMobileButtonContainer() {
    const mobileButtonContainer = document.querySelector('.touch-interface');
    const isMobileMode = window.innerWidth <= 1300;

    if (mobileButtonContainer) {
        if (isMobileMode) {
            mobileButtonContainer.style.display = 'flex';
        } else {
            mobileButtonContainer.style.display = 'none';
        }
    }
}

/**
 * Spiel-Menü anzeigen
 */
function toggleIngameMenu() {
    const ingameMenu = document.getElementById('game-controls');
    if (ingameMenu) {
        ingameMenu.style.display = 'flex';
    }
}

// Event-Listener für Vollbild- und Orientierungsänderungen
document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('mozfullscreenchange', handleFullscreenChange);
document.addEventListener('MSFullscreenChange', handleFullscreenChange);

window.addEventListener('orientationchange', handleOrientationChange);
window.addEventListener('resize', handleOrientationChange);


