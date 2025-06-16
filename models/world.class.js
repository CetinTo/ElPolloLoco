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
        this.startMainGameLoop();
        this.startDrawLoop();
    }

    /**
     * Startet die Hauptspiel-Schleife
     */
    startMainGameLoop() {
        const gameLoop = setInterval(() => {
            if (!gameActive || this.gameOver) {
                clearInterval(gameLoop);
                return;
            }
            this.runGameLogic();
        }, 1000 / 60);
        
        addInterval(gameLoop);
    }

    /**
     * Startet die Zeichen-Schleife
     */
    startDrawLoop() {
        const drawLoop = setInterval(() => {
            if (!gameActive || this.gameOver) {
                clearInterval(drawLoop);
                return;
            }
            this.draw();
        }, 1000 / 60);
        
        addInterval(drawLoop);
    }

    /**
     * Setzt die Welt-Referenz für den Charakter
     */
    setWorld() {
        this.character.world = this;
    }

    /**
     * Führt die Hauptspiel-Logik aus (OHNE neue Intervalle zu erstellen)
     */
    runGameLogic() {
        if (!this.character || this.gameOver) {
            return;
        }
        
        this.collisionManager.checkAllCollisions();
        this.gameManager.checkThrowObjects();
        this.checkGameState();
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
