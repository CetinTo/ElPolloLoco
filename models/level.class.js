/**
 * Repräsentiert ein Spiellevel mit Gegnern, Wolken, Hintergrundobjekten, Münzen, Flaschen und einem Endboss
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
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.bottles = bottles;
        this.endboss = endboss;
    }
}
