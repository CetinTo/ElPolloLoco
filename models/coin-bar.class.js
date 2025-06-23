/**
 * The maximum number of coins that the CoinBar can display
 * @type {number}
 */
const MAX_COINS = 20;

/**
 * Represents a graphical bar that displays collected coins
 * @extends DrawableObject
 */
class CoinBar extends DrawableObject {
    /**
     * Array of coin status bar images
     * @type {string[]}
     */
    IMAGES_COINS = [
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png'
    ];

    /**
     * Number of collected coins
     * @type {number}
     */
    collectedCoins = 0;

    /**
     * Creates a new CoinBar instance
     */
    constructor() {
        super();
        this.initializeImages();
        this.initializeProperties();
        this.initializeDisplay();
    }

    /**
     * Loads all coin status images
     */
    initializeImages() {
        this.loadImages(this.IMAGES_COINS);
    }

    /**
     * Initializes position and size of the coin bar
     */
    initializeProperties() {
        this.x = 15;
        this.y = 50;
        this.width = 200;
        this.height = 60;
    }

    /**
     * Initializes the display with zero coins
     */
    initializeDisplay() {
        this.setCollectedCoins(0);
    }

    /**
     * Sets the number of collected coins and updates the visual representation of the coin bar
     * @param {number} count - The number of collected coins
     */
    setCollectedCoins(count) {
        this.collectedCoins = count;
        let percentage = (this.collectedCoins / MAX_COINS) * 100;
        let path = this.IMAGES_COINS[this.resolveImagesIndex(percentage)];
        this.img = this.imageCache[path];
    }
}
