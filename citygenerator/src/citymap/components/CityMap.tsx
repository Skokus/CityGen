import {useEffect, useRef} from "react";
import City from "../models/City";
import PointRenderer from "../renderers/PointRenderer";
import RoadRenderer from "../renderers/RoadRenderer";

function CityMap({city} : {city: City}) {

    const canvasRef = useRef(null);

    useEffect(() => {
        redrawMap();
    });

    function redrawMap() {
        const canvas = canvasRef.current;
        // @ts-ignore
        const ctx = canvas.getContext('2d');
        const rr = new RoadRenderer();
        const pr = new PointRenderer();
        for (const r of city.roads){
            rr.setRoad(r);
            rr.drawArea(ctx, 1, 0, 0);
        }
        for (const r of city.roads) {
            rr.setRoad(r);
            rr.draw(ctx, 1, 0, 0);
            pr.setPoint(r.p1);
            pr.draw(ctx, 1, 0, 0);
        }
    }

    return (
        <div>
            <canvas ref={canvasRef} width={1000} height={1000}/>
        </div>
    );
}

export default CityMap;