import Road from "./Road";
import Point from "../point/Point";
import MainRoad from "./MainRoad";
import {Md5} from "ts-md5";

class SideRoad extends Road{

    mainRoad: MainRoad | undefined;
    isBuilt: boolean;
    parentSideRoad: SideRoad | undefined;

    constructor(p1: Point, p2: Point, mainRoad: MainRoad | undefined, isBuilt: boolean = false, parentSideRoad: SideRoad | undefined) {
        super(p1, p2);
        this.mainRoad = mainRoad;
        this.isBuilt = isBuilt;
        this.parentSideRoad = parentSideRoad;
    }

    public splitRoad(p: Point): SideRoad[]{
        return [new SideRoad(this.p1, p, this.mainRoad, this.isBuilt, this), new SideRoad(p, this.p2, this.mainRoad, this.isBuilt, this)];
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

    public getIsBuilt(): boolean {
        if(this.parentSideRoad === undefined) {
            return this.isBuilt;
        } else {
            return this.parentSideRoad.getIsBuilt();
        }
    }
}

export default SideRoad;