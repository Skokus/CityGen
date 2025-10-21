import Road from "./Road";
import Point from "../point/Point";
import MainRoad from "./MainRoad";

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

}

export default SideRoad;