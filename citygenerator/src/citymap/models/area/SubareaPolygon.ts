import Polygon from "./Polygon";
import SideRoad from "../road/SideRoad";
import Road from "../road/Road";
import Point from "../point/Point";
import PolygonBuilding from "../building/polygonbuilding/PolygonBuilding";
import Building from "../building/Building";
import {Md5} from "ts-md5";
class SubareaPolygon extends Polygon{

    building: PolygonBuilding | undefined;
    accessory: Building | undefined;
    subPolygons: SubareaPolygon[] | undefined = undefined;

    public getRoads(): SideRoad[]{
        return this.roads as SideRoad[];
    }

    public getAllPolygons(): SubareaPolygon[] {
        let all: SubareaPolygon[] = [];
        if(this.subPolygons === undefined || this.subPolygons.length === 0){
            return [this];
        }
        for(let sub of this.subPolygons){
            if(sub !== undefined && this.subPolygons.length > 0){
                for(let a of this.subPolygons){
                    all.push(...a.getAllPolygons());
                }
            } else {
                all.push(this);
            }
        }
        return all;
    }

    public getAllPolygonsWithBuildings(): SubareaPolygon[] {
        let all: SubareaPolygon[] = [];
        if(this.building !== undefined || this.accessory !== undefined){
            return [this];
        } else {
            if(this.subPolygons !== undefined && this.subPolygons.length > 0){
                for(let a of this.subPolygons){
                    all.push(...a.getAllPolygonsWithBuildings());
                }
            } else {
                return [];
            }
        }
        return all;
    }

    public getPolygonsAboveSize(minsize: number): SubareaPolygon[]{
        let all: SubareaPolygon[] = [];
        if(this.getArea() < minsize){
            return [];
        } else if(this.subPolygons === undefined || this.subPolygons.length === 0){
            return [this];
        } else {
            for(let sub of this.subPolygons){
                all.push(...sub.getPolygonsAboveSize(minsize));
            }
        }
        if(all.length > 0){
            return all;
        } else {
            return [this];
        }
    }

    public splitAboveSize(seed: number, maxsize: number): void {
        if(this.getArea() > maxsize){
            this.splitPolygonByLongestRoad(seed);
            if(this.subPolygons !== undefined) {
                for(const a of this.subPolygons){
                    a.splitAboveSize(seed, maxsize);
                }
            }
        } else {
            this.subPolygons = [];
        }
    }

    public splitPolygonByLongestRoad(seed: number): void {
        let roads = this.getRoads();
        var i = this.containsMainRoads() ? this.getLongestRoadId() : this.getLongestSideRoadId();
        var i2 = 0;
        var p1 = roads[i].getRandomPointInsideRoad(seed);
        var a = roads[i].perpendicularSlope;
        var b = roads[i].getPerpendicularB(p1);
        var p2: Point = new Point(1000,1000);
        roads.forEach((road, idx) => {
            if(idx !== i){
                var p = road.getIntersectionPoint(a, b);
                if(!p.isNan()){
                    p2 = p;
                    i2 = idx;
                }
            }
        });
        var bordersAbove: SideRoad[] = [];
        var bordersBelow: SideRoad[] = [];
        roads.forEach((road, idx) => {
            if(idx !== i && idx !== i2){
                road.isAboveLine(a,b) ? bordersAbove.push(road) : bordersBelow.push(road);
            } else if (idx === i){
                var roadParts = roads[i].splitRoad(p1);
                roadParts.forEach(part => {
                    part.getOtherPoint(p1).isAboveLine(a,b) ? bordersAbove.push(part) : bordersBelow.push(part);
                });
            } else if (idx === i2){
                roadParts = roads[i2].splitRoad(p2);
                roadParts.forEach(part => {
                    part.getOtherPoint(p2).isAboveLine(a,b) ? bordersAbove.push(part): bordersBelow.push(part);
                });
            }
        });
        var newRoad = new SideRoad(p1, p2, undefined);
        bordersAbove.push(newRoad);
        bordersBelow.push(newRoad);
        this.subPolygons = [new SubareaPolygon(bordersAbove), new SubareaPolygon(bordersBelow)];
    }

    public buildBuilding(pbuilding: PolygonBuilding){
        for(let road of this.getRoads()){
            if(road.mainRoad !== undefined){
                for(let building of road.mainRoad.getAllBuildings()){
                    console.log("HERE2");
                    if(Math.abs(building.point.distanceFromPoint(this.centroid)) <= building.radius){
                        road.mainRoad.removeBuilding(building);
                    }
                    for(let border of this.getRoads()){
                        if(Math.abs(Road.distanceFromPoint(building.point, border.p1, border.p2)) <= building.radius){
                            road.mainRoad.removeBuilding(building);
                            break;
                        }
                    }
                }
            }
        }
        this.building = pbuilding;
        if(this.subPolygons !== undefined){
            for(let sub of this.subPolygons){
                sub.removeBuilding();
            }
        }
    }

    private removeBuilding(): void {
        this.building = undefined;
        if(this.subPolygons !== undefined) {
            for(let sub of this.subPolygons){
                sub.removeBuilding();
            }
        }
    }

    public splitPolygonWithSmallerPolygon(ratio: number): void {
        let newPolygons: SubareaPolygon[] = [];
        let smallerPolygonPoints: Point[] = [];
        for(const point of this.getClockWiseBorderPoints()) {
            smallerPolygonPoints.push(new Road(this.centroid, point).getPointFromRoadScalar(ratio));
        }
        let smallerPolygonRoads: SideRoad[] = [];
        for(let i = 0; i < smallerPolygonPoints.length; i++) {
            smallerPolygonRoads.push(new SideRoad(smallerPolygonPoints[i], smallerPolygonPoints[(i+1)%smallerPolygonPoints.length], undefined));
        }
        const smallerPolygon = new SubareaPolygon(smallerPolygonRoads);
        newPolygons.push(smallerPolygon);
        let originalPoints: Point[] = this.getClockWiseBorderPoints();
        for(let i = 0; i < originalPoints.length; i++){
            const road1 = this.getSideRoadWithPoints(originalPoints[i], originalPoints[(i+1)%smallerPolygonPoints.length]);
            const road2 = smallerPolygon.getRoadWithPoints(smallerPolygonPoints[i], smallerPolygonPoints[(i+1)%smallerPolygonPoints.length]);
            const road3 = new SideRoad(originalPoints[i], smallerPolygonPoints[i], undefined);
            const road4 = new SideRoad(originalPoints[(i+1)%smallerPolygonPoints.length], smallerPolygonPoints[(i+1)%smallerPolygonPoints.length], undefined);
            const rectPolygon = new SubareaPolygon([road1, road2, road3, road4]);
            newPolygons.push(...rectPolygon.splitRectangle(1, 0,10));
        }
        this.subPolygons = newPolygons;
    }

    private getSideRoadWithPoints(point1: Point, point2: Point): SideRoad {
        for(const road of this.getRoads()) {
            if(road.doesContainPoint(point1) && road.doesContainPoint(point2)){
                return road;
            }

        }
        return this.getRoads()[0];
    }

    public splitRectangle(baseRoadId: number, counterBaseRoadId: number, distance: number): SubareaPolygon[] {
        let newPolygons: SubareaPolygon[] = [];
        const baseRoad = this.roads[baseRoadId];
        const counterBaseRoad = this.getRoads()[counterBaseRoadId];
        const n = Math.floor(baseRoad.length/distance);
        const newLength = baseRoad.length/n;
        const ratio = newLength/baseRoad.length;
        let basePoints: Point[] = [];
        let counterBasePoints: Point[] = [];
        basePoints.push(baseRoad.getPoint1());
        if(ratio !== 1){
            for (let i = 1; i < n; i++) {
                let s = baseRoad.getPointFromRoadScalar(i*ratio);
                basePoints.push(s);
            }
        }
        basePoints.push(baseRoad.getPoint2());
        for(const p of basePoints){
            var a = baseRoad.perpendicularSlope;
            var b = baseRoad.getPerpendicularB(p);
            counterBasePoints.push(counterBaseRoad.getIntersectionPoint(a,b));
        }
        let betweenRoads: SideRoad[] = [];
        for(let i = 0; i < counterBasePoints.length; i++){
            betweenRoads.push(new SideRoad(basePoints[i], counterBasePoints[i], counterBaseRoad.mainRoad));
        }
        for(let i = 0; i<basePoints.length-1; i++){
            const road1 = new SideRoad(basePoints[i], counterBasePoints[i], counterBaseRoad.mainRoad);
            const road2 = new SideRoad(basePoints[i+1], counterBasePoints[i+1], counterBaseRoad.mainRoad);
            newPolygons.push(new SubareaPolygon([road1, betweenRoads[i], road2, betweenRoads[i+1]]));
        }
        this.subPolygons = newPolygons;
        return newPolygons;
    }

    public getLongestSideRoadId(): number {
        const sideroads = this.getRoads().filter(p => !p.isMainRoad);
        let max = sideroads[0].length;
        let maxRoad = sideroads[0];
        for(let i = 1; i < sideroads.length; i++){
            if(sideroads[i].length > max){
                max = sideroads[i].length;
                maxRoad = sideroads[i];
            }
        }
        for(let i = 0; i < this.getRoads().length; i++){
            if(maxRoad === this.getRoads()[i]){
                return i;
            }
        }
        return 0;
    }

    public getLongestMainRoadId(): number {
        const mainroads = this.getRoads().filter(p => p.isMainRoad);
        let max = mainroads[0].length;
        let maxRoad = mainroads[0];
        for(let i = 1; i < mainroads.length; i++){
            if(mainroads[i].length > max){
                max = mainroads[i].length;
                maxRoad = mainroads[i];
            }
        }
        for(let i = 0; i < this.getRoads().length; i++){
            if(maxRoad === this.getRoads()[i]){
                return i;
            }
        }
        return 0;
    }

    public containsMainRoads(): boolean {
        for(let road of this.getRoads()){
            if(road.isMainRoad){
                return true;
            }
        }
        return false;
    }

    public containsSideRoads(): boolean {
        for(let road of this.getRoads()){
            if(!road.isMainRoad){
                return true;
            }
        }
        return false;
    }

    public getAccessoryRadius(ratio: number): number { //ratio so that the circle doesn't fill till the edges of the polygon
        const c = this.centroid;
        let min = Road.distanceFromPoint(c, this.roads[0].p1, this.roads[0].p2);
        for (let i = 1; i < this.roads.length; i++){
            if(Road.distanceFromPoint(c, this.roads[i].p1, this.roads[i].p2) < min){
                min = Road.distanceFromPoint(c, this.roads[i].p1, this.roads[i].p2);
            }
        }
        return min*ratio;
    }

    public getOccupationRate(): number {
        if(this.isOccupied()){
            return 1;
        }
        if(this.subPolygons === undefined || this.subPolygons.length === 0){
            return 0;
        } else {
            let ocpd = 0;
            for(const p of this.subPolygons){
                ocpd += p.getOccupationRate()*p.getArea()/this.getArea();
            }
            return ocpd;
        }
    }

    public isOccupied(): boolean{
        return this.building !== undefined;
    }

    public hashValue(seed: number): number {
        const hash = Md5.hashStr(seed + "SubareaPolygon" + this.centroid.x + ", " + this.centroid.y +" area:" + this.getArea()).substring(0,4);
        return parseInt(hash, 16)/65535;
    }

    public castleHashValue(seed: number): number {
        const hash = Md5.hashStr(seed + "SubareaPolygonCastle" + this.centroid.x + ", " + this.centroid.y +" area:" + this.getArea()).substring(0,4);
        return parseInt(hash, 16)/65535;
    }
}

export default SubareaPolygon;