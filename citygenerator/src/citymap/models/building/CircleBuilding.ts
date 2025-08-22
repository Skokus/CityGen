import Building from "./Building";

class CircleBuilding extends Building {

    constructor(x: number, y: number, radius: number) {
        super(x, y, radius, 0);
    }

    protected getRandomColor(): string {
        return "#a86503";
    }

}

export default CircleBuilding;