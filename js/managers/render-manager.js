/**
 * Manages rendering of all game objects
 * @class
 */
class RenderManager {
    constructor(world) {
        this.world = world;
    }

    /**
     * Clear canvas and setup camera
     */
    setupCanvas() {
        this.world.ctx.clearRect(0, 0, this.world.canvas.width, this.world.canvas.height);
        this.world.camera_x = -this.world.character.x + 100;
        this.world.ctx.translate(this.world.camera_x, 0);
    }

    /**
     * Render world objects with camera
     */
    renderWorldObjects() {
        this.addObjectsToMap(this.world.level.backgroundObjects);
        this.addObjectsToMap(this.world.level.clouds);
        this.addObjectsToMap(this.world.level.coins);
        this.addObjectsToMap(this.world.level.bottles);
        this.addObjectsToMap(this.world.level.enemies);
        this.addObjectsToMap(this.world.level.endboss);
        this.addToMap(this.world.character);
        this.addObjectsToMap(this.world.throwableObjects);
    }

    /**
     * Render UI elements without camera
     */
    renderUI() {
        this.world.ctx.translate(-this.world.camera_x, 0);
        this.addToMap(this.world.statusBar);
        this.addToMap(this.world.coinBar);
        this.addToMap(this.world.bottleBar);
    }

    /**
     * Render endboss healthbar if needed
     */
    renderEndbossHealthbar() {
        if (this.world.character.x >= 4500) {
            this.world.showEndbossHealthbar = true;
        }
        if (this.world.showEndbossHealthbar && this.world.level.endboss && this.world.level.endboss.length > 0) {
            this.addToMap(this.world.endbossHealthbar);
        }
    }

    /**
     * Renders all game objects
     */
    draw() {
        this.setupCanvas();
        this.renderWorldObjects();
        this.renderUI();
        this.renderEndbossHealthbar();
    }

    /**
     * Adds object to map
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
     * Adds array of objects to map
     */
    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

    /**
     * Flips image horizontally
     */
    flipImage(mo) {
        this.world.ctx.save();
        this.world.ctx.translate(mo.width, 0);
        this.world.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * Restores image orientation
     */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.world.ctx.restore();
    }
} 
