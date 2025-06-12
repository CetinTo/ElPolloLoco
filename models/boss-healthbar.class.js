/**
 * Repräsentiert eine Gesundheitsleiste für den Endboss
 * @class
 * @extends DrawableObject
 */

class EndbossHealthbar extends DrawableObject {
    IMAGES_BOSS_HEALTH_FULL = ['img/7_statusbars/2_statusbar_endboss/blue.png'];
    IMAGES_BOSS_HEALTH = [
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png',
    ];

    bossEnergy = 120;

    constructor() {
        super();
        this.initializeImages();
        this.initializeProperties();
        this.initializeDisplay();
    }

    /**
     * Lädt alle Boss-Gesundheits-Bilder
     */
    initializeImages() {
        this.loadImages(this.IMAGES_BOSS_HEALTH_FULL);
        this.loadImages(this.IMAGES_BOSS_HEALTH);
    }

    /**
     * Initialisiert Position und Eigenschaften der Boss-Gesundheitsleiste
     */
    initializeProperties() {
        this.id = EndbossHealthbar.counter;
        this.x = 500;
        this.y = 0;
        this.width = 200;
        this.height = 60;
    }

    /**
     * Initialisiert die Anzeige mit voller Boss-Energie
     */
    initializeDisplay() {
        this.setPercentage(this.bossEnergy);
    }

    /**
     * Setzt den Energieprozentsatz des Bosses und aktualisiert das Gesundheitsleisten-Bild entsprechend
     * @param {number} bossEnergy - Das aktuelle Energielevel des Endbosses
     */
    setPercentage(bossEnergy) {
        this.bossEnergy = bossEnergy;
        let path;
        if (this.bossEnergy === 120) {
            path = this.IMAGES_BOSS_HEALTH_FULL[0];
        } else {
            let percentage = (this.bossEnergy / 120) * 100;
            path = this.IMAGES_BOSS_HEALTH[this.resolveImagesIndex(percentage)];
        }
        this.img = this.imageCache[path];
    }
}
