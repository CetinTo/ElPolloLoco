/**
 * Verwaltet das Rendering aller Spielobjekte
 * @class
 */
class RenderManager {
    constructor(world) {
        this.world = world;
    }

    /**
     * Rendert alle Spielobjekte
     */
    draw() {
        this.world.ctx.clearRect(0, 0, this.world.canvas.width, this.world.canvas.height);
        
        this.world.camera_x = -this.world.character.x + 100;
        
        this.world.ctx.translate(this.world.camera_x, 0);
        
        this.addObjectsToMap(this.world.level.backgroundObjects);
        this.addObjectsToMap(this.world.level.clouds);
        this.addObjectsToMap(this.world.level.coins);
        this.addObjectsToMap(this.world.level.bottles);
        this.addObjectsToMap(this.world.level.enemies);
        this.addObjectsToMap(this.world.level.endboss);
        this.addToMap(this.world.character);
        this.addObjectsToMap(this.world.throwableObjects);
        
        this.world.ctx.translate(-this.world.camera_x, 0);
        
        this.addToMap(this.world.statusBar);
        this.addToMap(this.world.coinBar);
        this.addToMap(this.world.bottleBar);
        
        if (this.world.character.x >= 4500) {
            this.world.showEndbossHealthbar = true;
        }
        
        if (this.world.showEndbossHealthbar && this.world.level.endboss && this.world.level.endboss.length > 0) {
            this.addToMap(this.world.endbossHealthbar);
        }
    }

    /**
     * Fügt Objekt zur Karte hinzu
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
     * Fügt Array von Objekten zur Karte hinzu
     */
    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

    /**
     * Spiegelt Bild horizontal
     */
    flipImage(mo) {
        this.world.ctx.save();
        this.world.ctx.translate(mo.width, 0);
        this.world.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * Stellt Bildorientierung wieder her
     */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.world.ctx.restore();
    }
} 
