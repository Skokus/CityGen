import Point from "./Point";
import Building from "../building/Building";
import {Md5} from "ts-md5";

class SidePoint extends Point{

    building: Building | undefined | null; //1
    radius: number;
    angle: number;

    constructor(x: number, y: number, radius: number, angle: number) {
        super(x, y);
        this.building = undefined;
        this.radius = radius;
        this.angle = angle;
    }

    public isFree(): boolean{
        return this.building === undefined;
    }

    public hasBuilding(): boolean{
        return this.building !== undefined && this.building !== null;
    }

    public buildBuilding(building: Building): void {
        this.building = building;
    }

    public getAllBuildings(): Building[]{
        if(this.building !== undefined && this.building !== null){
            return [this.building];
        }
        return [];
    }

    public hashValue(seed: number, iteration: number): number {
        const hash = Md5.hashStr(seed + "SidePoint" + this.x + ", " + this.y + iteration + " area:" + this.angle).substring(0,4);
        return parseInt(hash, 16)/65535;
    }
}

export default SidePoint;