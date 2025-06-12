/**
 * Verwaltet alle Animationen und Tod des Endbosses
 * @class
 */
class BossAnimations {
    constructor(boss) {
        this.boss = boss;
    }

    /**
     * Prüft ob die Alarm-Animation basierend auf bestimmten Bedingungen starten soll
     */
    shouldStartAlert() {
        const shouldStart = world && world.character.x >= 4500 && !this.boss.hadFirstContact;
        return shouldStart;
    }

    /**
     * Startet die Alarm-Animation für den Endboss-Charakter
     */
    startAlertAnimation(interval) {
        if (!this.boss.alertAnimationPlayed) {
            this.boss.alert_sound.play();
            this.boss.alertAnimationInterval = this.startAnimationInterval(this.boss.IMAGES_ALERT, 275, () => {
                clearInterval(this.boss.alertAnimationInterval);
                this.boss.alertAnimationPlayed = true;
                setTimeout(() => {
                    this.boss.hadFirstContact = true;
                    this.boss.movementHandler.startWalking();
                }, 1000);
            });
            clearInterval(interval);
        }
    }

    /**
     * Startet die Verletzungs-Animation für den Endboss-Charakter
     */
    startHurtAnimation() {
        if (this.boss.hurtAnimationInterval) {
            clearInterval(this.boss.hurtAnimationInterval);
        }
        if (this.boss.walkingInterval) {
            clearInterval(this.boss.walkingInterval);
            this.boss.walkingInterval = null;
        }
        
        this.boss.movementHandler.stopMovement();
        this.boss.hurt_sound.play();
        
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
     * Setzt den Endboss nach der Verletzungs-Animation in den Geh-Zustand zurück
     */
    resetToWalkingState() {
        clearInterval(this.boss.hurtAnimationInterval);
        this.boss.hurtAnimationInterval = null;
        
        setTimeout(() => {
            this.boss.movementHandler.startWalking();
        }, 100);
    }

    /**
     * Prüft ob der Endboss tot ist und startet den Todesprozess
     */
    bossIsDead() {
        if (this.boss.energy <= 0 && !this.boss.isDead) {
            this.boss.isDead = true;
            this.stopAllAnimations();
            this.boss.dead_sound.play();
            this.startDeathAnimation();
            setTimeout(() => {
                showEndScreen();
            }, 1000);
            this.clearIntervals();
        }
    }

    /**
     * Stoppt alle Animationen für den Endboss
     */
    stopAllAnimations() {
        clearInterval(this.boss.hurtAnimationInterval);
        clearInterval(this.boss.attackAnimationInterval);
        this.boss.movementHandler.stopMovement();
        this.boss.isAttacking = false;
    }

    /**
     * Startet die Todes-Animation für den Endboss
     */
    startDeathAnimation() {
        this.boss.deathAnimationInterval = this.startAnimationInterval(this.boss.IMAGES_DEAD, 250, () => {
            this.endDeathAnimation();
        });
    }

    /**
     * Beendet die Todes-Animation für den Endboss
     */
    endDeathAnimation() {
        clearInterval(this.boss.deathAnimationInterval);
        this.boss.deathAnimationInterval = null;
        this.boss.loadImage(this.boss.IMAGES_DEAD[this.boss.IMAGES_DEAD.length - 1]);
    }

    /**
     * Löscht alle Animations-Intervalle
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
     * Startet ein Animations-Intervall für eine Reihe von Bildern
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
     * Aktualisiert die Gesundheitsleiste des Endbosses
     */
    updateHealthBar() {
        world.endbossHealthbar.setPercentage(this.boss.energy);
    }
} 
