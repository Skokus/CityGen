import Road from "../road/Road";
import GridClassCalculator from "./GridHashCalculator";
import MainPoint from "../point/MainPoint";
import MainRoad from "../road/MainRoad";

class GridCity {
    seed: number;
    gridSize: number;
    points: MainPoint[][] = [];
    roads: MainRoad[] = [];
    vc = 1; //vertical cutoff
    hc = 0.65; //horizontal cutoff
    s = 0.2; //offset

    constructor(gridSize: number, seed: number) {
        this.gridSize = gridSize;
        this.seed = seed;
    }

    public static initiateCity(gridSize: number, roadLength: number, seed: number): GridCity {
        let newGridCity = new GridCity(gridSize, seed);
        for(let i = 0; i < gridSize; i++) {
            newGridCity.points[i] = [];
            for(let j = 0; j < gridSize; j++) {
                const angle = GridClassCalculator.getAngleHash(i, j, seed) * Math.PI/2;
                const offset = GridClassCalculator.getOffsetHash(i, j, seed);
                newGridCity.points[i][j] = new MainPoint((i + Math.cos(angle) * offset*newGridCity.s) * roadLength, (j + Math.sin(angle) * offset*newGridCity.s) * roadLength);
            }
        }
        for(let i = 0; i < gridSize; i++) {
            for(let j = 0; j < gridSize; j++) {
                const p1 = newGridCity.points[i][j];
                if(newGridCity.points[i+1] !== undefined) {
                    const p2 = newGridCity.points[i+1][j];
                    if(GridClassCalculator.getNodeConnectionTest(i, j, i+1, j, seed) < newGridCity.vc){
                        newGridCity.roads.push(new MainRoad(p1, p2));
                    }
                }
                if(newGridCity.points[j+1] !== undefined) {
                    const p2 = newGridCity.points[i][j+1];
                    if(GridClassCalculator.getNodeConnectionTest(i, j, i, j+1, seed) < newGridCity.hc){
                        newGridCity.roads.push(new MainRoad(p1, p2));
                    }
                }
            }
        }
        return newGridCity;
    }
}

export default GridCity;