import Point from "./Point";
import MainRoad from "../road/MainRoad";

class MainPoint extends Point {

    connectedRoads: MainRoad[][];
    distanceFromCenter: number;
    rank: number | undefined;
    isComplete: boolean;

    constructor(x: number, y: number, distanceFromCenter?: number, rank?: number, isComplete: boolean = false) {
        super(x, y);
        this.connectedRoads = [[], [], [], []];
        this.distanceFromCenter = distanceFromCenter ? distanceFromCenter : 0;
        this.rank = rank ? rank : undefined;
        this.isComplete = isComplete;
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
            if (this.connectedRoads[i].length > 0 && this.connectedRoads[(i+2)%this.connectedRoads.length].length === 0) {
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

    public addRoad(road: MainRoad, direction: number) {
        this.connectedRoads[direction].push(road);
    }

    public getAllRoads(): MainRoad[] {
        return this.connectedRoads.flat();
    }

    public setLowerRank(lowerRank: number): void {
        if (this.rank === undefined || lowerRank < this.rank)
            this.rank = lowerRank;
    }

    public completePoint(){
        this.isComplete = true;
    }

    public canBeExtended(): boolean {
        return this.canBeHorizontallyExtended() || this.canBeVerticallyExtended();
    }

    public canBeSided(): boolean {
        let canBeHorizontallySided = false;
        let canBeVerticallySided = false;
        if((this.connectedRoads[0].length > 0 && this.connectedRoads[2].length > 0) && (this.connectedRoads[1].length === 0 || this.connectedRoads[3].length === 0)) {
            canBeVerticallySided = true;
        }
        if((this.connectedRoads[1].length > 0 && this.connectedRoads[3].length > 0) && (this.connectedRoads[0].length === 0 || this.connectedRoads[2].length === 0)) {
            canBeHorizontallySided = true;
        }
        return canBeHorizontallySided || canBeVerticallySided;
    }

    private canBeHorizontallyExtended(){
        let canBeHorizontallyExtended = false;
        if((this.connectedRoads[0].length > 0) !== (this.connectedRoads[2].length > 0))
            canBeHorizontallyExtended = true;
        return canBeHorizontallyExtended;
    }

    private canBeVerticallyExtended(){
        let canBeVerticallyExtended = false;
        if((this.connectedRoads[1].length > 0) !== (this.connectedRoads[3].length > 0))
            canBeVerticallyExtended = true;
        return canBeVerticallyExtended;
    }

}

export default MainPoint;