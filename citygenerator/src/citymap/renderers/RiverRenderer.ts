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
        let points = this.river.getRiverPoints();
        ctx.moveTo(scale*(points[0].x + xOffSet), scale*(points[0].y + yOffSet));
        for(let i = 1; i < points.length; i++){
            ctx.lineTo(scale*(points[i].x + xOffSet), scale*(points[i].y + yOffSet));
        }
        ctx.lineWidth = scale * 3;
        ctx.strokeStyle = "#0056ae";
        ctx.stroke();
        ctx.closePath();
    }

}

export default RiverRenderer;