import {useEffect, useRef} from "react";
import City from "../models/City";
import PointRenderer from "../renderers/PointRenderer";
import RoadRenderer from "../renderers/RoadRenderer";
import PolygonRenderer from "../renderers/PolygonRenderer";
import BuildingRenderer from "../renderers/BuildingRenderer";
import GridCity from "../models/squaregridcity/GridCity";
import gridCity from "../models/squaregridcity/GridCity";
import PolygonBuildingRenderer from "../renderers/PolygonBuildingRenderer";
import SubareaPolygon from "../models/area/SubareaPolygon";

interface CityMapProps {
    zoomScale: number;
    xOffSet: number;
    yOffSet: number;
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
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = "#E5E5DA";
        // @ts-ignore
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const pr = new PointRenderer();
        const rr = new RoadRenderer();
        const polr = new PolygonRenderer();
        const br = new BuildingRenderer();
        const pbr = new PolygonBuildingRenderer();

        if (props.city.polygons.length > 0) {
            for (const p of props.city.polygons) {
                polr.setPolygon(p);
                polr.draw(ctx, props.zoomScale, props.xOffSet, props.yOffSet);
                for (const c of p.subAreas) {
                    if(c.building !== undefined){
                        pbr.setPolygonBuilding(c.building);
                        pbr.draw(ctx, props.zoomScale, props.xOffSet, props.yOffSet);
                    }
                }
            }
        }
        if (props.city.lakes.length > 0) {
            for (const l of props.city.lakes) {
                polr.setPolygon(l);
                polr.draw(ctx, props.zoomScale, props.xOffSet, props.yOffSet);
            }
        }
        for (const r of props.city.roads) {
            rr.setRoad(r);
            rr.draw(ctx, props.zoomScale, props.xOffSet, props.yOffSet);
            pr.setPoint(r.p1);
            pr.draw(ctx, props.zoomScale, props.xOffSet, props.yOffSet);
            pr.setPoint(r.p2);
            pr.draw(ctx, props.zoomScale, props.xOffSet, props.yOffSet);
        }
        for (const b of props.city.getAllBuildings()) {
            br.setBuilding(b);
            br.draw(ctx, props.zoomScale, props.xOffSet, props.yOffSet);
        }
    }

    return (
        <div>
            <canvas ref={canvasRef} width={900} height={1000}/>
        </div>
    );
}

export default CityMap;