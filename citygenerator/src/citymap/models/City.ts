import Road from "./road/Road";
import Building from "./building/Building";
import MainRoad from "./road/MainRoad";
import DistrictPolygon from "./area/DistrictPolygon";
import MainPoint from "./point/MainPoint";
import DistrictPolygonType from "./area/DistrictPolygonType";
import LakePolygon from "./area/LakePolygon";
import Point from "./point/Point";
import River from "./River";
import SubareaPolygon from "./area/SubareaPolygon";
import HousingPBuilding from "./building/polygonbuilding/HousingPBuilding";

class City {

    roads: MainRoad[];
    polygons: DistrictPolygon[];
    lakes: LakePolygon[];
    rivers: River[];
    center: Point;
    popRadius = 30;
    angle = Math.PI/9;

    districtBorderMaxCount = 4;
    defaultCompletion = 1.0;
    wallRank = 2;

    expendRange = 2;
    sideRange = 1;
    buildingToPolygonRatio = 0.8;
    iteration = 0;
    seed = 0;
    idealPolygonOccupationRate = 0.1;

    polygonBuildingMaxSize = 500;
    pHouseRandomWage = 0.2;
    pHouseCenterWage = 1.0;
    pHouseWaterWage = 1.0;
    pHouseOccupiedWage = 1.0;

    constructor(roads: MainRoad[]) {
        this.roads = roads;
        this.polygons = [];
        this.lakes = [];
        this.rivers = [];
        this.center = roads[0].getPoint1();
    }

    public pickBestHousingBuildingCandidate(): SubareaPolygon | undefined {

        let possibleSpots: SubareaPolygon[] = [];
        let maxFitValue = 0;
        let maxSpot: SubareaPolygon | undefined = undefined;
        let waterRoads: Road[] = [];

        for(let i = 0; i < this.polygons.length; i++){
            possibleSpots.push(...this.polygons[i].subAreas.filter((a) => (!a.isOccupied() && a.containsMainRoads())))
        }

        let maxDistanceFromCenter = 0;
        let minDistanceFromCenter = Number.MAX_SAFE_INTEGER;
        let maxDistanceFromWater = 0;
        let minDistanceFromWater = Number.MAX_SAFE_INTEGER;

        for(let spot of possibleSpots){
            const spotDistanceFromCenter = spot.centroid.distanceFromPoint(this.center);
            if(spotDistanceFromCenter > maxDistanceFromCenter){
                maxDistanceFromCenter = spotDistanceFromCenter;
            }
            if(spotDistanceFromCenter < minDistanceFromCenter){
                minDistanceFromCenter = spotDistanceFromCenter;
            }
        }

        if(this.rivers.length > 0){
            waterRoads.push(...this.rivers[0].riverRoads);
            for(let spot of possibleSpots){
                const spotDistanceFromWater = spot.centroid.distanceFromWater(waterRoads);
                if(spotDistanceFromWater > maxDistanceFromWater){
                    maxDistanceFromWater = spotDistanceFromWater;
                }
                if(spotDistanceFromWater < minDistanceFromWater){
                    minDistanceFromWater = spotDistanceFromWater;
                }
            }
        }
        for(let i = 0; i < this.polygons.length; i++){
            var spots = this.polygons[i].subAreas.filter((a) => (!a.isOccupied() && a.containsMainRoads()));
            for(let spot of spots){
                let spotValue = 0;
                if(minDistanceFromCenter !== maxDistanceFromCenter)
                    spotValue += this.pHouseCenterWage * (maxDistanceFromCenter-spot.centroid.distanceFromPoint(this.center))/(maxDistanceFromCenter-minDistanceFromCenter);
                if(minDistanceFromWater !== maxDistanceFromWater)
                    spotValue += this.pHouseWaterWage * (maxDistanceFromWater-spot.centroid.distanceFromWater(waterRoads))/(maxDistanceFromWater-minDistanceFromWater);
                spotValue += this.pHouseRandomWage * spot.hashValue(this.seed, this.iteration);
                spotValue += this.pHouseOccupiedWage * this.polygons[i].occupiedPercentage() > this.idealPolygonOccupationRate ? 0 : 1;
                if(spotValue > maxFitValue){
                    maxFitValue = spotValue;
                    maxSpot = spot;
                }
            }
        }
        return maxSpot;
    }

    public addNewRoad(distance: number): void {
        const points = this.getAllPoints();
        var direction = -1;
        var randomPoint = new MainPoint(0, 0);
        while (direction < 0) {
            randomPoint = points[Math.floor(Math.random() * points.length)];
            direction = randomPoint.getRandomDirection();
        }
        const randomAngle = (Math.PI / 2) * direction + (Math.random() * this.angle) - this.angle / 2;
        const p = randomPoint.getDistancedPoint(distance, randomAngle);
        const newPoint = new MainPoint(p.x, p.y, randomPoint.distanceFromCenter + 1);
        const roadsFromRandomPoint = randomPoint.getAllRoads();
        const excludedPointSet = new Set<MainPoint>();
        for (const road of roadsFromRandomPoint) {
            excludedPointSet.add(road.getPoint1());
            excludedPointSet.add(road.getPoint2());
        }
        const excludedPoints = Array.from(excludedPointSet);
        const allPoints = this.getAllPoints().filter(point => !excludedPoints.includes(point));
        let expectedPoint = newPoint;

        let min = 200;
        for (let point of allPoints) {
            let dist = Road.distanceFromPoint(point, randomPoint, newPoint);
            if (dist < min) {
                min = dist;
                expectedPoint = point;
            }
        }
        if (min < this.popRadius) {
            const newRoad = MainRoad.createMainRoad(randomPoint, expectedPoint, direction, this.defaultCompletion);
            this.roads.push(newRoad);
            this.addPolygons(this.findCycles(this.districtBorderMaxCount, [expectedPoint], []));
            return;
        }

        for (let road of this.roads) {
            let dist = Road.distanceFromPoint(newPoint, road.p1, road.p2);
            if (dist < this.popRadius) {
                expectedPoint = road.getRandomPoint();
                const newRoad = MainRoad.createMainRoad(randomPoint, expectedPoint, direction, this.defaultCompletion);
                this.roads.push(newRoad);
                this.addPolygons(this.findCycles(this.districtBorderMaxCount, [expectedPoint], []));
                return;
            }
        }
        const newRoad = MainRoad.createMainRoad(randomPoint, newPoint, direction, this.defaultCompletion);
        this.roads.push(newRoad);
    }

    public addExtentionRoad(distance: number): void {
        const points = this.getMinimalExpandablePointsWithinRange();
        var direction = -1;
        var randomPoint = new MainPoint(0, 0);
        while (direction < 0) {
            randomPoint = points[Math.floor(Math.random() * points.length)];
            direction = randomPoint.getForwardDirection();
        }
        const randomAngle = (Math.PI / 2) * direction + (Math.random() * this.angle) - this.angle / 2;
        const p = randomPoint.getDistancedPoint(distance, randomAngle);
        const newPoint = new MainPoint(p.x, p.y, randomPoint.distanceFromCenter + 1);
        const roadsFromRandomPoint = randomPoint.getAllRoads();
        const excludedPointSet = new Set<MainPoint>();
        for (const road of roadsFromRandomPoint) {
            excludedPointSet.add(road.getPoint1());
            excludedPointSet.add(road.getPoint2());
        }
        const excludedPoints = Array.from(excludedPointSet);
        const allPoints = this.getAllPoints().filter(point => !excludedPoints.includes(point));
        let expectedPoint = newPoint;

        let min = 200;
        for (let point of allPoints) {
            let dist = Road.distanceFromPoint(point, randomPoint, newPoint);
            if (dist < min) {
                min = dist;
                expectedPoint = point;
            }
        }
        if (min < this.popRadius) {
            const newRoad = MainRoad.createMainRoad(randomPoint, expectedPoint, direction, this.defaultCompletion);
            this.roads.push(newRoad);
            this.addPolygons(this.findCycles(this.districtBorderMaxCount, [expectedPoint], []));
            return;
        }

        for (let road of this.roads) {
            let dist = Road.distanceFromPoint(newPoint, road.p1, road.p2);
            if (dist < this.popRadius) {
                expectedPoint = road.getRandomPoint();
                const newRoad = MainRoad.createMainRoad(randomPoint, expectedPoint, direction, this.defaultCompletion);
                this.roads.push(newRoad);
                this.addPolygons(this.findCycles(this.districtBorderMaxCount, [expectedPoint], []));
                return;
            }
        }

        const newRoad = MainRoad.createMainRoad(randomPoint, newPoint, direction, this.defaultCompletion);
        this.roads.push(newRoad);
    }

    public addSideRoad(distance: number): void {
        const points = this.getMinimalSideablePointsWithinRange();
        if (points.length === 0)
            return;
        var direction = -1;
        var randomPoint = new MainPoint(0, 0);
        while (direction < 0) {
            randomPoint = points[Math.floor(Math.random() * points.length)];
            direction = randomPoint.getSideDirection();
        }
        const randomAngle = (Math.PI / 2) * direction + (Math.random() * this.angle) - this.angle / 2;
        const p = randomPoint.getDistancedPoint(distance, randomAngle);
        const newPoint = new MainPoint(p.x, p.y, randomPoint.distanceFromCenter + 1);
        const roadsFromRandomPoint = randomPoint.getAllRoads();
        const excludedPointSet = new Set<MainPoint>();
        for (const road of roadsFromRandomPoint) {
            excludedPointSet.add(road.getPoint1());
            excludedPointSet.add(road.getPoint2());
        }
        const excludedPoints = Array.from(excludedPointSet);
        const allPoints = this.getAllPoints().filter(point => !excludedPoints.includes(point));
        let expectedPoint = newPoint;

        let min = 200;

        for (let point of allPoints) {
            let dist = Road.distanceFromPoint(point, randomPoint, newPoint);
            if (dist < min) {
                min = dist;
                expectedPoint = point;
            }
        }

        if (min < this.popRadius) {
            const newRoad = MainRoad.createMainRoad(randomPoint, expectedPoint, direction, this.defaultCompletion);
            this.roads.push(newRoad);
            this.addPolygons(this.findCycles(this.districtBorderMaxCount, [expectedPoint], []));
            return;
        }

        for (let road of this.roads) {
            let dist = Road.distanceFromPoint(newPoint, road.p1, road.p2);
            if (dist < this.popRadius) {
                expectedPoint = road.getRandomPoint();
                const newRoad = MainRoad.createMainRoad(randomPoint, expectedPoint, direction, this.defaultCompletion);
                this.roads.push(newRoad);
                this.addPolygons(this.findCycles(this.districtBorderMaxCount, [expectedPoint], []));
                return;
            }
        }

        const newRoad = MainRoad.createMainRoad(randomPoint, newPoint, direction, this.defaultCompletion);
        this.roads.push(newRoad);
        return;
    }

    public addBuilding(distance: number, radius: number): void {
        const posRoads = this.roads;
        const road = posRoads[Math.floor(Math.random() * posRoads.length)];
        road.addBuilding(distance, radius);
    }

    public addHousingPBuilding(): void {
        const spot = this.pickBestHousingBuildingCandidate();
        if(spot !== undefined){
            spot.buildBuilding(HousingPBuilding.createHousingPBuilding(spot, this.buildingToPolygonRatio));
        }
    }

    public getAllBuildings(): Building[] {
        const buildingSet = new Set<Building>();
        for (const road of this.roads) {
            for (const building of road.getAllBuildings()) {
                buildingSet.add(building);
            }
        }
        return Array.from(buildingSet);
    }

    public splitRandomPolygon(): void {
        const possiblePolygons: DistrictPolygon[] = this.polygons.filter((p) => p.subAreas.length < 2)
        if (possiblePolygons.length > 0) {
            possiblePolygons[0].splitPolygonMultipleTimesWithSize(this.polygonBuildingMaxSize);
        }
    }

    public splitRandomPolygonWithSmallerPolygon(ratio: number): void {
        const possiblePolygons: DistrictPolygon[] = this.polygons.filter((p) => p.subAreas.length < 2)
        if (possiblePolygons.length > 0) {
            possiblePolygons[0].splitPolygonBySmallerPolygon(ratio);
        }
    }

    public createCastle(ratio: number) : void {
        const possiblePolygons: DistrictPolygon[] = this.polygons.filter((p) => p.subAreas.length < 2  && p.subAreas[0].building === undefined)
        if (possiblePolygons.length > 0) {
            possiblePolygons[0].createCastle(ratio);
        }
    }

    public splitRandomPolygonUnevenly(){
        const possiblePolygons: DistrictPolygon[] = this.polygons.filter((p) => p.subAreas.length < 2);
        if (possiblePolygons.length > 0) {
            possiblePolygons[0].splitPolygonUnevenly(5);
        }
    }

    public static getExampleCity(): City {
        const p1 = new MainPoint(500, 500, 0);
        const p2 = new MainPoint(600, 510, 1);
        const r = MainRoad.createMainRoad(p1, p2, 0, 1);
        const c = new City([r]);
        //c.lakes.push(LakePolygon.createNewLakePolygon(new Point(200, 200), 300, 250, 25, Math.PI/10));
        c.rivers.push(River.createRiver(0, 0, 0*Math.PI/2, Math.PI, Math.PI/8, 100, 40));
        return c;
    }

    private getAllPoints(): MainPoint[] {
        const pointSet = new Set<MainPoint>();
        for (const road of this.roads) {
            pointSet.add(road.getPoint1());
            pointSet.add(road.getPoint2());
        }
        return Array.from(pointSet);
    }

    private getMinimalExpandablePointsWithinRange(): MainPoint[] {
        const min = this.getMinimalExpandablePointDistance();
        const max = min + this.expendRange;
        return this.getExtendablePoints().filter((point) => point.distanceFromCenter >= min && point.distanceFromCenter < max);
    }

    private getMinimalSideablePointsWithinRange(): MainPoint[] {
        const min = this.getMinimalSidedPointDistance();
        const max = min + this.sideRange;
        return this.getSideablePoints().filter((point) => point.distanceFromCenter >= min && point.distanceFromCenter < max);
    }

    private getMinimalExpandablePointDistance(): number {
        let min = 1000;
        const points = this.getExtendablePoints();
        for(let i = 0; i < points.length; i++) {
            if(points[i].distanceFromCenter < min){
                min = points[i].distanceFromCenter;
            }
        }
        return min;
    }

    private getMinimalSidedPointDistance(): number {
        let min = 1000;
        const points = this.getSideablePoints();
        for(let i = 0; i < points.length; i++) {
            if(points[i].distanceFromCenter < min){
                min = points[i].distanceFromCenter;
            }
        }
        return min;
    }

    private getExtendablePoints(): MainPoint[] {
        return this.getAllPoints().filter((point) => point.canBeExtended());
    }

    private getSideablePoints(): MainPoint[] {
        return this.getAllPoints().filter((point) => point.canBeSided());
    }

    private findCycles(pointCap: number, currentPoints: MainPoint[], currentRoads: MainRoad[]): DistrictPolygon[] {
        const result: DistrictPolygon[] = [];
        const pathPoints: MainPoint[] = currentPoints;
        const start = currentPoints[0];
        const end = currentPoints[currentPoints.length - 1];
        if (pathPoints.length > (pointCap + 1)) {//no path found under within the limit
            return result;
        }
        if (currentPoints.length > 1 && start === end) {
            result.push(new DistrictPolygon(currentRoads));
            return result;
        }
        for (const road of end.getAllRoads()) {
            if (road !== null && !currentRoads.includes(road)) {
                result.push(...this.findCycles(pointCap, [...currentPoints, road.getOtherPoint(end)], [...currentRoads, road]));
            }
        }
        return result;
    }

    private addPolygons(polygons: DistrictPolygon[]): void {
        const potentialPolygons: DistrictPolygon[] = polygons.filter((p) => !p.hasSmallerCycle());
        for (const newp of potentialPolygons) {
            let flag = true;
            for (const p of this.polygons) {
                if (newp.equals(p)) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                this.polygons.push(newp);
                newp.generateRank();
                if(newp.rank === 1){
                    newp.type = DistrictPolygonType.Market;
                }
                newp.addRankToRoads();
            }
        }
        this.checkForCityWalls();
    }

    private checkForCityWalls(): void {
        let roadSet: Set<MainPoint> = new Set();
        for(const road of this.roads) {
            if(road.hasBothRanks(this.wallRank, this.wallRank+1)){
                if(!roadSet.has(road.getPoint1())){
                    roadSet.add(road.getPoint1());
                } else {
                    roadSet.delete(road.getPoint1());
                }
                if(!roadSet.has(road.getPoint2())){
                    roadSet.add(road.getPoint2());
                } else {
                    roadSet.delete(road.getPoint2());
                }
            }
        }
        if(roadSet.size === 0) {
            for(const road of this.roads) {
                if(road.hasBothRanks(this.wallRank, this.wallRank+1)){
                    road.setToWall();
                }
            }
        }
        this.pickBestHousingBuildingCandidate();
    }

    public addRoadCompletionScalar(amount: number){
        for(const road of this.roads) {
            road.addCompletionScalar(amount);
        }
    }

}

export default City;