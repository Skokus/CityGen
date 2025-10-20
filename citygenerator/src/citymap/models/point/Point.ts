import River from "../River";
import Road from "../road/Road";

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

    public distanceFromPoint(point: Point){
        var a = this.x - point.x;
        var b = this.y - point.y;
        return Math.sqrt(a*a + b*b)
    }

    public distanceFromRiver(river: River){
        let minDistance = Number.MAX_SAFE_INTEGER;
        for(let riverRoad of river.riverRoads){
            const dist = Road.distanceFromPoint(this, riverRoad.p1, riverRoad.p2);
            if(dist < minDistance){
                minDistance = dist;
            }
        }
        console.log(minDistance);
        return minDistance;
    }

}

export default Point;