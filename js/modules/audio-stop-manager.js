/**
 * Audio stop management module
 * Handles stopping of all audio elements and sound management
 */

/**
 * Stop background audio
 */
function stopBackgroundAudio() {
    if (typeof stopBackgroundMusic === 'function') {
        stopBackgroundMusic();
    }
}

/**
 * Stop character audio
 */
function stopCharacterAudio() {
    if (world && world.character) {
        if (world.character.walking_sound) {
            world.character.walking_sound.pause();
            world.character.walking_sound.currentTime = 0;
            world.character.walking_sound.muted = true;
        }
        
        if (world.character.hurt_sound) {
            stopSingleAudio(world.character.hurt_sound);
        }
        
        if (world.character.death_sound) {
            stopSingleAudio(world.character.death_sound);
        }
    }
}

/**
 * Stop single audio element
 * @param {HTMLAudioElement} audio - Audio element to stop
 */
function stopSingleAudio(audio) {
    if (audio) {
        try {
            audio.pause();
            audio.currentTime = 0;
            audio.muted = true;
        } catch (error) {
        }
    }
}

/**
 * Stop boss audio
 */
function stopBossAudio() {
    if (world && world.level && world.level.endboss) {
        world.level.endboss.forEach(boss => {
            if (boss.intro_sound) stopSingleAudio(boss.intro_sound);
            if (boss.alert_sound) stopSingleAudio(boss.alert_sound);
            if (boss.hurt_sound) stopSingleAudio(boss.hurt_sound);
            if (boss.dead_sound) stopSingleAudio(boss.dead_sound);
        });
    }
}

/**
 * Stop enemy audio
 */
function stopEnemyAudio() {
    if (world && world.level && world.level.enemies) {
        world.level.enemies.forEach(enemy => {
            stopSingleAudio(enemy.walking_sound);
            stopSingleAudio(enemy.death_sound);
        });
    }
}

/**
 * Stop throwable object audio
 */
function stopThrowableAudio() {
    if (world && world.throwableObjects) {
        world.throwableObjects.forEach(obj => {
            if (obj.splash_sound) stopSingleAudio(obj.splash_sound);
            if (obj.throw_sound) stopSingleAudio(obj.throw_sound);
        });
    }
}

/**
 * Stop all game sounds
 */
function stopAllGameSounds() {
    stopBackgroundAudio();
    stopCharacterAudio();
    stopBossAudio();
    stopEnemyAudio();
    stopThrowableAudio();
}

/**
 * Stop all end sounds
 */
function stopAllEndSounds() {
    stopAllGameSounds();
    
    const audioElements = [
        'gameWon', 'gameLost', 'backgroundMusic'
    ];
    
    audioElements.forEach(elementName => {
        if (window[elementName]) {
            stopSingleAudio(window[elementName]);
        }
    });
} 