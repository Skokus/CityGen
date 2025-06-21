import Renderer from "./Renderer";
import Road from "../models/road/Road";
import Point from "../models/road/Point";
import Polygon from "../models/area/Polygon";
import polygon from "../models/area/Polygon";

class PolygonRenderer implements Renderer{

    private polygon!: Polygon;

    public setPolygon(polygon: Polygon) {
        this.polygon = polygon;
    }

    draw(ctx: CanvasRenderingContext2D, scale: number, xOffSet: number, yOffSet: number): void {
        if(this.polygon.roads.length === 0)
            return;
        ctx.beginPath();
        ctx.fillStyle = this.polygon.color;
        var points = this.polygon.clockWisePoints;
        ctx.moveTo(points[0].x + xOffSet, points[0].y + yOffSet);
        for(let i = 1; i < points.length; i++){
            ctx.lineTo(points[i].x + xOffSet, points[i].y + yOffSet);
        }
        ctx.fill();
        ctx.closePath();
    }

}

export default PolygonRenderer;