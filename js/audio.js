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
        
        
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            const timestamp = Date.now();
            audio.src = `${src}?t=${timestamp}`;
        } else {
            audio.src = src;
        }
        
        audio.addEventListener('error', (e) => {
            
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


isGameMuted = localStorage.getItem('isGameMuted') === 'true';

/**
 * Spielt den Spiel-Gewonnen-Sound ab (immer abspielen)
 */
function gameWonSound() {
    if (gameWon) {
        gameWon.muted = false; // Immer abspielen
        gameWon.volume = 0.7;
        console.log('🔊 Game Won Sound wird abgespielt, Lautstärke:', gameWon.volume);
        safePlay(gameWon);
    } else {
        console.log('❌ Game Won Sound Element nicht verfügbar');
    }
}

/**
 * Spielt den Spiel-Verloren-Sound ab (immer abspielen)
 */
function gameLostSound() {
    if (gameLost) {
        gameLost.muted = false; // Immer abspielen
        gameLost.volume = 0.7;
        console.log('🔊 Game Lost Sound wird abgespielt, Lautstärke:', gameLost.volume);
        safePlay(gameLost);
    } else {
        console.log('❌ Game Lost Sound Element nicht verfügbar');
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
 * MASTER AUDIO CONTROL - Kontrolliert alle Sounds im Spiel
 */
function toggleSoundAndImage() {
    console.log('🔊 Sound Toggle geklickt - aktueller Status:', isGameMuted ? 'STUMM' : 'AN');
    
    isGameMuted = !isGameMuted;
    localStorage.setItem('isGameMuted', isGameMuted);
    
    console.log('🔊 Neuer Sound Status:', isGameMuted ? 'STUMM' : 'AN');
    
    updateSoundStatus();
    masterMuteAllSounds();
}

/**
 * MASTER MUTE FUNKTION - Steuert alle Audios im Spiel
 */
function masterMuteAllSounds() {
    console.log('🔊 Master Mute wird ausgeführt, stumm:', isGameMuted);
    
    // Hintergrundmusik steuern
    if (backgroundMusic) {
        backgroundMusic.muted = isGameMuted;
        if (isGameMuted) {
            backgroundMusic.pause();
            console.log('🔇 Hintergrundmusik gestoppt');
        } else {
            // Nur wieder starten wenn das Spiel aktiv ist
            if (gameActive) {
                backgroundMusic.muted = false;
                safePlay(backgroundMusic);
                console.log('🔊 Hintergrundmusik gestartet');
            }
        }
    }
    
    // End-Sounds komplett kontrollieren (auch stoppen)
    if (gameWon) {
        gameWon.muted = isGameMuted;
        if (isGameMuted) {
            gameWon.pause();
            gameWon.currentTime = 0;
            console.log('🔇 Game Won Sound gestoppt');
        }
    }
    
    if (gameLost) {
        gameLost.muted = isGameMuted;
        if (isGameMuted) {
            gameLost.pause();
            gameLost.currentTime = 0;
            console.log('🔇 Game Lost Sound gestoppt');
        }
    }
    
    // Alle World-Sounds kontrollieren
    if (world) {
        // Character Sounds
        if (world.character) {
            if (world.character.walking_sound) {
                world.character.walking_sound.muted = isGameMuted;
                if (isGameMuted) world.character.walking_sound.pause();
            }
            if (world.character.hurt_sound) {
                world.character.hurt_sound.muted = isGameMuted;
                if (isGameMuted) world.character.hurt_sound.pause();
            }
            if (world.character.jumping_sound) {
                world.character.jumping_sound.muted = isGameMuted;
                if (isGameMuted) world.character.jumping_sound.pause();
            }
            console.log('🔊 Character Sounds', isGameMuted ? 'gemutet' : 'aktiviert');
        }
        
        // Enemy Sounds
        if (world.level && world.level.enemies) {
            world.level.enemies.forEach((enemy) => {
                if (enemy.death_sound) {
                    enemy.death_sound.muted = isGameMuted;
                    if (isGameMuted) enemy.death_sound.pause();
                }
                if (enemy.walking_sound) {
                    enemy.walking_sound.muted = isGameMuted;
                    if (isGameMuted) enemy.walking_sound.pause();
                }
            });
            console.log('🔊 Enemy Sounds', isGameMuted ? 'gemutet' : 'aktiviert');
        }
        
        // Endboss Sounds
        if (world.level && world.level.endboss) {
            world.level.endboss.forEach((endboss) => {
                if (endboss.alert_sound) {
                    endboss.alert_sound.muted = isGameMuted;
                    if (isGameMuted) endboss.alert_sound.pause();
                }
                if (endboss.hurt_sound) {
                    endboss.hurt_sound.muted = isGameMuted;
                    if (isGameMuted) endboss.hurt_sound.pause();
                }
                if (endboss.dead_sound) {
                    endboss.dead_sound.muted = isGameMuted;
                    if (isGameMuted) endboss.dead_sound.pause();
                }
            });
            console.log('🔊 Endboss Sounds', isGameMuted ? 'gemutet' : 'aktiviert');
        }
        
        // Throwable Object Sounds
        if (world.throwableObjects) {
            world.throwableObjects.forEach((bottle) => {
                if (bottle.bottle_shatter_sound) {
                    bottle.bottle_shatter_sound.muted = isGameMuted;
                    if (isGameMuted) bottle.bottle_shatter_sound.pause();
                }
                if (bottle.throw_sound) {
                    bottle.throw_sound.muted = isGameMuted;
                    if (isGameMuted) bottle.throw_sound.pause();
                }
            });
            console.log('🔊 Throwable Object Sounds', isGameMuted ? 'gemutet' : 'aktiviert');
        }
    }
    
    // Alle HTML Audio Elemente auf der Seite kontrollieren
    const allAudio = document.querySelectorAll('audio');
    allAudio.forEach(audio => {
        audio.muted = isGameMuted;
        if (isGameMuted) {
            audio.pause();
        }
    });
    console.log('🔊 Alle HTML Audio Elemente', isGameMuted ? 'gemutet' : 'aktiviert');
    
    console.log('✅ Master Mute abgeschlossen');
}

/**
 * Schaltet alle Spiel-Audio-Elemente basierend auf dem Spiel-Stummschaltungsstatus stumm oder laut
 * (Veraltete Funktion - wird von masterMuteAllSounds() ersetzt)
 */
function muteSounds() {
    console.log('⚠️ muteSounds() aufgerufen - wird zu masterMuteAllSounds() weitergeleitet');
    masterMuteAllSounds();
}

/**
 * Schaltet Hühner-Gegner-Sounds basierend auf dem Spiel-Stummschaltungsstatus stumm oder laut
 * (Teil der Master-Mute-Funktion)
 */
function muteChickenSounds() {
    if (world && world.level && world.level.enemies) {
        world.level.enemies.forEach((enemy) => {
            if (enemy instanceof Chicken && enemy.death_sound) {
                enemy.death_sound.muted = isGameMuted;
                if (isGameMuted) enemy.death_sound.pause();
            }
        });
    }
}

/**
 * Schaltet Endboss-Gegner-Sounds basierend auf dem Spiel-Stummschaltungsstatus stumm oder laut
 * (Teil der Master-Mute-Funktion)
 */
function muteEndbossSounds() {
    if (world && world.level && world.level.endboss) {
        world.level.endboss.forEach((endboss) => {
            if (endboss.alert_sound) {
                endboss.alert_sound.muted = isGameMuted;
                if (isGameMuted) endboss.alert_sound.pause();
            }
            if (endboss.hurt_sound) {
                endboss.hurt_sound.muted = isGameMuted;
                if (isGameMuted) endboss.hurt_sound.pause();
            }
            if (endboss.dead_sound) {
                endboss.dead_sound.muted = isGameMuted;
                if (isGameMuted) endboss.dead_sound.pause();
            }
        });
    }
}

/**
 * Schaltet Charakter-Sounds basierend auf dem Spiel-Stummschaltungsstatus stumm oder laut
 * (Teil der Master-Mute-Funktion)
 */
function muteCharacterSounds() {
    if (world && world.character) {
        if (world.character.walking_sound) {
            world.character.walking_sound.muted = isGameMuted;
            if (isGameMuted) world.character.walking_sound.pause();
        }
        if (world.character.hurt_sound) {
            world.character.hurt_sound.muted = isGameMuted;
            if (isGameMuted) world.character.hurt_sound.pause();
        }
    }
}

/**
 * Initialisiert den Sound-Status beim Seitenladen anhand von localStorage
 */
function initSoundStatusUI() {
    let musicToggleButton = document.getElementById('audio-control-btn');
    let soundIcon = document.getElementById('audio-toggle');

    
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


window.addEventListener('load', () => {
    initSoundStatusUI();
});
  
