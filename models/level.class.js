/**
 * Represents a game level with enemies, clouds, background objects, coins, bottles and an end boss
 * @class
 */

class Level {
    /**
     * Array of enemy objects in the level
     * @type {Array}
     */
    enemies;
    
    /**
     * Array of cloud objects in the level
     * @type {Array}
     */
    clouds;
    
    /**
     * Array of background objects in the level
     * @type {Array}
     */
    backgroundObjects;
    
    /**
     * Array of coin objects in the level
     * @type {Array}
     */
    coins;
    
    /**
     * Array of bottle objects in the level
     * @type {Array}
     */
    bottles;
    
    /**
     * Array containing the end boss object
     * @type {Array}
     */
    endboss;
    
    /**
     * X-coordinate where the level ends
     * @type {number}
     */
    level_end_x = 4500;

    /**
     * Creates a new Level instance
     * @param {Array} enemies - Array of enemy objects
     * @param {Array} clouds - Array of cloud objects
     * @param {Array} backgroundObjects - Array of background objects
     * @param {Array} coins - Array of coin objects
     * @param {Array} bottles - Array of bottle objects
     * @param {Array} endboss - Array containing the end boss
     */
    constructor(enemies, clouds, backgroundObjects, coins, bottles, endboss) {
        this.initializeGameObjects(enemies, clouds, backgroundObjects, coins, bottles, endboss);
    }

    /**
     * Initializes all game objects of the level
     * @param {Array} enemies - Array of enemy objects
     * @param {Array} clouds - Array of cloud objects
     * @param {Array} backgroundObjects - Array of background objects
     * @param {Array} coins - Array of coin objects
     * @param {Array} bottles - Array of bottle objects
     * @param {Array} endboss - Array containing the end boss
     */
    initializeGameObjects(enemies, clouds, backgroundObjects, coins, bottles, endboss) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.bottles = bottles;
        this.endboss = endboss;
    }
}
