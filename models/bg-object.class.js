/**
 * Class that represents a background object in the game
 * @extends MoveableObject
 */

class BackgroundObject extends MoveableObject {

    width = 720;
    height = 480;

    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.initializeProperties(x);
    }

    /**
     * Initializes position of the background object
     */
    initializeProperties(x) {
        this.x = x;
        this.y = 480 - this.height;
    }
}
