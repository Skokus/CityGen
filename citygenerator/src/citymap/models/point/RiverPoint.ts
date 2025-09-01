import Point from "./Point";
import MainPoint from "./MainPoint";

class RiverPoint extends Point {

    leftPoint: MainPoint;
    rightPoint: MainPoint;
    angle: number;

    constructor(x: number, y: number, angle: number, width: number) {
        super(x, y);
        this.angle = angle;
        this.leftPoint = this.getDistancedMainPoint(width/2, angle-Math.PI/2);
        this.rightPoint = this.getDistancedMainPoint(width/2, angle+Math.PI/2);
    }

    public getDistancedMainPoint(distance: number, angle: number): MainPoint {
        return new MainPoint(this.x + distance * Math.cos(angle), this.y + distance * Math.sin(angle));
    }

    public getDistancedRiverPoint(distance: number, angle: number, width: number): RiverPoint {
        return new RiverPoint(this.x + distance * Math.cos(angle), this.y + distance * Math.sin(angle), angle, width);
    }

}

export default RiverPoint;