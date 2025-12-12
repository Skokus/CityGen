import Road from "./Road";
import RiverPoint from "../point/RiverPoint";
import MainPoint from "../point/MainPoint";
import MainRoad from "./MainRoad";

class RiverRoad extends MainRoad {

    constructor(p1: RiverPoint, p2: RiverPoint) {
        super(p1, p2);
    }

    public getPoint1(): RiverPoint {
        return this.p1 as RiverPoint;
    }

    public getPoint2(): RiverPoint {
        return this.p2 as RiverPoint;
    }

    public static createRiverRoad(point1: RiverPoint, point2: RiverPoint): RiverRoad {
        const l = point1.connectedRoads.length;
        const road = new RiverRoad(point1, point2);
        const direction = point1.getDirectionToPoint(point2);
        point1.addRoad(road, direction);
        point2.addRoad(road, (direction + 2) % l);
        return road;
    }
}

export default RiverRoad;