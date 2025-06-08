/**
 * Repräsentiert den Endboss des Spiels
 * @extends MoveableObject
 */
class Endboss extends MoveableObject {
    height = 400;
    width = 250;
    y = 55;
    energy = 120;
    isDead = false;
    hadFirstContact = false;
    alertAnimationPlayed = false;

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

    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png'
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

    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png'
    ];

    alert_sound = new Audio('audio/boss_intro_sound.mp3');
    hurt_sound = new Audio('audio/chicken_hurt.mp3');
    dead_sound = new Audio('audio/boss_dead.mp3');

    constructor() {
        super().loadImage('img/4_enemie_boss_chicken/1_walk/G1.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 5000;
        this.speed = 8;
        this.offset = { top: 60, right: 20, bottom: 90, left: 20 };
        this.animationIntervals = [];
        this.animate();
    }

    /**
     * Animiert das Verhalten des Endbosses, einschließlich der Alarm-Animation
     */
    animate() {
        const animationInterval = setInterval(() => {
            if (this.shouldStartAlert()) {
                this.startAlertAnimation(animationInterval);
            }
            
            // Sofortige Aktivierung falls Alert nicht funktioniert
            if (world && world.character.x >= 4500 && !this.hadFirstContact && !this.alertAnimationPlayed) {
                this.hadFirstContact = true;
                this.alertAnimationPlayed = true;
                this.startWalking();
                clearInterval(animationInterval);
            }
        }, 120);
        this.animationIntervals.push(animationInterval);
        addInterval(animationInterval);
        
        // Backup-Aktivierung: Falls der Boss nach 2 Sekunden noch nicht aktiviert wurde
        setTimeout(() => {
            if (!this.hadFirstContact && world && world.character.x >= 4000) {
                this.hadFirstContact = true;
                this.alertAnimationPlayed = true;
                this.startWalking();
            }
        }, 2000);
    }

    /**
     * Prüft ob die Alarm-Animation basierend auf bestimmten Bedingungen starten soll
     * @returns {boolean} True wenn die Alarm-Animation starten soll, false andernfalls
     */
    shouldStartAlert() {
        const shouldStart = world && world.character.x >= 4500 && !this.hadFirstContact;
        return shouldStart;
    }

    /**
     * Startet die Alarm-Animation für den Endboss-Charakter
     * @param {number} interval - Das Intervall zum Prüfen des Alarm-Starts
     */
    startAlertAnimation(interval) {
        if (!this.alertAnimationPlayed) {
            this.alert_sound.play();
            this.alertAnimationInterval = this.startAnimationInterval(this.IMAGES_ALERT, 275, () => {
                clearInterval(this.alertAnimationInterval);
                this.alertAnimationPlayed = true;
                setTimeout(() => {
                    this.hadFirstContact = true;
                    this.startWalking();
                }, 1000);
            });
            clearInterval(interval);
        }
    }

    /**
     * Startet die Verletzungs-Animation für den Endboss-Charakter
     * Diese Animation tritt auf, wenn der Endboss getroffen wird
     */
    startHurtAnimation() {
        if (!this.hurtAnimationInterval) {
            this.stopMovement();
            this.hurt_sound.play();
            this.hurtAnimationInterval = this.startAnimationInterval(this.IMAGES_HURT, 300, () => {
                this.resetToWalkingState();
            });
        }
    }

    /**
     * Startet das Geh-Verhalten für den Endboss-Charakter
     * Der Endboss bewegt sich nach links solange er lebt und nicht tot ist
     */
    startWalking() {
        // Stoppe vorherige Walking-Intervalle
        if (this.walkingInterval) {
            clearInterval(this.walkingInterval);
        }
        
        this.walkingInterval = setInterval(() => {
            if (this.energy > 0 && !this.isDead) {
                this.updateSpeed();
                this.playAnimation(this.IMAGES_WALKING);
                this.x -= this.speed; // Direkte Bewegung nach links
            } else if (this.bossIsDead()) {
                clearInterval(this.walkingInterval);
                this.walkingInterval = null;
            }
        }, 120);
        
        this.animationIntervals.push(this.walkingInterval);
        addInterval(this.walkingInterval);
    }

    /**
     * Aktualisiert die Geschwindigkeit des Endbosses basierend auf seinem Energielevel
     * Niedrigere Energie führt zu erhöhter Geschwindigkeitsvariation
     */
    updateSpeed() {
        if (this.energy < 60) {
            this.speed = 12 + Math.random() * 1.2;
        } else {
            this.speed = 8;
        }
    }

    /**
     * Behandelt wenn der Endboss getroffen wird
     * Reduziert die Energie des Endbosses, startet die Verletzungs-Animation und aktualisiert die Gesundheitsleiste
     */
    bossIsHit() {
        this.reduceEnergy();
        this.startHurtAnimation();
        this.updateHealthBar();
    }

    /**
     * Reduziert die Energie des Endbosses um 30 und stellt sicher, dass sie nicht unter 0 fällt
     */
    reduceEnergy() {
        this.energy -= 30;
        if (this.energy < 0) {
            this.energy = 0;
        }
    }

    /**
     * Setzt den Endboss nach der Verletzungs-Animation in den Geh-Zustand zurück
     */
    resetToWalkingState() {
        clearInterval(this.hurtAnimationInterval);
        this.hurtAnimationInterval = null;
        this.playAnimation(this.IMAGES_WALKING);
        this.resumeMovementAfterDelay(0.05);
    }

    /**
     * Stoppt die Bewegung des Endbosses durch Setzen der Geschwindigkeit auf 0
     */
    stopMovement() {
        this.speed = 0;
    }

    /**
     * Setzt die Bewegung des Endbosses nach einer bestimmten Verzögerung fort
     * Passt die Geschwindigkeit des Endbosses basierend auf der Energie an
     * @param {number} delay - Die Verzögerung in Sekunden vor dem Fortsetzen der Bewegung
     */
    resumeMovementAfterDelay(delay) {
        setTimeout(() => {
            this.speed = 8 + Math.random() * 1.2;
        }, delay * 1000);
    }

    /**
     * Prüft ob der Endboss tot ist basierend auf seinem Energielevel
     * Wenn die Energie null oder darunter ist und der Endboss noch nicht tot ist,
     * wird der Todesprozess eingeleitet
     */
    bossIsDead() {
        if (this.energy <= 0 && !this.isDead) {
            this.isDead = true;
            this.stopAllAnimations();
            this.dead_sound.play();
            this.startDeathAnimation();
            setTimeout(() => {
                showEndScreen();
            }, 1000);
            this.clearIntervals();
        }
    }

    /**
     * Löscht alle Animations-Intervalle die mit dem Endboss verbunden sind
     */
    clearIntervals() {
        this.animationIntervals.forEach(interval => clearInterval(interval));
        this.animationIntervals = [];
        this.animationIntervals.forEach(interval => {
            const index = intervals.indexOf(interval);
            if (index !== -1) {
                intervals.splice(index, 1);
            }
        });
    }

    /**
     * Stoppt alle Animationen für den Endboss, einschließlich Verletzungs-Animation und Bewegung
     */
    stopAllAnimations() {
        clearInterval(this.hurtAnimationInterval);
        this.stopMovement();
    }

    /**
     * Startet die Todes-Animation für den Endboss
     */
    startDeathAnimation() {
        this.deathAnimationInterval = this.startAnimationInterval(this.IMAGES_DEAD, 250, () => {
            this.endDeathAnimation();
        });
    }

    /**
     * Beendet die Todes-Animation für den Endboss und lädt das finale Bild
     */
    endDeathAnimation() {
        clearInterval(this.deathAnimationInterval);
        this.deathAnimationInterval = null;
        this.loadImage(this.IMAGES_DEAD[this.IMAGES_DEAD.length - 1]);
    }

    /**
     * Aktualisiert die Gesundheitsleiste des Endbosses in der Spielwelt
     */
    updateHealthBar() {
        world.endbossHealthbar.setPercentage(this.energy);
    }

    /**
     * Startet ein Animations-Intervall für eine Reihe von Bildern
     * Diese Funktion spielt die Animation ab und löst den onComplete-Callback aus wenn beendet
     * @param {Array<string>} images - Array von Bildpfaden für die Animations-Frames
     * @param {number} intervalTime - Das Zeitintervall zwischen jedem Frame in Millisekunden
     * @param {function|null} onComplete - Callback-Funktion die ausgeführt wird wenn die Animation abgeschlossen ist
     * @returns {number} - Die ID des Animations-Intervalls
     */
    startAnimationInterval(images, intervalTime, onComplete = null) {
        let animationCounter = 0;
        const animationLength = images.length;
        return setInterval(() => {
            this.playAnimation(images);
            animationCounter++;
            if (animationCounter / animationLength >= 1) {
                clearInterval(this.deathAnimationInterval);
                if (onComplete) onComplete();
            }
        }, intervalTime);
    }
}
