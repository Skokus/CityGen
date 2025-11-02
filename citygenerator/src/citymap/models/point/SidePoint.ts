import Point from "./Point";
import Building from "../building/Building";

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
        return this.building === undefined
    }

    public getOffsetDistancedPoint(width: number, distance: number, angle: number, radius: number): Point {
        const maxOffSet = (width - radius)/2;
        const side = Math.random() > 0.5 ? 1 : -1; //choosing the direction in which the offset will go
        const offset = side * Math.random() * maxOffSet;
        const newX = this.x + distance * Math.cos(angle) + offset * Math.cos(angle + Math.PI/2 * side);
        const newY = this.y + distance * Math.sin(angle) + offset * Math.sin(angle + Math.PI/2 * side);
        return new Point(newX, newY);
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

}

export default SidePoint;