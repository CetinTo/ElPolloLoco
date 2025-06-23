/**
 * Represents a bottle object in the game
 * @extends MoveableObject
 */
class Bottles extends MoveableObject {
    /**
     * Width of the bottle in pixels
     * @type {number}
     */
    width = 60;
    
    /**
     * Height of the bottle in pixels
     * @type {number}
     */
    height = 80;
    
    /**
     * Array of bottle images
     * @type {string[]}
     */
    IMAGES_BOTTLE = [
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ];

    /**
     * Creates a new Bottles instance
     * @param {number} x - X-coordinate position
     * @param {number} y - Y-coordinate position
     */
    constructor(x, y) {
        super();
        this.initializeImage();
        this.initializeProperties(x, y);
    }

    /**
     * Loads a random bottle image
     */
    initializeImage() {
        this.loadImage(this.IMAGES_BOTTLE[Math.round(Math.random())]);
    }

    /**
     * Initializes position and properties of the bottle
     * @param {number} x - X-coordinate position
     * @param {number} y - Y-coordinate position
     */
    initializeProperties(x, y) {
        this.x = x + 450;
        this.y = y;
        this.offset = {
            top: 5,
            right: 5,
            bottom: 5,
            left: 5
        };
        this.collected = false;
    }
    
    /**
     * Overrides the draw() method so that collected bottles are not drawn
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     */
    draw(ctx) {
        if (this.collected) return;
        super.draw(ctx);
    }
}
