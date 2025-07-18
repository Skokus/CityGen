import Point from "../point/Point";

class Building {

    point: Point;
    radius: number;
    color: string;
    angle: number; //in radians

    constructor(x: number, y: number, radius: number, angle: number) {
        this.point = new Point(x, y);
        this.radius = radius;
        this.color = this.getRandomColor();
        this.angle = angle;
    }

    get x(): number {
        return this.point.x;
    }
    get y(): number {
        return this.point.y;
    }
    
    protected getRandomColor(): string {
        return "#754600";
    }

}

export default Building;