class Building {

    x: number;
    y: number;
    radius: number;
    color: string;
    angle: number; //in radians

    constructor(x: number, y: number, radius: number, angle: number) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = this.getRandomColor();
        this.angle = angle;
    }

    protected getRandomColor(): string {
        return "#754600";
    }

}

export default Building;