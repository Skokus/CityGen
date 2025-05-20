import Renderer from "./Renderer";
import Road from "../models/road/Road";
import Point from "../models/road/Point";

class RoadRenderer implements Renderer{

    private road: Road = new Road(new Point(0,0), new Point(1,0));

    constructor() {}

    public setRoad(road: Road) {
        this.road = road;
    }

    draw(ctx: CanvasRenderingContext2D, scale: number, xOffSet: number, yOffSet: number): void {
        ctx.beginPath();
        ctx.moveTo(this.road.p1.x + xOffSet, this.road.p1.y + yOffSet);
        ctx.lineTo(this.road.p2.x + xOffSet, this.road.p2.y + yOffSet);
        ctx.stroke();
        ctx.closePath();
    }

    drawArea(ctx: CanvasRenderingContext2D, scale: number, xOffSet: number, yOffSet: number){
        const parroads = this.road.getParallelRoad(30);
        ctx.beginPath();
        ctx.fillStyle = "green";
        ctx.moveTo(parroads[0].p1.x + xOffSet, parroads[0].p1.y + yOffSet);
        ctx.lineTo(parroads[0].p2.x + xOffSet, parroads[0].p2.y + yOffSet);
        ctx.lineTo(parroads[1].p2.x + xOffSet, parroads[1].p2.y + yOffSet);
        ctx.lineTo(parroads[1].p1.x + xOffSet, parroads[1].p1.y + yOffSet);
        ctx.lineTo(parroads[0].p1.x + xOffSet, parroads[0].p1.y + yOffSet);
        ctx.fill();
        ctx.closePath();
    }
}

export default RoadRenderer;