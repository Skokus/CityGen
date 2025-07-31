import Renderer from "./Renderer";
import DistrictPolygon from "../models/area/DistrictPolygon";
import PolygonBuilding from "../models/building/polygonbuilding/PolygonBuilding";

class PolygonBuildingRenderer implements Renderer{

    private polygonBuilding!: PolygonBuilding;

    public setPolygonBuilding(polygonBuilding: PolygonBuilding) {
        this.polygonBuilding = polygonBuilding;
    }

    draw(ctx: CanvasRenderingContext2D, scale: number, xOffSet: number, yOffSet: number): void {
        ctx.beginPath();
        ctx.fillStyle = this.polygonBuilding.color;
        let points = this.polygonBuilding.clockWiseBorderPoints;
        console.log(points);
        if(points.length <= 0)
            return;
        ctx.moveTo(scale*(points[0].x + xOffSet), scale*(points[0].y + yOffSet));
        for(let i = 1; i < points.length; i++){
            ctx.lineTo(scale*(points[i].x + xOffSet), scale*(points[i].y + yOffSet));
        }
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.stroke();
        ctx.closePath();
    }

}

export default PolygonBuildingRenderer;