/**
 * Repräsentiert den Hauptcharakter im Spiel
 * @extends MoveableObject
 */
class Character extends MoveableObject {
    y = -20;
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
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE);
        
        // Audio-Elemente mit verbesserter Fehlerbehandlung initialisieren
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
     * Initialisiert alle Audio-Elemente mit verbesserter Fehlerbehandlung
     */
    initializeAudio() {
        // Verwende die globale createAudioElement Funktion
        this.walking_sound = createAudioElement('audio/running_3.mp3');
        if (this.walking_sound) {
            this.walking_sound.loop = true;
            this.walking_sound.volume = 0.5;
        }
        
        this.hurt_sound = createAudioElement('audio/hurt.mp3');
    }

    /**
     * Sichere Audio-Wiedergabe mit Fehlerbehandlung
     */
    playAudioSafely(audioElement) {
        // Prüfe zuerst, ob das Spiel gemutet ist
        if (typeof isGameMuted !== 'undefined' && isGameMuted) {
            return; // Kein Sound abspielen wenn gemutet
        }
        
        if (audioElement) {
            try {
                if (typeof safePlay === 'function') {
                    safePlay(audioElement);
                } else {
                    audioElement.play().catch(error => {
                        // Audio konnte nicht abgespielt werden
                    });
                }
            } catch (error) {
                // Fehler beim Abspielen des Sounds
            }
        }
    }

    /**
     * Animiert die Bewegungen und Zustandsübergänge des Charakters
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
     * Animiert die grundlegenden Bewegungen des Charakters
     */
    animateCharacter() {
        this.handleIdleTimer();
        this.handleWalking();
        this.handleJumping();
        this.handleCamera();
    }

    /**
     * Behandelt Zustandsübergänge basierend auf dem aktuellen Zustand des Charakters
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
     * Aktualisiert den Idle-Timer basierend auf Benutzereingaben
     */
    handleIdleTimer() {
        if (!this.world || !this.world.keyboard) return;
        if (!this.world.keyboard.RIGHT && !this.world.keyboard.LEFT) {
            this.idleTimer += 1000 / 120;
        } else {
            this.idleTimer = 0;
        }
    }

    /**
     * Behandelt Charakterbewegung (Gehen)
     */
    handleWalking() {
        if (!this.world || !this.world.keyboard) return;
        
        // Stoppe Walking-Sound wenn gemutet
        if (typeof isGameMuted !== 'undefined' && isGameMuted && this.walking_sound) {
            this.walking_sound.pause();
        }
        
        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
          this.moveRight();
          this.otherDirection = false;
          // Verwende sichere Audio-Wiedergabe
          this.playAudioSafely(this.walking_sound);
        }
        if (this.world.keyboard.LEFT && this.x > 0) {
          this.moveLeft();
          this.otherDirection = true;
          // Sicheres Pausieren des Sounds
          if (this.walking_sound) {
              this.walking_sound.pause();
          }
        }
    }

    /**
     * Behandelt Charaktersprung
     */
    handleJumping() {
        if (!this.world || !this.world.keyboard) return;
        if (this.world.keyboard.SPACE && !this.isAboveGround()) {
            this.jump();
            this.idleTimer = 0;
        }
    }

    /**
     * Behandelt den Zustand des Charakters wenn er tot ist
     */
    handleDeadState() {
        this.playAnimation(this.IMAGES_DEAD);
        if (this.world) {
            this.world.endGame();
        }
    }

    /**
     * Behandelt den Zustand des Charakters wenn er verletzt ist
     */
    handleHurtState() {
        this.playAnimation(this.IMAGES_HURT);
        this.playAudioSafely(this.hurt_sound);
    }

    /**
     * Behandelt den Zustand des Charakters beim Springen
     */
    handleJumpingState() {
        this.playAnimation(this.IMAGES_JUMPING);
    }

    /**
     * Behandelt den Zustand des Charakters während langer Idle-Perioden
     */
    handleLongIdleState() {
        this.playAnimation(this.IMAGES_LONG_IDLE);
    }

    /**
     * Behandelt den Zustand des Charakters während des Gehens
     */
    handleWalkingState() {
        this.playAnimation(this.IMAGES_WALKING);
    }

    /**
     * Behandelt den Zustand des Charakters wenn er untätig ist
     */
    handleIdleState() {
        this.playAnimation(this.IMAGES_IDLE);
    }

    /**
     * Prüft ob der Charakter tot ist
     */
    isDead() {
        return this.energy <= 0;
    }

    /**
     * Behandelt die Kameraposition basierend auf der x-Koordinate des Charakters
     */
    handleCamera() {
        if (!this.world) return;
        
        // Verbesserte Kamera-Interpolation mit Pixel-perfekter Rundung
        let targetCamera = -this.x + 100;
        let currentCamera = this.world.camera_x;
        let difference = targetCamera - currentCamera;
        
        // Dynamische Interpolation basierend auf Entfernung
        let lerpFactor = Math.abs(difference) > 50 ? 0.15 : 0.08;
        
        // Pixel-perfekte Kamera-Position (auf ganze Pixel gerundet)
        this.world.camera_x = Math.round(currentCamera + (difference * lerpFactor));
    }
}



