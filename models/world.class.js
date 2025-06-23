/**
 * Animation frame request ID for tracking
 * @type {number}
 */
let requestAnimationFrameId = 0;

/**
 * Represents the game world where characters and objects interact
 * @class
 */
class World {
    /**
     * Main character object
     * @type {Character}
     */
    character = new Character();
    
    /**
     * Coin status bar display
     * @type {CoinBar}
     */
    coinBar = new CoinBar();
    
    /**
     * Bottle status bar display
     * @type {BottleBar}
     */
    bottleBar = new BottleBar();
    
    /**
     * End boss health bar display
     * @type {EndbossHealthbar}
     */
    endbossHealthbar = new EndbossHealthbar();
    
    /**
     * Character health status bar
     * @type {Statusbar}
     */
    statusBar = new Statusbar();
    
    /**
     * Array of thrown objects
     * @type {Array<ThrowableObject>}
     */
    throwableObjects = [];
    
    /**
     * Current game level
     * @type {Level}
     */
    level; 
    
    /**
     * Canvas element for rendering
     * @type {HTMLCanvasElement}
     */
    canvas;
    
    /**
     * 2D rendering context
     * @type {CanvasRenderingContext2D}
     */
    ctx;
    
    /**
     * Keyboard input handler
     * @type {Keyboard}
     */
    keyboard;
    
    /**
     * Camera X position for scrolling
     * @type {number}
     */
    camera_x = 0;
    
    /**
     * Number of collected coins
     * @type {number}
     */
    collectedCoins = 0;
    
    /**
     * Whether to show end boss health bar
     * @type {boolean}
     */
    showEndbossHealthbar = false;
    
    /**
     * Game over status
     * @type {boolean}
     */
    gameOver = false;
    
    /**
     * Whether character can throw bottles
     * @type {boolean}
     */
    canThrowBottle = true;
    
    /**
     * Number of available bottles to throw
     * @type {number}
     */
    availableBottles = 0;

    /**
     * Collision detection manager
     * @type {CollisionManager}
     */
    collisionManager;
    
    /**
     * Rendering manager
     * @type {RenderManager}
     */
    renderManager;
    
    /**
     * Game logic manager
     * @type {GameManager}
     */
    gameManager;

    /**
     * Creates a new World instance
     * @param {HTMLCanvasElement} canvas - Canvas element for rendering
     * @param {Keyboard} keyboard - Keyboard input handler
     * @param {Level} level1 - Initial game level
     */
    constructor(canvas, keyboard, level1) {
        this.initializeCanvasContext(canvas);
        this.initializeProperties(keyboard, level1);
        this.initializeManagers();
        this.setupWorld();
        this.startGameLoops();
    }

    /**
     * Initializes canvas and context properties
     * @param {HTMLCanvasElement} canvas - Canvas element
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
     * @param {Keyboard} keyboard - Keyboard input handler
     * @param {Level} level1 - Initial game level
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
     * Sets up the game world
     */
    setupWorld() {
        this.setWorld();
        

        this.draw();
        setTimeout(() => this.draw(), 10);
        setTimeout(() => this.draw(), 50);
    }

    /**
     * Starts all game loops
     */
    startGameLoops() {
        this.startMainGameLoop();
        this.startDrawLoop();
    }

    /**
     * Starts the main game loop
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
     * Starts the drawing loop
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
     * Main drawing function - delegates to RenderManager
     */
    draw() {
        this.renderManager.draw();
    }

    /**
     * Plays a game sound - delegates to GameManager
     * @param {string} soundFilePath - Path to the sound file
     * @param {number} [volume=0.2] - Volume level
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
