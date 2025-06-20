/**
 * Represents a game level with enemies, clouds, background objects, coins, bottles and an end boss
 * @class
 */

class Level {
    enemies;
    clouds;
    backgroundObjects;
    coins;
    bottles;
    endboss;
    level_end_x = 4500;

    constructor(enemies, clouds, backgroundObjects, coins, bottles, endboss) {
        this.initializeGameObjects(enemies, clouds, backgroundObjects, coins, bottles, endboss);
    }

    /**
     * Initializes all game objects of the level
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
