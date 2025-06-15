class Point {
    x: number;
    y: number;
    roadCounter: number[];
    distanceFromCrossroad: number;

    constructor(x: number, y: number, distanceFromCrossroad?: number) {
        this.x = x;
        this.y = y;
        this.roadCounter = [0,0,0,0]; //right top left bottom
        this.distanceFromCrossroad = distanceFromCrossroad ? distanceFromCrossroad : 0;
    }

    getHashCode(): string{
        return "X" + this.x + "Y" + this.y;
    }
    getDistancedPoint(distance: number, angle: number): Point {
        return new Point(this.x + distance * Math.cos(angle), this.y + distance * Math.sin(angle));
    }

    getRandomDirection(): number{
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
    getForwardDirection(): number{
        for(var i = 0; i < this.roadCounter.length; i++){
            if(this.roadCounter[i] > 0){
                return (i+2)%this.roadCounter.length;
            }
        }
        return -1;
    }
    getSideDirection(): number{
        for(var i = 0; i < this.roadCounter.length; i++){
            if(this.roadCounter[i] === 0){
                return i;
            }
        }
        console.log("HERE");
        return -1;
    }
    getRoadCount(): number{
        let count = 0;
        for(let i = 0; i < this.roadCounter.length; i++){
            count += this.roadCounter[i];
        }
        if(isNaN(count)){
            console.log(this);
        }
        return count;
    }
}

export default Point;