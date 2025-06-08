let requestAnimationFrameId = 0;

/**
 * Repräsentiert die Spielwelt, in der Charaktere und Objekte interagieren
 * @class
 */
class World {
    character = new Character();
    coinBar = new CoinBar();
    bottleBar = new BottleBar();
    endbossHealthbar = new EndbossHealthbar();
    statusBar = new Statusbar();
    throwableObjects = [];
    level; 
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    collectedCoins = 0;
    showEndbossHealthbar = false;
    gameOver = false;
    canThrowBottle = true;
    availableBottles = 0;

    constructor(canvas, keyboard, level1) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.level = level1;
        
        // Optimiere Canvas für perfekt nahtlose Hintergrundbilder
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.webkitImageSmoothingEnabled = false;
        this.ctx.mozImageSmoothingEnabled = false;
        this.ctx.msImageSmoothingEnabled = false;
        this.ctx.oImageSmoothingEnabled = false;
        
        // Erzwinge Pixel-perfektes Rendering
        this.ctx.translate(0.5, 0.5);
        this.ctx.scale(1, 1);
        this.ctx.translate(-0.5, -0.5);
        
        this.setWorld();
        
        // Rendere sofort mehrere Frames um schwarzes Bild zu vermeiden
        this.draw();
        setTimeout(() => this.draw(), 10);
        setTimeout(() => this.draw(), 50);
        
        this.run();
    }

    /**
     * Setzt die Welt-Referenz für den Charakter
     */
    setWorld() {
        this.character.world = this;
    }

    /**
     * Startet die Hauptspiel-Schleife
     */
    run() {
        const loop = () => {
            if (!this.character || this.gameOver) return;
    
            this.checkCoinCollisions();
            this.checkBottleCollisions();
            this.checkThrowObjects();
            this.checkCollisions();
            this.checkBottleHitEndbossCollisions();
    
            requestAnimationFrame(loop); 
        };
        requestAnimationFrame(loop); 
    }
    
    /**
     * Überprüft alle Kollisionen
     */
    checkCollisions() {
        this.checkCollisionsWithEnemies();
        this.checkCollisionWithEndboss();
    }

    /**
     * Setzt die Spielwelt zurück
     */
    resetWorld() {
        this.availableBottles = 0;
        this.throwableObjects = [];
        this.gameOver = false;
        this.camera_x = 0;
        this.collectedCoins = 0;
        this.showEndbossHealthbar = false;

        // Level1 neu initialisieren
        initLevel();
        this.level = level1;
        
        this.character = new Character();
        this.character.world = this;
    }

    /**
     * Überprüft Kollisionen mit Gegnern
     */
    checkCollisionsWithEnemies() {
        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy) && enemy.energy > 0) {
                if (this.character.isAboveGround() && this.character.speedY < 0) {
                    this.handleCollisionAboveGround(enemy);
                } else if (this.character.energy > 0) {
                    this.handleCollision();
                }
            }
        });
        this.checkBottleEnemyCollisions();
    }

    /**
     * Überprüft Kollisionen zwischen Flaschen und Gegnern
     */
    checkBottleEnemyCollisions() {
        this.throwableObjects.forEach((bottle, bottleIndex) => {
            this.level.enemies.forEach((enemy) => {
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
        this.throwableObjects.forEach((bottle, index) => {
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
        this.playBottleShatterSound();
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
        if (this.level.endboss && this.level.endboss.length > 0) {
            this.level.endboss.forEach(boss => {
                if (this.character.isColliding(boss)) {
                    this.handleCollision();
                }
            });
        }
    }

    /**
     * Überprüft Münz-Kollisionen
     */
    checkCoinCollisions() {
        // Verwende for-Schleife rückwärts für bessere Performance beim Entfernen
        for (let i = this.level.coins.length - 1; i >= 0; i--) {
            let coin = this.level.coins[i];
            if (this.character.isColliding(coin)) {
                this.level.coins.splice(i, 1);
                this.coinBar.setCollectedCoins(this.coinBar.collectedCoins + 1);
                if (!isGameMuted) {
                    this.playGameSound('audio/coin.mp3', 0.1);
                }
                coin.stopAnimation();
            }
        }
    }

    /**
     * Überprüft Flaschen-Kollisionen
     */
    checkBottleCollisions() {
        for (let i = this.level.bottles.length - 1; i >= 0; i--) {
            let bottle = this.level.bottles[i];
            if (this.isCharacterNearBottle(bottle)) {
                if (this.availableBottles < this.bottleBar.MAX_BOTTLES) {
                    this.level.bottles.splice(i, 1);
                    this.availableBottles++;
                    let visibleBottles = Math.min(this.availableBottles, this.bottleBar.MAX_BOTTLES);
                    this.bottleBar.setCollectedBottles(visibleBottles);
                    if (!isGameMuted) {
                        this.playGameSound('audio/bottle_collect.mp3', 1);
                    }
                }
            }
        }
    }
    
    /**
     * Präziserer Bounding-Box-Check für Flaschen-Sammlung mit Puffer
     */
    isCharacterNearBottle(bottle) {
        const buffer = 30; 

        const char = this.character;
        const charLeft = char.x + char.offset.left + buffer;
        const charRight = char.x + char.width - char.offset.right - buffer;
        const charTop = char.y + char.offset.top + buffer;
        const charBottom = char.y + char.height - char.offset.bottom - buffer;

        const bottleLeft = bottle.x;
        const bottleRight = bottle.x + (bottle.width || 40);
        const bottleTop = bottle.y;
        const bottleBottom = bottle.y + (bottle.height || 40);

        const horizontallyOverlapping = charRight > bottleLeft && charLeft < bottleRight;
        const verticallyOverlapping = charBottom > bottleTop && charTop < bottleBottom;

        return horizontallyOverlapping && verticallyOverlapping;
    }

    /**
     * Überprüft Wurf-Objekte
     */
    checkThrowObjects() {
        if (this.keyboard.D && this.canThrowBottle && this.availableBottles > 0 && !this.character.otherDirection) {
            let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
            this.throwableObjects.push(bottle);
            this.availableBottles--;
            let visibleBottles = Math.min(this.availableBottles, this.bottleBar.MAX_BOTTLES);
            this.bottleBar.setCollectedBottles(visibleBottles);
            if (!isGameMuted) {
                this.playGameSound('audio/bottle_throw.mp3', 0.2);
            }
            
            this.canThrowBottle = false;
            setTimeout(() => {
                this.canThrowBottle = true;
            }, 650);
        }
    }

    /**
     * Behandelt Kollision zwischen Flasche und Endboss
     */
    handleBottleEndbossCollision(bottle, index) {
        bottle.hasCollided = true;
        this.level.endboss[0].bossIsHit();
        this.playBottleShatterSound();
        bottle.animateBottleSplash();
        
        setTimeout(() => {
            this.throwableObjects.splice(index, 1); 
            let visibleBottles = Math.min(this.availableBottles, this.bottleBar.MAX_BOTTLES);
            this.bottleBar.setCollectedBottles(visibleBottles);
        }, 1000);
    }

    /**
     * Prüft ob Flasche mit Endboss kollidiert
     */
    isBottleCollidingWithEndboss(bottle) {
        return !bottle.hasCollided && this.level.endboss[0].isColliding(bottle);
    }

    /**
     * Entfernt Flasche nach Kollision
     */
    removeBottleAfterCollision(bottleIndex) {
        this.throwableObjects.splice(bottleIndex, 1);
    }

    /**
     * Behandelt Kollision mit Charakter
     */
    handleCollision() {
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy);
    }

    /**
     * Behandelt Kollision über dem Boden
     */
    handleCollisionAboveGround(enemy) {
        enemy.energy--;
        this.character.jump();
        if (enemy.energy === 0) {
            enemy.playDeathAnimation();
            setTimeout(() => {
                this.removeEnemyFromLevel(enemy);
            }, 500);
        }
    }

    /**
     * Entfernt Gegner aus dem Level
     */
    removeEnemyFromLevel(enemy) {
        const index = this.level.enemies.indexOf(enemy);
        if (index > -1) {
            this.level.enemies.splice(index, 1);
        }
    }

    /**
     * Prüft ob Endboss besiegt ist
     */
    isEndbossDefeated() {
        return this.level.endboss[0] && this.level.endboss[0].isDead;
    }

    /**
     * Prüft ob Charakter tot ist
     */
    isCharacterDead() {
        return this.character && this.character.energy <= 0;
    }

    /**
     * Beendet das Spiel
     */
    endGame() {
        if (!this.gameOver) {
            this.gameOver = true;
            this.bottleBar.setCollectedBottles(0);
            this.throwableObjects = [];
            showEndScreen();
        }
    }

    /**
     * Zeichnet die gesamte Spielwelt
     */
    draw() {
        if (!gameActive) {
            return;
        }
        
        this.clearCanvas();
        
        this.drawBackground(); 
        this.drawClouds();     
    
        this.drawMainCharacter(); 
        this.drawUI();            
        this.drawGameObjects();   
    
        requestAnimationFrameId = requestAnimationFrame(() => this.draw());
    }
    
    /**
     * Zeichnet die Wolken
     */
    drawClouds() {
        const roundedCameraX = Math.round(this.camera_x);
        this.ctx.translate(roundedCameraX, 0);
        this.addObjectsToMap(this.level.clouds);
        this.ctx.translate(-roundedCameraX, 0);
    }
    
    /**
     * Löscht das Canvas
     */
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Zeichnet den Hintergrund
     */
    drawBackground() {
        // Pixel-perfekte Kamera-Translation
        const roundedCameraX = Math.round(this.camera_x);
        this.ctx.translate(roundedCameraX, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.ctx.translate(-roundedCameraX, 0);
    }

    /**
     * Zeichnet den Hauptcharakter
     */
    drawMainCharacter() {
        const roundedCameraX = Math.round(this.camera_x);
        this.ctx.translate(roundedCameraX, 0);
        this.addToMap(this.character);    
        this.ctx.translate(-roundedCameraX, 0);
    }

    /**
     * Zeichnet die Benutzeroberfläche
     */
    drawUI() {
        this.addToMap(this.statusBar);
        this.addToMap(this.bottleBar);
        this.addToMap(this.coinBar);
        this.updateEndbossHealthbarVisibility();
        if (this.showEndbossHealthbar) {
            this.addToMap(this.endbossHealthbar);
        }
    
        this.ctx.font = '20px Arial';
        this.ctx.fillStyle = 'white';
    }

    /**
     * Aktualisiert die Sichtbarkeit der Endboss-Gesundheitsleiste
     */
    updateEndbossHealthbarVisibility() {
        if (this.character.x >= 4500) {
            this.showEndbossHealthbar = true;
        }
    }

    /**
     * Zeichnet alle Spielobjekte
     */
    drawGameObjects() {
        const roundedCameraX = Math.round(this.camera_x);
        this.ctx.translate(roundedCameraX, 0);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.endboss);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.throwableObjects);
        this.ctx.translate(-roundedCameraX, 0);
    }

    /**
     * Fügt Objekte zur Karte hinzu
     */
    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

    /**
     * Fügt ein Objekt zur Karte hinzu
     */
    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }
        
        // Pixel-perfekte Positionierung für nahtlose Hintergrundbilder
        const x = Math.floor(mo.x);
        const y = Math.floor(mo.y);
        
        this.ctx.drawImage(mo.img, x, y, mo.width, mo.height);
        
        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    /**
     * Spiegelt ein Bild horizontal
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * Stellt das gespiegelte Bild wieder her
     */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }

    /**
     * Spielt einen Spielsound ab
     */
    playGameSound(soundFilePath, volume = 0.2) {
        if (isGameMuted) return;
        
        let audio = new Audio(soundFilePath);
        audio.volume = volume;
        
        audio.play().then(() => {
            // Audio erfolgreich abgespielt
        }).catch(error => {
            // Fehler beim Abspielen
            
            // Fallback: Versuche es nochmal nach kurzer Verzögerung
            setTimeout(() => {
                audio.play().catch(e => {
                    // Fallback fehlgeschlagen
                });
            }, 100);
        });
    }

    /**
     * Spielt den Flaschen-Zersplitter-Sound ab
     */
    playBottleShatterSound() {
        if (!isGameMuted) {
            this.playGameSound('audio/bottle_shatter.mp3');
        }
    }
}
