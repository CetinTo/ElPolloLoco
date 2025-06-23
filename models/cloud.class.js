/**
 * Represents a cloud object that moves across the screen
 * Extends the MoveableObject class
 * @extends MoveableObject
 */
class Cloud extends MoveableObject {
    /**
     * Y-coordinate position of the cloud
     * @type {number}
     */
    y = 25;
    
    /**
     * Width of the cloud in pixels
     * @type {number}
     */
    width = 400;
    
    /**
     * Height of the cloud in pixels
     * @type {number}
     */
    height = 250;

    /**
     * Creates a new Cloud instance
     * @param {number} [x=0] - X-coordinate position of the cloud
     */
    constructor(x = 0) {
        super().loadImage('img/5_background/layers/4_clouds/1.png');
        this.initializeProperties(x);
        this.startMovement();
    }

    /**
     * Initializes the position of the cloud
     * @param {number} x - X-coordinate position
     */
    initializeProperties(x) {
        this.x = x;
    }

    /**
     * Starts the cloud movement
     */
    startMovement() {
        this.animate();
    }

    /**
     * Animates the cloud movement
     * Moves cloud left and resets position when off screen
     */
    animate() {
        setInterval(() => {
            this.moveLeft();
            if (this.x + this.width < 0) {
                this.x = window.innerWidth + 1000 + Math.random() * 1000; 
            }
        }, 1000 / 60);
    }
}
