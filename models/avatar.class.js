/**
 * Represents the main character in the game
 * @extends MoveableObject
 */
class Character extends MoveableObject {
    /**
     * Y-coordinate position of the character
     * @type {number}
     */
    y = 80;
    
    /**
     * Height of the character in pixels
     * @type {number}
     */
    height = 275;
    
    /**
     * Width of the character in pixels
     * @type {number}
     */
    width = 100;
    
    /**
     * Movement speed of the character
     * @type {number}
     */
    speed = 6;
    
    /**
     * Timer for tracking idle duration
     * @type {number}
     */
    idleTimer = 0;
    
    /**
     * Threshold for triggering long idle animation
     * @type {number}
     */
    IDLE_THRESHOLD = 2000;
    
    /**
     * Whether walking sound is currently playing
     * @type {boolean}
     */
    isWalkingSoundPlaying = false;

    /**
     * Array of walking animation images
     * @type {string[]}
     */
    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];

    /**
     * Array of jumping animation images
     * @type {string[]}
     */
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

    /**
     * Array of death animation images
     * @type {string[]}
     */
    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png'
    ];

    /**
     * Array of hurt animation images
     * @type {string[]}
     */
    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png'
    ];

    /**
     * Array of idle animation images
     * @type {string[]}
     */
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

    /**
     * Array of long idle animation images
     * @type {string[]}
     */
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

    /**
     * Reference to the game world
     * @type {World}
     */
    world;

    /**
     * Creates a new Character instance
     */
    constructor() {
        super().loadImage('img/2_character_pepe/2_walk/W-21.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE);
        this.initializeAudio();
        this.animate();
        this.applyGravity();
        this.jumping = false;
        this.offset = {
            top: 60,
            right: 20,
            bottom: 30,
            left: 20
        };
    }

    /**
     * Initializes audio elements
     */
    initializeAudio() {
        this.walking_sound = new Audio('audio/running_3.mp3');
        this.walking_sound.volume = 1.0; // Maximum volume
        this.walking_sound.loop = true;
        
        this.hurt_sound = new Audio('audio/hurt.mp3');
        this.hurt_sound.volume = 0.8;
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
     * Check movement conditions
     */
    getMovementState() {
        const isMovingRight = this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x;
        const isMovingLeft = this.world.keyboard.LEFT && this.x > 0;
        return {
            isMovingRight,
            isMovingLeft,
            isMoving: isMovingRight || isMovingLeft,
            isOnGround: !this.isAboveGround()
        };
    }

    /**
     * Handle character movement directions
     */
    handleMovementDirections(movement) {
        if (movement.isMovingRight) {
            this.moveRight();
            this.otherDirection = false;
        }
        if (movement.isMovingLeft) {
            this.moveLeft();
            this.otherDirection = true;
        }
    }

    /**
     * Control walking sound based on movement
     */
    controlWalkingSound(movement) {
        if (movement.isMoving && movement.isOnGround) {
            if (!this.isWalkingSoundPlaying) {
                this.startWalkingSound();
            }
        } else {
            if (this.isWalkingSoundPlaying) {
                this.stopWalkingSound();
            }
        }
    }

    /**
     * Handles character movement (walking)
     */
    handleWalking() {
        if (this.world && this.world.keyboard && !this.isDead()) {
            const movement = this.getMovementState();
            this.handleMovementDirections(movement);
            this.controlWalkingSound(movement);
        } else {
            if (this.isWalkingSoundPlaying) {
                this.stopWalkingSound();
            }
        }
    }

    /**
     * Starts walking sound
     */
    startWalkingSound() {
        if (this.walking_sound && typeof isGameMuted !== 'undefined' && !isGameMuted) {
            this.walking_sound.play().catch(e => console.log('Walking sound play failed:', e));
            this.isWalkingSoundPlaying = true;
        }
    }

    /**
     * Stops walking sound
     */
    stopWalkingSound() {
        if (this.walking_sound) {
            this.walking_sound.pause();
            this.walking_sound.currentTime = 0;
            this.isWalkingSoundPlaying = false;
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
        if (this.isWalkingSoundPlaying) {
            this.stopWalkingSound();
        }
        this.playAnimation(this.IMAGES_DEAD);
        setTimeout(() => {
            showEndScreen();
        }, 1000);
    }

    /**
     * Handles character state when hurt
     */
    handleHurtState() {
        if (this.isWalkingSoundPlaying) {
            this.stopWalkingSound();
        }
        this.playAnimation(this.IMAGES_HURT);
        if (this.hurt_sound && typeof isGameMuted !== 'undefined' && !isGameMuted) {
            this.hurt_sound.play().catch(e => console.log('Hurt sound play failed:', e));
        }
    }

    /**
     * Handles character state when jumping
     */
    handleJumpingState() {
        if (this.isWalkingSoundPlaying) {
            this.stopWalkingSound();
        }
        this.playAnimation(this.IMAGES_JUMPING);
    }

    /**
     * Handles character state during long idle periods
     */
    handleLongIdleState() {
        if (this.isWalkingSoundPlaying) {
            this.stopWalkingSound();
        }
        this.playAnimation(this.IMAGES_LONG_IDLE);
    }

    /**
     * Wakes up character by resetting idle timer
     */
    wakeUp() {
        this.idleTimer = 0;
        this.playAnimation(this.IMAGES_IDLE);
    }

    /**
     * Handles character state while walking
     */
    handleWalkingState() {
        this.playAnimation(this.IMAGES_WALKING);
    }

    /**
     * Handles character state when idle
     */
    handleIdleState() {
        this.playAnimation(this.IMAGES_IDLE);
    }

    /**
     * Checks if character is dead
     */
    isDead() {
        return this.energy <= 0;
    }

    /**
     * Handles camera position based on character's x-coordinate
     */
    handleCamera() {
        this.world.camera_x = -this.x + 100;
    }
}



