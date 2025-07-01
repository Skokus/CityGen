import Point from "./Point";
import Polygon from "../area/Polygon";
import Building from "../building/Building";
import SquareBuilding from "../building/SquareBuilding";
import SidePoint from "./SidePoint";
import sidePoint from "./SidePoint";

class Road {
    p1: Point;
    p2: Point;
    buildings: Building[];
    sidePoints: SidePoint[];

    constructor(p1: Point, p2: Point) {
        this.p1 = p1;
        this.p2 = p2;
        this.buildings = [];
        this.sidePoints = [];
    }

    get length(): number{
        return Math.sqrt(Math.pow((this.p1.x - this.p2.x), 2) + Math.pow((this.p1.y - this.p2.y), 2));
    }
    get slope(): number{ // a in y=ax+b
        return (this.p2.y - this.p1.y)/(this.p2.x - this.p1.x);
    }
    get yInter(): number{ // b in y=ax+b
        return this.p1.y - this.slope * this.p1.x;
    }
    get perpendicularSlope(): number{
        return -1/this.slope;
    }
    get angle(): number{
        return Math.atan2(this.p2.y - this.p1.y, this.p2.x - this.p1.x);
    }

    public getPerpendicularB(p: Point): number{ //after splitting road get the perpendicular line equation
        return p.y - this.perpendicularSlope * p.x;
    }
    public getRandomPoint(): Point{
        if(Math.random() > 0.5)
            return this.p1;
        else
            return this.p2;
    }
    public getOtherPoint(p: Point){ //USE ONLY WITH p AS p1 OR p2
        if(p !== this.p1)
            return this.p1;
        else
            return this.p2;
    }
    public doesContainPoint(p: Point): boolean{
        return this.p1 === p || this.p2 === p;
    }
    public getParallelRoad(distance: number): Road[]{
        const dx = this.p1.x - this.p2.x;
        const dy = this.p1.y - this.p2.y;
        const nx = -dy / this.length;
        const ny = dx / this.length;
        const r1 = new Road(new Point(this.p1.x + nx * distance, this.p1.y + ny * distance), new Point(this.p2.x + nx * distance, this.p2.y + ny * distance));
        const r2 = new Road(new Point(this.p1.x - nx * distance, this.p1.y - ny * distance), new Point(this.p2.x - nx * distance, this.p2.y - ny * distance));
        return [r1, r2];
    }
    public getPointFromRoad(scalar: number): Point{
        //https://stackoverflow.com/questions/64938264/how-can-i-generate-a-random-point-on-a-line-segment
        var distX = this.p2.x - this.p1.x;
        var distY = this.p2.y - this.p1.y;
        var modX = (distX * scalar) + this.p1.x;
        var modY = (distY * scalar) + this.p1.y;
        return new Point(modX, modY);
    }
    public addBuilding(distance: number, radius: number){
        var availableSidePoints: SidePoint[] = this.sidePoints.filter((s) => s.isFree());
        var randomPoint = availableSidePoints[Math.floor(Math.random() * availableSidePoints.length)];
        var bAngle = this.angle+Math.PI/2;
        var side = randomPoint.getRandomSide();
        console.log(randomPoint);
        var bCenter = randomPoint.getDistancedPoint(distance * side, bAngle);
        this.buildings.push(new SquareBuilding(bCenter.x, bCenter.y,radius, bAngle));
        randomPoint.buildBuilding(side);
    }
    public createSidePoints(distance: number): void{
        if(distance > this.length || this.sidePoints.length > 0){
            return;
        }
        const n = Math.floor(this.length/distance);
        const ratio = 1/n;
        for(let i = 0; i < n; i++){
            let s = this.createSidePointOnRoad(i * ratio + ratio/2);
            this.sidePoints.push(s);
        }

    }

    public static distanceFromPoint(p: Point, p1: Point, p2: Point): number{
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
        }
        else if (param > 1) {
            xx = x2;
            yy = y2;
        }
        else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }
        let dx = x - xx;
        let dy = y - yy;
        return Math.sqrt(dx * dx + dy * dy);
    }
    public static getAllRoadsWithPoint(roads: Road[], p: Point): Road[]{
        let result: Road[] = [];
        for(let road of roads) {
            if(road.doesContainPoint(p)){
                result.push(road);
            }
        }
        return result;
    }
    public static createRoad(point1: Point, point2: Point, direction: number): Road {
        const dirslen = point1.roadCounter.length
        const road = new Road(point1, point2);
        point1.addRoad(road, direction);
        point2.addRoad(road, (direction+2)%dirslen);
        road.createSidePoints(10);
        return road;
    }

    private createSidePointOnRoad(scalar: number): SidePoint {
        var distX = this.p2.x - this.p1.x;
        var distY = this.p2.y - this.p1.y;
        var modX = (distX * scalar) + this.p1.x;
        var modY = (distY * scalar) + this.p1.y;
        return new SidePoint(modX, modY);
    }
}

export default Road;