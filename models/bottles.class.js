/**
 * Repräsentiert ein Flaschen-Objekt im Spiel
 * @extends MoveableObject
 */
class Bottles extends MoveableObject {
    width = 60;
    height = 80;
    IMAGES_BOTTLE = [
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ];

    constructor(x, y) {
        super();
        this.initializeImage();
        this.initializeProperties(x, y);
    }

    /**
     * Lädt ein zufälliges Flaschen-Bild
     */
    initializeImage() {
        this.loadImage(this.IMAGES_BOTTLE[Math.round(Math.random())]);
    }

    /**
     * Initialisiert Position und Eigenschaften der Flasche
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
     * Überschreibt die draw()-Methode, damit eingesammelte Flaschen nicht gezeichnet werden
     */
    draw(ctx) {
        if (this.collected) return;
        super.draw(ctx);
    }
}
