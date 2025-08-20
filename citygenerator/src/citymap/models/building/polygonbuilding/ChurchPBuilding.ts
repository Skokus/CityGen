import Point from "../../point/Point";
import PolygonBuilding from "./PolygonBuilding";
import Polygon from "../../area/Polygon";
import Road from "../../road/Road";

class ChurchPBuilding extends PolygonBuilding {

    protected getDefaultColor(): string {
        return "#09006a";
    }

    //ratio of smaller polygon to bigger one (borders)
    public static createChurchPBuilding(polygon: Polygon, ratio: number): ChurchPBuilding {
        let newBorderPoints: Point[] = [];
        for(const point of polygon.getPoints()) {
            newBorderPoints.push(new Road(polygon.centroid, point).getPointFromRoadScalar(ratio));
        }
        return new ChurchPBuilding(newBorderPoints);
    }
}

export default ChurchPBuilding;