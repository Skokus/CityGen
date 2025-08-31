import Point from "../../point/Point";
import PolygonBuilding from "./PolygonBuilding";
import Polygon from "../../area/Polygon";
import Road from "../../road/Road";
import TowerBuilding from "../TowerBuilding";

class CastlePBuilding extends PolygonBuilding {

    towers: TowerBuilding[];

    constructor(borderPoints: Point[]) {
        super(borderPoints);
        this.towers = [];
    }

    protected getDefaultColor(): string {
        return "#7c7c7c";
    }

    public static createCastlePBuilding(polygon: Polygon, ratio: number): CastlePBuilding {
        let newBorderPoints: Point[] = [];
        for(const point of polygon.getPoints()) {
            newBorderPoints.push(new Road(polygon.centroid, point).getPointFromRoadScalar(ratio));
        }
        let castle = new CastlePBuilding(newBorderPoints);
        castle.createTowers(polygon, newBorderPoints, 0.8);
        return castle;
    }

    private createTowers(polygon: Polygon, borderPoints: Point[], ratio: number): void {
        for(let p of borderPoints){
            let min = Road.distanceFromPoint(p, polygon.roads[0].p1, polygon.roads[0].p2);
            for(let i = 1; i < polygon.roads.length; i++) {
                let l = Road.distanceFromPoint(p, polygon.roads[i].p1, polygon.roads[i].p2)
                if(l < min){
                    min = l;
                }
            }
            this.towers.push(new TowerBuilding(p.x, p.y, min * ratio));
        }
        const c = polygon.centroid;
        let min = Road.distanceFromPoint(c, polygon.roads[0].p1, polygon.roads[0].p2);
        for(let i = 1; i < polygon.roads.length; i++) {
            let l = Road.distanceFromPoint(c, polygon.roads[i].p1, polygon.roads[i].p2)
            if(l < min){
                min = l;
            }
        }
        this.towers.push(new TowerBuilding(c.x, c.y, min * ratio * 0.6));
    }
}

export default CastlePBuilding;