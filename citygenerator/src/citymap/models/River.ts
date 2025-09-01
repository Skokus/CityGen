import RiverRoad from "./road/RiverRoad";
import RiverPoint from "./point/RiverPoint";
import riverPoint from "./point/RiverPoint";
import Point from "./point/Point";

class River {

    riverRoads: RiverRoad[];

    constructor(riverRoads: RiverRoad[]) {
        this.riverRoads = riverRoads;
    }

    public getRiverPoints(): RiverPoint[] {
        var points: Set<Point> = new Set();
        for (let road of this.riverRoads) {
            points.add(road.p1);
            points.add(road.p2);
        }
        return Array.from(points) as RiverPoint[];
    }

    public static createRiver(startX: number, startY: number, startAngle: number, angleRange: number, maxAngleChange: number, stepDistance: number, width: number, n: number): River {
        let riverPoints: RiverPoint[] = [];
        riverPoints.push(new RiverPoint(startX, startY, startAngle, width));
        for(let i = 1; i < n; i++){
            const newAngle = riverPoints[i-1].angle + (Math.random() * maxAngleChange * 2 - maxAngleChange);
            riverPoints.push(riverPoints[i-1].getDistancedRiverPoint(stepDistance, newAngle, width));
        }
        let riverRoads: RiverRoad[] = [];
        for(let i = 1; i < n; i++){
            riverRoads.push(new RiverRoad(riverPoints[i-1], riverPoints[i]));
        }
        return new River(riverRoads);
    }

}

export default River;