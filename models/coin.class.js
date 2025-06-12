/**
 * Repräsentiert ein Münz-Objekt das vom Charakter gesammelt werden kann
 * @extends MoveableObject
 */

class Coin extends MoveableObject {
    IMAGES_COINS = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ];
    percentage = 100;
    animationInterval;

    constructor(x, y) {
        super();
        this.initializeImages();
        this.initializeProperties(x, y);
        this.startAnimation();
    }

    /**
     * Lädt alle Münz-Bilder
     */
    initializeImages() {
        this.loadImages(this.IMAGES_COINS);
        this.loadImage('img/8_coin/coin_2.png');
    }

    /**
     * Initialisiert Position und Eigenschaften der Münze
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
     * Startet die Münz-Animation
     */
    startAnimation() {
        this.animate();
    }

    /**
     * Animiert das Aussehen der Münze durch Durchlaufen ihrer Animations-Frames
     */
    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_COINS);
        }, 300)
    }

    /**
     * Stoppt die Animation der Münze
     */
    stopAnimation() {
        clearInterval(this.animationInterval);
    }
}
