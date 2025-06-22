import Road from "./road/Road";
import Point from "./road/Point";
import Polygon from "./area/Polygon";

class City {

  roads: Road[];
  popRadius = 50;
  angle = Math.PI/4;

  constructor(roads: Road[]) {
    this.roads = roads;
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
      return;
    }

    for(let road of this.roads) {
      let dist = Road.distanceFromPoint(newPoint, road.p1, road.p2);
      if(dist < this.popRadius){
        expectedPoint = road.getRandomPoint();
        const newRoad = Road.createRoad(randomPoint, expectedPoint, direction);
        this.roads.push(newRoad);
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
    const randomAngle = (Math.PI/2) * direction + (Math.random() * Math.PI/4) - Math.PI/8;
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
    if(min < 40){
      const newRoad = Road.createRoad(randomPoint, expectedPoint, direction);
      this.roads.push(newRoad);
      return;
    }

    for(let road of this.roads) {
      let dist = Road.distanceFromPoint(newPoint, road.p1, road.p2);
      if(dist < 30){
        expectedPoint = road.getRandomPoint();
        const newRoad = Road.createRoad(randomPoint, expectedPoint, direction);
        this.roads.push(newRoad);
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
    const randomAngle = (Math.PI/2) * direction + (Math.random() * Math.PI/4) - Math.PI/8;
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
    if(min < 40){
      const newRoad = Road.createRoad(randomPoint, expectedPoint, direction);
      this.roads.push(newRoad);
      return;
    }

    for(let road of this.roads) {
      let dist = Road.distanceFromPoint(newPoint, road.p1, road.p2);
      if(dist < 30){
        expectedPoint = road.getRandomPoint();
        const newRoad = Road.createRoad(randomPoint, expectedPoint, direction);
        this.roads.push(newRoad);
        return;
      }
    }

    const newRoad = Road.createRoad(randomPoint, newPoint, direction);
    this.roads.push(newRoad);
    return;
  }

  public addPolygon(distance: number): void{
    const posRoads = this.roads.filter((r) => !r.hasTwoPolygons());
    const road = posRoads[Math.floor(Math.random()*posRoads.length)];
    const pol = road.createPolygon(distance);
  }

  public static getExampleCity(): City{
    const p1 = new Point(700, 400, 0);
    const p2 = new Point(800, 400, 0);
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
}

export default City;