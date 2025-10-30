import Polygon from "./Polygon";
import MainRoad from "../road/MainRoad";
import MainPoint from "../point/MainPoint";
import SubareaPolygon from "./SubareaPolygon";
import SideRoad from "../road/SideRoad";
import Road from "../road/Road";
import HousingPBuilding from "../building/polygonbuilding/HousingPBuilding";
import DistrictPolygonType from "./DistrictPolygonType";
import MarketBoothPBuilding from "../building/polygonbuilding/MarketBoothPBuilding";
import ChurchPBuilding from "../building/polygonbuilding/ChurchPBuilding";
import FountainBuilding from "../building/FountainBuilding";
import CastlePBuilding from "../building/polygonbuilding/CastlePBuilding";

class DistrictPolygon extends Polygon {

    subAreas: SubareaPolygon[];
    rank: number;
    type: DistrictPolygonType;

    constructor(roads: MainRoad[]) {
        super(roads);
        this.subAreas = [this.createInitialSubArea(roads)];
        this.rank = 0;
        this.type = DistrictPolygonType.Farm;
    }

    public getClockWiseBorderPoints(): MainPoint[] {
        return super.getClockWiseBorderPoints() as MainPoint[];
    }

    public getPoints(): MainPoint[] {
        return super.getPoints() as MainPoint[];
    }

    public getRoads(): MainRoad[] {
        return this.roads as MainRoad[];
    }

    public hasSmallerCycle(): boolean {
        if (this.roads.length <= 3) {
            return false;
        }
        for (let point of this.getPoints()) {
            for (let road of point.getAllRoads()) {
                if (!this.roads.includes(road) && this.getPoints().includes(road.getOtherPoint(point))) {
                    return true;
                }
            }
        }
        return false;
    }

    public splitPolygonByLongestRoad(): Polygon[] {
        this.subAreas.push(...this.subAreas[0].splitPolygonByLongestRoad());
        this.subAreas.shift();
        return [this];
    }

    public splitPolygonWithSmallerPolygon(ratio: number): Polygon[] {
        this.subAreas.push(...this.subAreas[0].splitPolygonWithSmallerPolygon(ratio));
        this.subAreas.shift();
        return [this];
    }

    public splitPolygonMultipleTimesWithSize(maxsize: number): void {
        let newPolygons: SubareaPolygon[] = [];
        let l = newPolygons.length;
        while(true) {
            newPolygons = [];
            for (let a of this.subAreas) {
                if (a.getArea() > maxsize)
                    newPolygons.push(...a.splitPolygonByLongestRoad());
                else newPolygons.push(a);
            }
            this.subAreas = newPolygons;
            if (newPolygons.length === l)
                break;
            l = newPolygons.length;
        }
    }

    public splitPolygonBySmallerPolygon(ratio: number): void {
        let newPolygons: SubareaPolygon[] = [];
        for (let a of this.subAreas) {
            newPolygons.push(...a.splitPolygonWithSmallerPolygon(ratio));
        }
        this.subAreas = newPolygons;
        const c = this.subAreas[0];
        this.subAreas[0].accessory = new FountainBuilding(c.centroid.x, c.centroid.y, c.getAccessoryRadius(0.6));
        for(let i = 1; i < newPolygons.length; i++) {
            this.subAreas[i].building = MarketBoothPBuilding.createMarketBoothPBuilding(this.subAreas[i], 0.80);
        }
    }

    public splitPolygonUnevenly(n: number): void {
        let newPolygons: SubareaPolygon[] = [];
        for (let a of this.subAreas) {
            newPolygons.push(...a.splitPolygonByLongestRoad());
        }
        this.subAreas = [newPolygons[0]];
        this.subAreas[0].building = ChurchPBuilding.createChurchPBuilding(this.subAreas[0], 0.90);
        newPolygons.shift();
        for (let i = 1; i < n; i++) {
            let temp = [];
            for (let i = 0; i < newPolygons.length; i++) {
                temp.push(...newPolygons[i].splitPolygonByLongestRoad());
            }
            newPolygons = temp;
        }
        this.subAreas.push(...newPolygons);
        for(let i = 1; i < this.subAreas.length; i++) {
            this.subAreas[i].building = HousingPBuilding.createHousingPBuilding(this.subAreas[i], 0.90);
        }
    }

    public createCastle(ratio: number): void {
        this.subAreas[0].building = CastlePBuilding.createCastlePBuilding(this.subAreas[0], ratio);
    }

    protected createInitialSubArea(roads: Road[]): SubareaPolygon {
        let subRoads = [];
        for (let road of roads) {
            subRoads.push(new SideRoad(road.p1, road.p2, road as MainRoad));
        }
        return new SubareaPolygon(subRoads);
    }

    public generateRank(): void {
        let minPointTier = Number.MAX_VALUE;
        for (const point of this.getPoints()) {
            if (point.rank !== undefined && point.rank < minPointTier) {
                minPointTier = point.rank;
            }
        }
        if (minPointTier === Number.MAX_VALUE) {
            for (const point of this.getPoints()) {
                point.setLowerRank(2);
            }
            this.rank = 1;
        } else {
            for (const point of this.getPoints()) {
                point.setLowerRank(minPointTier + 1);
            }
            this.rank = minPointTier;
        }
    }

    public addRankToRoads(): void {
        for(let road of this.getRoads()) {
            road.addRankOfPolygon(this.rank);
        }
    }

    public occupiedPercentage(): number{
        var totalArea = 0;
        var occupiedArea = 0;
        for (const area of this.subAreas) {
            if(area.isOccupied()){
                occupiedArea += area.getArea();
            }
            totalArea += area.getArea();
        }
        return occupiedArea/totalArea;
    }

}

export default DistrictPolygon;