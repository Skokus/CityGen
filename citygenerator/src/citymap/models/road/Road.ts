import Point from "./Point";

class Road {
    p1: Point;
    p2: Point;

    constructor(p1: Point, p2: Point) {
        this.p1 = p1;
        this.p2 = p2;
    }

    get length(): number{
        return Math.sqrt(Math.pow((this.p1.x - this.p2.x), 2) + Math.pow((this.p1.y - this.p2.y), 2));
    }

    public getRandomPoint(){
        if(Math.random() > 0.5)
            return this.p1;
        else
            return this.p2;
    }
}

export default Road;