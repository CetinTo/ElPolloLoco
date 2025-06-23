/**
 * Represents a drawable object in the game
 * @class
 */
class DrawableObject {
    /**
     * X-coordinate position of the object
     * @type {number}
     */
    x = 120;
    
    /**
     * Y-coordinate position of the object
     * @type {number}
     */
    y = 365;
    
    /**
     * Height of the object in pixels
     * @type {number}
     */
    height = 150;
    
    /**
     * Width of the object in pixels
     * @type {number}
     */
    width = 100;
    
    /**
     * Image element for the object
     * @type {HTMLImageElement}
     */
    img;
    
    /**
     * Cache for storing loaded images
     * @type {Object<string, HTMLImageElement>}
     */
    imageCache = {};
    
    /**
     * Index of the current image in animation sequence
     * @type {number}
     */
    currentImage = 0;
    
    /**
     * Collision offset values for more precise collision detection
     * @type {Object}
     * @property {number} top - Top offset
     * @property {number} right - Right offset
     * @property {number} bottom - Bottom offset
     * @property {number} left - Left offset
     */
    offset = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    };

    /**
     * Loads an image from the specified path and assigns it to the object's 'img' property
     * @param {string} path - The path to the image file
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Loads an array of images and stores them in the image cache
     * @param {string[]} array - An array of image paths to load
     */
    loadImages(array) {
        array.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    /**
     * Draws the object on the canvas context
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     */
    draw(ctx) {
        try {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        } catch (e) {}
    }

    /**
     * Draws a frame around the object for debugging purposes
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     */
    drawFrame(ctx) {
        if (this instanceof Character || this instanceof Chicken || this instanceof Endboss || this instanceof Coin || this instanceof Bottles || this instanceof ThrowableObject) {
            ctx.beginPath();
            ctx.lineWidth = '2';
            ctx.strokeStyle = 'blue';
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();

            ctx.beginPath();
            ctx.lineWidth = '2';
            ctx.strokeStyle = 'red';
            ctx.rect(this.x + this.offset.left, this.y + this.offset.top, this.width - this.offset.right - this.offset.left, this.height - this.offset.bottom);
            ctx.stroke();
        }
    }

    /**
     * Determines the index of the image to use based on a given percentage
     * @param {number} percentage - The percentage (0-100) to determine the image index
     * @returns {number} - The index of the image to use
     */
    resolveImagesIndex(percentage) {
        if (percentage >= 100) {
            return 5;
        } else if (percentage >= 80) {
            return 4;
        } else if (percentage >= 60) {
            return 3;
        } else if (percentage >= 40) {
            return 2;
        } else if (percentage >= 20) {
            return 1;
        } else {
            return 0;
        }
    }
}
