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
    pointFromRoad.increaseRoadCounter();
    newPoint.increaseRoadCounter();
  }

  public static getExampleCity(): City{
    let city =  new City([new Road(new Point(400, 400), new Point(500, 400))]);
    return city;
  }

}

export default City;