import Point from "../../point/Point";
import PolygonBuilding from "./PolygonBuilding";
import Polygon from "../../area/Polygon";
import Road from "../../road/Road";

class HousingPBuilding extends PolygonBuilding {

    constructor(borderPoints: Point[]) {
        super(borderPoints);
    }

    protected getDefaultColor(): string {
        return "#ff9a02";
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