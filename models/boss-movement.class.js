/**
 * Manages the movement and speed of the end boss
 * @class
 */
class BossMovement {
    constructor(boss) {
        this.boss = boss;
    }

    /**
     * Updates the aggression level based on energy
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
     * Balanced boss speed
     */
    updateAggressiveSpeed() {
        this.boss.speed = 40 + this.boss.aggressionLevel * 15;
        
        if (world && world.character) {
            const distance = Math.abs(this.boss.x - world.character.x);
            if (distance < 700) {
                this.boss.speed += 25;
            }
        }
        
        if (this.boss.energy < 60) {
            this.boss.speed += 20;
        }
        if (this.boss.energy < 30) {
            this.boss.speed += 25;
        }
    }

    /**
     * Starts the walking behavior for the end boss character
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
        }, 30);
        
        this.boss.animationIntervals.push(this.boss.walkingInterval);
        addInterval(this.boss.walkingInterval);
    }

    /**
     * Stops the movement of the end boss by setting speed to 0
     */
    stopMovement() {
        this.boss.speed = 0;
    }

    /**
     * Resumes the movement of the end boss after a certain delay
     */
    resumeMovementAfterDelay(delay) {
        setTimeout(() => {
            this.boss.speed = 8 + Math.random() * 1.2;
        }, delay * 1000);
    }
} 
