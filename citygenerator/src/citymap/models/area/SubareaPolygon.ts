import Polygon from "./Polygon";
import SideRoad from "../road/SideRoad";
import Road from "../road/Road";
import Point from "../point/Point";

class SubareaPolygon extends Polygon{

    constructor(roads: SideRoad[]) {
        super(roads);
        this.color = "#fff889";
    }

    public getRoads(): SideRoad[]{
        return this.roads as SideRoad[];
    }

    public splitPolygon(): SubareaPolygon[] {
        let roads = this.getRoads();
        var i = this.getLongestMainRoadId(); var i2 = 0;
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

    public getLongestMainRoadId(): number{
        const mainroads = this.getRoads().filter(p => p.isMainRoad);
        let max = mainroads[0].length;
        let maxId = 0;
        for(let i = 1; i < mainroads.length; i++){
            if(mainroads[i].length > max){
                max = mainroads[i].length;
                maxId = i;
            }
        }
        return maxId;
    }
}

export default SubareaPolygon;