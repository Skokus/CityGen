import Building from "./Building";

class SquareBuilding extends Building{

    protected getRandomColor(): string {
        return "#834e00";
    }

    get height():number {
        return this.radius/Math.sqrt(2);
    }
}

export default SquareBuilding;