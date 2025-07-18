import SquareBuilding from "../building/SquareBuilding";
import Road from "./Road";
import SidePoint from "../point/SidePoint";
import MainPoint from "../point/MainPoint";
import Building from "../building/Building";

class MainRoad extends Road{

    sidePoints: SidePoint[];

    constructor(p1: MainPoint, p2: MainPoint) {
        super(p1, p2);
        this.sidePoints = [];
    }

    public addBuilding(distance: number, radius: number){
        const availableSidePoints: SidePoint[] = this.sidePoints.filter((s) => s.isFree());
        console.log(availableSidePoints);
        const randomPoint = availableSidePoints[Math.floor(Math.random() * availableSidePoints.length)];
        const bAngle = this.angle+Math.PI/2;
        const side = randomPoint.getRandomSide();
        const bCenter = randomPoint.getOffsetDistancedPoint(distance * side, bAngle, radius);
        randomPoint.buildBuilding(side, new SquareBuilding(bCenter.x, bCenter.y,radius, bAngle));
    }

    public getAllBuildings(): Building[] {
        let allBuildings: Building[] = [];
        for(const p of this.sidePoints){
            allBuildings.push(...p.getAllBuildings());
        }
        return allBuildings;
    }
    public createSidePoints(distance: number): void{
        if(distance > this.length || this.sidePoints.length > 0){
            return;
        }
        const n = Math.floor(this.length/distance);
        const ratio = 1/n;
        for(let i = 0; i < n; i++){
            let s = this.createSidePointOnRoad(i * ratio + ratio/2, this.length/distance);
            this.sidePoints.push(s);
        }
        console.log("HERE");
    }
    public static createMainRoad(point1: MainPoint, point2: MainPoint, direction: number): MainRoad {
        const l = point1.connectedRoads.length;
        const road = new MainRoad(point1, point2);
        point1.addRoad(road, direction);
        point2.addRoad(road, (direction+2)%l);
        road.createSidePoints(10);
        return road;
    }
    private createSidePointOnRoad(scalar: number, width: number): SidePoint {
        const distX = this.p2.x - this.p1.x;
        const distY = this.p2.y - this.p1.y;
        const modX = (distX * scalar) + this.p1.x;
        const modY = (distY * scalar) + this.p1.y;
        return new SidePoint(modX, modY, width);
    }
}

export default MainRoad;