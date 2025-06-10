/**
 * Verwaltet den Spiel-Zustand und Audio
 * @class
 */
class GameManager {
    constructor(world) {
        this.world = world;
    }

    /**
     * Überprüft die Wurflogik für Flaschen
     */
    checkThrowObjects() {
        if (this.world.keyboard.D && this.world.canThrowBottle && this.world.availableBottles > 0 && !this.world.character.otherDirection) {
            // Wecke den Charakter auf, falls er schläft
            if (this.world.character.idleTimer > this.world.character.IDLE_THRESHOLD) {
                this.world.character.wakeUp();
            }
            
            let bottle = new ThrowableObject(this.world.character.x + 100, this.world.character.y + 100);
            this.world.throwableObjects.push(bottle);
            this.world.availableBottles--;
            let visibleBottles = Math.min(this.world.availableBottles, this.world.bottleBar.MAX_BOTTLES);
            this.world.bottleBar.setCollectedBottles(this.world.availableBottles);
            this.world.playGameSound('./audio/bottle_throw.mp3', 0.8);
            
            this.world.canThrowBottle = false;
            setTimeout(() => {
                this.world.canThrowBottle = true;
            }, 650);
        }
    }

    /**
     * Überprüft ob der Endboss besiegt wurde
     */
    isEndbossDefeated() {
        return this.world.level.endboss[0] && this.world.level.endboss[0].isDead;
    }

    /**
     * Überprüft ob der Charakter tot ist
     */
    isCharacterDead() {
        return this.world.character && this.world.character.energy <= 0;
    }

    /**
     * Beendet das Spiel
     */
    endGame() {
        if (!this.world.gameOver) {
            this.world.gameOver = true;
            this.world.bottleBar.setCollectedBottles(0);
            this.world.throwableObjects = [];
            showEndScreen();
        }
    }

    /**
     * Spielt einen Spiel-Sound ab (wenn nicht stummgeschaltet)
     */
    playGameSound(soundFilePath, volume = 0.2) {
        if (isGameMuted) return;
        
        try {
            const audio = new Audio(soundFilePath);
            audio.volume = volume;
            
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    // Fehler beim Abspielen ignorieren
                });
            }
        } catch (error) {
            // Fehler beim Laden ignorieren
        }
    }

    /**
     * Spielt das Flaschen-Zerbrechgeräusch ab
     */
    playBottleShatterSound() {
        this.playGameSound('./audio/bottle_shatter.mp3', 0.7);
    }
} 