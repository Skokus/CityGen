import Point from "./Point";
import Road from "../road/Road";

class MainPoint extends Point {

    connectedRoads: Road[][];
    distanceFromCenter: number;

    constructor(x: number, y: number, distanceFromCenter?: number) {
        super(x, y);
        this.connectedRoads = [[], [], [], []];
        this.distanceFromCenter = distanceFromCenter ? distanceFromCenter : 0;
    }

    public getDistancedPoint(distance: number, angle: number): Point {
        return new Point(this.x + distance * Math.cos(angle), this.y + distance * Math.sin(angle));
    }

    public getRandomDirection(): number {
        var possibleDirections: number[] = [];
        for (var i = 0; i < this.connectedRoads.length; i++) {
            if (this.connectedRoads[i].length === 0) {
                possibleDirections.push(i);
            }
        }
        if (possibleDirections.length > 0) {
            return possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
        }
        return -1;
    }

    public getForwardDirection(): number {
        for (var i = 0; i < this.connectedRoads.length; i++) {
            if (this.connectedRoads[i].length > 0) {
                return (i + 2) % this.connectedRoads.length;
            }
        }
        return -1;
    }

    public getSideDirection(): number {
        for (var i = 0; i < this.connectedRoads.length; i++) {
            if (this.connectedRoads[i].length === 0) {
                return i;
            }
        }
        return -1;
    }

    public getRoadCount(): number {
        let count = 0;
        for (let i = 0; i < this.connectedRoads.length; i++) {
            count += this.connectedRoads[i].length;
        }
        return count;
    }

    public addRoad(road: Road, direction: number) {
        this.connectedRoads[direction].push(road);
    }

    public getAllRoads(): Road[] {
        return this.connectedRoads.flat();
    }
}

export default MainPoint;