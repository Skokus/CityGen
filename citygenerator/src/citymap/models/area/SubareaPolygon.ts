import Polygon from "./Polygon";
import SideRoad from "../road/SideRoad";
import Road from "../road/Road";
import Point from "../point/Point";
import PolygonBuilding from "../building/polygonbuilding/PolygonBuilding";

class SubareaPolygon extends Polygon{

    building: PolygonBuilding | undefined;

    public getRoads(): SideRoad[]{
        return this.roads as SideRoad[];
    }

    public splitPolygonByLongestRoad(): SubareaPolygon[] {
        let roads = this.getRoads();
        var i = this.containsMainRoads() ? this.getLongestRoadId() : this.getLongestSideRoadId();
        var i2 = 0;
        var p1 = roads[i].getRandomPointInsideRoad();
        var a = roads[i].perpendicularSlope;
        var b = roads[i].getPerpendicularB(p1);
        var p2: Point = new Point(1000,1000);
        roads.forEach((road, idx) => {
            if(idx !== i){
                var p = road.getIntersectionPoint(a, b);
                if(!p.isNan()){
                    p2 = p;
                    i2 = idx;
                }
            }
        });
        var bordersAbove: SideRoad[] = [];
        var bordersBelow: SideRoad[] = [];
        roads.forEach((road, idx) => {
            if(idx !== i && idx !== i2){
                road.isAboveLine(a,b) ? bordersAbove.push(road) : bordersBelow.push(road);
            } else if (idx === i){
                var roadParts = roads[i].splitRoad(p1);
                roadParts.forEach(part => {
                    part.getOtherPoint(p1).isAboveLine(a,b) ? bordersAbove.push(part) : bordersBelow.push(part);
                });
            } else if (idx === i2){
                roadParts = roads[i2].splitRoad(p2);
                roadParts.forEach(part => {
                    part.getOtherPoint(p2).isAboveLine(a,b) ? bordersAbove.push(part): bordersBelow.push(part);
                });
            }
        });
        var newRoad = new SideRoad(p1, p2, false);
        bordersAbove.push(newRoad);
        bordersBelow.push(newRoad);
        return [new SubareaPolygon(bordersAbove), new SubareaPolygon(bordersBelow)];
    }

    public splitPolygonWithSmallerPolygon(ratio: number): SubareaPolygon[] {
        let newPolygons: SubareaPolygon[] = [];
        let smallerPolygonPoints: Point[] = [];
        for(const point of this.getClockWiseBorderPoints()) {
            smallerPolygonPoints.push(new Road(this.centroid, point).getPointFromRoadScalar(ratio));
        }
        let smallerPolygonRoads: SideRoad[] = [];
        for(let i = 0; i < smallerPolygonPoints.length; i++) {
            smallerPolygonRoads.push(new SideRoad(smallerPolygonPoints[i], smallerPolygonPoints[(i+1)%smallerPolygonPoints.length], false));
        }
        const smallerPolygon = new SubareaPolygon(smallerPolygonRoads);
        newPolygons.push(smallerPolygon);
        let originalPoints: Point[] = this.getClockWiseBorderPoints();
        for(let i = 0; i < originalPoints.length; i++){
            const road1 = this.getRoadWithPoints(originalPoints[i], originalPoints[(i+1)%smallerPolygonPoints.length]);
            const road2 = smallerPolygon.getRoadWithPoints(smallerPolygonPoints[i], smallerPolygonPoints[(i+1)%smallerPolygonPoints.length]);
            const road3 = new SideRoad(originalPoints[i], smallerPolygonPoints[i], false);
            const road4 = new SideRoad(originalPoints[(i+1)%smallerPolygonPoints.length], smallerPolygonPoints[(i+1)%smallerPolygonPoints.length], false);
            const rectPolygon = new SubareaPolygon([road1, road2, road3, road4]);
            newPolygons.push(...rectPolygon.splitRectangle(1, 0,10));
        }
        return newPolygons;
    }

    public splitRectangle(baseRoadId: number, counterBaseRoadId: number, distance: number): SubareaPolygon[] {
        let newPolygons: SubareaPolygon[] = [];
        const baseRoad = this.roads[baseRoadId];
        const counterBaseRoad = this.roads[counterBaseRoadId];
        const n = Math.floor(baseRoad.length/distance);
        const newLength = baseRoad.length/n;
        const ratio = newLength/baseRoad.length;
        let basePoints: Point[] = [];
        let counterBasePoints: Point[] = [];
        basePoints.push(baseRoad.getPoint1());
        if(ratio !== 1){
            for (let i = 1; i < n; i++) {
                let s = baseRoad.getPointFromRoadScalar(i*ratio);
                basePoints.push(s);
            }
        }
        basePoints.push(baseRoad.getPoint2());
        for(const p of basePoints){
            var a = baseRoad.perpendicularSlope;
            var b = baseRoad.getPerpendicularB(p);
            counterBasePoints.push(counterBaseRoad.getIntersectionPoint(a,b));
        }
        let betweenRoads: SideRoad[] = [];
        for(let i = 0; i < counterBasePoints.length; i++){
            betweenRoads.push(new SideRoad(basePoints[i], counterBasePoints[i], false));
        }
        console.log(betweenRoads);
        for(let i = 0; i<basePoints.length-1; i++){
            const road1 = new SideRoad(basePoints[i], counterBasePoints[i], false);
            const road2 = new SideRoad(basePoints[i+1], counterBasePoints[i+1], false);
            newPolygons.push(new SubareaPolygon([road1, betweenRoads[i], road2, betweenRoads[i+1]]));
        }
        return newPolygons;
    }

    public getLongestMainRoadId(): number {
        const maxroads = this.getRoads().filter(p => p.isMainRoad);
        let max = maxroads[0].length;
        let maxRoad = maxroads[0];
        for(let i = 1; i < maxroads.length; i++){
            if(maxroads[i].length > max){
                max = maxroads[i].length;
                maxRoad = maxroads[i];
            }
        }
        for(let i = 0; i < this.getRoads().length; i++){
            if(maxRoad === this.getRoads()[i]){
                return i;
            }
        }
        return 0;
    }

    public getLongestSideRoadId(): number {
        const sideroads = this.getRoads().filter(p => !p.isMainRoad);
        let max = sideroads[0].length;
        let maxRoad = sideroads[0];
        for(let i = 1; i < sideroads.length; i++){
            if(sideroads[i].length > max){
                max = sideroads[i].length;
                maxRoad = sideroads[i];
            }
        }
        for(let i = 0; i < this.getRoads().length; i++){
            if(maxRoad === this.getRoads()[i]){
                return i;
            }
        }
        return 0;
    }

    public containsSideRoads(): boolean {
        for(let road of this.getRoads()){
            if(!road.isMainRoad){
                return true;
            }
        }
        return false;
    }

    public containsMainRoads(): boolean {
        for(let road of this.getRoads()){
            if(road.isMainRoad){
                return true;
            }
        }
        return false;
    }
}

export default SubareaPolygon;