/**
 * Class representing a chicken character in the game
 * @extends MoveableObject
 */
class Chicken extends MoveableObject {
    /**
     * Y-coordinate position of the chicken
     * @type {number}
     */
    y = 350;
    
    /**
     * Height of the chicken in pixels
     * @type {number}
     */
    height = 80;
    
    /**
     * Width of the chicken in pixels
     * @type {number}
     */
    width = 70;
    
    /**
     * Energy/health points of the chicken
     * @type {number}
     */
    energy = 1;

    /**
     * Array of walking animation images
     * @type {string[]}
     */
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
    ];

    /**
     * Array of death animation images
     * @type {string[]}
     */
    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ];

    /**
     * Creates a new Chicken instance
     * @param {number} x - X-coordinate position
     */
    constructor(x) {
        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.initializeImages();
        this.initializeProperties(x);
        this.initializeAudio();
        this.startBehavior();
    }

    /**
     * Loads all animation images for the chicken
     */
    initializeImages() {
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
    }

    /**
     * Initializes basic properties of the chicken
     * @param {number} x - X-coordinate position
     */
    initializeProperties(x) {
        this.x = x;
        this.speed = 0.25 + Math.random() * 0.35;
        this.movementInterval = null;
        this.animationInterval = null;
        this.offset = {
            top: 5,
            right: 5,
            bottom: 5,
            left: 5
        };
    }

    /**
     * Starts chicken behavior
     */
    startBehavior() {
        this.animate();
    }

    /**
     * Initializes audio element with improved error handling
     */
    initializeAudio() {
        this.death_sound = createAudioElement('audio/chicken_hurt.mp3');
    }

    /**
     * Starts intervals for chicken movement and animation
     */
    animate() {
        this.movementInterval = setInterval(() => {
            if (this.energy > 0) {
                this.moveLeft();
            }
        }, 1000 / 60);

        this.animationInterval = setInterval(() => {
            if (this.energy > 0) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 200);
    }

    /**
     * Stops movement and animation intervals of the chicken
     */
    stopIntervals() {
        clearInterval(this.movementInterval);
        clearInterval(this.animationInterval);
    }

    /**
     * Starts death animation for the chicken
     * Stops movement and plays death animation and sound
     */
    playDeathAnimation() {
        this.stopIntervals();
        this.playAnimation(this.IMAGES_DEAD);
        this.playSoundOnDeath();
    }

    /**
     * Plays sound effect when chicken dies
     * Adjusts volume and plays sound effect
     */
    playSoundOnDeath() {
        if (typeof isGameMuted !== 'undefined' && isGameMuted) {
            return; 
        }
        if (this.death_sound) {
            try {
                this.death_sound.volume = 0.4;
                this.death_sound.currentTime = 0; 
                if (typeof safePlay === 'function') {
                    safePlay(this.death_sound);
                } else {
                    this.death_sound.play().catch(error => {
                    });
                }
            } catch (error) {
            }
        }
    }
}
