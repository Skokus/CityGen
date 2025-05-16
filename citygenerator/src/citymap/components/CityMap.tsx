import {useEffect, useRef} from "react";
import City from "../models/City";

function CityMap({city} : {city: City} ) {

    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        for (const r of city.roads) {
            ctx.beginPath();
            ctx.moveTo(r.p1.x, r.p1.y);
            ctx.lineTo(r.p2.x, r.p2.y);
            ctx.stroke();
            ctx.closePath();
        }
    }, []);

    return (
        <div>
            <canvas ref={canvasRef} width={1000} height={1000}/>
        </div>
    );
}

export default CityMap;