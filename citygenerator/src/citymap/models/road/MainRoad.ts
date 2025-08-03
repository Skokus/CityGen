import SquareBuilding from "../building/SquareBuilding";
import Road from "./Road";
import SidePoint from "../point/SidePoint";
import MainPoint from "../point/MainPoint";
import Building from "../building/Building";
import Point from "../point/Point";

class MainRoad extends Road {

    sidePoints: SidePoint[];
    connectedPolygonRanks: number[];

    constructor(p1: MainPoint, p2: MainPoint, completionRate?: number) {
        super(p1, p2, completionRate);
        this.sidePoints = [];
        this.connectedPolygonRanks = [];
    }

    public addBuilding(distance: number, radius: number) {
        const availableSidePoints: SidePoint[] = this.sidePoints.filter((s) => s.isFree());
        console.log(availableSidePoints);
        const randomPoint = availableSidePoints[Math.floor(Math.random() * availableSidePoints.length)];
        const bAngle = this.angle + Math.PI / 2;
        const side = randomPoint.getRandomSide();
        const bCenter = randomPoint.getOffsetDistancedPoint(distance * side, bAngle, radius);
        randomPoint.buildBuilding(side, new SquareBuilding(bCenter.x, bCenter.y, radius, bAngle));
    }

    public getAllBuildings(): Building[] {
        let allBuildings: Building[] = [];
        for (const p of this.sidePoints) {
            allBuildings.push(...p.getAllBuildings());
        }
        return allBuildings;
    }

    public createSidePoints(distance: number): void {
        if (distance > this.length || this.sidePoints.length > 0) {
            return;
        }
        const n = Math.floor(this.length / distance);
        const ratio = 1 / n;
        for (let i = 0; i < n; i++) {
            let s = this.createSidePointOnRoad(i * ratio + ratio / 2, this.length / distance);
            this.sidePoints.push(s);
        }
    }

    public static createMainRoad(point1: MainPoint, point2: MainPoint, direction: number, completionRate: number): MainRoad {
        const l = point1.connectedRoads.length;
        const road = new MainRoad(point1, point2, completionRate);
        point1.addRoad(road, direction);
        point2.addRoad(road, (direction + 2) % l);
        road.createSidePoints(10);
        return road;
    }

    public getPoint1(): MainPoint {
        return this.p1 as MainPoint;
    }

    public getPoint2(): MainPoint {
        return this.p2 as MainPoint;
    }

    public getRandomPoint(): MainPoint {
        if (Math.random() > 0.5)
            return this.p1 as MainPoint;
        else
            return this.p2 as MainPoint;
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

    private createSidePointOnRoad(scalar: number, width: number): SidePoint {
        const distX = this.p2.x - this.p1.x;
        const distY = this.p2.y - this.p1.y;
        const modX = (distX * scalar) + this.p1.x;
        const modY = (distY * scalar) + this.p1.y;
        return new SidePoint(modX, modY, width);
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
}

export default MainRoad;