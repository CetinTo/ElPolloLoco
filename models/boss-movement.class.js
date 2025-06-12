/**
 * Verwaltet die Bewegung und Geschwindigkeit des Endbosses
 * @class
 */
class BossMovement {
    constructor(boss) {
        this.boss = boss;
    }

    /**
     * Aktualisiert das Aggressions-Level basierend auf der Energie
     */
    updateAggressionLevel() {
        if (this.boss.energy <= 40) {
            this.boss.aggressionLevel = 3;
        } else if (this.boss.energy <= 80) {
            this.boss.aggressionLevel = 2;
        } else {
            this.boss.aggressionLevel = 1;
        }
    }

    /**
     * Balancierte Boss-Geschwindigkeit
     */
    updateAggressiveSpeed() {
        this.boss.speed = 8 + this.boss.aggressionLevel * 3;
        
        if (world && world.character) {
            const distance = Math.abs(this.boss.x - world.character.x);
            if (distance < 400) {
                this.boss.speed += 5;
            }
        }
        
        if (this.boss.energy < 60) {
            this.boss.speed += 4;
        }
        if (this.boss.energy < 30) {
            this.boss.speed += 6;
        }
    }

    /**
     * Startet das Geh-Verhalten für den Endboss-Charakter
     */
    startWalking() {
        if (this.boss.walkingInterval) {
            clearInterval(this.boss.walkingInterval);
        }
        
        this.boss.walkingInterval = setInterval(() => {
            if (this.boss.energy > 0 && !this.boss.isDead && !this.boss.isAttacking && !this.boss.hurtAnimationInterval) {
                this.updateAggressionLevel();
                
                this.updateAggressiveSpeed();
                this.boss.x -= this.boss.speed;
                
                if (this.boss.isJumping) {
                    this.boss.jumpHandler.applyJumpPhysics();
                }
                
                if (this.boss.jumpHandler.shouldJumpAttack()) {
                    this.boss.jumpHandler.startJumpAttack();
                }
                
                if (this.boss.attackHandler.shouldAttack()) {
                    this.boss.attackHandler.startAttackAnimation();
                    return;
                }
                
                if (!this.boss.hurtAnimationInterval) {
                    this.boss.playAnimation(this.boss.IMAGES_WALKING);
                }
            } else if (this.boss.animationHandler.bossIsDead()) {
                clearInterval(this.boss.walkingInterval);
                this.boss.walkingInterval = null;
            }
        }, 40);
        
        this.boss.animationIntervals.push(this.boss.walkingInterval);
        addInterval(this.boss.walkingInterval);
    }

    /**
     * Stoppt die Bewegung des Endbosses durch Setzen der Geschwindigkeit auf 0
     */
    stopMovement() {
        this.boss.speed = 0;
    }

    /**
     * Setzt die Bewegung des Endbosses nach einer bestimmten Verzögerung fort
     */
    resumeMovementAfterDelay(delay) {
        setTimeout(() => {
            this.boss.speed = 8 + Math.random() * 1.2;
        }, delay * 1000);
    }
} 
