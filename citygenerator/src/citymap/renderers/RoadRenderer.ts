import Renderer from "./Renderer";
import Road from "../models/road/Road";

class RoadRenderer implements Renderer{

    private road!: Road;

    public setRoad(road: Road) {
        this.road = road;
    }

    draw(ctx: CanvasRenderingContext2D, scale: number, xOffSet: number, yOffSet: number): void {
        ctx.beginPath();
        ctx.moveTo(scale*(this.road.p1.x + xOffSet), scale*(this.road.p1.y + yOffSet));
        ctx.lineTo(scale*(this.road.p2.x + xOffSet), scale*(this.road.p2.y + yOffSet));
        ctx.stroke();
        ctx.closePath();
    }
}

export default RoadRenderer;