import MainPoint from "./MainPoint";

class RiverPoint extends MainPoint {

    angle: number;

    constructor(x: number, y: number, angle: number) {
        super(x, y);
        this.angle = angle;
    }

    public getDistancedRiverPoint(distance: number, angle: number): RiverPoint {
        return new RiverPoint(this.x + distance * Math.cos(angle), this.y + distance * Math.sin(angle), angle);
    }

}

export default RiverPoint;