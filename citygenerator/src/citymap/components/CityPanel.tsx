import {useEffect, useState} from "react";
import City from "../models/City";
import CityMap from "./CityMap";
import "./CityPanel.css"

function CityPanel() {

    const [maxRoadLength, setMaxRoadLength] = useState(100);
    const [minRoadLength, setMinRoadLength] = useState(90);
    const [pointBuildingRadius, setPointBuildingRadius] = useState(10);
    const [minBuildingSize, setMinBuildingSize] = useState(7);
    const [maxBuildingDistanceFromRoad, setMaxBuildingDistanceFromRoad] = useState(10);
    const [minBuildingDistanceFromRoad, setMinBuildingDistanceFromRoad] = useState(10);
    const [seed, setSeed] = useState(0);
    const [riverStartAngle, setRiverStartAngle] = useState(Math.PI/2);
    const [x1, setX1] = useState(500);
    const [y1, setY1] = useState(500);
    const [x2, setX2] = useState(600);
    const [y2, setY2] = useState(510);

    const [city, setCity] = useState(City.getExampleCity(x1, y1, x2, y2, seed, pointBuildingRadius, minRoadLength, maxRoadLength));
    const [counter, setCounter] = useState(0);
    const [zoomScale, setZoomScale] = useState(1.4);
    const [xOffset, setXOffset] = useState(10);
    const [yOffset, setYOffset] = useState(10);
    const [moveDistance, setMoveDistance] = useState(30);
    const [ticking, setTicking] = useState(false);
    const [timePeriod, setTimePeriod] = useState(1000);

    useEffect(() => {
        const timer = setTimeout(() => ticking, timePeriod)
        return () => clearTimeout(timer)
    }, [counter, ticking]);

    function restartCity(){
        const newcity = City.getExampleCity(x1, y1, x2, y2, seed, pointBuildingRadius, minRoadLength, maxRoadLength);
        setCity(newcity);
        setCounter(counter + 1);
    }

    function addRoad() {
        for(let i = 0; i < 50; i++)
            city.addRoad(minRoadLength, maxRoadLength);
        setCity(city);
        setCounter(counter + 1);
    }

    function addBuilding() {
        city.addBuilding();
        setCity(city);
        setCounter(counter + 1);
    }

    function splitPolygon() {
        city.splitRandomPolygon();
        setCity(city);
        setCounter(counter + 1);
    }

    function splitPolygonWithSmallerPolygon() {
        city.splitRandomPolygonWithSmallerPolygon(0.7);
        setCity(city);
        setCounter(counter + 1);
    }

    function createCastle() {
        city.createCastle(0.8);
        setCity(city);
        setCounter(counter + 1);
    }

    function addHousingPBuilding(){
        for(let i = 0; i < 10; i++)
            city.addHousingPBuilding();
        setCity(city);
        setCounter(counter + 1);
    }

    function addChurchPBuilding(){
        city.addChurchPBuilding();
        setCity(city);
        setCounter(counter + 1);
    }

    function addRoadCompletion(){
        city.addRoadCompletionScalar(0.2);
        setCity(city);
        setCounter(counter + 1);
    }

    function checkDistricts(){
        city.checkDistrictsForSideRoadUpdate();
        setCity(city);
        setCounter(counter + 1);
    }

    function zoomInMap() {
        setZoomScale(zoomScale + 0.2);
    }

    function zoomOutMap() {
        setZoomScale(zoomScale - 0.2);
    }

    function moveX(d: number) {
        setXOffset(xOffset + d);
    }

    function moveY(d: number) {
        setYOffset(yOffset + d);
    }

    return (
        <div className="container">
            <div className="mainpanel">
                <CityMap zoomScale={zoomScale} city={city} xOffSet={xOffset} yOffSet={yOffset}/>
            </div>
            <div className="sidepanel">
                <button onClick={() => {
                    addRoad()
                }}>Add road
                </button>
                <br/>
                <button onClick={() => {
                    addBuilding()
                }}>Add building
                </button>
                <button onClick={() => {
                    addHousingPBuilding()
                }}>Add house
                </button>
                <button onClick={() => {
                    addChurchPBuilding()
                }}>Add church
                </button>
                <button onClick={() => {
                    splitPolygon()
                }}>Split
                </button>
                <button onClick={() => {
                    splitPolygonWithSmallerPolygon()
                }}>Split with marketplace
                </button>
                <button onClick={() => {
                    createCastle()
                }}>Create Castle
                </button>
                <button onClick={() => {
                    checkDistricts()
                }}>Check districts
                </button>
                <br/>
                <button onClick={() => {
                    zoomInMap()
                }}>+
                </button>
                <button onClick={() => {
                    zoomOutMap()
                }}>-
                </button>
                <button onClick={() => {
                    moveX(-moveDistance * zoomScale)
                }}>Move right
                </button>
                <button onClick={() => {
                    moveX(moveDistance * zoomScale)
                }}>Move left
                </button>
                <button onClick={() => {
                    moveY(moveDistance * zoomScale)
                }}>Move up
                </button>
                <button onClick={() => {
                    moveY(-moveDistance * zoomScale)
                }}>Move down
                </button>
                <input id={"timePeriod"} name="timePeriod" type="number" defaultValue={timePeriod} onChange={e => {
                    setTimePeriod(e.target.valueAsNumber)
                }}/>
                <button onClick={() => {
                    setTicking(!ticking)
                }}>Ticking
                </button>
                <button onClick={() => {
                    addRoadCompletion()
                }}>Add road completion
                </button>
                <br/>
                <label className="inputLabel">
                    Seed:
                </label>
                <input className="input" id={"seed"} name="seedInput" type="number" defaultValue={seed} onChange={e => {
                    setSeed(e.target.valueAsNumber)
                }}/>
                <br/>
                <label className="inputLabel">
                    Maximum main road length:
                </label>
                <input className="input" id={"maxRoadLength"} name="maxRoadLengthInput" type="number" defaultValue={maxRoadLength} onChange={e => {
                    setMaxRoadLength(e.target.valueAsNumber)
                }}/>
                <br/>
                <label className="inputLabel">
                    Maximum main road length:
                </label>
                <input className="input" id={"minRoadLength"} name="minRoadLengthInput" type="number" defaultValue={minRoadLength} onChange={e => {
                    setMinRoadLength(e.target.valueAsNumber)
                }}/>
                <br/>
                <label className="inputLabel">
                    Maximum primitive building size:
                </label>
                <label className="inputLabel">
                    Minimum primitive building size:
                </label>
                <input className="input" id={"minPrimitiveBuildingSize"} name="minPrimitiveBuildingSizeInput" type="number" defaultValue={minBuildingSize} onChange={e => {
                    setMinBuildingSize(e.target.valueAsNumber)
                }}/>
                <br/>
                <label className="inputLabel">
                    Maximum building distance from road:
                </label>
                <input className="input" id={"maxBuildingDistanceFromRoad"} name="maxBuildingDistanceFromRoadInput" type="number" defaultValue={maxBuildingDistanceFromRoad} onChange={e => {
                    setMaxBuildingDistanceFromRoad(e.target.valueAsNumber)
                }}/>
                <label className="inputLabel">
                    Minimum building distance from road:
                </label>
                <input className="input" id={"minBuildingDistanceFromRoad"} name="minBuildingDistanceFromRoadInput" type="number" defaultValue={minBuildingDistanceFromRoad} onChange={e => {
                    setMinBuildingDistanceFromRoad(e.target.valueAsNumber)
                }}/>
                <br/>
                <label className="inputLabel">
                    X of first point of starting road:
                </label>
                <input className="input" id={"x1"} name="x1" type="number" defaultValue={x1} onChange={e => {
                    setX1(e.target.valueAsNumber)
                }}/>
                <br/>
                <label className="inputLabel">
                    Y of first point of starting road:
                </label>
                <input className="input" id={"y1"} name="y1" type="number" defaultValue={y1} onChange={e => {
                    setY1(e.target.valueAsNumber)
                }}/>
                <br/>
                <label className="inputLabel">
                    X of second point of starting road:
                </label>
                <input className="input" id={"x2"} name="x2" type="number" defaultValue={x2} onChange={e => {
                    setX2(e.target.valueAsNumber)
                }}/>
                <br/>
                <label className="inputLabel">
                    Y of second point of starting road:
                </label>
                <input className="input" id={"y2"} name="y2" type="number" defaultValue={y2} onChange={e => {
                    setY2(e.target.valueAsNumber)
                }}/>
                <button onClick={() => {
                    restartCity();
                }}>Restart city
                </button>
            </div>
        </div>
    );
}

export default CityPanel;