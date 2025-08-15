import Road from "./road/Road";
import Building from "./building/Building";
import MainRoad from "./road/MainRoad";
import DistrictPolygon from "./area/DistrictPolygon";
import MainPoint from "./point/MainPoint";
import DistrictPolygonType from "./area/DistrictPolygonType";

class City {

    roads: MainRoad[];
    polygons: DistrictPolygon[];
    popRadius = 50;
    angle = Math.PI / 9;

    districtBorderMaxCount = 4;
    defaultCompletion = 1.0;
    wallRank = 2;

    constructor(roads: MainRoad[]) {
        this.roads = roads;
        this.polygons = [];
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
        const points = this.getAllPoints().filter(point => point.getRoadCount() === 1);
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
        const points = this.getAllPoints().filter(point => point.getRoadCount() > 1 && point.getRoadCount() < 4);
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
            possiblePolygons[0].splitPolygonMultipleTimes(3);
        }
    }

    public splitRandomPolygonWithSmallerPolygon(ratio: number): void {
        const possiblePolygons: DistrictPolygon[] = this.polygons.filter((p) => p.subAreas.length < 2)
        if (possiblePolygons.length > 0) {
            possiblePolygons[0].splitPolygonBySmallerPolygon(ratio);
        }
    }

    public static getExampleCity(): City {
        const p1 = new MainPoint(200, 200, 0);
        const p2 = new MainPoint(300, 210, 0);
        const r = MainRoad.createMainRoad(p1, p2, 0, 1);
        return new City([r]);
    }

    private getAllPoints(): MainPoint[] {
        const pointSet = new Set<MainPoint>();
        for (const road of this.roads) {
            pointSet.add(road.getPoint1());
            pointSet.add(road.getPoint2());
        }
        return Array.from(pointSet);
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
    }

    public addRoadCompletionScalar(amount: number){
        for(const road of this.roads) {
            road.addCompletionScalar(amount);
        }
    }

}

export default City;