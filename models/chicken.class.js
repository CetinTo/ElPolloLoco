/**
 * Klasse die einen Hühner-Charakter im Spiel repräsentiert
 * @extends MoveableObject
 */
class Chicken extends MoveableObject {
    y = 350;
    height = 80;
    width = 70;
    energy = 1;

    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
    ];

    IMAGES_DEAD = [
        'img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ];

    constructor(x) {
        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.x = x;
        this.speed = 0.25 + Math.random() * 0.35;
        this.movementInterval = null;
        this.animationInterval = null;
        
        // Audio-Element mit verbesserter Fehlerbehandlung initialisieren
        this.initializeAudio();
        
        this.animate();
        this.offset = {
            top: 5,
            right: 5,
            bottom: -55,
            left: 5
        };
    }

    /**
     * Initialisiert das Audio-Element mit verbesserter Fehlerbehandlung
     */
    initializeAudio() {
        // Verwende die globale createAudioElement Funktion
        this.death_sound = createAudioElement('audio/chicken_hurt.mp3');
    }

    /**
     * Startet Intervalle für Hühner-Bewegung und Animation
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
     * Stoppt die Bewegungs- und Animations-Intervalle des Huhns
     */
    stopIntervals() {
        clearInterval(this.movementInterval);
        clearInterval(this.animationInterval);
    }

    /**
     * Startet die Todes-Animation für das Huhn
     * Stoppt die Bewegung und spielt die Todes-Animation und den Sound ab
     */
    playDeathAnimation() {
        this.stopIntervals();
        this.playAnimation(this.IMAGES_DEAD);
        this.playSoundOnDeath();
    }

    /**
     * Spielt einen Soundeffekt ab wenn das Huhn stirbt
     * Passt die Lautstärke an und spielt den Soundeffekt ab
     */
    playSoundOnDeath() {
        // Prüfe zuerst, ob das Spiel gemutet ist
        if (typeof isGameMuted !== 'undefined' && isGameMuted) {
            return; // Kein Sound abspielen wenn gemutet
        }
        
        if (this.death_sound) {
            try {
                this.death_sound.volume = 0.4;
                this.death_sound.currentTime = 0; // Reset zum Anfang
                
                // Verwende die sichere Play-Funktion aus audio.js
                if (typeof safePlay === 'function') {
                    safePlay(this.death_sound);
                } else {
                    this.death_sound.play().catch(error => {
                        // Chicken death sound konnte nicht abgespielt werden
                    });
                }
            } catch (error) {
                // Fehler beim Abspielen des Chicken death sounds
            }
        }
    }
}