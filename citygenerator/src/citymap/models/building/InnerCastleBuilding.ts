import SquareBuilding from "./SquareBuilding";

class InnerCastleBuilding extends SquareBuilding{

    protected getRandomColor(): string {
        return "#000000";
    }

    get height():number {
        return this.radius/Math.sqrt(2);
    }
}

export default InnerCastleBuilding;