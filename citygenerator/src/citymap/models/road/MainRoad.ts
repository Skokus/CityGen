import SquareBuilding from "../building/SquareBuilding";
import Road from "./Road";
import SidePoint from "../point/SidePoint";
import MainPoint from "../point/MainPoint";
import Building from "../building/Building";
import Point from "../point/Point";
import MainRoadType from "./MainRoadType";
import {Md5} from "ts-md5";
import RiverPoint from "../point/RiverPoint";

class MainRoad extends Road {

    topSidePoints: SidePoint[];
    bottomSidePoints: SidePoint[];
    connectedPolygonRanks: number[];
    type: MainRoadType;

    constructor(p1: MainPoint, p2: MainPoint, completionRate?: number) {
        super(p1, p2, completionRate);
        this.topSidePoints = [];
        this.bottomSidePoints = [];
        this.connectedPolygonRanks = [];
        this.type = MainRoadType.Road;
    }

    public getAllFreeSpots(): SidePoint[] {
        let freeSpots = [];
        freeSpots.push(...this.topSidePoints.filter(sidePoint => sidePoint.isFree()));
        freeSpots.push(...this.bottomSidePoints.filter(sidePoint => sidePoint.isFree()));
        return freeSpots;
    }

    public removeBuilding(building: Building){
        for(let sidepoint of this.topSidePoints) {
            if (sidepoint.building === building) {
                sidepoint.building = null;
            }
        }
        for(let sidepoint of this.bottomSidePoints) {
            if (sidepoint.building === building) {
                sidepoint.building = null;
            }
        }
    }

    public getAllBuildings(): Building[] {
        let allBuildings: Building[] = [];
        for (const p of this.topSidePoints) {
            allBuildings.push(...p.getAllBuildings());
        }
        for (const p of this.bottomSidePoints) {
            allBuildings.push(...p.getAllBuildings());
        }
        return allBuildings;
    }

    public createSidePoints(distance: number): void {
        if (distance > this.length || this.topSidePoints.length > 0) {
            return;
        }
        let newSidePoints: SidePoint[] = [];
        let newSidePoints2: SidePoint[] = [];
        const n = Math.floor(this.length/distance);
        const ratio = 1 / n;
        for (let i = 0; i < n; i++) {
            let s = this.createSidePointNextToRoad(i * ratio + ratio / 2, this.length / distance, 1);
            newSidePoints.push(s);
            let s2 = this.createSidePointNextToRoad(i * ratio + ratio / 2, this.length / distance, -1);
            newSidePoints2.push(s2);
        }
        if(newSidePoints[0].isAboveLine(this.slope, this.yInter)){
            this.topSidePoints = newSidePoints;
            this.bottomSidePoints = newSidePoints2;
        } else {
            this.topSidePoints = newSidePoints2;
            this.bottomSidePoints = newSidePoints;
        }
    }

    public static createMainRoad(point1: MainPoint, point2: MainPoint, direction: number, completionRate: number): MainRoad {
        const l = point1.connectedRoads.length;
        const road = new MainRoad(point1, point2, completionRate);
        point1.addRoad(road, direction);
        point2.addRoad(road, (direction + 2) % l);
        road.createSidePoints(10);
        if((point1 instanceof RiverPoint && !(point2 instanceof RiverPoint))){
            if(point1.distanceFromCenter <= 0){
                point1.distanceFromCenter = (point2.distanceFromCenter + 1);
            }
        }
        if((point2 instanceof RiverPoint && !(point1 instanceof RiverPoint))){
            if(point2.distanceFromCenter <= 0){
                point2.distanceFromCenter = point1.distanceFromCenter + 1;
            }
        }
        return road;
    }

    public getPoint1(): MainPoint {
        return this.p1 as MainPoint;
    }

    public getPoint2(): MainPoint {
        return this.p2 as MainPoint;
    }

    public getRandomPoint(seed: number): MainPoint {
        if (this.getRandomMainPointHash(seed) > 0.5)
            return this.p1 as MainPoint;
        else
            return this.p2 as MainPoint;
    }

    private getRandomMainPointHash(seed: number){
        const hash = Md5.hashStr(seed + "RandomPointMainRoad" + this.p1.x + ", " + this.p1.y + ", " + this.p2.x + ", " + + this.p2.y).substring(0,4);
        return parseInt(hash, 16)/65535;
    }

    public getOtherPoint(p: Point): MainPoint { //USE ONLY WITH p AS p1 OR p2
        if (p !== this.p1)
            return this.p1 as MainPoint;
        else
            return this.p2 as MainPoint;
    }

    public splitRoad(p: Point): Road[] {
        return [new MainRoad(this.p1 as MainPoint, p as MainPoint), new MainRoad(p as MainPoint, this.p2 as MainPoint)];
    }

    private createSidePointNextToRoad(scalar: number, distance: number, rotation: number): SidePoint {
        const distX = this.p2.x - this.p1.x;
        const distY = this.p2.y - this.p1.y;
        const modX = (distX * scalar) + this.p1.x;
        const modY = (distY * scalar) + this.p1.y;
        const p = new Point(modX, modY).getDistancedPoint(distance, this.angle + rotation * Math.PI/2);
        return new SidePoint(p.x, p.y, distance, this.angle + Math.PI/2);
    }

    public addCompletionScalar(scalar: number) {
        this.updateCompletionPoint(this.completionRate + scalar);
        if (this.completionRate >= 1) {
            this.getPoint2().completePoint();
        }
    }

    public hasBothRanks(rank1: number, rank2: number): boolean {
        return this.connectedPolygonRanks.includes(rank1) && this.connectedPolygonRanks.includes(rank2);
    }

    public addRankOfPolygon(rank: number): void {
        this.connectedPolygonRanks.push(rank);
    }

    public setToWall(){
        this.type = MainRoadType.Wall;
    }

    public occupiedPercentage(): number {
        let occupiedSpots = 0;
        let allSpots = 0;
        for(const p of this.topSidePoints){
            if(p.building !== undefined && p.building !== null){
                occupiedSpots++;
                allSpots++;
            } else if(p.building === undefined){
                occupiedSpots++;
            }
        }
        for(const p of this.bottomSidePoints){
            if(p.building !== undefined && p.building !== null){
                occupiedSpots++;
                allSpots++;
            } else if(p.building === undefined){
                occupiedSpots++;
            }
        }
        if(allSpots !== 0){
            return occupiedSpots/allSpots;
        }
        return 0;
    }

}

export default MainRoad;