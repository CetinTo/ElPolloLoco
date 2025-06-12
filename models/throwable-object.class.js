/**
 * Repräsentiert ein werfbares Objekt das geworfen und animiert werden kann
 * @class
 * @extends MoveableObject
 */

class ThrowableObject extends MoveableObject {
    speedY = 30;
    speedX = 20;
    hasCollided;
    rotationInterval;

    IMAGES_BOTTLE_ROTATION = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];

    IMAGES_BOTTLE_SPLASH = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png',

    ];

    constructor(x, y) {
        super().loadImage('img/6_salsa_bottle/salsa_bottle.png');
        this.initializeImages();
        this.initializeProperties(x, y);
        this.startBehavior();
    }

    /**
     * Lädt alle Animations-Bilder für das werfbare Objekt
     */
    initializeImages() {
        this.loadImages(this.IMAGES_BOTTLE_ROTATION);
        this.loadImages(this.IMAGES_BOTTLE_SPLASH);
    }

    /**
     * Initialisiert Position und Eigenschaften des werfbaren Objekts
     */
    initializeProperties(x, y) {
        this.x = x;
        this.y = y;
        this.height = 80;
        this.width = 65;
        this.throwInterval = null;
        this.offset = {
            top: 10,
            right: 10,
            bottom: 20,
            left: 10
        };
    }

    /**
     * Startet das Wurf- und Animations-Verhalten
     */
    startBehavior() {
        this.throw();
        this.animate();
    }

    /**
     * Wirft das Objekt mit einer bestimmten Flugbahn und startet die Animation
     */
    throw() {
        this.speedY = 15;
        this.speedX = 15;
        this.applyGravity();
        this.throwInterval = setInterval(() => {
            this.x += 25;
        }, 80);
        this.playThrowSound();
    }


    /**
     * Animiert die Rotation des werfbaren Objekts
     */
    animate() {
        this.rotationInterval = setInterval(() => {
            this.playAnimation(this.IMAGES_BOTTLE_ROTATION);
        }, 50);
    }


    /**
     * Animiert den Spritz-Effekt wenn das werfbare Objekt ein Ziel trifft
     */
    animateBottleSplash() {
        clearInterval(this.rotationInterval);
        this.speedX = 0;
        this.speedY = 0;
        this.applyGravity(false);
        clearInterval(this.throwInterval);
        this.playAnimation(this.IMAGES_BOTTLE_SPLASH);
    }


    /**
     * Spielt den Soundeffekt ab wenn das werfbare Objekt geworfen wird
     */
    playThrowSound() {
        if (!isGameMuted) {
            
            let throwSound = createAudioElement('audio/bottle_throw.mp3');
            
            if (throwSound) {
                
                if (typeof safePlay === 'function') {
                    safePlay(throwSound);
                } else {
                    throwSound.play().catch(error => {
                        
                    });
                }
            }
        }
    }
}
