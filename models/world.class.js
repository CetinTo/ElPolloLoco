let requestAnimationFrameId = 0;

/**
 * Represents the game world where characters and objects interact
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
     * Initializes canvas and context properties
     */
    initializeCanvasContext(canvas) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        

        this.canvas.width = 720;
        this.canvas.height = 480;
        

        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';
        

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'blue';
        this.ctx.fillRect(0, 0, 50, 50);
    }

    /**
     * Initializes basic properties
     */
    initializeProperties(keyboard, level1) {
        this.keyboard = keyboard;
        this.level = level1;
    }

    /**
     * Initializes all manager classes
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
     * Sets the world reference for the character
     */
    setWorld() {
        this.character.world = this;
    }

    /**
     * Executes the main game logic (WITHOUT creating new intervals)
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
     * Checks the game state (win/loss)
     */
    checkGameState() {
        if (this.gameManager.isEndbossDefeated() || this.gameManager.isCharacterDead()) {
            this.gameManager.endGame();
        }
    }

    /**
     * Reset world properties to initial state
     */
    resetWorldProperties() {
        this.availableBottles = 0;
        this.throwableObjects = [];
        this.gameOver = false;
        this.camera_x = 0;
        this.collectedCoins = 0;
        this.showEndbossHealthbar = false;
    }

    /**
     * Reset level and character
     */
    resetLevelAndCharacter() {
        initLevel();
        this.level = level1;
        this.character = new Character();
        this.character.world = this;
    }

    /**
     * Resets the game world
     */
    resetWorld() {
        this.resetWorldProperties();
        this.resetLevelAndCharacter();
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
     * Plays the bottle breaking sound - delegates to GameManager
     */
    playBottleShatterSound() {
        this.gameManager.playBottleShatterSound();
    }
}
