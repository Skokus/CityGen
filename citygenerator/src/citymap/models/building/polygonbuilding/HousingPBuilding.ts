import Point from "../../point/Point";
import PolygonBuilding from "./PolygonBuilding";
import Polygon from "../../area/Polygon";
import Road from "../../road/Road";

class HousingPBuilding extends PolygonBuilding {

    protected getDefaultColor(): string {
        const c = Math.random();
        if(c < 0.33){
            return "#a16300";
        } else if (c < 0.66){
            return "#c37c00";
        }
        return "#834f00";
    }

    //ratio of smaller polygon to bigger one (borders)
    public static createHousingPBuilding(polygon: Polygon, ratio: number): HousingPBuilding {
        let newBorderPoints: Point[] = [];
        for(const point of polygon.getPoints()) {
            newBorderPoints.push(new Road(polygon.centroid, point).getPointFromRoadScalar(ratio));
        }
        return new HousingPBuilding(newBorderPoints);
    }
}

export default HousingPBuilding;