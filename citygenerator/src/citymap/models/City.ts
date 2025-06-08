import Road from "./road/Road";
import Point from "./road/Point";

class City {

  roads: Road[] = [];

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
      console.log(direction);
    }
    const randomAngle = (Math.PI/2) * direction + (Math.random() * Math.PI/3) - Math.PI/6;
    const newPoint = randomPoint.getDistancedPoint(distance, randomAngle);
    randomPoint.roadCounter[direction]++;
    newPoint.roadCounter[(direction+2)%4]++;
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