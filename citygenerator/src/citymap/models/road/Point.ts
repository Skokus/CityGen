class Point {
    x: number;
    y: number;
    private roadCounter: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.roadCounter = 0;
    }

    getRandomPointFromDistance(distance: number): Point{
        var x = Math.random() * distance + this.x;
        var y = -Math.sqrt(Math.pow(distance, 2) - Math.pow(this.x - x, 2)) + this.y;
        return new Point(x, y);
    }

    increaseRoadCounter(): void{
        this.roadCounter++;
    }

    getRoadCounter(): number{
        return this.roadCounter;
    }

    getHashCode(): string{
        return "X" + this.x + "Y" + this.y;
    }
}

export default Point;