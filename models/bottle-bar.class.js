/**
 * Repräsentiert eine grafische Leiste die gesammelte Flaschen anzeigt
 * @extends DrawableObject
 */
class BottleBar extends DrawableObject {

    IMAGES_BOTTLES = [
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/40.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/60.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/80.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/100.png'
    ];

    constructor() {
        super();
        this.initializeImages();
        this.initializeProperties();
        this.initializeDisplay();
    }

    /**
     * Lädt alle Flaschen-Status-Bilder
     */
    initializeImages() {
        this.loadImages(this.IMAGES_BOTTLES);
    }

    /**
     * Initialisiert Position und Eigenschaften der Flaschenleiste
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
     * Initialisiert die Anzeige mit null Flaschen
     */
    initializeDisplay() {
        this.setCollectedBottles(0);
    }

    /**
     * Setzt die Anzahl der gesammelten Flaschen und aktualisiert das Bild der Flaschenleiste
     * @param {number} count - Die Anzahl der gesammelten Flaschen
     */
    setCollectedBottles(count) {
        let percentage = (count / this.MAX_BOTTLES) * 100;
        if (percentage > 100) percentage = 100;
        let path = this.IMAGES_BOTTLES[this.resolveImagesIndex(percentage)];
        this.img = this.imageCache[path];
    }
    
    
    
}

