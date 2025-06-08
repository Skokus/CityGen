class Point {
    x: number;
    y: number;
    private roadCounter: number[];
    distanceFromCrossroad: number;
    constructor(x: number, y: number, distanceFromCrossroad?: number) {
        this.x = x;
        this.y = y;
        this.roadCounter = [0,0,0,0]; //right top left bottom
        this.distanceFromCrossroad = distanceFromCrossroad ? distanceFromCrossroad : 0;
    }

    getRandomPointFromDistance(distance: number): Point{
        var x = Math.random() * distance + this.x;
        var y = -Math.sqrt(Math.pow(distance, 2) - Math.pow(this.x - x, 2)) + this.y;
        return new Point(x, y);
    }

    getHashCode(): string{
        return "X" + this.x + "Y" + this.y;
    }

    getDistancedPoint(distance: number, angle: number): Point {
        return new Point(this.x + distance * Math.cos(angle), this.y + distance * Math.sin(angle));
    }
}

export default Point;