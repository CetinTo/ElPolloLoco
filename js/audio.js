/**
 * Helper function to safely play an audio element, only when it is paused.
 * If the audio is already playing, no new play call is started.
 * Errors with the name "AbortError" are specifically suppressed.
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
 * Creates a new audio element with improved cache handling
 * @param {string} src - The path to the audio file
 * @returns {HTMLAudioElement|null} - The audio element or null on errors
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
 * Background music audio element
 * @type {HTMLAudioElement}
 */
let backgroundMusic = createAudioElement('audio/game.mp3');

/**
 * Audio element for the game won sound
 * @type {HTMLAudioElement}
 */
let gameWon = createAudioElement('audio/game_won.mp3');

/**
 * Audio element for the game lost sound
 * @type {HTMLAudioElement}
 */
let gameLost = createAudioElement('audio/game_lost.mp3');

/**
 * Indicates whether the game audio is muted
 * @type {boolean}
 */
let isGameMuted = false;


isGameMuted = localStorage.getItem('isGameMuted') === 'true';

function gameWonSound() {
    if (gameWon && !isGameMuted) {
        gameWon.muted = false;
        gameWon.volume = 0.7;
        safePlay(gameWon);
    }
}

function gameLostSound() {
    if (gameLost && !isGameMuted) {
        gameLost.muted = false;
        gameLost.volume = 0.7;
        safePlay(gameLost);
    }
}

/**
 * Sets the volume and mute status for the background music and plays it
 */
function playBackgroundMusic() {
    backgroundMusic.volume = 0.1;
    backgroundMusic.muted = isGameMuted;
    safePlay(backgroundMusic);
}

/**
 * Stops the background music and resets the playback position to the beginning
 */
function stopBackgroundMusic() {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
}

/**
 * Toggles the mute status of the background music and updates the UI accordingly
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
 * Toggles the mute status of the game audio and updates the UI
 * MASTER AUDIO CONTROL - Controls all sounds in the game
 */
function toggleSoundAndImage() {
    isGameMuted = !isGameMuted;
    localStorage.setItem('isGameMuted', isGameMuted);
    
    updateSoundStatus();
    masterMuteAllSounds();
}

/**
 * MASTER MUTE FUNCTION - Controls all audios in the game
 */
function masterMuteAllSounds() {

    if (backgroundMusic) {
        backgroundMusic.muted = isGameMuted;
        if (isGameMuted) {
            backgroundMusic.pause();
        } else {
    
            if (gameActive) {
                backgroundMusic.muted = false;
                safePlay(backgroundMusic);
            }
        }
    }
    

    if (gameWon) {
        gameWon.muted = isGameMuted;
        if (isGameMuted) {
            gameWon.pause();
            gameWon.currentTime = 0;
        }
    }
    
    if (gameLost) {
        gameLost.muted = isGameMuted;
        if (isGameMuted) {
            gameLost.pause();
            gameLost.currentTime = 0;
        }
    }
    
    
    if (world) {
        
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
        }
        
        
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
        }
        
        
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
        }
        
        
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
        }
    }
    
    
    const allAudio = document.querySelectorAll('audio');
    allAudio.forEach(audio => {
        audio.muted = isGameMuted;
        if (isGameMuted) {
            audio.pause();
        }
    });
}

/**
 * Mutes or unmutes all game audio elements based on the game mute status
 * (Deprecated function - replaced by masterMuteAllSounds())
 */
function muteSounds() {
    masterMuteAllSounds();
}

/**
 * Mutes or unmutes chicken enemy sounds based on the game mute status
 * (Part of the master mute function)
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
 * Mutes or unmutes end boss enemy sounds based on the game mute status
 * (Part of the master mute function)
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
 * Mutes or unmutes character sounds based on the game mute status
 * (Part of the master mute function)
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
 * Initializes the sound status when the page loads based on localStorage
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
  
