import Polygon from "./Polygon";
import MainRoad from "../road/MainRoad";
import MainPoint from "../point/MainPoint";

class DistrictPolygon extends Polygon{

    constructor(roads: MainRoad[]) {
        super(roads);
        this.color = "#ffee8c";
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
                if(!this.roads.includes(road) && this.getPoints().includes(road.getOtherPoint(point) as MainPoint)){
                    return true;
                }
            }
        }
        return false;
    }
}

export default DistrictPolygon;