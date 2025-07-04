import Road from "./road/Road";
import Point from "./road/Point";
import Polygon from "./area/Polygon";
import Building from "./building/Building";
import SquareBuilding from "./building/SquareBuilding";

class City {

  roads: Road[];
  polygons: Polygon[];
  popRadius = 50;
  angle = Math.PI/9;

  constructor(roads: Road[]) {
    this.roads = roads;
    this.polygons = [];
  }

  public addNewRoad(distance: number): void {
    const points = this.getAllPoints();
    var direction = -1;
    var randomPoint = new Point(0, 0);
    while(direction < 0) {
      randomPoint = points[Math.floor(Math.random() * points.length)];
      direction = randomPoint.getRandomDirection();
    }
    const randomAngle = (Math.PI/2) * direction + (Math.random() * this.angle) - this.angle/2;
    const newPoint = randomPoint.getDistancedPoint(distance, randomAngle);
    newPoint.distanceFromCrossroad = randomPoint.distanceFromCrossroad + 1;
    const roadsFromRandomPoint = Road.getAllRoadsWithPoint(this.roads, randomPoint);
    const excludedPointSet = new Set<Point>();
    for(const road of roadsFromRandomPoint) {
      excludedPointSet.add(road.p1);
      excludedPointSet.add(road.p2);
    }
    const excludedPoints = Array.from(excludedPointSet);
    const allPoints = this.getAllPoints().filter(point => !excludedPoints.includes(point));
    let expectedPoint = newPoint;

    let min = 200;
    for(let point of allPoints) {
      let dist = Road.distanceFromPoint(point, randomPoint, newPoint);
      if(dist < min){
        min = dist;
        expectedPoint = point;
      }
    }
    if(min < this.popRadius){
      const newRoad = Road.createRoad(randomPoint, expectedPoint, direction);
      this.roads.push(newRoad);
      this.polygons.push(...this.findCycles(6, [expectedPoint], []));
      return;
    }

    for(let road of this.roads) {
      let dist = Road.distanceFromPoint(newPoint, road.p1, road.p2);
      if(dist < this.popRadius){
        expectedPoint = road.getRandomPoint();
        const newRoad = Road.createRoad(randomPoint, expectedPoint, direction);
        this.roads.push(newRoad);
        this.polygons.push(...this.findCycles(6, [expectedPoint], []));
        return;
      }
    }

    const newRoad = Road.createRoad(randomPoint, newPoint, direction);
    this.roads.push(newRoad);
    return;
  }
  public addExtentionRoad(distance: number): void {
    const points = this.getAllPoints().filter(point => point.getRoadCount() === 1);
    var direction = -1;
    var randomPoint = new Point(0, 0);
    while(direction < 0) {
      randomPoint = points[Math.floor(Math.random() * points.length)];
      direction = randomPoint.getForwardDirection();
    }
    const randomAngle = (Math.PI/2) * direction + (Math.random() * this.angle) - this.angle/2;
    const newPoint = randomPoint.getDistancedPoint(distance, randomAngle);
    newPoint.distanceFromCrossroad = randomPoint.distanceFromCrossroad + 1;
    const roadsFromRandomPoint = Road.getAllRoadsWithPoint(this.roads, randomPoint);
    const excludedPointSet = new Set<Point>();
    for(const road of roadsFromRandomPoint) {
      excludedPointSet.add(road.p1);
      excludedPointSet.add(road.p2);
    }
    const excludedPoints = Array.from(excludedPointSet);
    const allPoints = this.getAllPoints().filter(point => !excludedPoints.includes(point));
    let expectedPoint = newPoint;

    let min = 200;
    for(let point of allPoints) {
      let dist = Road.distanceFromPoint(point, randomPoint, newPoint);
      if(dist < min){
        min = dist;
        expectedPoint = point;
      }
    }
    if(min < this.popRadius){
      const newRoad = Road.createRoad(randomPoint, expectedPoint, direction);
      this.roads.push(newRoad);
      this.polygons.push(...this.findCycles(6, [expectedPoint], []));
      return;
    }

    for(let road of this.roads) {
      let dist = Road.distanceFromPoint(newPoint, road.p1, road.p2);
      if(dist < this.popRadius){
        expectedPoint = road.getRandomPoint();
        const newRoad = Road.createRoad(randomPoint, expectedPoint, direction);
        this.roads.push(newRoad);
        this.polygons.push(...this.findCycles(6, [expectedPoint], []));
        return;
      }
    }

    const newRoad = Road.createRoad(randomPoint, newPoint, direction);
    this.roads.push(newRoad);
    return;
  }
  public addSideRoad(distance: number): void {
    const points = this.getAllPoints().filter(point => point.getRoadCount() > 1 && point.getRoadCount() < 4);
    if(points.length === 0)
      return;
    var direction = -1;
    var randomPoint = new Point(0, 0);
    while(direction < 0) {
      randomPoint = points[Math.floor(Math.random() * points.length)];
      direction = randomPoint.getSideDirection();
    }
    const randomAngle = (Math.PI/2) * direction + (Math.random() * this.angle) - this.angle/2;
    const newPoint = randomPoint.getDistancedPoint(distance, randomAngle);
    newPoint.distanceFromCrossroad = randomPoint.distanceFromCrossroad + 1;
    const roadsFromRandomPoint = Road.getAllRoadsWithPoint(this.roads, randomPoint);
    const excludedPointSet = new Set<Point>();
    for(const road of roadsFromRandomPoint) {
      excludedPointSet.add(road.p1);
      excludedPointSet.add(road.p2);
    }
    const excludedPoints = Array.from(excludedPointSet);
    const allPoints = this.getAllPoints().filter(point => !excludedPoints.includes(point));
    let expectedPoint = newPoint;

    let min = 200;
    for(let point of allPoints) {
      let dist = Road.distanceFromPoint(point, randomPoint, newPoint);
      if(dist < min){
        min = dist;
        expectedPoint = point;
      }
    }
    if(min < this.popRadius){
      const newRoad = Road.createRoad(randomPoint, expectedPoint, direction);
      this.roads.push(newRoad);
      this.polygons.push(...this.findCycles(6, [expectedPoint], []));
      return;
    }

    for(let road of this.roads) {
      let dist = Road.distanceFromPoint(newPoint, road.p1, road.p2);
      if(dist < this.popRadius){
        expectedPoint = road.getRandomPoint();
        const newRoad = Road.createRoad(randomPoint, expectedPoint, direction);
        this.roads.push(newRoad);
        this.polygons.push(...this.findCycles(6, [expectedPoint], []));
        return;
      }
    }

    const newRoad = Road.createRoad(randomPoint, newPoint, direction);
    this.roads.push(newRoad);
    return;
  }

  public addBuilding(distance: number, radius: number): void{
    const posRoads = this.roads;
    const road = posRoads[Math.floor(Math.random()*posRoads.length)];
    road.addBuilding(distance, radius);
  }

  public getAllBuildings(): Building[] {
    const buildingSet = new Set<Building>();
    for(const road of this.roads) {
      for(const building of road.buildings) {
        buildingSet.add(building);
      }
    }
    return Array.from(buildingSet);
  }

  public static getExampleCity(): City{
    const p1 = new Point(400, 400, 0);
    const p2 = new Point(500, 400, 0);
    const r = Road.createRoad(p1, p2, 0);
    return new City([r]);
  }

  private getAllPoints(): Point[]{
    const pointSet = new Set<Point>();
    for(const road of this.roads){
      pointSet.add(road.p1);
      pointSet.add(road.p2);
    }
    return Array.from(pointSet);
  }
  private findCycles(pointCap: number, currentPoints: Point[], currentRoads: Road[]): Polygon[]{
    const result: Polygon[] = [];
    const pathPoints: Point[] = currentPoints;
    const start = currentPoints[0];
    const end = currentPoints[currentPoints.length - 1];
    if(pathPoints.length > pointCap){//no path found under within the limit
      return result;
    }
    if(currentPoints.length > 1 && start === end){
      result.push(new Polygon(currentRoads));
      return result;
    }
    for(const road of end.connectedRoads){
      if(road !== null && !currentRoads.includes(road)){
        result.push(...this.findCycles(pointCap, [...currentPoints, road.getOtherPoint(end)], [...currentRoads, road]));
      }
    }
    return result;
  }
}

export default City;