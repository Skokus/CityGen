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

    getRandomPointFromDistance(distance: number): Point{
        var x = Math.random() * distance + this.x;
        var y = -Math.sqrt(Math.pow(distance, 2) - Math.pow(this.x - x, 2)) + this.y;
        return new Point(x, y);
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
}

export default Point;