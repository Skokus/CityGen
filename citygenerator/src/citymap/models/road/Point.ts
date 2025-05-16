class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    getRandomPointFromDistance(distance: number): Point{
        var x = Math.random() * distance + this.x;
        var y = -Math.sqrt(Math.pow(distance, 2) - Math.pow(this.x - x, 2)) + this.y;
        return new Point(x, y);
    }
}

export default Point;