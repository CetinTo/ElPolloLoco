let requestAnimationFrameId = 0;

/**
 * Repräsentiert die Spielwelt, in der Charaktere und Objekte interagieren
 * @class
 */
class World {
    character = new Character();
    coinBar = new CoinBar();
    bottleBar = new BottleBar();
    endbossHealthbar = new EndbossHealthbar();
    statusBar = new Statusbar();
    throwableObjects = [];
    level; 
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    collectedCoins = 0;
    showEndbossHealthbar = false;
    gameOver = false;
    canThrowBottle = true;
    availableBottles = 0;

    
    collisionManager;
    renderManager;
    gameManager;

    constructor(canvas, keyboard, level1) {
        this.initializeCanvasContext(canvas);
        this.initializeProperties(keyboard, level1);
        this.initializeManagers();
        this.setupWorld();
        this.startGameLoops();
    }

    /**
     * Initialisiert Canvas und Kontext-Eigenschaften
     */
    initializeCanvasContext(canvas) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        
        // Canvas Größe explizit setzen
        this.canvas.width = 864;
        this.canvas.height = 576;
        
        // Anti-Aliasing konfigurieren aber nicht deaktivieren
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';
        
        // Canvas leeren und testen
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'blue';
        this.ctx.fillRect(0, 0, 50, 50);
        
        console.log('Canvas initialisiert:', this.canvas.width, 'x', this.canvas.height);
    }

    /**
     * Initialisiert grundlegende Eigenschaften
     */
    initializeProperties(keyboard, level1) {
        this.keyboard = keyboard;
        this.level = level1;
    }

    /**
     * Initialisiert alle Manager-Klassen
     */
    initializeManagers() {
        this.collisionManager = new CollisionManager(this);
        this.renderManager = new RenderManager(this);
        this.gameManager = new GameManager(this);
    }

    /**
     * Richtet die Welt ein
     */
    setupWorld() {
        this.setWorld();
        
        // Initiale Zeichnungen für bessere Performance
        this.draw();
        setTimeout(() => this.draw(), 10);
        setTimeout(() => this.draw(), 50);
    }

    /**
     * Startet alle Spiel-Loops
     */
    startGameLoops() {
        console.log('Starte Game Loops...');
        this.run();
        
        // Erzwinge erste Zeichnung
        setTimeout(() => {
            console.log('Erste Zeichnung...');
            this.draw();
        }, 100);
    }

    /**
     * Setzt die Welt-Referenz für den Charakter
     */
    setWorld() {
        this.character.world = this;
    }

    /**
     * Startet die Hauptspiel-Schleife
     */
    run() {
        console.log('Hauptspiel-Schleife gestartet');
        
        // Vereinfachte Game Loop
        const gameLoopInterval = setInterval(() => {
            if (!gameActive || !this.character || this.gameOver) {
                clearInterval(gameLoopInterval);
                console.log('🛑 Game Loop gestoppt');
                return;
            }
            
            this.collisionManager.checkAllCollisions();
            this.gameManager.checkThrowObjects();
            this.checkGameState();
        }, 1000/60); // 60 FPS
        
        // Vereinfachte Draw Loop
        const drawLoopInterval = setInterval(() => {
            if (!gameActive || this.gameOver) {
                clearInterval(drawLoopInterval);
                console.log('🛑 Draw Loop gestoppt');
                return;
            }
            this.draw();
        }, 1000/60); // 60 FPS
        
        // Intervals zur globalen Liste hinzufügen
        if (typeof addInterval === 'function') {
            addInterval(gameLoopInterval);
            addInterval(drawLoopInterval);
        }
    }

    /**
     * Überprüft den Spielzustand (Gewinn/Verlust)
     */
    checkGameState() {
        if (this.gameManager.isEndbossDefeated() || this.gameManager.isCharacterDead()) {
            this.gameManager.endGame();
        }
    }

    /**
     * Setzt die Spielwelt zurück
     */
    resetWorld() {
        this.availableBottles = 0;
        this.throwableObjects = [];
        this.gameOver = false;
        this.camera_x = 0;
        this.collectedCoins = 0;
        this.showEndbossHealthbar = false;

        
        initLevel();
        this.level = level1;
        
        this.character = new Character();
        this.character.world = this;
    }

    /**
     * Hauptzeichenfunktion - delegiert an RenderManager
     */
    draw() {
        this.renderManager.draw();
    }

    /**
     * Spielt einen Spiel-Sound ab - delegiert an GameManager
     */
    playGameSound(soundFilePath, volume = 0.2) {
        this.gameManager.playGameSound(soundFilePath, volume);
    }

    /**
     * Spielt das Flaschen-Zerbrechgeräusch ab - delegiert an GameManager
     */
    playBottleShatterSound() {
        this.gameManager.playBottleShatterSound();
    }
}
