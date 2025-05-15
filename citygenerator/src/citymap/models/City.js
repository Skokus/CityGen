import { Delaunay } from "d3";
import { useRef, useMemo, useEffect } from "react";

function City() {

  const canvasRef = useRef(null);
  var w = 1000;
  var h = 1000;
  const data = Array(100)
      .fill()
      .map((_, i) => ({ x: (i * w) / 100, y: Math.random() * h }));

  const delaunay = useMemo(() => {
    const formattedData = data.map((d) => [d.x, d.y]);
    return Delaunay.from(formattedData);
  }, [data]);

  const voronoi = useMemo(() => {
    return delaunay.voronoi([0,0,1000,1000]);
  }, [delaunay]);

  useEffect(() => {
    console.log(voronoi);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const segments = voronoi.render().split(/M/).slice(1);
    for (const cell of voronoi.cellPolygons()) {
      console.log(cell);
    }
    for (const e of segments) {
      ctx.beginPath();
      ctx.stroke(new Path2D("M" + e));
    }
  }, []);
  
  return (
    <div className="container">
      <canvas ref={canvasRef} width={1000} height={1000}/>
    </div>
  );
}

export default City;