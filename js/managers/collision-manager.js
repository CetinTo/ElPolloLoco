/**
 * Manages all collisions in the game
 * @class
 */
class CollisionManager {
    /**
     * Creates a new CollisionManager instance
     * @param {World} world - Reference to the game world
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * Checks all collisions in the game
     */
    checkAllCollisions() {
        this.checkCoinCollisions();
        this.checkBottleCollisions();
        this.checkCollisionsWithEnemies();
        this.checkCollisionWithEndboss();
        this.checkBottleHitEndbossCollisions();
    }

    /**
     * Checks collisions between character and coins
     */
    checkCoinCollisions() {
        for (let i = this.world.level.coins.length - 1; i >= 0; i--) {
            let coin = this.world.level.coins[i];
            if (this.world.character.isColliding(coin)) {
                this.world.level.coins.splice(i, 1);
                this.world.collectedCoins++;
                this.world.coinBar.setCollectedCoins(this.world.collectedCoins);
                this.world.playGameSound('./audio/coin.mp3', 0.5);
                coin.stopAnimation();
            }
        }
    }

    /**
     * Checks collisions between character and bottles
     */
    checkBottleCollisions() {
        for (let i = this.world.level.bottles.length - 1; i >= 0; i--) {
            let bottle = this.world.level.bottles[i];
            if (this.isCharacterNearBottle(bottle)) {
                if (this.world.availableBottles < this.world.bottleBar.MAX_BOTTLES) {
                    this.world.level.bottles.splice(i, 1);
                    this.world.availableBottles++;
                    this.world.bottleBar.setCollectedBottles(this.world.availableBottles);
                    this.world.playGameSound('./audio/bottle_collect.mp3', 0.6);
                }
            }
        }
    }

    /**
     * Improved collision detection for bottle collection
     * @param {Bottles} bottle - The bottle to check collision with
     * @returns {boolean} - True if character is near bottle
     */
    isCharacterNearBottle(bottle) {
        const buffer = 20;

        const char = this.world.character;
        const charLeft = char.x + char.offset.left;
        const charRight = char.x + char.width - char.offset.right;
        const charTop = char.y + char.offset.top;
        const charBottom = char.y + char.height - char.offset.bottom;

        const bottleLeft = bottle.x;
        const bottleRight = bottle.x + (bottle.width || 40);
        const bottleTop = bottle.y;
        const bottleBottom = bottle.y + (bottle.height || 40);

        const horizontallyOverlapping = charRight > bottleLeft && charLeft < bottleRight;
        const verticallyOverlapping = charBottom > bottleTop && charTop < bottleBottom;

        return horizontallyOverlapping && verticallyOverlapping;
    }

    /**
     * Find enemies to kill from jumping
     * @returns {Object} - Object containing jump status and enemies to kill
     * @returns {boolean} returns.hasJumpedOnAnyEnemy - Whether character jumped on any enemy
     * @returns {Array} returns.enemiesToKill - Array of enemies to kill
     */
    findEnemiesToKill() {
        let hasJumpedOnAnyEnemy = false;
        let enemiesToKill = [];
        
        this.world.level.enemies.forEach((enemy) => {
            if (this.world.character.isColliding(enemy) && enemy.energy > 0) {
                if (this.isCharacterJumpingOnEnemy(enemy)) {
                    enemiesToKill.push(enemy);
                    hasJumpedOnAnyEnemy = true;
                }
            }
        });
        
        return { hasJumpedOnAnyEnemy, enemiesToKill };
    }

    /**
     * Add nearby enemies to kill list
     * @param {Array} enemiesToKill - Array of enemies to kill
     */
    addNearbyEnemiesToKill(enemiesToKill) {
        this.world.level.enemies.forEach((enemy) => {
            if (enemy.energy > 0 && this.isEnemyNearJumpingCharacter(enemy)) {
                if (!enemiesToKill.includes(enemy)) {
                    enemiesToKill.push(enemy);
                }
            }
        });
    }

    /**
     * Execute enemy deaths from jumping
     * @param {Array} enemiesToKill - Array of enemies to kill
     */
    executeEnemyDeaths(enemiesToKill) {
        enemiesToKill.forEach((enemy) => {
            enemy.energy = 0;
            enemy.playDeathAnimation();
            setTimeout(() => {
                const index = this.world.level.enemies.indexOf(enemy);
                if (index > -1) {
                    this.world.level.enemies.splice(index, 1);
                }
            }, 500);
        });
    }

    /**
     * Handle jump attacks on enemies
     * @param {Array} enemiesToKill - Array of enemies to kill
     */
    handleJumpAttacks(enemiesToKill) {
        this.addNearbyEnemiesToKill(enemiesToKill);
        this.executeEnemyDeaths(enemiesToKill);
        this.world.playGameSound('./audio/chicken_hurt.mp3', 0.8);
        this.world.character.jump();
    }

    /**
     * Handle normal enemy collisions without jumping
     */
    handleNormalEnemyCollisions() {
        this.world.level.enemies.forEach((enemy) => {
            if (this.world.character.isColliding(enemy) && enemy.energy > 0) {
                this.world.character.hit();
                this.world.statusBar.setPercentage(this.world.character.energy);
            }
        });
    }

    /**
     * Checks collisions with enemies (jumping vs normal collision)
     */
    checkCollisionsWithEnemies() {
        const { hasJumpedOnAnyEnemy, enemiesToKill } = this.findEnemiesToKill();
        
        if (hasJumpedOnAnyEnemy) {
            this.handleJumpAttacks(enemiesToKill);
        } else {
            this.handleNormalEnemyCollisions();
        }
        
        this.checkBottleEnemyCollisions();
    }

    /**
     * Checks if character is jumping on enemy from above
     * @param {Object} enemy - The enemy
     * @returns {boolean} - True if character is jumping from above
     */
    isCharacterJumpingOnEnemy(enemy) {
        const character = this.world.character;
        
        const isFalling = character.speedY < 0;
        
        const isInAir = character.isAboveGround();
        
        const characterBottom = character.y + character.height;
        const enemyTop = enemy.y;
        const enemyMiddle = enemy.y + (enemy.height / 2);
        
        const comingFromAbove = characterBottom < enemyMiddle + 40;
        
        return isFalling && isInAir && comingFromAbove;
    }

    /**
     * Checks if enemy is near jumping character
     * @param {Object} enemy - The enemy to check
     * @returns {boolean} - True if enemy is close enough
     */
    isEnemyNearJumpingCharacter(enemy) {
        const character = this.world.character;
        const distance = Math.abs(character.x - enemy.x);
        const verticalDistance = Math.abs(character.y - enemy.y);
        
        return distance <= 100 && verticalDistance <= 80;
    }

    /**
     * Handles normal collision (taking damage)
     */
    handleCollision() {
        this.world.character.hit();
        this.world.statusBar.setPercentage(this.world.character.energy);
    }

    /**
     * Checks collisions between bottles and enemies
     */
    checkBottleEnemyCollisions() {
        this.world.throwableObjects.forEach((bottle, bottleIndex) => {
            this.world.level.enemies.forEach((enemy) => {
                if (!bottle.hasCollided && enemy.energy > 0 && enemy.isColliding(bottle)) {
                    this.handleBottleEnemyCollision(bottle, bottleIndex, enemy);
                }
            });
        });
    }

    /**
     * Checks collisions between bottles and endboss
     */
    checkBottleHitEndbossCollisions() {
        this.world.throwableObjects.forEach((bottle, index) => {
            if (this.isBottleCollidingWithEndboss(bottle)) {
                this.handleBottleEndbossCollision(bottle, index);
            }
        });
    }

    /**
     * Handles collision between bottle and enemy
     * @param {ThrowableObject} bottle - The bottle that collided
     * @param {number} bottleIndex - Index of the bottle in array
     * @param {Object} enemy - The enemy that was hit
     */
    handleBottleEnemyCollision(bottle, bottleIndex, enemy) {
        bottle.hasCollided = true;
        enemy.energy--;
        this.playEnemyDeathAnimation(enemy);
        this.world.playBottleShatterSound();
        bottle.animateBottleSplash();
        this.removeBottleAndEnemyAfterCollision(bottleIndex, enemy);
    }

    /**
     * Plays enemy death animation if enemy is dead
     * @param {Object} enemy - The enemy to check
     */
    playEnemyDeathAnimation(enemy) {
        if (enemy.energy === 0) {
            enemy.playDeathAnimation();
        }
    }

    /**
     * Removes bottle and enemy after collision with delay
     * @param {number} bottleIndex - Index of bottle to remove
     * @param {Object} enemy - Enemy to remove if dead
     */
    removeBottleAndEnemyAfterCollision(bottleIndex, enemy) {
        if (enemy.energy === 0) {
            setTimeout(() => {
                this.removeEnemyFromLevel(enemy);
            }, 500);
        }
        setTimeout(() => {
            this.removeBottleAfterCollision(bottleIndex);
        }, 1000);
    }

    /**
     * Checks collision with endboss
     */
    checkCollisionWithEndboss() {
        if (this.world.level.endboss && this.world.level.endboss.length > 0) {
            this.world.level.endboss.forEach(boss => {
                if (this.world.character.isColliding(boss)) {
                    this.handleCollision();
                }
            });
        }
    }

    /**
     * Handles collision between bottle and endboss
     * @param {ThrowableObject} bottle - The bottle that hit the boss
     * @param {number} index - Index of the bottle
     */
    handleBottleEndbossCollision(bottle, index) {
        bottle.hasCollided = true;
        this.world.level.endboss[0].bossIsHit();
        this.world.playBottleShatterSound();
        bottle.animateBottleSplash();
        
        setTimeout(() => {
            this.removeBottleAfterCollision(index);
        }, 1000);
    }

    /**
     * Checks if bottle is colliding with endboss
     * @param {ThrowableObject} bottle - The bottle to check
     * @returns {boolean} - True if colliding with endboss
     */
    isBottleCollidingWithEndboss(bottle) {
        return this.world.level.endboss[0] && !bottle.hasCollided && this.world.level.endboss[0].isColliding(bottle);
    }

    /**
     * Removes enemy from level
     * @param {Object} enemy - Enemy to remove
     */
    removeEnemyFromLevel(enemy) {
        const index = this.world.level.enemies.indexOf(enemy);
        if (index > -1) {
            this.world.level.enemies.splice(index, 1);
        }
    }

    /**
     * Removes bottle after collision
     * @param {number} bottleIndex - Index of bottle to remove
     */
    removeBottleAfterCollision(bottleIndex) {
        if (this.world.throwableObjects[bottleIndex]) {
            this.world.throwableObjects.splice(bottleIndex, 1);
        }
    }
} 
