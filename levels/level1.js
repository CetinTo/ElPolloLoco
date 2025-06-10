/**
 * Initialisiert das Spiellevel mit spezifizierten Entitäten und Objekten
 */
function initLevel() {
    /**
     * Das Spiellevel, enthält Hühner, Wolken, Hintergrundobjekte, Münzen, Flaschen und einen Endboss
     * @type {Level}
     */
    level1 = new Level(
        // Hühner-Array (Mix aus normalen und kleinen Hühnern)
        [
            // Erstes Huhn - Tutorial (einzeln)
            new Chicken(800),
            
            // Kleine Hühner - früher Bereich
            new ChickenSmall(1100),
            new ChickenSmall(1150),
            
            // Früher Bereich - Hühner-Paar (schwieriger)
            new Chicken(1200),
            new Chicken(1350),
            
            // Einzelnes kleines Huhn
            new ChickenSmall(1600),
            
            // Einzelnes normales Huhn
            new Chicken(1800),
            
            // Kleine Hühner-Gruppe
            new ChickenSmall(2000),
            new ChickenSmall(2100),
            
            // Mittlerer Bereich - Dreier-Gruppe (herausfordernd)
            new Chicken(2200),
            new Chicken(2350),
            new Chicken(2500),
            
            // Kleine Hühner nach der großen Gruppe
            new ChickenSmall(2700),
            
            // Pause - einzelnes Huhn
            new Chicken(2900),
            
            // Mix aus kleinen und normalen Hühnern
            new ChickenSmall(3100),
            new Chicken(3300),
            new ChickenSmall(3400),
            new Chicken(3450),
            
            // Kleine Hühner vor dem Boss
            new ChickenSmall(3800),
            new ChickenSmall(3850),
            
            // Letztes einzelnes Huhn vor Boss
            new Chicken(3900),
        ],
        // Wolken-Array
        [
            new Cloud(200),
            new Cloud(800),
            new Cloud(1400),
            new Cloud(2000)
        ],
        // Hintergrundobjekte-Array
        [
            new BackgroundObject('img/5_background/layers/air.png', -719),
            new BackgroundObject('img/5_background/layers/3_third_layer/2.png', -719),
            new BackgroundObject('img/5_background/layers/2_second_layer/2.png', -719),
            new BackgroundObject('img/5_background/layers/1_first_layer/2.png', -719),
            new BackgroundObject('img/5_background/layers/air.png', 0),
            new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 0),
            new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 0),
            new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 0),
            new BackgroundObject('img/5_background/layers/air.png', 718),
            new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 718),
            new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 718),
            new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 718),
            new BackgroundObject('img/5_background/layers/air.png', 718 * 2),
            new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 718 * 2),
            new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 718 * 2),
            new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 718 * 2),
            new BackgroundObject('img/5_background/layers/air.png', 718 * 3),
            new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 718 * 3),
            new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 718 * 3),
            new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 718 * 3),
            new BackgroundObject('img/5_background/layers/air.png', 718 * 4),
            new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 718 * 4),
            new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 718 * 4),
            new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 718 * 4),
            new BackgroundObject('img/5_background/layers/air.png', 718 * 5),
            new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 718 * 5),
            new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 718 * 5),
            new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 718 * 5),
            new BackgroundObject('img/5_background/layers/air.png', 718 * 6),
            new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 718 * 6),
            new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 718 * 6),
            new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 718 * 6),
            new BackgroundObject('img/5_background/layers/air.png', 718 * 7),
            new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 718 * 7),
            new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 718 * 7),
            new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 718 * 7),
        ],
        // Münzen-Array
        [
            // Startbereich
            new Coin(200, 150),
            new Coin(350, 100),
            
            // Erste Sektion
            new Coin(600, 180),
            new Coin(800, 80),
            new Coin(1000, 150),
            
            // Mittlerer Bereich
            new Coin(1300, 50),
            new Coin(1500, 200),
            new Coin(1700, 120),
            
            // Sprungbereich
            new Coin(1950, 60),
            new Coin(2200, 180),
            new Coin(2450, 100),
            
            // Späte Sektion
            new Coin(2700, 150),
            new Coin(2950, 80),
            new Coin(3200, 200),
            
            // Endbereich
            new Coin(3500, 120),
            new Coin(3750, 60),
            new Coin(4000, 150),
        ],
        // Flaschen-Array
        [
            new Bottles(0, 375),
            new Bottles(100, 375),
            new Bottles(650, 375),
            new Bottles(950, 375),
            new Bottles(1200, 375),
            new Bottles(1300, 375),
            new Bottles(1450, 375),
            new Bottles(1650, 375),
            new Bottles(1750, 375),
            new Bottles(2050, 375),
            new Bottles(2350, 375),
            new Bottles(2550, 375),
            new Bottles(2950, 375),
            new Bottles(3250, 375),
            new Bottles(3550, 375),
            new Bottles(3700, 375),
            new Bottles(3950, 375),
        ],
        // Endboss
        [new Endboss()]
    );
}
