import Road from "./Road";

class Point {
    x: number;
    y: number;
    roadCounter: number[];
    connectedRoads: (Road|null)[];
    distanceFromCrossroad: number;

    constructor(x: number, y: number, distanceFromCrossroad?: number) {
        this.x = x;
        this.y = y;
        this.roadCounter = [0,0,0,0]; //right top left bottom
        this.connectedRoads = [null, null, null, null];
        this.distanceFromCrossroad = distanceFromCrossroad ? distanceFromCrossroad : 0;
    }

    public getHashCode(): string{
        return "X" + this.x + "Y" + this.y;
    }
    public getDistancedPoint(distance: number, angle: number): Point {
        return new Point(this.x + distance * Math.cos(angle), this.y + distance * Math.sin(angle));
    }
    public getRandomDirection(): number{
        var possibleDirections: number[] = [];
        for(var i = 0; i < this.roadCounter.length; i++){
            if(this.roadCounter[i] <= 0){
                possibleDirections.push(i);
            }
        }
        if(possibleDirections.length > 0){
            return possibleDirections[Math.floor(Math.random()*possibleDirections.length)];
        }
        return -1;
    }
    public getForwardDirection(): number{
        for(var i = 0; i < this.roadCounter.length; i++){
            if(this.roadCounter[i] > 0){
                return (i+2)%this.roadCounter.length;
            }
        }
        return -1;
    }
    public getSideDirection(): number{
        for(var i = 0; i < this.roadCounter.length; i++){
            if(this.roadCounter[i] === 0){
                return i;
            }
        }
        return -1;
    }
    public getRoadCount(): number{
        let count = 0;
        for(let i = 0; i < this.roadCounter.length; i++){
            count += this.roadCounter[i];
        }
        return count;
    }
    public getAngle(p: Point): number{
        return Math.atan2(this.y - p.y, this.x - p.x);
    }
    public isAboveLine(a: number, b: number){
        if(this.y < (a * this.x + b))
            return true;
        this.connectedRoads[0] = new Road(new Point(1,1), new Point(2,2));
        return false;
    }
    public addRoad(road: Road, direction: number){
        this.roadCounter[direction]++;
        this.connectedRoads[direction] = road;
    }
    public getAllRoads(): Road[]{
        let ret: Road[] = [];
        for(let road of this.connectedRoads){
            if(road !== null){
                ret.push(road);
            }
        }
        return ret;
    }
    public hasRoadOnDirection(direction: number): boolean{
        return this.connectedRoads[direction] !== null;
    }
    public getRoadOnDirection(direction: number): Road | null{
        return this.connectedRoads[direction];
    }
}

export default Point;