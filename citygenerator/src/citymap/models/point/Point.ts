class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public getDistancedPoint(distance: number, angle: number): Point {
        return new Point(this.x + distance * Math.cos(angle), this.y + distance * Math.sin(angle));
    }

    public getAngle(p: Point): number {
        return Math.atan2(this.y - p.y, this.x - p.x);
    }

    public isNan(): boolean {
        return Number.isNaN(this.x) || Number.isNaN(this.y);
    }
    public isAboveLine(a: number, b: number){
        return this.y < (a * this.x + b);
    }
}

export default Point;