import {useEffect, useRef} from "react";
import City from "../models/City";
import PointRenderer from "../renderers/PointRenderer";
import RoadRenderer from "../renderers/RoadRenderer";
import PolygonRenderer from "../renderers/PolygonRenderer";
import BuildingRenderer from "../renderers/BuildingRenderer";
import GridCity from "../models/squaregridcity/GridCity";
import gridCity from "../models/squaregridcity/GridCity";

interface CityMapProps {
    zoomScale: number;
    xOffSet: number;
    yOffSet: number;
    city: GridCity;
}

function CityMap(props: CityMapProps) {

    const canvasRef = useRef(null);

    useEffect(() => {
        redrawMap();
    });

    function redrawMap() {
        const canvas = canvasRef.current;
        // @ts-ignore
        const context = canvas!.getContext('2d');
        // @ts-ignore
        context.clearRect(0, 0, canvas!.width, canvas!.height);
        // @ts-ignore
        const ctx = canvas.getContext('2d');

        const pr = new PointRenderer();
        const rr = new RoadRenderer();
        const polr = new PolygonRenderer();
        const br = new BuildingRenderer();

        for (const r of props.city.roads) {
            rr.setRoad(r);
            rr.draw(ctx, props.zoomScale, props.xOffSet, props.yOffSet);
            pr.setPoint(r.p1);
            pr.draw(ctx, props.zoomScale, props.xOffSet, props.yOffSet);
            pr.setPoint(r.p2);
            pr.draw(ctx, props.zoomScale, props.xOffSet, props.yOffSet);
        }
    }

    return (
        <div>
            <canvas ref={canvasRef} width={900} height={1000}/>
        </div>
    );
}

export default CityMap;