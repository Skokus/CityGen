import Point from "./Point";
import Polygon from "../area/Polygon";

class Road {
    p1: Point;
    p2: Point;

    constructor(p1: Point, p2: Point) {
        this.p1 = p1;
        this.p2 = p2;
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
    public createPolygon(distance: number): Polygon{
        const direction = this.getSideDirection();
        const randomAngle = (Math.PI/2) * direction + (Math.random() * Math.PI/4) - Math.PI/8;
        let newPoint1: Point;
        let newPoint2: Point;
        let newRoad1, newRoad2, newRoad3: Road;
        switch (direction) {
            case 0:
                newPoint1 = this.p1.hasRoadOnDirection(0) ? this.p1.getRoadOnDirection(0)!.getOtherPoint(this.p1) : this.p1.getDistancedPoint(distance, randomAngle);
                newPoint2 = this.p2.hasRoadOnDirection(0) ? this.p2.getRoadOnDirection(0)!.getOtherPoint(this.p2) : this.p2.getDistancedPoint(distance, randomAngle);
                newRoad1 = Road.createRoad(this.p1, newPoint1, 0);
                newRoad2 = Road.createRoad(this.p2, newPoint2, 0);
                newRoad3 = Road.createRoad(newPoint1, newPoint2, 1);
                return new Polygon([this, newRoad1, newRoad2, newRoad3], "green");
            case 1:
                newPoint1 = this.p1.hasRoadOnDirection(1) ? this.p1.getRoadOnDirection(1)!.getOtherPoint(this.p1) : this.p1.getDistancedPoint(distance, randomAngle);
                newPoint2 = this.p2.hasRoadOnDirection(1) ? this.p2.getRoadOnDirection(1)!.getOtherPoint(this.p2) : this.p2.getDistancedPoint(distance, randomAngle);
                newRoad1 = Road.createRoad(this.p1, newPoint1, 1);
                newRoad2 = Road.createRoad(this.p2, newPoint2, 1);
                newRoad3 = Road.createRoad(newPoint1, newPoint2, 0);
                return new Polygon([this, newRoad1, newRoad2, newRoad3], "green");
            case 2:
                newPoint1 = this.p1.hasRoadOnDirection(2) ? this.p1.getRoadOnDirection(2)!.getOtherPoint(this.p1) : this.p1.getDistancedPoint(distance, randomAngle);
                newPoint2 = this.p2.hasRoadOnDirection(2) ? this.p2.getRoadOnDirection(2)!.getOtherPoint(this.p2) : this.p2.getDistancedPoint(distance, randomAngle);
                newRoad1 = Road.createRoad(newPoint1, this.p1,0);
                newRoad2 = Road.createRoad(newPoint2, this.p2,0);
                newRoad3 = Road.createRoad(newPoint1, newPoint2, 1);
                return new Polygon([this, newRoad1, newRoad2, newRoad3], "green");
            case 3:
                newPoint1 = this.p1.hasRoadOnDirection(3) ? this.p1.getRoadOnDirection(3)!.getOtherPoint(this.p1) : this.p1.getDistancedPoint(distance, randomAngle);
                newPoint2 = this.p2.hasRoadOnDirection(3) ? this.p2.getRoadOnDirection(3)!.getOtherPoint(this.p2) : this.p2.getDistancedPoint(distance, randomAngle);
                newRoad1 = Road.createRoad(newPoint1, this.p1,1);
                newRoad2 = Road.createRoad(newPoint2, this.p2, 1);
                newRoad3 = Road.createRoad(newPoint1, newPoint2, 0);
                return new Polygon([this, newRoad1, newRoad2, newRoad3], "green");
        }
        console.log("coś się zepsuło");
        return new Polygon([], "green");
    }
    public hasTwoPolygons(): boolean {
        return this.getSideDirection() === -1;
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
        return road;
    }

    private getSideDirection(): number{
        let i = 0;
        let posDirs = [];
        for(i = 0; i < 4; i++){
            if(this === this.p1.connectedRoads[i]){
                break;
            }
        }
        if(this.p1.roadCounter[(i+1)%4] === 0 || this.p2.roadCounter[(i+1)%4] === 0)
            posDirs.push((i+1)%4);
        if(this.p1.roadCounter[(i+3)%4] === 0 || this.p2.roadCounter[(i+3)%4] === 0)
            posDirs.push((i+3)%4);
        if(posDirs.length <= 0){
            return -1;
        }
        return posDirs[Math.floor(Math.random() * posDirs.length)];
    }
}

export default Road;