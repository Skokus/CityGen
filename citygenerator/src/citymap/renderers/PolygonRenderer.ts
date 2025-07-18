import Renderer from "./Renderer";
import Polygon from "../models/area/Polygon";

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
        let points = this.polygon.getClockWiseBorderPoints();
        ctx.moveTo(scale*(points[0].x + xOffSet), scale*(points[0].y + yOffSet));
        for(let i = 1; i < points.length; i++){
            ctx.lineTo(scale*(points[i].x + xOffSet), scale*(points[i].y + yOffSet));
        }
        ctx.fill();
        ctx.closePath();
    }

}

export default PolygonRenderer;