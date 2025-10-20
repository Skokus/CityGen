import Building from "../building/Building";
import SquareBuilding from "../building/SquareBuilding";
import Point from "../point/Point";

class Road {

    p1: Point;
    p2: Point;
    completionRate: number;
    completionPoint: Point = new Point(0,0);

    constructor(p1: Point, p2: Point, completionRate: number = 1) {
        this.p1 = p1;
        this.p2 = p2;
        this.completionRate = completionRate;
        this.updateCompletionPoint(completionRate);
    }

    get length(): number {
        return Math.sqrt(Math.pow((this.p1.x - this.p2.x), 2) + Math.pow((this.p1.y - this.p2.y), 2));
    }

    get slope(): number { // a in y=ax+b
        return (this.p2.y - this.p1.y) / (this.p2.x - this.p1.x);
    }

    get yInter(): number { // b in y=ax+b
        return this.p1.y - this.slope * this.p1.x;
    }

    get perpendicularSlope(): number {
        return -1 / this.slope;
    }

    get angle(): number {
        return Math.atan2(this.p2.y - this.p1.y, this.p2.x - this.p1.x);
    }

    public getPoint1(): Point {
        return this.p1;
    }

    public getPoint2(): Point {
        return this.p2;
    }

    public splitRoad(p: Point): Road[] {
        return [new Road(this.p1, p), new Road(p, this.p2)];
    }

    public getPerpendicularB(p: Point): number { //after splitting road get the perpendicular line equation
        return p.y - this.perpendicularSlope * p.x;
    }

    public getRandomPoint(): Point {
        if (Math.random() > 0.5)
            return this.p1;
        else
            return this.p2;
    }

    public getRandomPointInsideRoad(): Point {
        var scalar = Math.random() * 0.1 + 0.45;
        var distX = this.p2.x - this.p1.x;
        var distY = this.p2.y - this.p1.y;

        var modX = (distX * scalar) + this.p1.x;
        var modY = (distY * scalar) + this.p1.y;
        return new Point(modX, modY);
    }

    public getOtherPoint(p: Point) { //USE ONLY WITH p AS p1 OR p2
        if (p !== this.p1)
            return this.p1;
        else
            return this.p2;
    }

    public doesContainPoint(p: Point): boolean {
        return this.p1 === p || this.p2 === p;
    }

    public getPointFromRoadScalar(scalar: number): Point {
        //https://stackoverflow.com/questions/64938264/how-can-i-generate-a-random-point-on-a-line-segment
        var distX = this.p2.x - this.p1.x;
        var distY = this.p2.y - this.p1.y;
        var modX = (distX * scalar) + this.p1.x;
        var modY = (distY * scalar) + this.p1.y;
        return new Point(modX, modY);
    }

    public getIntersectionPoint(a: number, b: number): Point {
        var x = (this.yInter - b) / (a - this.slope);
        var range = [this.p1.x, this.p2.x].sort((a, b) => a - b);
        if (x < range[0] || x > range[1]) {
            return new Point(Number.NaN, Number.NaN);
        }
        var y = this.slope * x + this.yInter;
        return new Point(x, y);
    }

    public isAboveLine(a: number, b: number) {
        return this.p1.isAboveLine(a, b) && this.p2.isAboveLine(a, b);
    }

    public static distanceFromPoint(p: Point, p1: Point, p2: Point): number {
        //https://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment
        const x = p.x;
        const x1 = p1.x;
        const x2 = p2.x;
        const y = p.y;
        const y1 = p1.y;
        const y2 = p2.y;

        let A = x - x1;
        let B = y - y1;
        let C = x2 - x1;
        let D = y2 - y1;

        let dot = A * C + B * D;
        let len_sq = C * C + D * D;
        let param = -1;
        if (len_sq !== 0) //in case of 0 length line
            param = dot / len_sq;

        let xx, yy;
        if (param < 0) {
            xx = x1;
            yy = y1;
        } else if (param > 1) {
            xx = x2;
            yy = y2;
        } else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }
        let dx = x - xx;
        let dy = y - yy;
        return Math.sqrt(dx * dx + dy * dy);
    }

    public updateCompletionPoint(rate: number): void{
        let r = rate < 1 ? rate : 1;
        this.completionRate = r;
        this.completionPoint = this.getPointFromRoadScalar(r);
    }

}

export default Road;