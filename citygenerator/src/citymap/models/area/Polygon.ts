import Road from "../road/Road";
import Point from "../road/Point";

class Polygon {
    roads: Road[];
    color: string;

    constructor(roads: Road[]) {
        this.roads = roads;
        this.color = "#ffee8c";
    }

    get centroid(): Point{
        var x = 0;
        var y = 0;
        var l = this.points.length;
        this.points.forEach(p => {
            x += p.x;
            y += p.y;
        });
        return new Point(x/l, y/l);
    }
    get clockWisePoints(): Point[]{
        var ret: Point[] = [];
        var ps = this.points;
        var c = this.centroid
        while(ps.length !== 0){
            var ang = ps[0].getAngle(c);
            var i = 0;
            ps.forEach((p, idx) => {
                if(p.getAngle(c) > ang){
                    ang = p.getAngle(c);
                    i = idx;
                }
            });
            ret.push(ps[i]);
            ps.splice(i, 1);
        }
        return ret;
    }
    get points(): Point[]{
        var points: Set<Point> = new Set();
        for(let road of this.roads){
            points.add(road.p1);
            points.add(road.p2);
        }
        return Array.from(points);
    }

    public equals(p: Polygon): boolean{
        if(this.roads.length !== p.roads.length){
            return false;
        } else {
            for(let road of p.roads){
                if(!this.roads.includes(road)){
                    return false;
                }
            }
        }
        return true;
    }
    public hasSmallerCycle(): boolean{
        if(this.roads.length <= 3){
            return false;
        }
        for(let point of this.points){
            for(let road of point.getAllRoads()){
                if(!this.roads.includes(road) && this.points.includes(road.getOtherPoint(point))){
                    return true;
                }
            }
        }
        return false;
    }
}

export default Polygon;