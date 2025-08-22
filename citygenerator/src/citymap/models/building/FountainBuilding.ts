import CircleBuilding from "./CircleBuilding";

class FountainBuilding extends CircleBuilding{

    outlineColor: string;

    constructor(x: number, y: number, radius: number) {
        super(x, y, radius);
        this.outlineColor = "#616161";
    }

    protected getRandomColor(): string {
        return "#006bfd";
    }

}

export default FountainBuilding;