import Renderer from "./Renderer";
import Building from "../models/building/Building";
import SquareBuilding from "../models/building/SquareBuilding";
import building from "../models/building/Building";

class BuildingRenderer implements Renderer{

    private building!: Building;

    public setBuilding(building: Building) {
        this.building = building;
    }

    draw(ctx: CanvasRenderingContext2D, scale: number, xOffSet: number, yOffSet: number): void {
        if(this.building instanceof SquareBuilding){
            const x = scale*(this.building.x + xOffSet);
            const y = scale*(this.building.y + yOffSet);
            const h = this.building.height * scale;
            const a = this.building.angle;
            console.log(h);
            ctx.beginPath();
            ctx.moveTo(this.rotateX(h/2, h/2, a) + x, this.rotateY(h/2, h/2, a) + y);
            ctx.lineTo(this.rotateX(-h/2, h/2, a) + x, this.rotateY(-h/2, h/2, a) + y);
            ctx.lineTo(this.rotateX(-h/2, -h/2, a) + x, this.rotateY(-h/2, -h/2, a) + y);
            ctx.lineTo(this.rotateX(h/2, -h/2, a) + x, this.rotateY(h/2, -h/2, a) + y);
            ctx.lineTo(this.rotateX(h/2, h/2, a) + x, this.rotateY(h/2, h/2, a) + y);
            ctx.strokeStyle = "black";
            ctx.stroke();
            ctx.fillStyle = this.building.color;
            ctx.fill();
            ctx.closePath();
        }
    }

    private rotateX(x: number, y: number, angle: number): number{
        return x*Math.cos(angle) - y*Math.sin(angle);
    }

    private rotateY(x: number, y: number, angle: number): number{
        return x*Math.sin(angle) + y*Math.cos(angle);
    }
}

export default BuildingRenderer;