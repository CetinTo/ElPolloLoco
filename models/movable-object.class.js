/**
 * Class for movable objects in the game
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
     * Applies gravity to the movable object, causing it to fall or move upward
     */
    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0)
                this.y -= this.speedY;
            this.speedY -= this.acceleration;
        }, 1000 / 40);
    }

    /**
     * Checks if the movable object is above ground or falling
     * @returns {boolean} True if above ground, otherwise false
     */
    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        } else {
            return this.y < 150;
        }
    }

    /**
     * Moves the movable object to the right
     */
    moveRight() {
        this.x += this.speed;
    }

    /**
     * Moves the movable object to the left
     */
    moveLeft() {
        this.x -= this.speed;
    }

    /**
     * Makes the movable object jump
     */
    jump() {
        this.speedY = 30;
    }

    /**
     * Checks if the movable object collides with another movable object
     * @param {MoveableObject} mo - The other movable object for collision checking
     * @returns {boolean} True if colliding, otherwise false
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
     * Handles hit event on the movable object and reduces its energy
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
     * Checks if the movable object is hurt based on hit cooldown
     * @returns {boolean} True if hurt, otherwise false
     */
    isHurt() {
        let timePassed = new Date().getTime() - this.lastHitTime;
        timePassed = timePassed / 1000;
        return timePassed < 1;
    }

    /**
     * Checks if the movable object is dead based on energy
     * @returns {boolean} True if dead, otherwise false
     */
    isDead() {
        return this.energy == 0;
    }

    /**
     * Plays an animation on the movable object by updating its image
     * @param {string[]} images - An array of image paths for the animation
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }
}
