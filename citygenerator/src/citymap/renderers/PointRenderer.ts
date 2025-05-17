import Renderer from "./Renderer";
import Point from "../models/road/Point";

class PointRenderer implements Renderer{

    private point: Point = new Point(0, 0);

    constructor() {}

    public setPoint(point: Point) {
        this.point = point;
    }

    draw(ctx: CanvasRenderingContext2D, scale: number, xOffSet: number, yOffSet: number): void {
        ctx.beginPath();
        ctx.arc(this.point.x + xOffSet, this.point.y + yOffSet, scale * 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }

}

export default PointRenderer;