/**
 * Manages all animations and death of the end boss
 * @class
 */
class BossAnimations {
    /**
     * Creates a new BossAnimations instance
     * @param {Endboss} boss - Reference to the boss object
     */
    constructor(boss) {
        this.boss = boss;
    }

    /**
     * Safely plays boss audio with error handling
     * @param {HTMLAudioElement} audioElement - Audio element to play
     */
    playBossSound(audioElement) {
        if (typeof isGameMuted !== 'undefined' && isGameMuted) {
            return; 
        }
        if (audioElement) {
            try {
                audioElement.currentTime = 0;
                if (typeof safePlay === 'function') {
                    safePlay(audioElement);
                } else {
                    audioElement.play().catch(error => {
                        console.warn('Boss audio playback failed:', error);
                    });
                }
            } catch (error) {
                console.warn('Boss audio error:', error);
            }
        }
    }

    /**
     * Checks if the alert animation should start based on certain conditions
     * @returns {boolean} - True if alert animation should start
     */
    shouldStartAlert() {
        const shouldStart = world && world.character.x >= 4500 && !this.boss.hadFirstContact;
        return shouldStart;
    }

    /**
     * Handle alert animation completion
     */
    completeAlertAnimation() {
        clearInterval(this.boss.alertAnimationInterval);
        this.boss.alertAnimationPlayed = true;
        setTimeout(() => {
            this.boss.hadFirstContact = true;
            this.boss.movementHandler.startWalking();
        }, 1000);
    }

    /**
     * Starts the alert animation for the end boss character
     * @param {number} interval - Interval ID to clear
     */
    startAlertAnimation(interval) {
        if (!this.boss.alertAnimationPlayed) {
            this.playBossSound(this.boss.alert_sound);
            this.boss.alertAnimationInterval = this.startAnimationInterval(
                this.boss.IMAGES_ALERT, 
                275, 
                () => this.completeAlertAnimation()
            );
            clearInterval(interval);
        }
    }

    /**
     * Stop existing animations for hurt
     */
    stopAnimationsForHurt() {
        if (this.boss.hurtAnimationInterval) {
            clearInterval(this.boss.hurtAnimationInterval);
        }
        if (this.boss.walkingInterval) {
            clearInterval(this.boss.walkingInterval);
            this.boss.walkingInterval = null;
        }
        this.boss.movementHandler.stopMovement();
    }

    /**
     * Create hurt animation interval
     */
    createHurtInterval() {
        let hurtFrameIndex = 0;
        this.boss.hurtAnimationInterval = setInterval(() => {
            if (hurtFrameIndex < this.boss.IMAGES_HURT.length) {
                this.boss.loadImage(this.boss.IMAGES_HURT[hurtFrameIndex]);
                hurtFrameIndex++;
            } else {
                clearInterval(this.boss.hurtAnimationInterval);
                this.boss.hurtAnimationInterval = null;
                this.resetToWalkingState();
            }
        }, 150);
    }

    /**
     * Starts the hurt animation for the end boss character
     */
    startHurtAnimation() {
        this.stopAnimationsForHurt();
        this.playBossSound(this.boss.hurt_sound);
        this.createHurtInterval();
    }

    /**
     * Resets the end boss to walking state after hurt animation
     */
    resetToWalkingState() {
        clearInterval(this.boss.hurtAnimationInterval);
        this.boss.hurtAnimationInterval = null;
        
        setTimeout(() => {
            this.boss.movementHandler.startWalking();
        }, 100);
    }

    /**
     * Checks if the end boss is dead and starts the death process
     */
    bossIsDead() {
        if (this.boss.energy <= 0 && !this.boss.isDead) {
            this.boss.isDead = true;
            this.stopAllAnimations();
            this.playBossSound(this.boss.dead_sound);
            this.startDeathAnimation();
            setTimeout(() => {
                showEndScreen();
            }, 1000);
            this.clearIntervals();
        }
    }

    /**
     * Stops all animations for the end boss
     */
    stopAllAnimations() {
        clearInterval(this.boss.hurtAnimationInterval);
        clearInterval(this.boss.attackAnimationInterval);
        this.boss.movementHandler.stopMovement();
        this.boss.isAttacking = false;
    }

    /**
     * Starts the death animation for the end boss
     */
    startDeathAnimation() {
        this.boss.deathAnimationInterval = this.startAnimationInterval(this.boss.IMAGES_DEAD, 250, () => {
            this.endDeathAnimation();
        });
    }

    /**
     * Ends the death animation for the end boss
     */
    endDeathAnimation() {
        clearInterval(this.boss.deathAnimationInterval);
        this.boss.deathAnimationInterval = null;
        this.boss.loadImage(this.boss.IMAGES_DEAD[this.boss.IMAGES_DEAD.length - 1]);
    }

    /**
     * Clears all animation intervals
     */
    clearIntervals() {
        this.boss.animationIntervals.forEach(interval => clearInterval(interval));
        this.boss.animationIntervals = [];
        this.boss.animationIntervals.forEach(interval => {
            const index = intervals.indexOf(interval);
            if (index !== -1) {
                intervals.splice(index, 1);
            }
        });
    }

    /**
     * Starts an animation interval for a series of images
     * @param {string[]} images - Array of image paths for animation
     * @param {number} intervalTime - Time between animation frames in milliseconds
     * @param {Function} [onComplete=null] - Callback function when animation completes
     * @returns {number} - Interval ID
     */
    startAnimationInterval(images, intervalTime, onComplete = null) {
        let currentFrame = 0;
        const interval = setInterval(() => {
            if (currentFrame < images.length) {
                this.boss.loadImage(images[currentFrame]);
                currentFrame++;
            } else {
                clearInterval(interval);
                if (onComplete) {
                    onComplete();
                }
            }
        }, intervalTime);
        return interval;
    }

    /**
     * Updates the health bar of the end boss
     */
    updateHealthBar() {
        world.endbossHealthbar.setPercentage((this.boss.energy / 180) * 100);
    }
} 
