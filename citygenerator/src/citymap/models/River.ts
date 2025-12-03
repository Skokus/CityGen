import RiverRoad from "./road/RiverRoad";
import RiverPoint from "./point/RiverPoint";
import Point from "./point/Point";
import LakePoint from "./point/LakePoint";
import MainPoint from "./point/MainPoint";

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

    public static createRiver(startPoint: LakePoint, startAngle: number, angleRange: number, maxAngleChange: number, minStepDistance: number, maxStepDistance: number, n: number, seed: number): River {
        let riverPoints: RiverPoint[] = [];
        startPoint.angle = startAngle;
        riverPoints.push(startPoint);
        for(let i = 1; i < n; i++){
            let newAngle = riverPoints[i-1].angle + (riverPoints[i-1].getRiverHashValue(seed) * maxAngleChange * 2 - maxAngleChange);
            const anglediff = (newAngle - startAngle + 180 + 360) % 360 - 180
            if(anglediff > angleRange){
                newAngle = startAngle + angleRange;
            } else if(anglediff < -angleRange){
                newAngle = startAngle - angleRange;
            }
            const stepDistance = riverPoints[i-1].getDistanceHashValue(seed) * (minStepDistance - maxStepDistance) + minStepDistance;
            riverPoints.push(riverPoints[i-1].getDistancedRiverPoint(stepDistance, newAngle));
        }
        let riverRoads: RiverRoad[] = [];
        for(let i = 1; i < n; i++){
            riverRoads.push(new RiverRoad(riverPoints[i-1], riverPoints[i]));
        }
        return new River(riverRoads);
    }

}

export default River;