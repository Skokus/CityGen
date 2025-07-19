import SquareBuilding from "../building/SquareBuilding";
import Road from "./Road";
import SidePoint from "../point/SidePoint";
import MainPoint from "../point/MainPoint";
import Building from "../building/Building";
import Point from "../point/Point";

class SideRoad extends Road{

    constructor(p1: Point, p2: Point) {
        super(p1, p2);
    }

    public splitRoad(p: Point): Road[]{
        return [new SideRoad(this.p1, p), new SideRoad(p, this.p2)];
    }
}

export default SideRoad;