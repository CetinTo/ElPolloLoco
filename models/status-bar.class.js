/**
 * Represents a status bar that displays different statuses with images based on percentages
 * @class
 * @extends DrawableObject
 */

class Statusbar extends DrawableObject {
    IMAGES_HEALTH = [
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png',   
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png',  
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png',  
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',  
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',  
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png'  
    ];
    

    percentage = 100;

    constructor() {
        super();
        this.initializeImages();
        this.initializeProperties();
        this.initializeDisplay();
    }

    /**
     * Loads all status images
     */
    initializeImages() {
        this.loadImages(this.IMAGES_HEALTH);
    }

    /**
     * Initializes position and size of the status bar
     */
    initializeProperties() {
        this.x = 15;
        this.y = 0;
        this.width = 200;
        this.height = 60;
    }

    /**
     * Initializes the display with full status
     */
    initializeDisplay() {
        this.setPercentage(100);
    }

    /**
     * Sets the percentage for the status bar and updates the displayed image accordingly
     * @param {number} percentage - The percentage to set
     */
    setPercentage(percentage) {
        this.percentage = percentage;
    
        
        if (this.percentage < 0) this.percentage = 0;
    
        let index = this.resolveImagesIndex(this.percentage);
        let path = this.IMAGES_HEALTH[index];
        this.img = this.imageCache[path];
    }
    
}
