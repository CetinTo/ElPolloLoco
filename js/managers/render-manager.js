/**
 * Verwaltet das Rendering des Spiels
 * @class
 */
class RenderManager {
    constructor(world) {
        this.world = world;
    }

    /**
     * Hauptzeichenfunktion - rendert das komplette Spiel
     */
    draw() {
        this.clearCanvas();
        
        // Kamera-Position berechnen
        this.world.camera_x = -this.world.character.x + 100;
        
        // Pixel-perfekte Kamera-Translation
        this.world.ctx.save();
        this.world.ctx.translate(Math.round(this.world.camera_x), 0);
        
        this.drawBackground();
        this.drawClouds();
        this.drawGameObjects();
        this.drawMainCharacter();
        
        this.world.ctx.restore();
        
        this.drawUI();
    }

    /**
     * Zeichnet die Wolken
     */
    drawClouds() {
        this.addObjectsToMap(this.world.level.clouds);
    }

    /**
     * Löscht den Canvas
     */
    clearCanvas() {
        this.world.ctx.clearRect(0, 0, this.world.canvas.width, this.world.canvas.height);
    }

    /**
     * Zeichnet den Hintergrund pixel-perfekt
     */
    drawBackground() {
        this.addObjectsToMap(this.world.level.backgroundObjects);
    }

    /**
     * Zeichnet den Hauptcharakter
     */
    drawMainCharacter() {
        this.addToMap(this.world.character);
    }

    /**
     * Zeichnet die Benutzeroberfläche
     */
    drawUI() {
        // UI wird ohne Kamera-Translation gezeichnet
        this.addToMap(this.world.statusBar);
        this.addToMap(this.world.coinBar);
        this.addToMap(this.world.bottleBar);
        
        this.updateEndbossHealthbarVisibility();
    }

    /**
     * Aktualisiert die Sichtbarkeit der Endboss-Gesundheitsleiste
     */
    updateEndbossHealthbarVisibility() {
        if (this.world.character.x >= 4500) {
            this.world.showEndbossHealthbar = true;
        }
        
        if (this.world.showEndbossHealthbar && this.world.level.endboss && this.world.level.endboss.length > 0) {
            this.addToMap(this.world.endbossHealthbar);
        }
    }

    /**
     * Zeichnet alle Spielobjekte
     */
    drawGameObjects() {
        this.addObjectsToMap(this.world.level.enemies);
        this.addObjectsToMap(this.world.level.endboss);
        this.addObjectsToMap(this.world.level.coins);
        this.addObjectsToMap(this.world.level.bottles);
        this.addObjectsToMap(this.world.throwableObjects);
    }

    /**
     * Fügt mehrere Objekte zur Karte hinzu
     */
    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

    /**
     * Fügt ein Objekt zur Karte hinzu mit pixel-perfektem Rendering
     */
    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }
        
        mo.draw(this.world.ctx);
        
        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    /**
     * Spiegelt das Bild horizontal
     */
    flipImage(mo) {
        this.world.ctx.save();
        this.world.ctx.translate(mo.width, 0);
        this.world.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * Setzt die Bildspiegelung zurück
     */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.world.ctx.restore();
    }
} 