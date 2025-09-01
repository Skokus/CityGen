import Renderer from "./Renderer";
import Point from "../models/point/Point";
import MainPoint from "../models/point/MainPoint";
import River from "../models/River";

class RiverRenderer implements Renderer{

    private river!: River;

    public setRiver(river: River) {
        this.river = river;
    }

    draw(ctx: CanvasRenderingContext2D, scale: number, xOffSet: number, yOffSet: number): void {
        if(this.river.riverRoads.length === 0)
            return;
        ctx.beginPath();
        ctx.fillStyle = "#0056ae";
        let points = this.river.getRiverPoints();
        ctx.moveTo(scale*(points[0].rightPoint.x + xOffSet), scale*(points[0].rightPoint.y + yOffSet));
        for(let i = 1; i < points.length; i++){
            ctx.lineTo(scale*(points[i].rightPoint.x + xOffSet), scale*(points[i].rightPoint.y + yOffSet));
        }
        for(let i = points.length - 1; i >= 0; i--){
            ctx.lineTo(scale*(points[i].leftPoint.x + xOffSet), scale*(points[i].leftPoint.y + yOffSet));
        }
        ctx.strokeStyle = "black";
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }

}

export default RiverRenderer;