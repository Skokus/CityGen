import Road from "./road/Road";
import Point from "./road/Point";

class City {

  roads: Road[] = [];

  constructor(roads: Road[]) {
    this.roads = roads;
  }

  public addNewRoad(distance: number): void {
    const rBuilding = this.roads[Math.floor(Math.random()*this.roads.length)];
    const pointFromRoad = new Point(rBuilding[0], rBuilding[1]);
    const newPoint = pointFromRoad.getRandomPointFromDistance(distance);
    this.roads.push(new Road(pointFromRoad, newPoint));
  }

  public static getExampleCity(){
    return new City([new Road(new Point(100, 100), new Point(200, 200))]);
  }

}

export default City;