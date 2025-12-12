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

    subAreas: SubareaPolygon;
    rank: number;
    type: DistrictPolygonType;
    isSplited: boolean = false;
    houseSubPolygonsArray: SubareaPolygon[] = [];

    constructor(roads: MainRoad[]) {
        super(roads);
        this.subAreas = this.createInitialSubArea(roads);
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

    public splitPolygonMultipleTimesWithSize(seed: number, maxsize: number): void {
        this.subAreas.splitAboveSize(seed, maxsize);
        this.houseSubPolygonsArray = this.subAreas.getAllPolygons();
    }

    public splitPolygonBySmallerPolygon(ratio: number): void {
        this.subAreas.splitPolygonWithSmallerPolygon(ratio);
        if(this.subAreas.subPolygons !== undefined) {
            const c = this.subAreas.subPolygons[0];
            this.subAreas.subPolygons[0].accessory = new FountainBuilding(c.centroid.x, c.centroid.y, c.getAccessoryRadius(0.6));
            for(let i = 1; i < this.subAreas.subPolygons.length; i++) {
                this.subAreas.subPolygons[i].buildBuilding(MarketBoothPBuilding.createMarketBoothPBuilding(this.subAreas.subPolygons[i], 0.80));
            }
        }
    }

    public createCastle(ratio: number): void {
        this.subAreas.buildBuilding(CastlePBuilding.createCastlePBuilding(this.subAreas, ratio));
    }

    protected createInitialSubArea(roads: Road[]): SubareaPolygon {
        let subRoads = [];
        for (let road of roads) {
            subRoads.push(new SideRoad(road.p1, road.p2, road as MainRoad, true, undefined));
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
                point.setLowerRank(1);
            }
            this.rank = 0;
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
        if(this.type === DistrictPolygonType.Rural){
            return this.subAreas.getOccupationRate();
        } else if(this.type === DistrictPolygonType.Farm){
            return this.subAreas.getOccupationRateNearBuiltRoads();
        }
        return 1;
    }

    public getHousingPolygons(): SubareaPolygon[] {
        return this.houseSubPolygonsArray;
    }

    public checkForNewSideRoads(): void {
        this.subAreas.buildNewSideRoads();
    }

    public getAllBuiltPolygons(): SubareaPolygon[] {
        return this.subAreas.getAllBuiltPolygons();
    }

    public getAllSubareasWithChurch(minsize: number): SubareaPolygon[] {
        return this.subAreas.getPolygonsAboveSize(minsize).filter((p) => p.building instanceof ChurchPBuilding);
    }

}

export default DistrictPolygon;