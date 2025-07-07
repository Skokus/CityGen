import Renderer from "./Renderer";
import Point from "../models/road/Point";

class PointRenderer implements Renderer{

    private point!: Point;
    private colors = [
        '#000000'
    ];

    public setPoint(point: Point) {
        this.point = point;
    }

    draw(ctx: CanvasRenderingContext2D, scale: number, xOffSet: number, yOffSet: number): void {
        ctx.beginPath();
        ctx.arc(scale*(this.point.x + xOffSet), scale*(this.point.y + yOffSet), scale * 2, 0, 2 * Math.PI);
        ctx.fillStyle = this.colors[this.point.distanceFromCrossroad < this.colors.length-1 ? this.point.distanceFromCrossroad : this.colors.length-1];
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }

}

export default PointRenderer;