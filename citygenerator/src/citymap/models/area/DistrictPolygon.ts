import Polygon from "./Polygon";
import MainRoad from "../road/MainRoad";
import MainPoint from "../point/MainPoint";
import SubareaPolygon from "./SubareaPolygon";
import SideRoad from "../road/SideRoad";
import Road from "../road/Road";
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
                if(road !== null){
                    if (!this.roads.includes(road) && this.getPoints().includes(road.getOtherPoint(point))) {
                        return true;
                    }
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
    }

    public buildMarketBuilding(seed: number): void {
        if(this.type !== DistrictPolygonType.Market)
            return;
        var areas = this.subAreas.subPolygons;
        if(areas !== undefined && areas.length > 0) {
            var freeAreas = areas.filter((a) => !a.isOccupied()).slice(1, areas.length);
            if(freeAreas.length <= 0)
                return;
            if(areas.length/2 > freeAreas.length && areas[0].accessory === undefined){
                areas[0].accessory = new FountainBuilding(areas[0].centroid.x, areas[0].centroid.y, areas[0].getAccessoryRadius(0.6));
            } else {
                var maxArea = freeAreas[0];
                var max = maxArea.marketBuildingHashValue(seed);
                for(let i = 1; i < freeAreas.length; i++){
                    if(freeAreas[i].marketBuildingHashValue(seed) > max){
                        max = freeAreas[i].marketBuildingHashValue(seed);
                        maxArea = freeAreas[i];
                    }
                }
                maxArea.buildBuilding(MarketBoothPBuilding.createMarketBoothPBuilding(maxArea, 0.80));
            }
        }
    }

    public blockPointBuildingsInRoads(): void {
        for(let r of this.getRoads()){
            r.blockSidePoints();
        }
    }

    public removePointBuildingsInRoads(): void { //for market only
        for(let r of this.getRoads()){
            r.removeAllBuildingsOnSidePoints();
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

    public generateRank(hasMarket: boolean): void {
        let minPointTier = Number.MAX_VALUE;
        for (const point of this.getPoints()) {
            if (point.rank !== undefined && point.rank < minPointTier) {
                minPointTier = point.rank;
            }
        }
        if (minPointTier === Number.MAX_VALUE) {
            if(!hasMarket){
                for (const point of this.getPoints()) {
                    point.setLowerRank(1);
                }
                this.rank = 0;
            } else {
                this.rank = -1;
            }
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