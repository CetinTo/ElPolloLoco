/**
 * Manages game logic and audio
 * @class
 */
class GameManager {
    /**
     * Creates a new GameManager instance
     * @param {World} world - Reference to the game world
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * Handles throwing of objects (legacy method)
     */
    handleThrowing() {
        if (this.world.keyboard.D && this.world.availableBottles > 0) {
            this.world.character.wakeUp();
            
            let bottle = new ThrowableObject(this.world.character.x + 100, this.world.character.y + 100);
            this.world.throwableObjects.push(bottle);
            this.world.availableBottles--;
            this.world.bottleBar.setCollectedBottles(this.world.availableBottles);
        }
    }

    /**
     * Check if throw conditions are met
     * @returns {boolean} - True if character can throw bottle
     */
    canThrow() {
        return this.world.keyboard.D && 
               this.world.canThrowBottle && 
               this.world.availableBottles > 0 && 
               !this.world.character.otherDirection;
    }

    /**
     * Create and throw bottle with sound effects
     */
    executeThrow() {
        if (this.world.character.idleTimer > this.world.character.IDLE_THRESHOLD) {
            this.world.character.wakeUp();
        }
        
        let bottle = new ThrowableObject(this.world.character.x + 100, this.world.character.y + 100);
        this.world.throwableObjects.push(bottle);
        this.world.availableBottles--;
        this.world.bottleBar.setCollectedBottles(this.world.availableBottles);
        this.world.playGameSound('./audio/bottle_throw.mp3', 0.8);
    }

    /**
     * Set throw cooldown to prevent spam throwing
     */
    setThrowCooldown() {
        this.world.canThrowBottle = false;
        setTimeout(() => {
            this.world.canThrowBottle = true;
        }, 650);
    }

    /**
     * Checks throwing logic for bottles
     */
    checkThrowObjects() {
        if (this.canThrow()) {
            this.executeThrow();
            this.setThrowCooldown();
        }
    }

    /**
     * Checks if endboss is defeated
     * @returns {boolean} - True if endboss is dead
     */
    isEndbossDefeated() {
        return this.world.level.endboss[0] && this.world.level.endboss[0].isDead;
    }

    /**
     * Checks if character is dead
     * @returns {boolean} - True if character has no energy left
     */
    isCharacterDead() {
        return this.world.character && this.world.character.energy <= 0;
    }

    /**
     * Ends the game and shows end screen
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
     * Plays game audio with error handling
     * @param {string} audioPath - Path to the audio file
     * @param {number} [volume=1.0] - Volume level (0.0 to 1.0)
     * @param {boolean} [loop=false] - Whether to loop the audio
     */
    playGameSound(audioPath, volume = 1.0, loop = false) {
        if (isGameMuted) {
            return;
        }
        
        try {
            const audio = new Audio(audioPath);
            audio.volume = volume;
            audio.loop = loop;
            
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                }).catch(error => {
                });
            }
        } catch (error) {
        }
    }

    /**
     * Plays bottle shatter sound effect
     */
    playBottleShatterSound() {
        this.playGameSound('./audio/bottle_shatter.mp3', 0.5);
    }
} 
