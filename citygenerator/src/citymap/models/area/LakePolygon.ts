import Polygon from "./Polygon";
import MainRoad from "../road/MainRoad";
import MainPoint from "../point/MainPoint";
import Point from "../point/Point";
import {Md5} from "ts-md5";

class LakePolygon extends Polygon {

    constructor(roads: MainRoad[]) {
        super(roads);
    }

    public getClockWiseBorderPoints(): MainPoint[] {
        return super.getClockWiseBorderPoints() as MainPoint[];
    }

    public getPoints(): MainPoint[] {
        return super.getPoints() as MainPoint[];
    }

    public static createNewLakePolygon(center: Point, maxRadius: number, minRadius: number, numberOfEdges: number, edgeAngleOffset: number, seed: number): LakePolygon {
        const angles = [];
        for (let i = 0; i < numberOfEdges; i++) {
            angles.push(i*2*Math.PI/numberOfEdges);
        }
        const edgePoints: MainPoint[] = [];
        for (let i = 0; i < numberOfEdges; i++) {
            edgePoints.push(center.getDistancedPoint(minRadius+LakePolygon.getPointDistanceHashValue(seed, i)*(maxRadius-minRadius), angles[i]) as MainPoint);
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

    public getClosestPointToAngle(angle: number): MainPoint{
        const points = this.getClockWiseBorderPoints();
        var i2 = 0;
        var prevangle = 0;
        var i3 = 0;
        var nextangle = 0;
        console.log("HERE");
        console.log(angle);
        for(let i = 0; i < points.length; i++) {
            const pangle = this.centroid.getAngle(points[i]);
            console.log(pangle);
            if(pangle < angle){
                console.log("AHA")
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