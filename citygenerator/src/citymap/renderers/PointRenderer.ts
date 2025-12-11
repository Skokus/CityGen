import Renderer from "./Renderer";
import Point from "../models/point/Point";
import MainPoint from "../models/point/MainPoint";

class PointRenderer implements Renderer{

    private point!: Point;
    private colors = [
        '#fdf002',
        '#3aff04',
        '#ff3030',
        '#001eff',
        '#be10ef',
    ];

    public setPoint(point: Point) {
        this.point = point;
    }

    draw(ctx: CanvasRenderingContext2D, scale: number, xOffSet: number, yOffSet: number): void {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.arc(scale*(this.point.x + xOffSet), scale*(this.point.y + yOffSet), scale, 0, 2 * Math.PI);
        ctx.fillStyle = "black";
        if(this.point instanceof MainPoint && this.point.rank !== undefined){
            ctx.fillStyle = "black";
        }
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }

}

export default PointRenderer;