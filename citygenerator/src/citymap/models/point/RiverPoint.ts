import MainPoint from "./MainPoint";
import {Md5} from "ts-md5";

class RiverPoint extends MainPoint {

    angle: number;

    constructor(x: number, y: number, angle: number) {
        super(x, y);
        this.angle = angle;
    }

    public getDistancedRiverPoint(distance: number, angle: number): RiverPoint {
        return new RiverPoint(this.x + distance * Math.cos(angle), this.y + distance * Math.sin(angle), angle);
    }

    public getRiverHashValue(seed: number): number {
        const hash = Md5.hashStr(seed + "RiverPoint" + this.x + ", " + this.y + ", angle" + this.angle).substring(0,4);
        return parseInt(hash, 16)/65535;
    }
}

export default RiverPoint;