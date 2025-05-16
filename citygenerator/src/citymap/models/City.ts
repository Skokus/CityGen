import Road from "./road/Road";
import Point from "./road/Point";

class City {

  roads: Road[] = [];

  constructor(roads: Road[]) {
    this.roads = roads;
  }

  public addNewRoad(distance: number): void {
    const randomRoad = this.roads[Math.floor(Math.random()*this.roads.length)];
    const pointFromRoad = randomRoad.getRandomPoint();
    const newPoint = pointFromRoad.getRandomPointFromDistance(distance);
    this.roads.push(new Road(pointFromRoad, newPoint));
  }

  public static getExampleCity(): City{
    let city =  new City([new Road(new Point(100, 100), new Point(200, 200))]);
    city.addNewRoad(50);
    city.addNewRoad(50);
    return city;
  }

}

export default City;