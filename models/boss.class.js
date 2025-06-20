/**
 * Represents the end boss of the game
 * @extends MoveableObject
 */
class Endboss extends MoveableObject {
    height = 400;
    width = 250;
    y = 55;
    energy = 300;
    isDead = false;
    hadFirstContact = false;
    alertAnimationPlayed = false;
    isAttacking = false;
    lastAttackTime = 0;
    isJumping = false;
    lastJumpTime = 0;
    speedMode = 'normal'; 
    lastSpeedChange = 0;
    aggressionLevel = 1; 
    horizontalJumpSpeed = 0; 

    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png'
    ];

    IMAGES_ALERT = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png'
    ];

    IMAGES_ATTACK = [
        'img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/4_enemie_boss_chicken/3_attack/G19.png',
        'img/4_enemie_boss_chicken/3_attack/G20.png'
    ];

    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];

    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png'
    ];

    constructor() {
        super().loadImage('img/4_enemie_boss_chicken/1_walk/G1.png');
        this.initializeImages();
        this.initializeProperties();
        this.initializeAudio();
        this.initializeHandlers();
        this.startBehavior();
    }

    /**
     * Initializes all audio elements for the boss
     */
    initializeAudio() {
        this.alert_sound = createAudioElement('audio/boss_intro_sound.mp3');
        if (this.alert_sound) {
            this.alert_sound.volume = 0.4;
            this.alert_sound.preload = 'auto';
        }
        
        this.hurt_sound = createAudioElement('audio/chicken_hurt.mp3');
        if (this.hurt_sound) {
            this.hurt_sound.volume = 0.5;
            this.hurt_sound.preload = 'auto';
        }
        
        this.dead_sound = createAudioElement('audio/boss_dead.mp3');
        if (this.dead_sound) {
            this.dead_sound.volume = 0.7;
            this.dead_sound.preload = 'auto';
        }
    }

    /**
     * Loads all image arrays for different animations
     */
    initializeImages() {
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
    }

    /**
     * Initializes basic properties of the end boss
     */
    initializeProperties() {
        this.x = 5000;
        this.speed = 60;
        this.speedMode = 'normal';
        this.horizontalJumpSpeed = 30;
        this.offset = { top: 60, right: 20, bottom: 90, left: 20 };
        this.animationIntervals = [];
    }

    /**
     * Initializes all handler classes for boss behavior
     */
    initializeHandlers() {
        this.movementHandler = new BossMovement(this);
        this.attackHandler = new BossAttacks(this);
        this.jumpHandler = new BossJumpAttacks(this);
        this.animationHandler = new BossAnimations(this);
    }

    /**
     * Starts the boss behavior
     */
    startBehavior() {
        this.animate();
    }

    /**
     * Check if character triggers first contact
     */
    checkFirstContact() {
        if (world && world.character.x >= 4500 && !this.hadFirstContact && !this.alertAnimationPlayed) {
            this.hadFirstContact = true;
            this.alertAnimationPlayed = true;
            this.movementHandler.startWalking();
            return true;
        }
        return false;
    }

    /**
     * Start animation loop for boss behavior
     */
    startAnimationLoop() {
        const animationInterval = setInterval(() => {
            if (this.animationHandler.shouldStartAlert()) {
                this.animationHandler.startAlertAnimation(animationInterval);
            }
            
            if (this.checkFirstContact()) {
                clearInterval(animationInterval);
            }
        }, 120);
        this.animationIntervals.push(animationInterval);
        addInterval(animationInterval);
    }

    /**
     * Setup delayed contact trigger
     */
    setupDelayedContact() {
        setTimeout(() => {
            if (!this.hadFirstContact && world && world.character.x >= 4000) {
                this.hadFirstContact = true;
                this.alertAnimationPlayed = true;
                this.movementHandler.startWalking();
            }
        }, 2000);
    }

    /**
     * Animates the behavior of the end boss
     */
    animate() {
        this.startAnimationLoop();
        this.setupDelayedContact();
    }

    /**
     * Handles when the end boss is hit
     */
    bossIsHit() {
        this.reduceEnergy();
        this.animationHandler.startHurtAnimation();
        this.animationHandler.updateHealthBar();
    }

    /**
     * Reduces the energy of the end boss by 30
     */
    reduceEnergy() {
        this.energy -= 30;
        if (this.energy < 0) {
            this.energy = 0;
        }
    }
}
