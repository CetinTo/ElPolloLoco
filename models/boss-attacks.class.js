/**
 * Manages attacks and jump attacks of the end boss
 * @class
 */
class BossAttacks {
    constructor(boss) {
        this.boss = boss;
    }

    /**
     * Safely plays boss audio with error handling
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
     * Starts balanced attack animation
     */
    startAttackAnimation() {
        if (!this.boss.isAttacking && this.boss.energy > 0) {
            this.boss.isAttacking = true;
            this.boss.movementHandler.stopMovement();
            this.boss.lastAttackTime = Date.now();
            
            const attackSpeed = Math.max(120 - (this.boss.aggressionLevel * 20), 80);
            
            this.boss.attackAnimationInterval = this.boss.animationHandler.startAnimationInterval(this.boss.IMAGES_ATTACK, attackSpeed, () => {
                this.boss.animationHandler.resetToWalkingState();
                this.boss.isAttacking = false;
                clearInterval(this.boss.attackAnimationInterval);
                
                this.boss.speed = 15 + this.boss.aggressionLevel * 3;
                setTimeout(() => {
                    this.boss.movementHandler.updateAggressiveSpeed();
                }, 400);
            });
        }
    }

    /**
     * Checks if the boss should attack - More aggressive
     */
    shouldAttack() {
        if (!world || !world.character || this.boss.isAttacking || this.boss.isJumping) return false;
        
        const distanceToPlayer = Math.abs(this.boss.x - world.character.x);
        const timeSinceLastAttack = Date.now() - this.boss.lastAttackTime;
        
        const attackDistance = 550 + (this.boss.aggressionLevel * 100);
        const attackCooldown = Math.max(400 - (this.boss.aggressionLevel * 100), 200);
        
        return distanceToPlayer < attackDistance && timeSinceLastAttack > attackCooldown && this.boss.energy > 0;
    }
}

/**
 * Manages jump attacks of the end boss
 * @class
 */
class BossJumpAttacks {
    constructor(boss) {
        this.boss = boss;
    }

    /**
     * Checks if boss should perform a jump attack - More frequent and aggressive
     */
    shouldJumpAttack() {
        if (!world || !world.character || this.boss.isJumping || this.boss.isAttacking) return false;
        
        const distanceToPlayer = Math.abs(this.boss.x - world.character.x);
        const timeSinceLastJump = Date.now() - this.boss.lastJumpTime;
        
        const jumpChance = this.boss.aggressionLevel * 0.005;
        
        return distanceToPlayer < 600 && distanceToPlayer > 100 && 
               timeSinceLastJump > 2000 && Math.random() < jumpChance;
    }

    /**
     * Starts large jump attack towards the player
     */
    startJumpAttack() {
        if (!this.boss.isJumping && world && world.character) {
            this.boss.isJumping = true;
            this.boss.lastJumpTime = Date.now();
            
            const playerX = world.character.x;
            const bossX = this.boss.x;
            const distance = Math.abs(playerX - bossX);
            
            this.boss.speedY = -25 - (this.boss.aggressionLevel * 3);
            
            if (playerX < bossX) {
                this.boss.horizontalJumpSpeed = -(12 + this.boss.aggressionLevel * 3);
            } else {
                this.boss.horizontalJumpSpeed = (12 + this.boss.aggressionLevel * 3);
            }
            
            this.playBossSound(this.boss.alert_sound);
            
            setTimeout(() => {
                this.boss.isJumping = false;
                this.boss.speedY = 0;
                this.boss.horizontalJumpSpeed = 0;
                this.boss.y = 55;
            }, 1000);
        }
    }

    /**
     * Jump physics with horizontal movement towards the player
     */
    applyJumpPhysics() {
        this.boss.speedY += 2.5;
        this.boss.y += this.boss.speedY;
        
        if (this.boss.horizontalJumpSpeed !== 0) {
            this.boss.x += this.boss.horizontalJumpSpeed;
        }
        
        if (this.boss.y >= 55) {
            this.boss.y = 55;
            this.boss.speedY = 0;
            this.boss.isJumping = false;
            this.boss.horizontalJumpSpeed = 0;
        }
    }
} 
