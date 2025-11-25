import Road from "./Road";
import Point from "../point/Point";
import MainRoad from "./MainRoad";
import {Md5} from "ts-md5";

class SideRoad extends Road{

    mainRoad: MainRoad | undefined;

    constructor(p1: Point, p2: Point, mainRoad: MainRoad | undefined) {
        super(p1, p2);
        this.mainRoad = mainRoad;
    }

    public splitRoad(p: Point): SideRoad[]{
        return [new SideRoad(this.p1, p, this.mainRoad), new SideRoad(p, this.p2, this.mainRoad)];
    }

    get isMainRoad(): boolean {
        return this.mainRoad instanceof MainRoad;
    }

    public hashValue(seed: number): number {
        const hash = Md5.hashStr(seed + "SideRoad" + this.p1.x + ", " + this.p1.y + ", " + this.p2.x + ", " + + this.p2.y).substring(0,4);
        return parseInt(hash, 16)/65535;
    }

    public getRandomPointInsideRoad(seed: number): Point {
        var scalar = this.hashValue(seed) * 0.1 + 0.45;
        var distX = this.p2.x - this.p1.x;
        var distY = this.p2.y - this.p1.y;

        var modX = (distX * scalar) + this.p1.x;
        var modY = (distY * scalar) + this.p1.y;
        return new Point(modX, modY);
    }

}

export default SideRoad;