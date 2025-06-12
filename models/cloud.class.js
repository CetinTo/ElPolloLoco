/**
 * Repräsentiert ein Wolken-Objekt das sich über den Bildschirm bewegt
 * Erweitert die MoveableObject-Klasse
 */
class Cloud extends MoveableObject {
    y = 25;
    width = 400;
    height = 250;

    constructor(x = 0) {
        super().loadImage('img/5_background/layers/4_clouds/1.png');
        this.initializeProperties(x);
        this.startMovement();
    }

    /**
     * Initialisiert die Position der Wolke
     */
    initializeProperties(x) {
        this.x = x;
    }

    /**
     * Startet die Wolken-Bewegung
     */
    startMovement() {
        this.animate();
    }

    /**
     * Animiert die Wolkenbewegung
     */
    animate() {
        setInterval(() => {
            this.moveLeft();
            if (this.x + this.width < 0) {
                this.x = window.innerWidth + 1000 + Math.random() * 1000; 
            }
        }, 1000 / 60);
    }
}
