import Polygon from "./Polygon";
import MainRoad from "../road/MainRoad";
import Point from "../point/Point";
import {Md5} from "ts-md5";
import LakePoint from "../point/LakePoint";

class LakePolygon extends Polygon {

    constructor(roads: MainRoad[]) {
        super(roads);
    }

    public getClockWiseBorderPoints(): LakePoint[] {
        return super.getClockWiseBorderPoints() as LakePoint[];
    }

    public getPoints(): LakePoint[] {
        return super.getPoints() as LakePoint[];
    }

    public static createNewLakePolygon(center: Point, maxRadius: number, minRadius: number, numberOfEdges: number, edgeAngleOffset: number, seed: number): LakePolygon {
        const angles = [];
        for (let i = 0; i < numberOfEdges; i++) {
            angles.push(i*2*Math.PI/numberOfEdges);
        }
        const edgePoints: LakePoint[] = [];
        for (let i = 0; i < numberOfEdges; i++) {
            var p = center.getDistancedPoint(minRadius+LakePolygon.getPointDistanceHashValue(seed, i)*(maxRadius-minRadius), angles[i]);
            edgePoints.push(new LakePoint(p.x, p.y, 0));
        }
        const edgeRoads: MainRoad[] = [];
        for (let i = 0; i < numberOfEdges; i++) {
            edgeRoads.push(new MainRoad(edgePoints[i], edgePoints[(i+1)%numberOfEdges]));
        }
        return new LakePolygon(edgeRoads);
    }

    public static getPointDistanceHashValue(seed: number, iteration: number): number {
        const hash = Md5.hashStr(seed + "Lake, iteration" + iteration).substring(0,4);
        return parseInt(hash, 16)/65535;
    }

    public getClosestPointToAngle(angle: number): LakePoint{
        const points = this.getClockWiseBorderPoints();
        var i2 = 0;
        var prevangle = 0;
        var i3 = 0;
        var nextangle = 0;
        for(let i = 0; i < points.length; i++) {
            const pangle = this.centroid.getAngle(points[i]);
            if(pangle < angle){
                i3 = i;
                nextangle = pangle;
                i2 = (i-1)%points.length;
                prevangle = this.centroid.getAngle(points[(i-1+points.length)%points.length]);
                break;
            }
        }
        if(Math.abs((nextangle-angle)%(2*Math.PI)) > Math.abs((prevangle-angle)%(2*Math.PI))){
            return points[i2];
        } else {
            return points[i3];
        }
    }
}

export default LakePolygon;