import Road from "./road/Road";
import Point from "./road/Point";

class City {

  roads: Road[] = [];

  constructor(roads: Road[]) {
    this.roads = roads;
  }

  public addNewRoad(distance: number): void {
    const direction = Math.floor(Math.random() * 4);
    const points = this.getAllPoints();
    const randomAngle = (Math.PI/2) * direction;
    const randomPoint = points[Math.floor(Math.random() * points.length)];
    const newPoint = randomPoint.getDistancedPoint(distance, randomAngle);
    this.roads.push(new Road(randomPoint, newPoint));
  }

  public static getExampleCity(): City{
    let city =  new City([new Road(new Point(400, 400), new Point(500, 400))]);
    return city;
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