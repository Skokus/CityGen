import Point from "../../point/Point";
import PolygonBuilding from "./PolygonBuilding";
import Polygon from "../../area/Polygon";
import Road from "../../road/Road";

class MarketBoothPBuilding extends PolygonBuilding {

    protected getDefaultColor(): string {
        const c = Math.random();
        if(c < 0.33){
            return "#d63100";
        } else if(c < 0.66){
            return "#27b500";
        } else {
            return "#ffffff";
        }
    }

    //ratio of smaller polygon to bigger one (borders)
    public static createMarketBoothPBuilding(polygon: Polygon, ratio: number): MarketBoothPBuilding {
        let newBorderPoints: Point[] = [];
        for(const point of polygon.getPoints()) {
            newBorderPoints.push(new Road(polygon.centroid, point).getPointFromRoadScalar(ratio));
        }
        return new MarketBoothPBuilding(newBorderPoints);
    }
}

export default MarketBoothPBuilding;