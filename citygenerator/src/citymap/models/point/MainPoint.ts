import Point from "./Point";
import MainRoad from "../road/MainRoad";
import {Md5} from "ts-md5";

class MainPoint extends Point {

    connectedRoads: (MainRoad | null)[][];
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

    public addRoad(road: MainRoad | null, direction: number) {
        if(road === null && this.connectedRoads[direction].includes(null)){
            return;
        }
        this.connectedRoads[direction].push(road);
    }

    public getAllRoads(): (MainRoad | null)[] {
        return this.connectedRoads.flat();
    }

    public getAllRealRoads(): (MainRoad | null)[] {
        return this.connectedRoads.flat().filter((r) => r !== null);
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

    public hashValue(seed: number){
        const hash = Md5.hashStr(seed + "MainPoint" + this.x + ", " + this.y).substring(0,4);
        return parseInt(hash, 16)/65535;
    }
    public getAngleHashValue(seed: number, direction: number): number {
        const hash = Md5.hashStr(seed + "MainPointAngle" + this.x + ", " + this.y + ", direction" + direction).substring(0,4);
        return parseInt(hash, 16)/65535;
    }
    public getDistanceHashValue(seed: number, direction: number): number {
        const hash = Md5.hashStr(seed + "MainPointDistance" + this.x + ", " + this.y + ", direction" + direction).substring(0,4);
        return parseInt(hash, 16)/65535;
    }

    public numberOfDirectionsTaken(): number {
        var n = 0;
        for(const r of this.connectedRoads){
            if(r.filter((p) => p !== null).length > 0){
                n++;
            }
        }
        return n;
    }
    public hasRoadInEveryDirection(): boolean {
        for(const r of this.connectedRoads){
            if(r.length <= 0){
                return false;
            }
        }
        return true;
    }

    public getDirectionToPoint(point2: MainPoint): number{
        const angle = this.getAngle(point2) * 180/Math.PI;
        if(angle > 315 || angle < 45){
            return 0;
        } else if(angle < 135){
            return 1;
        } else if(angle < 225){
            return 2;
        } else {
            return 3;
        }
    }
}

export default MainPoint;