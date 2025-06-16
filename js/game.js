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
 * Spiel initialisieren und Spielwelt einrichten
 */
async function init() {
    // Erst alle Screens zurücksetzen
    const finaleScreen = document.getElementById('finale-screen');
    if (finaleScreen) {
        finaleScreen.style.display = 'none';
        finaleScreen.className = 'finale-screen'; // Reset class
    }
    
    resetGame();
    gameActive = true;
    
    // Bilder vorladen
    await preloadImages();
    
    initLevel();
    
    if (typeof playBackgroundMusic === 'function') {
        playBackgroundMusic();
    }
    
    canvas = document.getElementById('game-canvas');
    
    if (!canvas) {
        return;
    }
    
    // Canvas Größe sicherstellen
    canvas.width = 864;
    canvas.height = 576;
    
    // Canvas-Test - zeichne ein Test-Rechteck
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'green';
    ctx.fillRect(10, 10, 100, 100);
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('CANVAS TEST', 20, 50);
    
    world = new World(canvas, keyboard, level1);
    
    // WICHTIG: Spiel starten!
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
 * Hauptmenü anzeigen
 */
function showMenu() {
    if (gameActive) {
        if (typeof stopBackgroundMusic === 'function') {
            stopBackgroundMusic();
        }
        gameActive = false;
    }
    
    // Alle Screens verstecken
    const finaleScreen = document.getElementById('finale-screen');
    const gameArea = document.getElementById('game-area');
    const mainMenu = document.getElementById('main-menu');
    const navPanel = document.getElementById('navigation-panel');
    const gameControls = document.getElementById('game-controls');
    
    if (finaleScreen) {
        finaleScreen.style.display = 'none';
        finaleScreen.className = 'finale-screen'; // Reset class
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
 * Startbildschirm verstecken und Spielinhalt anzeigen
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
 * Endbildschirm mit entsprechendem Styling basierend auf Spielergebnis anzeigen
 */
function showEndScreen() {
    // ZUERST alle laufenden Spiel-Sounds stoppen - aber End-Sounds erlauben
    stopAllGameSounds();
    
    const endScreen = document.getElementById('finale-screen');
    
    if (!endScreen) {
        return;
    }
    
    // Game deaktivieren
    gameActive = false;
    
    // World-Loops sofort stoppen
    if (world) {
        world.gameOver = true;
    }
    
    endScreen.style.display = 'flex';
    
    // End-Screen anzeigen und End-Sound abspielen
    if (world && world.character && world.character.energy <= 0) {
        endScreen.className = 'finale-screen game-lost-screen';
        
        // Game Lost Sound abspielen
        if (typeof gameLostSound === 'function') {
            gameLostSound();
            
            // Nach 3 Sekunden alles stoppen
            setTimeout(() => {
                stopAllEndSounds();
                clearAllIntervals();
            }, 3000);
        }
    } else {
        endScreen.className = 'finale-screen game-won-screen';
        
        // Game Won Sound abspielen
        if (typeof gameWonSound === 'function') {
            gameWonSound();
            
            // Nach 3 Sekunden alles stoppen
            setTimeout(() => {
                stopAllEndSounds();
                clearAllIntervals();
            }, 3000);
        }
    }
}

/**
 * Stoppt alle laufenden Spiel-Sounds vollständig (außer End-Sounds)
 */
function stopAllGameSounds() {
    // Hintergrundmusik stoppen
    if (typeof stopBackgroundMusic === 'function') {
        stopBackgroundMusic();
    }
    
    // Globale Audio-Elemente stoppen (außer End-Sounds)
    if (typeof backgroundMusic !== 'undefined' && backgroundMusic) {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
        backgroundMusic.muted = true;
    }
    
    // Character Sounds stoppen
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
    
    // Endboss Sounds stoppen
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
    
    // Enemy Sounds stoppen  
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
    
    // Throwable Object Sounds stoppen
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
 * Stoppt ALLE End-Sounds (Game Won/Lost) komplett
 */
function stopAllEndSounds() {
    // Game Won Sound stoppen
    if (typeof gameWon !== 'undefined' && gameWon) {
        gameWon.pause();
        gameWon.currentTime = 0;
        gameWon.muted = true;
    }
    
    // Game Lost Sound stoppen
    if (typeof gameLost !== 'undefined' && gameLost) {
        gameLost.pause();
        gameLost.currentTime = 0;
        gameLost.muted = true;
    }
    
    // Alle HTML Audio Elemente stoppen (komplett sicher)
    const allAudio = document.querySelectorAll('audio');
    allAudio.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
        audio.muted = true;
    });
}

/**
 * Zurück zum Hauptmenü
 */
function returnToMenu() {
    // SOFORT alles stoppen
    gameActive = false;
    
    // Alle Intervals und Timeouts sofort löschen
    clearAllIntervals();
    
    // ALLE Sounds sofort stoppen
    stopAllGameSounds();
    stopAllEndSounds();
    
    // Welt zurücksetzen falls vorhanden
    if (world) {
        world.gameOver = true; // Stoppt alle World-Loops
        world = null; // Referenz entfernen
    }
    
    // Spiel komplett zurücksetzen
    prepareRestart();
    
    // Menü anzeigen
    showMenu();
    
    currentScreen = 'main-menu';
}

/**
 * Spiel neu starten
 */
function restart() {
    // SOFORT alles stoppen
    gameActive = false;
    
    // Alle Intervals und Timeouts sofort löschen
    clearAllIntervals();
    
    // ALLE Sounds sofort stoppen
    stopAllGameSounds();
    stopAllEndSounds();
    
    // Welt zurücksetzen falls vorhanden
    if (world) {
        world.gameOver = true; // Stoppt alle World-Loops
        world = null; // Referenz entfernen
    }
    
    // Spiel komplett zurücksetzen
    prepareRestart();
    
    // Neu initialisieren
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
    const touchInterface = document.querySelector('.touch-interface');
    const isMobile = window.innerWidth <= 1300;
    
    if (touchInterface) {
        if (isMobile) {
            touchInterface.style.display = 'flex';
        } else {
            touchInterface.style.display = 'none';
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

/**
 * Test-Funktionen für Browser-Konsole
 */
function testMenuButton() {
    returnToMenu();
}

function testRestartButton() {
    init();
}

function testShowEndScreen() {
    showEndScreen();
}

// Globale Funktionen verfügbar machen
window.testMenuButton = testMenuButton;
window.testRestartButton = testRestartButton;
window.testShowEndScreen = testShowEndScreen;
window.returnToMenu = returnToMenu;
window.init = init;

document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('mozfullscreenchange', handleFullscreenChange);
document.addEventListener('MSFullscreenChange', handleFullscreenChange);

window.addEventListener('orientationchange', handleOrientationChange);
window.addEventListener('resize', handleOrientationChange);


