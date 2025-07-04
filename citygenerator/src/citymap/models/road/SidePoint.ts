import Point from "./Point";

class SidePoint {
    x: number;
    y: number;
    hasTopBuilding: boolean; //1
    hasBottomBuilding: boolean; //-1
    width: number; //maximum radius of the building

    constructor(x: number, y: number, width: number) {
        this.x = x;
        this.y = y;
        this.hasTopBuilding = false;
        this.hasBottomBuilding = false;
        this.width = width;
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
    public getOffsetDistancedPoint(distance: number, angle: number, radius: number): Point {
        const maxOffSet = (this.width - radius)/2;
        const side = Math.random() > 0.5 ? 1 : -1; //choosing the direction in which the offset will go
        const offset = side * Math.random() * maxOffSet;
        const newX = this.x + distance * Math.cos(angle) + offset * Math.cos(angle + Math.PI/2 * side);
        const newY = this.y + distance * Math.sin(angle) + offset * Math.sin(angle + Math.PI/2 * side);
        return new Point(newX, newY);
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