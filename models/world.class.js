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

    // Manager-Instanzen
    collisionManager;
    renderManager;
    gameManager;

    constructor(canvas, keyboard, level1) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.level = level1;
        
        // Optimiere Canvas für perfekt nahtlose Hintergrundbilder
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.webkitImageSmoothingEnabled = false;
        this.ctx.mozImageSmoothingEnabled = false;
        this.ctx.msImageSmoothingEnabled = false;
        this.ctx.oImageSmoothingEnabled = false;
        
        // Erzwinge Pixel-perfektes Rendering
        this.ctx.translate(0.5, 0.5);
        this.ctx.scale(1, 1);
        this.ctx.translate(-0.5, -0.5);
        
        // Initialisiere Manager
        this.collisionManager = new CollisionManager(this);
        this.renderManager = new RenderManager(this);
        this.gameManager = new GameManager(this);
        
        this.setWorld();
        
        // Rendere sofort mehrere Frames um schwarzes Bild zu vermeiden
        this.draw();
        setTimeout(() => this.draw(), 10);
        setTimeout(() => this.draw(), 50);
        
        this.run();
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
        const gameLoop = () => {
            if (!this.character || this.gameOver) return;
    
            this.collisionManager.checkAllCollisions();
            this.gameManager.checkThrowObjects();
            this.checkGameState();
    
            requestAnimationFrame(gameLoop); 
        };
        
        const drawLoop = () => {
            if (!gameActive || this.gameOver) return;
            
            this.draw();
            requestAnimationFrameId = requestAnimationFrame(drawLoop);
        };
        
        requestAnimationFrame(gameLoop);
        requestAnimationFrame(drawLoop);
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

        // Level1 neu initialisieren
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
