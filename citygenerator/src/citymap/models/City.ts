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
import SidePoint from "./point/SidePoint";
import SquareBuilding from "./building/SquareBuilding";
import ChurchPBuilding from "./building/polygonbuilding/ChurchPBuilding";

class City {

    roads: MainRoad[];
    polygons: DistrictPolygon[];
    lakes: LakePolygon[];
    rivers: River[];
    center: Point;
    popRadius = 30;
    angle = Math.PI/9;

    riverStartAngle = 0*Math.PI/9;

    districtBorderMaxCount = 4;
    defaultCompletion = 1.0;
    wallRank = 2;

    expendRange = 2;
    sideRange = 1;
    buildingToPolygonRatio = 0.8;
    iteration = 0;
    seed = 0;
    idealPolygonOccupationRate = 0.1;

    polygonBuildingMaxSize = 312.5;
    pHouseRandomWage = 0.2;
    pHouseCenterWage = 1.0;
    pHouseWaterWage = 1.0;
    pHouseOccupiedWage = 1.0;

    houseRandomWage = 0.2;
    houseCenterWage = 1.0;
    houseWaterWage = 1.0;
    houseOccupiedWage = 0;

    churchBuildingMinSize = 4000;
    churchRandomWage = 0.2;
    churchCenterWage = 1.0;
    churchWaterWage = 0.0;
    churchOccupiedWage = 7.0;

    constructor(roads: MainRoad[], seed: number) {
        this.seed = seed;
        this.roads = roads;
        this.polygons = [];
        this.lakes = [];
        this.rivers = [];
        this.center = roads[0].getPoint1();
    }

    public pickBestPHousingBuildingCandidate(): SubareaPolygon | undefined {

        let possibleSpots: SubareaPolygon[] = [];
        let maxFitValue = 0;
        let maxSpot: SubareaPolygon | undefined = undefined;
        let waterRoads: Road[] = [];

        for(let i = 0; i < this.polygons.length; i++){
            possibleSpots.push(...this.polygons[i].subAreas.getAllPolygons().filter((a) => (!a.isOccupied() && a.containsMainRoads())))
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
            var spots = this.polygons[i].subAreas.getAllPolygons().filter((a) => (!a.isOccupied() && a.containsMainRoads()));
            for(let spot of spots){
                let spotValue = 0;
                if(minDistanceFromCenter !== maxDistanceFromCenter)
                    spotValue += this.pHouseCenterWage * (maxDistanceFromCenter-spot.centroid.distanceFromPoint(this.center))/(maxDistanceFromCenter-minDistanceFromCenter);
                if(minDistanceFromWater !== maxDistanceFromWater)
                    spotValue += this.pHouseWaterWage * (maxDistanceFromWater-spot.centroid.distanceFromWater(waterRoads))/(maxDistanceFromWater-minDistanceFromWater);
                spotValue += this.pHouseRandomWage * spot.hashValue(this.seed);
                spotValue += this.pHouseOccupiedWage * this.polygons[i].occupiedPercentage() > this.idealPolygonOccupationRate ? 0 : 1;
                if(spotValue > maxFitValue){
                    maxFitValue = spotValue;
                    maxSpot = spot;
                }
            }
        }
        return maxSpot;
    }

    public pickBestHousingBuildingCandidate(): SidePoint | undefined {
        let allFreeSpots: SidePoint[] = [];
        let maxFitValue = 0;
        let maxSpot: SidePoint | undefined = undefined;
        let waterRoads: Road[] = [];
        for(const r of this.roads){
            allFreeSpots.push(...r.getAllFreeSpots());
        }
        let maxDistanceFromCenter = 0;
        let minDistanceFromCenter = Number.MAX_SAFE_INTEGER;
        let maxDistanceFromWater = 0;
        let minDistanceFromWater = Number.MAX_SAFE_INTEGER;

        for(let spot of allFreeSpots){
            const spotDistanceFromCenter = spot.distanceFromPoint(this.center);
            if(spotDistanceFromCenter > maxDistanceFromCenter){
                maxDistanceFromCenter = spotDistanceFromCenter;
            }
            if(spotDistanceFromCenter < minDistanceFromCenter){
                minDistanceFromCenter = spotDistanceFromCenter;
            }
        }

        if(this.rivers.length > 0){
            waterRoads.push(...this.rivers[0].riverRoads);
            for(let spot of allFreeSpots){
                const spotDistanceFromWater = spot.distanceFromWater(waterRoads);
                if(spotDistanceFromWater > maxDistanceFromWater){
                    maxDistanceFromWater = spotDistanceFromWater;
                }
                if(spotDistanceFromWater < minDistanceFromWater){
                    minDistanceFromWater = spotDistanceFromWater;
                }
            }
        }
        for(let i = 0; i < this.roads.length; i++){
            var spots = this.roads[i].getAllFreeSpots();
            for(let spot of spots){
                let spotValue = 0;
                if(minDistanceFromCenter !== maxDistanceFromCenter)
                    spotValue += this.houseCenterWage * (maxDistanceFromCenter-spot.distanceFromPoint(this.center))/(maxDistanceFromCenter-minDistanceFromCenter);
                if(minDistanceFromWater !== maxDistanceFromWater)
                    spotValue += this.houseWaterWage * (maxDistanceFromWater-spot.distanceFromWater(waterRoads))/(maxDistanceFromWater-minDistanceFromWater);
                spotValue += this.houseRandomWage * spot.hashValue(this.seed, this.iteration);
                spotValue += this.houseOccupiedWage * this.roads[i].occupiedPercentage() > this.idealPolygonOccupationRate ? 0 : 1;
                if(spotValue > maxFitValue){
                    maxFitValue = spotValue;
                    maxSpot = spot;
                }
            }
        }
        return maxSpot;
    }

    public pickBestChurchBuildingCandidate(): SubareaPolygon | undefined {

        let possibleSpots: SubareaPolygon[] = [];
        let maxFitValue = 0;
        let maxSpot: SubareaPolygon | undefined = undefined;
        let waterRoads: Road[] = [];

        for(let i = 0; i < this.polygons.length; i++){
            possibleSpots.push(...this.polygons[i].subAreas.getPolygonsAboveSize(this.churchBuildingMinSize).filter((a) => (!a.isOccupied() && a.containsMainRoads())))
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
            var spots = this.polygons[i].subAreas.getPolygonsAboveSize(this.churchBuildingMinSize).filter((a) => (!a.isOccupied() && a.containsMainRoads()));
            for(let spot of spots){
                let spotValue = 0;
                if(minDistanceFromCenter !== maxDistanceFromCenter)
                    spotValue += (this.churchCenterWage * (maxDistanceFromCenter-spot.centroid.distanceFromPoint(this.center))/(maxDistanceFromCenter-minDistanceFromCenter));
                if(minDistanceFromWater !== maxDistanceFromWater)
                    spotValue += (this.churchWaterWage * (maxDistanceFromWater-spot.centroid.distanceFromWater(waterRoads))/(maxDistanceFromWater-minDistanceFromWater));
                spotValue += (this.churchRandomWage * spot.hashValue(this.seed));
                spotValue += (this.churchOccupiedWage * (1 - spot.getOccupationRate()));
                console.log("OCCUPIED " + spot.getOccupationRate());
                if(spotValue > maxFitValue){
                    maxFitValue = spotValue;
                    maxSpot = spot;
                }
            }
        }
        return maxSpot;
    }

    public addNewRoad(distance: number): void {

    }

    public addExtentionRoad(minDistance: number, maxDistance: number): void {
        const points = this.getMinimalExpandablePointsWithinRange();
        var direction = -1;
        var randomPoint = new MainPoint(0, 0);
        while (direction < 0) {
            randomPoint = points[Math.floor(Math.random() * points.length)];
            direction = randomPoint.getForwardDirection();
        }
        const randomAngle = (Math.PI / 2) * direction + (randomPoint.getAngleHashValue(this.seed, direction) * this.angle) - this.angle / 2;
        const distance = randomPoint.getDistanceHashValue(this.seed, direction) * (minDistance - maxDistance) + minDistance;
        const p = randomPoint.getDistancedPoint(distance, randomAngle);
        const newPoint = new MainPoint(p.x, p.y, randomPoint.distanceFromCenter + 1);
        const roadsFromRandomPoint = randomPoint.getAllRoads();
        const excludedPointSet = new Set<MainPoint>();
        for (const road of roadsFromRandomPoint) {
            excludedPointSet.add(road.getPoint1());
            excludedPointSet.add(road.getPoint2());
        }
        const excludedPoints = Array.from(excludedPointSet);
        const allPoints = this.getAllRoadAndWaterPoints().filter(point => !excludedPoints.includes(point));
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

        for (let road of this.getAllRoadsAndRiverRoads()) {
            let dist = Road.distanceFromPoint(newPoint, road.p1, road.p2);
            if (dist < this.popRadius) {
                expectedPoint = road.getRandomPoint(this.seed) as MainPoint;
                const newRoad = MainRoad.createMainRoad(randomPoint, expectedPoint, direction, this.defaultCompletion);
                this.roads.push(newRoad);
                this.addPolygons(this.findCycles(this.districtBorderMaxCount, [expectedPoint], []));
                return;
            }
        }
        const newRoad = MainRoad.createMainRoad(randomPoint, newPoint, direction, this.defaultCompletion);
        this.roads.push(newRoad);
    }

    public addSideRoad(minDistance: number, maxDistance: number): void {
        const points = this.getMinimalSideablePointsWithinRange();
        if (points.length === 0)
            return;
        var direction = -1;
        var randomPoint = new MainPoint(0, 0);
        while (direction < 0) {
            randomPoint = points[Math.floor(Math.random() * points.length)];
            direction = randomPoint.getSideDirection();
        }
        const randomAngle = (Math.PI / 2) * direction + (randomPoint.getAngleHashValue(this.seed, direction) * this.angle) - this.angle / 2;
        const distance = randomPoint.getDistanceHashValue(this.seed, direction) * (minDistance - maxDistance) + minDistance;
        const p = randomPoint.getDistancedPoint(distance, randomAngle);
        const newPoint = new MainPoint(p.x, p.y, randomPoint.distanceFromCenter + 1);
        const roadsFromRandomPoint = randomPoint.getAllRoads();
        const excludedPointSet = new Set<MainPoint>();
        for (const road of roadsFromRandomPoint) {
            excludedPointSet.add(road.getPoint1());
            excludedPointSet.add(road.getPoint2());
        }
        const excludedPoints = Array.from(excludedPointSet);
        const allPoints = this.getAllRoadAndWaterPoints().filter(point => !excludedPoints.includes(point));
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

        for (let road of this.getAllRoadsAndRiverRoads()) {
            let dist = Road.distanceFromPoint(newPoint, road.p1, road.p2);
            if (dist < this.popRadius) {
                expectedPoint = road.getRandomPoint(this.seed) as MainPoint;
                const newRoad = MainRoad.createMainRoad(randomPoint, expectedPoint, direction, this.defaultCompletion);
                this.roads.push(newRoad);
                this.addPolygons(this.findCycles(this.districtBorderMaxCount, [expectedPoint], []));
                return;
            }
        }
        const newRoad = MainRoad.createMainRoad(randomPoint, newPoint, direction, this.defaultCompletion);
        this.roads.push(newRoad);
    }

    public addBuilding(): void {
        const spot = this.pickBestHousingBuildingCandidate();
        if(spot !== undefined){
            spot.buildBuilding(new SquareBuilding(spot.x, spot.y, spot.radius, spot.angle));
        }
    }

    public addHousingPBuilding(): void {
        const spot = this.pickBestPHousingBuildingCandidate();
        if(spot !== undefined){
            spot.buildBuilding(HousingPBuilding.createHousingPBuilding(spot, this.buildingToPolygonRatio));
        }
    }

    public addChurchPBuilding(): void {
        const spot = this.pickBestChurchBuildingCandidate();
        if(spot !== undefined){
            spot.buildBuilding(ChurchPBuilding.createChurchPBuilding(spot, this.buildingToPolygonRatio));
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
        const possiblePolygons: DistrictPolygon[] = this.polygons.filter((p) => p.subAreas.subPolygons === undefined)
        if (possiblePolygons.length > 0) {
            possiblePolygons[0].splitPolygonMultipleTimesWithSize(this.seed, this.polygonBuildingMaxSize);
        }
    }

    public splitRandomPolygonWithSmallerPolygon(ratio: number): void {
        const possiblePolygons: DistrictPolygon[] = this.polygons.filter((p) => p.subAreas.subPolygons === undefined)
        if (possiblePolygons.length > 0) {
            possiblePolygons[0].splitPolygonBySmallerPolygon(ratio);
        }
    }

    public createCastle(ratio: number) : void {
        const possiblePolygons: DistrictPolygon[] = this.polygons.filter((p) => p.subAreas.subPolygons === undefined)
        if (possiblePolygons.length > 0) {
            possiblePolygons[0].createCastle(ratio);
        }
    }

    public static getExampleCity(x1: number, y1: number, x2: number, y2: number, seed: number, riverStartAngle: number): City {
        const p1 = new MainPoint(x1, y1, 0);
        const p2 = new MainPoint(x2, y2, 1);
        const r = MainRoad.createMainRoad(p1, p2, 0, 1);
        const c = new City([r], seed);
        c.lakes.push(LakePolygon.createNewLakePolygon(new Point(200, 200), 300, 300, 24, Math.PI/10, seed));
        const rc = c.lakes[0].getClosestPointToAngle(riverStartAngle);
        c.rivers.push(River.createRiver(rc.x, rc.y, riverStartAngle, Math.PI/9, Math.PI/8, 100, 40, seed));
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

    private getAllRoadAndWaterPoints(): MainPoint[] {
        const pointSet = new Set<MainPoint>();
        for (const road of this.roads) {
            pointSet.add(road.getPoint1());
            pointSet.add(road.getPoint2());
        }
        for(const river of this.rivers) {
            for(const p of river.getRiverPoints())
                pointSet.add(p);
        }
        return Array.from(pointSet);
    }

    private getAllRoadsAndRiverRoads(): Road[] {
        const roads: Road[] = [];
        roads.push(...this.roads);
        for(const river of this.rivers) {
            roads.push(...river.riverRoads);
        }
        return roads;
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
        this.pickBestPHousingBuildingCandidate();
    }

    public addRoadCompletionScalar(amount: number){
        for(const road of this.roads) {
            road.addCompletionScalar(amount);
        }
    }

}

export default City;