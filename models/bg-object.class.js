/**
 * Class that represents a background object in the game
 * @extends MoveableObject
 */

class BackgroundObject extends MoveableObject {
    /**
     * Width of the background object in pixels
     * @type {number}
     */
    width = 720;
    
    /**
     * Height of the background object in pixels
     * @type {number}
     */
    height = 480;

    /**
     * Creates a new BackgroundObject instance
     * @param {string} imagePath - Path to the background image
     * @param {number} x - X-coordinate position
     */
    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.initializeProperties(x);
    }

    /**
     * Initializes position of the background object
     * @param {number} x - X-coordinate position
     */
    initializeProperties(x) {
        this.x = x;
        this.y = 480 - this.height;
    }
}
