const {Frame} = require("./Frame");

class Movie {
    constructor(ledCount, delay, frameCount) {
        this.frames = new Array(frameCount);
        this.ledCount = ledCount;
        this.delay = delay;
        this.frameCount = frameCount;
    }

    static repeatedColors(ledCount, colors) {
        let movie = new Movie(ledCount, 1, 1);
        movie.put(0, Frame.repeatedColors(ledCount, colors));
        return movie;
    }

    static twinklingColors(ledCount, frameCount, delay, colors) {
        let movie = new Movie(ledCount, delay, frameCount);
        for (let i = 0; i < frameCount; i++) {
            let frame = Frame.repeatedColors(ledCount, colors);
            frame.addTwinkle(30, 0.1);
            movie.put(i, frame);
        }
        return movie;
    }

    static blinkingColors(ledCount, delay, colors) {
        let movie = new Movie(ledCount, delay, colors.length);
        for (let i = 0; i < colors.length; i++) {
            movie.put(i, Frame.singleColor(ledCount, colors[i]));
        }
        return movie;
    }

    static loopingColors(ledCount, delay, colors) {
        let movie = new Movie(ledCount, delay, colors.length);
        for (let i = 0; i < colors.length; i++) {
            colors.push(colors.shift());
            movie.put(i, Frame.repeatedColors(ledCount, colors));
        }
        return movie;
    }

    static movingGradient(ledCount, frameCount, delay, colors, addTwinkle = false) {
        let movie = new Movie(ledCount, delay, frameCount);
        for (let i = 0; i < frameCount; i++) {
            // Offset changes to create the moving effect
            let frame = Frame.gradient(ledCount, colors, i);
            if (addTwinkle) {
                frame.addTwinkle(Math.floor(ledCount * 0.05), 0.2); // Twinkle 5% of LEDs
            }
            movie.put(i, frame);
        }
        return movie;
    }

    get(index) {
        return this.frames[index];
    }

    put(index, frame) {
        this.frames[index] = frame;
    }

    getArray(ledProfile) {
        let frameLength = this.ledCount * ledProfile.length;
        let array = new Uint8Array(this.frameCount * frameLength);
        for (let i = 0; i < this.frameCount; i++) {
            let frame = this.frames[i].getArray(ledProfile);
            console.assert(frame.length === frameLength, `Frame ${i} length mismatch!`);
        

            for (let frameIndex = 0; frameIndex < frameLength; frameIndex++) {
                array[frameLength * i + frameIndex] = frame[frameIndex];
            }
        }
        return array;
    }

    getArraySpiral(ledProfile, treeHeight, treeCircumference) {
        let frameLength = this.ledCount * ledProfile.length;
        let array = new Uint8Array(this.frameCount * frameLength);
        let ledsPerRow = Math.floor(this.ledCount / treeHeight);
        
        for (let i = 0; i < this.frameCount; i++) {
            let frame = this.frames[i].getArray(ledProfile);
            console.assert(frame.length === frameLength, `Frame ${i} length mismatch!`);
            
            for (let row = 0; row < treeHeight; row++) {
                for (let col = 0; col < ledsPerRow; col++) {
                    let ledIndex = row * ledsPerRow + col;
                    let spiralIndex = (row * treeCircumference + col) % this.ledCount;
                    for (let k = 0; k < ledProfile.length; k++) {
                        array[(i * frameLength) + (ledIndex * ledProfile.length) + k] = frame[(spiralIndex * ledProfile.length) + k];
                    }
                }
            }
        }
        return array;
    }
};

exports.Movie = Movie;
