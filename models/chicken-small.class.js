/**
 * Class that represents a small chicken character in the game
 * @extends MoveableObject
 */
class ChickenSmall extends MoveableObject {
    y = 350;
    height = 60;
    width = 60;
    energy = 1;

    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png',
    ];

    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ];

    constructor(x) {
        super().loadImage('img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
        this.initializeImages();
        this.initializeProperties(x);
        this.initializeAudio();
        this.startBehavior();
    }

    /**
     * Loads all animation images for the small chicken
     */
    initializeImages() {
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
    }

    /**
     * Initializes basic properties of the small chicken
     */
    initializeProperties(x) {
        this.x = x;
        this.speed = 0.4 + Math.random() * 0.6;
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
     * Starts the small chicken behavior
     */
    startBehavior() {
        this.animate();
    }

    /**
     * Initializes the audio element with improved error handling
     */
    initializeAudio() {
        this.death_sound = createAudioElement('audio/chicken_hurt.mp3');
    }

    /**
     * Starts intervals for small chicken movement and animation
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
     * Stops the movement and animation intervals of the small chicken
     */
    stopIntervals() {
        clearInterval(this.movementInterval);
        clearInterval(this.animationInterval);
    }

    /**
     * Starts the death animation for the small chicken
     * Stops movement and plays the death animation and sound
     */
    playDeathAnimation() {
        this.stopIntervals();
        this.playAnimation(this.IMAGES_DEAD);
        this.playSoundOnDeath();
    }

    /**
     * Plays a sound effect when the small chicken dies
     * Adjusts volume and plays the sound effect
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
