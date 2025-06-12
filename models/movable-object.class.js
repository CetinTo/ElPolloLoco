/**
 * Klasse für bewegliche Objekte im Spiel
 * @extends DrawableObject
 */
class MoveableObject extends DrawableObject {
    speed = 0.2;
    otherDirection = false;
    speedY = 0;
    acceleration = 2;
    energy = 100;
    lastHitTime = 0;
    hitCooldown = 250;

    /**
     * Wendet Schwerkraft auf das bewegliche Objekt an, wodurch es fällt oder sich nach oben bewegt
     */
    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0)
                this.y -= this.speedY;
            this.speedY -= this.acceleration;
        }, 1000 / 40);
    }

    /**
     * Prüft ob das bewegliche Objekt über dem Boden ist oder fällt
     * @returns {boolean} True wenn über dem Boden, andernfalls false
     */
    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        } else {
            return this.y < 150;
        }
    }

    /**
     * Bewegt das bewegliche Objekt nach rechts
     */
    moveRight() {
        this.x += this.speed;
    }

    /**
     * Bewegt das bewegliche Objekt nach links
     */
    moveLeft() {
        this.x -= this.speed;
    }

    /**
     * Lässt das bewegliche Objekt springen
     */
    jump() {
        this.speedY = 30;
    }

    /**
     * Prüft ob das bewegliche Objekt mit einem anderen beweglichen Objekt kollidiert
     * @param {MoveableObject} mo - Das andere bewegliche Objekt für die Kollisionsprüfung
     * @returns {boolean} True wenn kollidierend, andernfalls false
     */
    isColliding(mo) {
        return (
            this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
            this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
            this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
            this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom
        );
    }

    /**
     * Behandelt das Treffer-Ereignis auf dem beweglichen Objekt und reduziert seine Energie
     */
    hit() {
        const currentTime = new Date().getTime();
        if (currentTime - this.lastHitTime > this.hitCooldown) {
            this.lastHitTime = currentTime;
            this.energy -= 10;

            if (this.energy < 0) {
                this.energy = 0;
            }
        }
    }

    /**
     * Prüft ob das bewegliche Objekt verletzt ist basierend auf der Treffer-Abklingzeit
     * @returns {boolean} True wenn verletzt, andernfalls false
     */
    isHurt() {
        let timePassed = new Date().getTime() - this.lastHitTime;
        timePassed = timePassed / 1000;
        return timePassed < 1;
    }

    /**
     * Prüft ob das bewegliche Objekt tot ist basierend auf der Energie
     * @returns {boolean} True wenn tot, andernfalls false
     */
    isDead() {
        return this.energy == 0;
    }

    /**
     * Spielt eine Animation auf dem beweglichen Objekt ab durch Aktualisierung seines Bildes
     * @param {string[]} images - Ein Array von Bildpfaden für die Animation
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }
}
