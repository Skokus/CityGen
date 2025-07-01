import Point from "./Point";

class SidePoint {
    x: number;
    y: number;
    hasTopBuilding: boolean; //1
    hasBottomBuilding: boolean; //-1

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.hasTopBuilding = false;
        this.hasBottomBuilding = false;
    }

    public getRandomSide(): number{
        if(!this.hasBottomBuilding && !this.hasTopBuilding){
            return Math.random() > 0.5 ? 1 : -1;
        }
        if(!this.hasTopBuilding){
            return 1;
        }
        if (!this.hasBottomBuilding) {
            return -1;
        }
        return 0;
    }

    public isFree(): boolean{
        return !this.hasBottomBuilding || !this.hasTopBuilding;
    }
    public getDistancedPoint(distance: number, angle: number): Point {
        return new Point(this.x + distance * Math.cos(angle), this.y + distance * Math.sin(angle));
    }
    public buildBuilding(side: number){
        if(side === 1){
            this.hasTopBuilding = true;
        } else if(side === -1){
            this.hasBottomBuilding = true;
        }
    }
}

export default SidePoint;