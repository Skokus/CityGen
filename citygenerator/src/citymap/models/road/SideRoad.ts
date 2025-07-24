import SquareBuilding from "../building/SquareBuilding";
import Road from "./Road";
import SidePoint from "../point/SidePoint";
import MainPoint from "../point/MainPoint";
import Building from "../building/Building";
import Point from "../point/Point";

class SideRoad extends Road{

    isMainRoad: boolean;

    constructor(p1: Point, p2: Point, isMainRoad: boolean) {
        super(p1, p2);
        this.isMainRoad = isMainRoad;
    }

    public splitRoad(p: Point): SideRoad[]{
        return [new SideRoad(this.p1, p, this.isMainRoad), new SideRoad(p, this.p2, this.isMainRoad)];
    }
}

export default SideRoad;