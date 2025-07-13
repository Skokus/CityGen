import Road from "./Road";

class Point {
    x: number;
    y: number;
    roadCounter: number[];
    connectedRoads: Road[];
    distanceFromCrossroad: number;

    constructor(x: number, y: number, distanceFromCrossroad?: number) {
        this.x = x;
        this.y = y;
        this.roadCounter = [0, 0, 0, 0]; //right top left bottom
        this.connectedRoads = [];
        this.distanceFromCrossroad = distanceFromCrossroad ? distanceFromCrossroad : 0;
    }

    public getDistancedPoint(distance: number, angle: number): Point {
        return new Point(this.x + distance * Math.cos(angle), this.y + distance * Math.sin(angle));
    }

    public getRandomDirection(): number {
        var possibleDirections: number[] = [];
        for (var i = 0; i < this.roadCounter.length; i++) {
            if (this.roadCounter[i] <= 0) {
                possibleDirections.push(i);
            }
        }
        if (possibleDirections.length > 0) {
            return possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
        }
        return -1;
    }

    public getForwardDirection(): number {
        for (var i = 0; i < this.roadCounter.length; i++) {
            if (this.roadCounter[i] > 0) {
                return (i + 2) % this.roadCounter.length;
            }
        }
        return -1;
    }

    public getSideDirection(): number {
        for (var i = 0; i < this.roadCounter.length; i++) {
            if (this.roadCounter[i] === 0) {
                return i;
            }
        }
        return -1;
    }

    public getRoadCount(): number {
        let count = 0;
        for (let i = 0; i < this.roadCounter.length; i++) {
            count += this.roadCounter[i];
        }
        return count;
    }

    public getAngle(p: Point): number {
        return Math.atan2(this.y - p.y, this.x - p.x);
    }

    public addRoad(road: Road, direction: number) {
        this.roadCounter[direction]++;
        this.connectedRoads.push(road);
    }

    public getAllRoads(): Road[] {
        let ret: Road[] = [];
        for (let road of this.connectedRoads) {
            if (road !== null) {
                ret.push(road);
            }
        }
        return ret;
    }
}

export default Point;