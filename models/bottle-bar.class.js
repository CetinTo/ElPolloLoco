/**
 * Represents a graphical bar that displays collected bottles
 * @extends DrawableObject
 */
class BottleBar extends DrawableObject {
    /**
     * Array of bottle status bar images
     * @type {string[]}
     */
    IMAGES_BOTTLES = [
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/40.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/60.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/80.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/100.png'
    ];

    /**
     * Creates a new BottleBar instance
     */
    constructor() {
        super();
        this.initializeImages();
        this.initializeProperties();
        this.initializeDisplay();
    }

    /**
     * Loads all bottle status images
     */
    initializeImages() {
        this.loadImages(this.IMAGES_BOTTLES);
    }

    /**
     * Initializes position and properties of the bottle bar
     */
    initializeProperties() {
        this.MAX_BOTTLES = 10;
        this.collectedBottles = 0;
        this.x = 15;
        this.y = 100;
        this.width = 200;
        this.height = 60;
    }

    /**
     * Initializes the display with zero bottles
     */
    initializeDisplay() {
        this.setCollectedBottles(0);
    }

    /**
     * Sets the number of collected bottles and updates the bottle bar image
     * @param {number} count - The number of collected bottles
     */
    setCollectedBottles(count) {
        let percentage = (count / this.MAX_BOTTLES) * 100;
        if (percentage > 100) percentage = 100;
        let path = this.IMAGES_BOTTLES[this.resolveImagesIndex(percentage)];
        this.img = this.imageCache[path];
    }
    
    
    
}

