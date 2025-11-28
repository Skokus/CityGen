import Renderer from "./Renderer";
import Point from "../models/point/Point";
import MainPoint from "../models/point/MainPoint";

class PointRenderer implements Renderer{

    private point!: Point;
    private colors = [
        '#000000',
        '#ff0000',
        '#d5cb00',
        '#18ff00',
        '#0013ff',
    ];

    public setPoint(point: Point) {
        this.point = point;
    }

    draw(ctx: CanvasRenderingContext2D, scale: number, xOffSet: number, yOffSet: number): void {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.arc(scale*(this.point.x + xOffSet), scale*(this.point.y + yOffSet), scale * 5, 0, 2 * Math.PI);
        ctx.fillStyle = this.colors[0];
        if(this.point instanceof MainPoint && this.point.rank !== undefined){
            ctx.fillStyle = this.colors[this.point.rank];
        }
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }

}

export default PointRenderer;