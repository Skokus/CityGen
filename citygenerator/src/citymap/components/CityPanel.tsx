import {useEffect, useState} from "react";
import City from "../models/City";
import CityMap from "./CityMap";
import "./CityPanel.css"

function CityPanel() {

    const [maxRoadLength, setMaxRoadLength] = useState(100);
    const [minRoadLength, setMinRoadLength] = useState(90);
    const [maxBuildingSize, setMaxBuildingSize] = useState(10);
    const [minBuildingSize, setMinBuildingSize] = useState(7);
    const [maxBuildingDistanceFromRoad, setMaxBuildingDistanceFromRoad] = useState(10);
    const [minBuildingDistanceFromRoad, setMinBuildingDistanceFromRoad] = useState(10);
    const [seed, setSeed] = useState(0);

    const [city, setCity] = useState(City.getExampleCity());
    const [counter, setCounter] = useState(0);
    const [zoomScale, setZoomScale] = useState(1.4);
    const [xOffset, setXOffset] = useState(10);
    const [yOffset, setYOffset] = useState(10);
    const [ticking, setTicking] = useState(false);
    const [timePeriod, setTimePeriod] = useState(1000);

    useEffect(() => {
        const timer = setTimeout(() => ticking && addNewRoad(), timePeriod)
        return () => clearTimeout(timer)
    }, [counter, ticking]);

    function addNewRoad() {
        city.addNewRoad(getRandomMainRoadDistance());
        setCity(city);
        setCounter(counter + 1);
    }

    function addForwardRoad() {
        city.addExtentionRoad(getRandomMainRoadDistance());
        setCity(city);
        setCounter(counter + 1);
    }

    function addCrossroadRoad() {
        city.addSideRoad(getRandomMainRoadDistance());
        setCity(city);
        setCounter(counter + 1);
    }

    function addBuilding() {
        city.addBuilding(getRandomBuildingDistance(), getRandomBuildingSize());
        setCity(city);
        setCounter(counter + 1);
    }

    function splitPolygon() {
        city.splitRandomPolygon();
        setCity(city);
        setCounter(counter + 1);
    }

    function splitPolygonWithSmallerPolygon() {
        city.splitRandomPolygonWithSmallerPolygon(0.8);
        setCity(city);
        setCounter(counter + 1);
    }

    function addRoadCompletion(){
        city.addRoadCompletionScalar(0.2);
        setCity(city);
        setCounter(counter + 1);
    }

    function getRandomMainRoadDistance() {
        return Math.random() * (maxRoadLength - minRoadLength) + minRoadLength;
    }

    function getRandomBuildingSize() {
        return Math.random() * (maxBuildingSize - minBuildingSize) + minBuildingSize;
    }

    function getRandomBuildingDistance() {
        return Math.random() * (maxBuildingDistanceFromRoad - minBuildingDistanceFromRoad) + minBuildingDistanceFromRoad;
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
                    addNewRoad()
                }}>Add random road
                </button>
                <button onClick={() => {
                    addForwardRoad()
                }}>Extend road
                </button>
                <button onClick={() => {
                    addCrossroadRoad()
                }}>Side road
                </button>
                <br/>
                <button onClick={() => {
                    addBuilding()
                }}>Add building
                </button>
                <button onClick={() => {
                    splitPolygon()
                }}>Split
                </button>
                <button onClick={() => {
                    splitPolygonWithSmallerPolygon()
                }}>Split with marketplace
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
                    moveX(-10 * zoomScale)
                }}>Move right
                </button>
                <button onClick={() => {
                    moveX(10 * zoomScale)
                }}>Move left
                </button>
                <button onClick={() => {
                    moveY(10 * zoomScale)
                }}>Move up
                </button>
                <button onClick={() => {
                    moveY(-10 * zoomScale)
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
                <input className="input" id={"maxPrimitiveBuildingSize"} name="maxPrimitiveBuildingSizeInput" type="number" defaultValue={maxBuildingSize} onChange={e => {
                    setMaxBuildingSize(e.target.valueAsNumber)
                }}/>
                <br/>
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
            </div>
        </div>
    );
}

export default CityPanel;