import Point from "./Point";
import Building from "../building/Building";

class SidePoint extends Point{

    topBuilding: Building | undefined; //1
    bottomBuilding: Building | undefined; //-1
    width: number; //maximum radius of the building

    constructor(x: number, y: number, width: number) {
        super(x, y);
        this.topBuilding = undefined;
        this.bottomBuilding = undefined;
        this.width = width;
    }

    public getRandomSide(): number{
        if(this.bottomBuilding !== undefined && this.topBuilding !== undefined){
            return Math.random() > 0.5 ? 1 : -1;
        }
        if(!this.topBuilding){
            return 1;
        }
        if (!this.bottomBuilding) {
            return -1;
        }
        return 0;
    }

    public isFree(): boolean{
        return this.bottomBuilding !== undefined || this.topBuilding !== undefined;
    }

    public getOffsetDistancedPoint(distance: number, angle: number, radius: number): Point {
        const maxOffSet = (this.width - radius)/2;
        const side = Math.random() > 0.5 ? 1 : -1; //choosing the direction in which the offset will go
        const offset = side * Math.random() * maxOffSet;
        const newX = this.x + distance * Math.cos(angle) + offset * Math.cos(angle + Math.PI/2 * side);
        const newY = this.y + distance * Math.sin(angle) + offset * Math.sin(angle + Math.PI/2 * side);
        return new Point(newX, newY);
    }

    public buildBuilding(side: number, building: Building): void {
        if(side === 1){
            this.topBuilding = building;
        } else if(side === -1){
            this.bottomBuilding = building;
        }
    }
}

export default SidePoint;