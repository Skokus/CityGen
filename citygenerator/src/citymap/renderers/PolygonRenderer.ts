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
        ctx.lineWidth = 1;
        let points = this.polygon.getClockWiseBorderPoints();
        ctx.moveTo(scale*(points[0].x + xOffSet), scale*(points[0].y + yOffSet));
        for(let i = 1; i < points.length; i++){
            ctx.lineTo(scale*(points[i].x + xOffSet), scale*(points[i].y + yOffSet));
        }
        ctx.strokeStyle = "black";
        if(this.polygon instanceof DistrictPolygon || this.polygon instanceof LakePolygon)
            ctx.fill();
        ctx.closePath();
    }

    private getPolygonColor(): string {
        if(this.polygon instanceof DistrictPolygon){
            return this.getDistrictPolygon();
        } else if(this.polygon instanceof LakePolygon){
            return "#0056ae";
        }
        return "#ffffff";
    }

    private getDistrictPolygon(): string {
        if(this.polygon instanceof DistrictPolygon){
            if(this.polygon.type === DistrictPolygonType.Market)
                return "#bcbcbc"
                //return "#9c9c9c";
            else if(this.polygon.type === DistrictPolygonType.Farm)
                return "#ffe863";
            else if(this.polygon.type === DistrictPolygonType.Rural)
                return "#b6b6b6";
        }
        return "#ffffff";
    }
}

export default PolygonRenderer;