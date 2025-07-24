import Polygon from "./Polygon";
import MainRoad from "../road/MainRoad";
import MainPoint from "../point/MainPoint";
import Point from "../point/Point";
import SubareaPolygon from "./SubareaPolygon";
import SideRoad from "../road/SideRoad";
import Road from "../road/Road";

class DistrictPolygon extends Polygon{

    subAreas: SubareaPolygon[];

    constructor(roads: MainRoad[]) {
        super(roads);
        this.color = "#ffee8c";
        this.subAreas = [this.createInitialSubArea(roads)];
    }

    public getClockWiseBorderPoints(): MainPoint[]{
        return super.getClockWiseBorderPoints() as MainPoint[];
    }
    public getPoints(): MainPoint[]{
        return super.getPoints() as MainPoint[];
    }

    public hasSmallerCycle(): boolean{
        if(this.roads.length <= 3){
            return false;
        }
        for(let point of this.getPoints()){
            for(let road of point.getAllRoads()){
                if(!this.roads.includes(road) && this.getPoints().includes(road.getOtherPoint(point))){
                    return true;
                }
            }
        }
        return false;
    }
    public splitPolygon(): Polygon[] {
        this.subAreas.push(...this.subAreas[0].splitPolygon());
        this.subAreas.shift();
        return [this];
    }
    public splitPolygonMultipleTimes(n: number): void {
        let newPolygons: SubareaPolygon[] = [];
        for(let i = 0; i < n; i++){
            newPolygons = [];
            for(let a of this.subAreas){
                newPolygons.push(...a.splitPolygon());
            }
            this.subAreas = newPolygons;
        }
    }
    private createInitialSubArea(roads: Road[]): SubareaPolygon{
        let subRoads = [];
        for(let road of roads){
            subRoads.push(new SideRoad(road.p1, road.p2, true));
        }
        return new SubareaPolygon(subRoads);
    }
}

export default DistrictPolygon;