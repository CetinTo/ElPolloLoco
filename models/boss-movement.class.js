/**
 * Manages the movement and speed of the end boss
 * @class
 */
class BossMovement {
    /**
     * Creates a new BossMovement instance
     * @param {Endboss} boss - Reference to the boss object
     */
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
     * Balanced boss speed based on aggression level, distance to player, and energy
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
     * Check if boss can move based on state conditions
     * @returns {boolean} - True if boss can move
     */
    canBossMove() {
        return this.boss.energy > 0 && 
               !this.boss.isDead && 
               !this.boss.isAttacking && 
               !this.boss.hurtAnimationInterval;
    }

    /**
     * Handle boss movement and attacks logic
     */
    handleBossMovement() {
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
    }

    /**
     * Create walking interval for boss movement
     */
    createWalkingInterval() {
        this.boss.walkingInterval = setInterval(() => {
            if (this.canBossMove()) {
                this.handleBossMovement();
            } else if (this.boss.animationHandler.bossIsDead()) {
                clearInterval(this.boss.walkingInterval);
                this.boss.walkingInterval = null;
            }
        }, 30);
    }

    /**
     * Register walking interval for cleanup
     */
    registerWalkingInterval() {
        this.boss.animationIntervals.push(this.boss.walkingInterval);
        addInterval(this.boss.walkingInterval);
    }

    /**
     * Starts the walking behavior for the end boss character
     */
    startWalking() {
        if (this.boss.walkingInterval) {
            clearInterval(this.boss.walkingInterval);
        }
        this.createWalkingInterval();
        this.registerWalkingInterval();
    }

    /**
     * Stops the movement of the end boss by setting speed to 0
     */
    stopMovement() {
        this.boss.speed = 0;
    }

    /**
     * Resumes the movement of the end boss after a certain delay
     * @param {number} delay - Delay in seconds before resuming movement
     */
    resumeMovementAfterDelay(delay) {
        setTimeout(() => {
            this.boss.speed = 8 + Math.random() * 1.2;
        }, delay * 1000);
    }
} 
