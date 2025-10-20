import Road from "./Road";
import RiverPoint from "../point/RiverPoint";

class RiverRoad extends Road {

    constructor(p1: RiverPoint, p2: RiverPoint) {
        super(p1, p2);
    }

    public getPoint1(): RiverPoint {
        return this.p1 as RiverPoint;
    }

    public getPoint2(): RiverPoint {
        return this.p2 as RiverPoint;
    }

}

export default RiverRoad;