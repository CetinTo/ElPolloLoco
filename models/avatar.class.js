/**
 * Represents the main character in the game
 * @extends MoveableObject
 */
class Character extends MoveableObject {
    y = 80;
    height = 275;
    width = 100;
    speed = 6;
    idleTimer = 0;
    IDLE_THRESHOLD = 2000;

    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];

    IMAGES_JUMPING = [
        'img/2_character_pepe/3_jump/J-31.png',
        'img/2_character_pepe/3_jump/J-32.png',
        'img/2_character_pepe/3_jump/J-33.png',
        'img/2_character_pepe/3_jump/J-34.png',
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
        'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png'
    ];

    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png'
    ];

    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png'
    ];

    IMAGES_IDLE = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
        'img/2_character_pepe/1_idle/idle/I-10.png'
    ];

    IMAGES_LONG_IDLE = [
        'img/2_character_pepe/1_idle/long_idle/I-11.png',
        'img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/2_character_pepe/1_idle/long_idle/I-13.png',
        'img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/2_character_pepe/1_idle/long_idle/I-15.png',
        'img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/2_character_pepe/1_idle/long_idle/I-17.png',
        'img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/2_character_pepe/1_idle/long_idle/I-19.png',
        'img/2_character_pepe/1_idle/long_idle/I-20.png'
    ];

    world;

    constructor() {
        super().loadImage('img/2_character_pepe/2_walk/W-21.png');
        this.initializeImages();
        this.initializeProperties();
        this.initializeAudio();
        this.startAnimations();
    }

    /**
     * Loads all image arrays for different animations
     */
    initializeImages() {
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE);
    }

    /**
     * Initializes basic properties of the character
     */
    initializeProperties() {
        this.jumping = false;
        this.offset = {
            top: 60,
            right: 20,
            bottom: 30,
            left: 20
        };
    }

    /**
     * Starts all animations and physics
     */
    startAnimations() {
        this.animate();
        this.applyGravity();
    }

    /**
     * Initializes all audio elements with improved error handling
     */
    initializeAudio() {
        this.walking_sound = createAudioElement('audio/running_3.mp3');
        if (this.walking_sound) {
            this.walking_sound.loop = true;
            this.walking_sound.volume = 0.5;
        }
        this.hurt_sound = createAudioElement('audio/hurt.mp3');
    }

    /**
     * Safe audio playback with error handling
     */
    playAudioSafely(audioElement) {
        if (typeof isGameMuted !== 'undefined' && isGameMuted) {
            return; 
        }
        if (audioElement) {
            try {
                if (typeof safePlay === 'function') {
                    safePlay(audioElement);
                } else {
                    audioElement.play().catch(error => {
                    });
                }
            } catch (error) {
            }
        }
    }

    /**
     * Animates character movements and state transitions
     */
    animate() {
        intervals.push(setInterval(() => {
            this.animateCharacter();
        }, 1000 / 60));
        intervals.push(setInterval(() => {
            this.animateCharacterState();
        }, 50));
    }

    /**
     * Animates basic character movements
     */
    animateCharacter() {
        this.handleIdleTimer();
        this.handleWalking();
        this.handleJumping();
        this.handleCamera();
    }

    /**
     * Handles state transitions based on current character state
     */
    animateCharacterState() {
        if (!this.world) return;
        if (this.isDead() && !this.world.gameOver) {
            this.handleDeadState();
        } else if (this.isHurt() && !this.world.gameOver) {
            this.handleHurtState();
        } else if (this.isAboveGround()) {
            this.handleJumpingState();
        } else {
            if (this.idleTimer > this.IDLE_THRESHOLD) {
                this.handleLongIdleState();
            } else if (this.world.keyboard && (this.world.keyboard.RIGHT || this.world.keyboard.LEFT)) {
                this.handleWalkingState();
            } else {
                this.handleIdleState();
            }
        }
    }

    /**
     * Updates idle timer based on user input
     */
    handleIdleTimer() {
        if (this.world && this.world.keyboard && (this.world.keyboard.RIGHT || this.world.keyboard.LEFT || this.world.keyboard.SPACE)) {
            this.idleTimer = 0;
        } else {
            this.idleTimer += 50;
        }
    }

    /**
     * Handles character movement (walking)
     */
    handleWalking() {
        if (this.world && this.world.keyboard && !this.isDead()) {
            if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.moveRight();
                this.otherDirection = false;
                this.playAudioSafely(this.walking_sound);
            }
            if (this.world.keyboard.LEFT && this.x > 0) {
                this.moveLeft();
                this.otherDirection = true;
                this.playAudioSafely(this.walking_sound);
            }
            if (!this.world.keyboard.LEFT && !this.world.keyboard.RIGHT) {
                if (this.walking_sound) {
                    this.walking_sound.pause();
                }
            }
        }
    }

    /**
     * Handles character jumping
     */
    handleJumping() {
        if (this.world && this.world.keyboard && this.world.keyboard.SPACE && !this.isAboveGround() && !this.isDead()) {
            this.jump();
        }
    }

    /**
     * Handles character state when dead
     */
    handleDeadState() {
        this.stopAnimationSound();
        this.playAnimation(this.IMAGES_DEAD);
        setTimeout(() => {
            showEndScreen();
        }, 1000);
    }

    /**
     * Handles character state when hurt
     */
    handleHurtState() {
        this.stopAnimationSound();
        this.playAnimation(this.IMAGES_HURT);
        this.playAudioSafely(this.hurt_sound);
    }

    /**
     * Handles character state when jumping
     */
    handleJumpingState() {
        this.stopAnimationSound();
        this.playAnimation(this.IMAGES_JUMPING);
    }

    /**
     * Handles character state during long idle periods
     */
    handleLongIdleState() {
        this.stopAnimationSound();
        this.playAnimation(this.IMAGES_LONG_IDLE);
    }

    /**
     * Wakes up character by resetting idle timer
     * Called when player performs action while character is sleeping
     */
    wakeUp() {
        this.idleTimer = 0;
        this.playAnimation(this.IMAGES_IDLE);
    }

    /**
     * Handles character state while walking
     */
    handleWalkingState() {
        this.stopAnimationSound();
        this.playAnimation(this.IMAGES_WALKING);
    }

    /**
     * Handles character state when idle
     */
    handleIdleState() {
        this.stopAnimationSound();
        this.playAnimation(this.IMAGES_IDLE);
    }

    /**
     * Checks if character is dead
     */
    isDead() {
        return this.energy == 0;
    }

    /**
     * Handles camera position based on character x-coordinate
     */
    handleCamera() {
        if (this.world) {
            this.world.camera_x = -this.x + 100;
        }
    }

    stopAnimationSound() {
        if (this.walking_sound) {
            this.walking_sound.pause();
            this.walking_sound.currentTime = 0;
        }
    }
}



