import {useEffect, useRef} from "react";
import City from "../models/City";
import PointRenderer from "../renderers/PointRenderer";
import RoadRenderer from "../renderers/RoadRenderer";
import PolygonRenderer from "../renderers/PolygonRenderer";
import BuildingRenderer from "../renderers/BuildingRenderer";

interface CityMapProps {
    zoomScale: number;
    city: City;
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
        const rr = new RoadRenderer();
        const pr = new PointRenderer();
        const br = new BuildingRenderer();
        const polr = new PolygonRenderer();
        if(props.city.polygons.length > 0){
            for (const p of props.city.polygons){
                polr.setPolygon(p);
                polr.draw(ctx, props.zoomScale, 0, 0);
            }
        }
        for (const r of props.city.roads) {
            rr.setRoad(r);
            rr.draw(ctx, props.zoomScale, 0, 0);
            pr.setPoint(r.p1);
            pr.draw(ctx, props.zoomScale, 0, 0);
            pr.setPoint(r.p2);
            pr.draw(ctx, props.zoomScale, 0, 0);
        }
        for(const b of props.city.getAllBuildings()){
            br.setBuilding(b);
            br.draw(ctx, props.zoomScale, 0, 0);
        }
    }

    return (
        <div>
            <canvas ref={canvasRef} width={900} height={1000}/>
        </div>
    );
}

export default CityMap;