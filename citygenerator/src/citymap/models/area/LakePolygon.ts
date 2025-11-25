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

    public getRoads(): MainRoad[] {
        return this.roads as MainRoad[];
    }

    public splitPolygonByLongestRoad(): Polygon[] {
        return [this];
    }

    public splitPolygonWithSmallerPolygon(ratio: number): Polygon[] {
        return [this];
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
}

export default LakePolygon;