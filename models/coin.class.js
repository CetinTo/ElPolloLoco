/**
 * Represents a coin object that can be collected by the character
 * @extends MoveableObject
 */

class Coin extends MoveableObject {
    /**
     * Array of coin animation images
     * @type {string[]}
     */
    IMAGES_COINS = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ];
    
    /**
     * Percentage value for coin status
     * @type {number}
     */
    percentage = 100;
    
    /**
     * Animation interval reference
     * @type {number}
     */
    animationInterval;

    /**
     * Creates a new Coin instance
     * @param {number} x - X-coordinate position
     * @param {number} y - Y-coordinate position
     */
    constructor(x, y) {
        super();
        this.initializeImages();
        this.initializeProperties(x, y);
        this.startAnimation();
    }

    /**
     * Loads all coin images
     */
    initializeImages() {
        this.loadImages(this.IMAGES_COINS);
        this.loadImage('img/8_coin/coin_2.png');
    }

    /**
     * Initializes position and properties of the coin
     * @param {number} x - X-coordinate position
     * @param {number} y - Y-coordinate position
     */
    initializeProperties(x, y) {
        this.x = x + 500;
        this.y = y;
        this.width = 120;
        this.height = 120;
        this.offset = {
            top: 45,
            right: 45,
            bottom: 80,
            left: 45
        };
    }

    /**
     * Starts the coin animation
     */
    startAnimation() {
        this.animate();
    }

    /**
     * Animates the appearance of the coin by cycling through its animation frames
     */
    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_COINS);
        }, 300)
    }

    /**
     * Stops the animation of the coin
     */
    stopAnimation() {
        clearInterval(this.animationInterval);
    }
}
