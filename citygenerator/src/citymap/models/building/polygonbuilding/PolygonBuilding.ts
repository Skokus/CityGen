import Point from "../../point/Point";

class PolygonBuilding {

    borderPoints: Point[];
    color: string;

    constructor(borderPoints: Point[]) {
        this.borderPoints = borderPoints;
        this.color = this.getDefaultColor();
    }

    get centroid(): Point{
        var x = 0;
        var y = 0;
        var l = this.borderPoints.length;
        this.borderPoints.forEach(p => {
            x += p.x;
            y += p.y;
        });
        return new Point(x/l, y/l);
    }

    get clockWiseBorderPoints(): Point[] {
        var ret: Point[] = [];
        var ps = this.getPoints();
        var c = this.centroid;
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

    protected getDefaultColor(): string {
        return "#cc7c03";
    }

    public getPoints(){
        let ret: Point[] = [];
            for(const point of this.borderPoints){
                ret.push(point);
            }
        return ret;
    }
}

export default PolygonBuilding;