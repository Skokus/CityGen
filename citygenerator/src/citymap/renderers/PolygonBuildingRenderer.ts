import Renderer from "./Renderer";
import PolygonBuilding from "../models/building/polygonbuilding/PolygonBuilding";
import CastlePBuilding from "../models/building/polygonbuilding/CastlePBuilding";

class PolygonBuildingRenderer implements Renderer{

    private polygonBuilding!: PolygonBuilding;

    public setPolygonBuilding(polygonBuilding: PolygonBuilding) {
        this.polygonBuilding = polygonBuilding;
    }

    draw(ctx: CanvasRenderingContext2D, scale: number, xOffSet: number, yOffSet: number): void {
        ctx.beginPath();
        ctx.fillStyle = this.polygonBuilding.color;
        let points = this.polygonBuilding.clockWiseBorderPoints;
        ctx.lineWidth = 1;
        if(points.length <= 0)
            return;
        ctx.moveTo(scale*(points[0].x + xOffSet), scale*(points[0].y + yOffSet));
        for(let i = 1; i < points.length; i++){
            ctx.lineTo(scale*(points[i].x + xOffSet), scale*(points[i].y + yOffSet));
        }
        ctx.lineTo(scale*(points[0].x + xOffSet), scale*(points[0].y + yOffSet));
        ctx.fill();
        ctx.strokeStyle = "black";
        if(this.polygonBuilding instanceof CastlePBuilding){ //drawing walls of castle
            ctx.strokeStyle = this.polygonBuilding.towers[0].color;
            ctx.lineWidth = this.polygonBuilding.towers[0].radius * 0.7 * scale;
        }
        ctx.stroke();
        ctx.closePath();
        if(this.polygonBuilding instanceof CastlePBuilding){
            for(let tower of this.polygonBuilding.towers){
                ctx.beginPath();
                const x = scale*(tower.x + xOffSet);
                const y = scale*(tower.y + yOffSet);
                ctx.fillStyle = tower.color;
                ctx.moveTo(scale*(tower.x + xOffSet), scale*(tower.y + yOffSet));
                ctx.arc(x, y, tower.radius*scale, 0, 2 * Math.PI);
                ctx.fill();
                ctx.closePath();
            }
        }
        ctx.lineWidth = 1;
    }

}

export default PolygonBuildingRenderer;