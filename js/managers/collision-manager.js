/**
 * Verwaltet alle Kollisionen im Spiel
 * @class
 */
class CollisionManager {
    constructor(world) {
        this.world = world;
    }

    /**
     * Überprüft alle Kollisionen
     */
    checkAllCollisions() {
        this.checkCoinCollisions();
        this.checkBottleCollisions();
        this.checkCollisionsWithEnemies();
        this.checkCollisionWithEndboss();
        this.checkBottleHitEndbossCollisions();
    }

    /**
     * Überprüft Münz-Kollisionen
     */
    checkCoinCollisions() {
        // Verwende for-Schleife rückwärts für bessere Performance beim Entfernen
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
     * Überprüft Flaschen-Kollisionen
     */
    checkBottleCollisions() {
        for (let i = this.world.level.bottles.length - 1; i >= 0; i--) {
            let bottle = this.world.level.bottles[i];
            if (this.isCharacterNearBottle(bottle)) {
                // Sammle Flaschen nur wenn noch Platz im Inventar ist
                if (this.world.availableBottles < this.world.bottleBar.MAX_BOTTLES) {
                    this.world.level.bottles.splice(i, 1);
                    this.world.availableBottles++;
                    this.world.bottleBar.setCollectedBottles(this.world.availableBottles);
                    this.world.playGameSound('./audio/bottle_collect.mp3', 0.6);
                }
                // Wenn der Balken voll ist, sammle die Flasche nicht (lasse sie liegen)
            }
        }
    }

    /**
     * Verbesserte Kollisionserkennung für Flaschen-Sammlung
     */
    isCharacterNearBottle(bottle) {
        const buffer = 20; // Reduzierter Buffer für präzisere Kollision

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
     * Überprüft Kollisionen mit Gegnern
     */
    checkCollisionsWithEnemies() {
        let killedEnemies = [];
        let shouldTakeDamage = false;
        
        this.world.level.enemies.forEach((enemy) => {
            if (this.world.character.isColliding(enemy) && enemy.energy > 0) {
                if (this.world.character.isAboveGround() && this.world.character.speedY < 0) {
                    this.handleCollisionAboveGround(enemy);
                    killedEnemies.push(enemy);
                } else if (this.world.character.energy > 0) {
                    shouldTakeDamage = true;
                }
            }
        });
        
        if (shouldTakeDamage && killedEnemies.length === 0) {
            this.handleCollision();
        }
        
        this.checkBottleEnemyCollisions();
    }

    /**
     * Überprüft Kollisionen zwischen Flaschen und Gegnern
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
     * Überprüft Kollisionen zwischen Flaschen und Endboss
     */
    checkBottleHitEndbossCollisions() {
        this.world.throwableObjects.forEach((bottle, index) => {
            if (this.isBottleCollidingWithEndboss(bottle)) {
                this.handleBottleEndbossCollision(bottle, index);
            }
        });
    }

    /**
     * Behandelt Kollision zwischen Flasche und Gegner
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
     * Spielt Gegner-Tod-Animation ab
     */
    playEnemyDeathAnimation(enemy) {
        if (enemy.energy === 0) {
            enemy.playDeathAnimation();
        }
    }

    /**
     * Entfernt Flasche und Gegner nach Kollision
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
     * Überprüft Kollision mit Endboss
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
     * Behandelt Kollision über dem Boden (Springen auf Gegner)
     */
    handleCollisionAboveGround(enemy) {
        enemy.energy--;
        this.world.character.jump();
        this.world.playGameSound('./audio/chicken_hurt.mp3', 0.8);
        if (enemy.energy === 0) {
            enemy.playDeathAnimation();
            setTimeout(() => {
                this.removeEnemyFromLevel(enemy);
            }, 500);
        }
    }

    /**
     * Behandelt normale Kollision (Schaden nehmen)
     */
    handleCollision() {
        this.world.character.hit();
        this.world.statusBar.setPercentage(this.world.character.energy);
        this.world.playGameSound('./audio/hurt.mp3', 0.7);
    }

    /**
     * Entfernt Gegner aus dem Level
     */
    removeEnemyFromLevel(enemy) {
        const index = this.world.level.enemies.indexOf(enemy);
        if (index > -1) {
            this.world.level.enemies.splice(index, 1);
        }
    }

    /**
     * Behandelt Kollision zwischen Flasche und Endboss
     */
    handleBottleEndbossCollision(bottle, index) {
        bottle.hasCollided = true;
        this.world.level.endboss[0].hit();
        this.world.endbossHealthbar.setPercentage((this.world.level.endboss[0].energy / 120) * 100);
        this.world.playBottleShatterSound();
        bottle.animateBottleSplash();
        
        setTimeout(() => {
            this.removeBottleAfterCollision(index);
        }, 1000);
    }

    /**
     * Überprüft ob Flasche mit Endboss kollidiert
     */
    isBottleCollidingWithEndboss(bottle) {
        return this.world.level.endboss[0] && !bottle.hasCollided && this.world.level.endboss[0].isColliding(bottle);
    }

    /**
     * Entfernt Flasche nach Kollision
     */
    removeBottleAfterCollision(bottleIndex) {
        if (this.world.throwableObjects[bottleIndex]) {
            this.world.throwableObjects.splice(bottleIndex, 1);
        }
    }
} 