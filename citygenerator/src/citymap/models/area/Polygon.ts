import Road from "../road/Road";
import Point from "../point/Point";


class Polygon {

    roads: Road[];

    constructor(roads: Road[]) {
        this.roads = roads;
    }

    get centroid(): Point {
        var x = 0;
        var y = 0;
        var l = this.getPoints().length;
        this.getPoints().forEach(p => {
            x += p.x;
            y += p.y;
        });
        return new Point(x / l, y / l);
    }

    public getLongestRoadId(): number {
        let max = this.roads[0].length;
        let maxId = 0;
        for (let i = 1; i < this.roads.length; i++) {
            if (this.roads[i].length > max) {
                max = this.roads[i].length;
                maxId = i;
            }
        }
        return maxId;
    }

    public getClockWiseBorderPoints(): Point[] {
        var ret: Point[] = [];
        var ps = this.getPoints();
        var c = this.centroid
        while (ps.length !== 0) {
            var ang = ps[0].getAngle(c);
            var i = 0;
            ps.forEach((p, idx) => {
                if (p.getAngle(c) > ang) {
                    ang = p.getAngle(c);
                    i = idx;
                }
            });
            ret.push(ps[i]);
            ps.splice(i, 1);
        }
        return ret;
    }

    public getPoints(): Point[] {
        var points: Set<Point> = new Set();
        for (let road of this.roads) {
            points.add(road.p1);
            points.add(road.p2);
        }
        return Array.from(points);
    }

    public getArea(): number{
        var v = 0;
        var points = this.getClockWiseBorderPoints().reverse();
        var n = points.length;
        for(let i = 0; i < n; i++){
            v += points[i].x * points[(i+1)%n].y;
            v -= points[i].y * points[(i+1)%n].x;
        }
        return v/2;
    }

    public getRoadWithPoints(point1: Point, point2: Point): Road {
        for(const road of this.roads) {
            if(road.doesContainPoint(point1) && road.doesContainPoint(point2))
                return road;
        }
        return this.roads[0];
    }

    public equals(p: Polygon): boolean {
        if (this.roads.length !== p.roads.length) {
            return false;
        } else {
            for (let road of p.roads) {
                if (!this.roads.includes(road)) {
                    return false;
                }
            }
        }
        return true;
    }

    public splitPolygonByLongestRoad(): Polygon[] {
        return [this];
    }

    public splitPolygonWithSmallerPolygon(ratio: number): Polygon[] {
        return [this];
    }
}

export default Polygon;