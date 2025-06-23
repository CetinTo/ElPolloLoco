/**
 * Represents a throwable object that can be thrown and animated
 * @class
 * @extends MoveableObject
 */

class ThrowableObject extends MoveableObject {
    /**
     * Vertical speed of the throwable object
     * @type {number}
     */
    speedY = 30;
    
    /**
     * Horizontal speed of the throwable object
     * @type {number}
     */
    speedX = 20;
    
    /**
     * Whether the object has collided with something
     * @type {boolean}
     */
    hasCollided;
    
    /**
     * Interval reference for rotation animation
     * @type {number}
     */
    rotationInterval;

    /**
     * Array of bottle rotation animation images
     * @type {string[]}
     */
    IMAGES_BOTTLE_ROTATION = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];

    /**
     * Array of bottle splash animation images
     * @type {string[]}
     */
    IMAGES_BOTTLE_SPLASH = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png',

    ];

    /**
     * Creates a new ThrowableObject instance
     * @param {number} x - X-coordinate position
     * @param {number} y - Y-coordinate position
     */
    constructor(x, y) {
        super().loadImage('img/6_salsa_bottle/salsa_bottle.png');
        this.initializeImages();
        this.initializeProperties(x, y);
        this.startBehavior();
    }

    /**
     * Loads all animation images for the throwable object
     */
    initializeImages() {
        this.loadImages(this.IMAGES_BOTTLE_ROTATION);
        this.loadImages(this.IMAGES_BOTTLE_SPLASH);
    }

    /**
     * Initializes position and properties of the throwable object
     * @param {number} x - X-coordinate position
     * @param {number} y - Y-coordinate position
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
     * Starts throwing and animation behavior
     */
    startBehavior() {
        this.throw();
        this.animate();
    }

    /**
     * Throws object with specific trajectory and starts animation
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
     * Animates rotation of the throwable object
     */
    animate() {
        this.rotationInterval = setInterval(() => {
            this.playAnimation(this.IMAGES_BOTTLE_ROTATION);
        }, 50);
    }

    /**
     * Animates splash effect when throwable object hits target
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
     * Plays sound effect when throwable object is thrown
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
