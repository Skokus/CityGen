import Renderer from "./Renderer";
import Polygon from "../models/area/Polygon";
import DistrictPolygon from "../models/area/DistrictPolygon";
import DistrictPolygonType from "../models/area/DistrictPolygonType";
import LakePolygon from "../models/area/LakePolygon";

class PolygonRenderer implements Renderer{

    private polygon!: Polygon;
    private colors = [
        '#fdf002',
        '#3aff04',
        '#ff3030',
        '#001eff',
        '#be10ef',
    ];

    public setPolygon(polygon: Polygon) {
        this.polygon = polygon;
    }

    draw(ctx: CanvasRenderingContext2D, scale: number, xOffSet: number, yOffSet: number): void {
        if(this.polygon.roads.length === 0)
            return;
        ctx.beginPath();
        ctx.fillStyle = this.getPolygonColor();
        let points = this.polygon.getClockWiseBorderPoints();
        ctx.moveTo(scale*(points[0].x + xOffSet), scale*(points[0].y + yOffSet));
        for(let i = 1; i < points.length; i++){
            ctx.lineTo(scale*(points[i].x + xOffSet), scale*(points[i].y + yOffSet));
        }
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.stroke();
        ctx.closePath();
    }

    private getPolygonColor(): string {
        if(this.polygon instanceof DistrictPolygon){
            switch(this.polygon.type){
                case DistrictPolygonType.Farm:
                    return "#ffe87b";
                case DistrictPolygonType.Market:
                    return "#9f9f9f";
            }
        } else if(this.polygon instanceof LakePolygon){
            return "#00b8ff";
        }
        return "#ffffff";
    }
}

export default PolygonRenderer;