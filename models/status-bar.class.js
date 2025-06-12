/**
 * Repräsentiert eine Statusleiste die verschiedene Status mit Bildern basierend auf Prozentsätzen anzeigt
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
        this.loadImages(this.IMAGES_HEALTH);
        this.x = 15;
        this.y = 0;
        this.width = 200;
        this.height = 60;
        this.setPercentage(100);
    }


    /**
     * Setzt den Prozentsatz für die Statusleiste und aktualisiert das angezeigte Bild entsprechend
     * @param {number} percentage - Der zu setzende Prozentsatz
     */
    setPercentage(percentage) {
        this.percentage = percentage;
    
        
        if (this.percentage < 0) this.percentage = 0;
    
        let index = this.resolveImagesIndex(this.percentage);
        let path = this.IMAGES_HEALTH[index];
        this.img = this.imageCache[path];
    }
    
}
