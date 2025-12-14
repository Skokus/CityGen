import Renderer from "./Renderer";
import Road from "../models/road/Road";
import MainRoad from "../models/road/MainRoad";
import SideRoad from "../models/road/SideRoad";
import MainRoadType from "../models/road/MainRoadType";

class RoadRenderer implements Renderer{

    private road!: Road;

    public setRoad(road: Road) {
        this.road = road;
    }

    draw(ctx: CanvasRenderingContext2D, scale: number, xOffSet: number, yOffSet: number): void {
        ctx.beginPath();
        if(this.road instanceof MainRoad){
            ctx.strokeStyle = "#000000";
            ctx.lineWidth = 1;
            if(this.road.type === MainRoadType.Wall){
                ctx.strokeStyle = "#ff612d";
                ctx.lineWidth = scale*4;
            }
        } else if(this.road instanceof SideRoad){
            ctx.lineWidth = 1;
        }
        ctx.moveTo(scale*(this.road.p1.x + xOffSet), scale*(this.road.p1.y + yOffSet));
        ctx.lineTo(scale*(this.road.completionPoint.x + xOffSet), scale*(this.road.completionPoint.y + yOffSet));
        ctx.stroke();
        ctx.closePath();
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = scale;
    }
}

export default RoadRenderer;