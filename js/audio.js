/**
 * Hilfsfunktion um ein Audio-Element sicher abzuspielen, nur wenn es pausiert ist.
 * Falls das Audio bereits läuft, wird kein erneuter Play-Aufruf gestartet.
 * Fehler mit dem Namen "AbortError" werden gezielt unterdrückt.
 * @param {HTMLAudioElement} audioElement
 * @returns {Promise}
 */
function safePlay(audioElement) {
    if (audioElement.paused) {
      return audioElement.play().catch((error) => {
        if (error.name !== 'AbortError') {
          // Audio-Fehler aufgetreten
        }
      });
    }
    return Promise.resolve();
}

/**
 * Erstellt ein neues Audio-Element mit verbesserter Cache-Behandlung
 * @param {string} src - Der Pfad zur Audio-Datei
 * @returns {HTMLAudioElement|null} - Das Audio-Element oder null bei Fehlern
 */
function createAudioElement(src) {
    try {
        const audio = new Audio();
        audio.preload = 'auto';
        
        // Cache-Busting nur in der Entwicklung, um Produktions-Performance zu erhalten
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            const timestamp = Date.now();
            audio.src = `${src}?t=${timestamp}`;
        } else {
            audio.src = src;
        }
        
        audio.addEventListener('error', (e) => {
            // Audio-Datei konnte nicht geladen werden
        });
        
        return audio;
    } catch (error) {
        return null;
    }
}

/**
 * Hintergrundmusik Audio-Element
 * @type {HTMLAudioElement}
 */
let backgroundMusic = createAudioElement('audio/game.mp3');

/**
 * Audio-Element für den Spiel-Gewonnen-Sound
 * @type {HTMLAudioElement}
 */
let gameWon = createAudioElement('audio/game_won.mp3');

/**
 * Audio-Element für den Spiel-Verloren-Sound
 * @type {HTMLAudioElement}
 */
let gameLost = createAudioElement('audio/game_lost.mp3');

/**
 * Zeigt an, ob das Spiel-Audio stummgeschaltet ist
 * @type {boolean}
 */
let isGameMuted = false;

// Zustand aus localStorage laden
isGameMuted = localStorage.getItem('isGameMuted') === 'true';

/**
 * Spielt den Spiel-Gewonnen-Sound ab, wenn das Spiel nicht stummgeschaltet ist
 */
function gameWonSound() {
    if (!isGameMuted) {
      safePlay(gameWon);
    }
}

/**
 * Spielt den Spiel-Verloren-Sound ab, wenn das Spiel nicht stummgeschaltet ist
 */
function gameLostSound() {
    if (!isGameMuted) {
      safePlay(gameLost);
    }
}

/**
 * Setzt die Lautstärke und den Stummschaltungsstatus für die Hintergrundmusik und spielt sie ab
 */
function playBackgroundMusic() {
    backgroundMusic.volume = 0.1;
    backgroundMusic.muted = isGameMuted;
    safePlay(backgroundMusic);
}

/**
 * Stoppt die Hintergrundmusik und setzt die Wiedergabeposition auf den Anfang zurück
 */
function stopBackgroundMusic() {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
}

/**
 * Schaltet den Stummschaltungsstatus der Hintergrundmusik um und aktualisiert die UI entsprechend
 */
function updateSoundStatus() {
    backgroundMusic.muted = isGameMuted;

    let musicToggleButton = document.getElementById('audio-control-btn');
    let soundIcon = document.getElementById('audio-toggle');
    if (isGameMuted) {
      musicToggleButton.innerText = 'Sound Off';
      soundIcon.src = './img/12_icons/SOUND_OFF_icon.png';
    } else {
      musicToggleButton.innerText = 'Sound On';
      soundIcon.src = './img/12_icons/SOUND_ON_icon.png';
    }

    if (gameActive) {
      muteSounds();
    }
}

/**
 * Schaltet den Stummschaltungsstatus des Spiel-Audios um und aktualisiert die UI
 */
function toggleSoundAndImage() {
    isGameMuted = !isGameMuted;
    localStorage.setItem('isGameMuted', isGameMuted);
    updateSoundStatus();
    muteSounds();
}

/**
 * Schaltet alle Spiel-Audio-Elemente basierend auf dem Spiel-Stummschaltungsstatus stumm oder laut
 */
function muteSounds() {
    if (backgroundMusic) {
      backgroundMusic.muted = isGameMuted;
      if (isGameMuted) {
        backgroundMusic.pause();
      }
    }
    muteChickenSounds();
    muteCharacterSounds();
    muteEndbossSounds();
    
    // Stoppe alle laufenden Character-Sounds wenn gemutet
    if (isGameMuted && world && world.character) {
      if (world.character.walking_sound) {
        world.character.walking_sound.pause();
      }
      if (world.character.hurt_sound) {
        world.character.hurt_sound.pause();
      }
    }
}

/**
 * Schaltet Hühner-Gegner-Sounds basierend auf dem Spiel-Stummschaltungsstatus stumm oder laut
 */
function muteChickenSounds() {
    if (world && world.level && world.level.enemies) {
      world.level.enemies.forEach((enemy) => {
        if (enemy instanceof Chicken) {
          enemy.death_sound.muted = isGameMuted;
        }
      });
    }
}

/**
 * Schaltet Endboss-Gegner-Sounds basierend auf dem Spiel-Stummschaltungsstatus stumm oder laut
 */
function muteEndbossSounds() {
    if (world && world.level && world.level.endboss) {
      world.level.endboss.forEach((endboss) => {
        endboss.alert_sound.muted = isGameMuted;
        endboss.hurt_sound.muted = isGameMuted;
        endboss.dead_sound.muted = isGameMuted;
      });
    }
}

/**
 * Schaltet Charakter-Sounds basierend auf dem Spiel-Stummschaltungsstatus stumm oder laut
 */
function muteCharacterSounds() {
    if (world && world.character) {
      world.character.walking_sound.muted = isGameMuted;
      world.character.hurt_sound.muted = isGameMuted;
    }
}

/**
 * Initialisiert den Sound-Status beim Seitenladen anhand von localStorage
 */
function initSoundStatusUI() {
    let musicToggleButton = document.getElementById('audio-control-btn');
    let soundIcon = document.getElementById('audio-toggle');

    // Falls die HTML-Elemente noch nicht existieren, abbrechen
    if (!musicToggleButton || !soundIcon) return;

    if (isGameMuted) {
      musicToggleButton.innerText = 'Sound Off';
      soundIcon.src = './img/12_icons/SOUND_OFF_icon.png';
    } else {
      musicToggleButton.innerText = 'Sound On';
      soundIcon.src = './img/12_icons/SOUND_ON_icon.png';
    }

    backgroundMusic.muted = isGameMuted;
    muteSounds();
}

// Event-Listener für das Laden der Seite
window.addEventListener('load', () => {
    initSoundStatusUI();
});
  