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
        this.loadImages(this.IMAGES_COINS);
        this.loadImage('img/8_coin/coin_2.png');
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
