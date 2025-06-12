/**
 * Repräsentiert ein zeichenbares Objekt im Spiel
 * @class
 */
class DrawableObject {
    x = 120;
    y = 365;
    height = 150;
    width = 100;
    img;
    imageCache = {};
    currentImage = 0;
    offset = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    };

    /**
     * Lädt ein Bild vom angegebenen Pfad und weist es der 'img'-Eigenschaft des Objekts zu
     * @param {string} path - Der Pfad zur Bilddatei
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Lädt ein Array von Bildern und speichert sie im Bild-Cache
     * @param {string[]} array - Ein Array von Bildpfaden zum Laden
     */
    loadImages(array) {
        array.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    /**
     * Zeichnet das Objekt auf den Canvas-Kontext
     * @param {CanvasRenderingContext2D} ctx - Der Canvas-Rendering-Kontext
     */
    draw(ctx) {
        try {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        } catch (e) {}
    }

    /**
     * Zeichnet einen Rahmen um das Objekt für Debugging-Zwecke
     * @param {CanvasRenderingContext2D} ctx - Der Canvas-Rendering-Kontext
     */
    drawFrame(ctx) {
        if (this instanceof Character || this instanceof Chicken || this instanceof Endboss || this instanceof Coin || this instanceof Bottles || this instanceof ThrowableObject) {
            ctx.beginPath();
            ctx.lineWidth = '2';
            ctx.strokeStyle = 'blue';
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();

            ctx.beginPath();
            ctx.lineWidth = '2';
            ctx.strokeStyle = 'red';
            ctx.rect(this.x + this.offset.left, this.y + this.offset.top, this.width - this.offset.right - this.offset.left, this.height - this.offset.bottom);
            ctx.stroke();
        }
    }

    /**
     * Bestimmt den Index des zu verwendenden Bildes basierend auf einem gegebenen Prozentsatz
     * @param {number} percentage - Der Prozentsatz (0-100) zur Bestimmung des Bild-Index
     * @returns {number} - Der Index des zu verwendenden Bildes
     */
    resolveImagesIndex(percentage) {
        if (percentage >= 100) {
            return 5;
        } else if (percentage >= 80) {
            return 4;
        } else if (percentage >= 60) {
            return 3;
        } else if (percentage >= 40) {
            return 2;
        } else if (percentage >= 20) {
            return 1;
        } else {
            return 0;
        }
    }
}
