import {useEffect, useRef, useState} from "react";
import City from "../models/City";
import PointRenderer from "../renderers/PointRenderer";
import Point from "../models/road/Point";
import RoadRenderer from "../renderers/RoadRenderer";
import CityMap from "./CityMap";

function CityPanel() {

    const maxRoadLength = 100;
    const minRoadLength = 80;
    const maxBuildingSize = 10;
    const minBuildingSize = 7;
    const maxBuildingDistanceFromRoad = 10;
    const minBuildingDistanceFromRoad = 10;

    const [city, setCity] = useState(City.getExampleCity());
    const [counter, setCounter] = useState(0);
    const [zoomScale, setZoomScale] = useState(1.0);
    const [xOffset, setXOffset] = useState(0);
    const [yOffset, setYOffset] = useState(0);
    useEffect(() => {

    });

    function addNewRoad(){
        city.addNewRoad(getRandomMainRoadDistance());
        setCity(city);
        setCounter(counter + 1);
    }

    function addForwardRoad(){
        city.addExtentionRoad(getRandomMainRoadDistance());
        setCity(city);
        setCounter(counter + 1);
    }

    function addCrossroadRoad(){
        city.addSideRoad(getRandomMainRoadDistance());
        setCity(city);
        setCounter(counter + 1);
    }

    function addBuilding(){
        city.addBuilding(getRandomBuildingDistance(), getRandomBuildingSize());
        setCity(city);
        setCounter(counter + 1);
    }

    function getRandomMainRoadDistance(){
        return Math.random() * (maxRoadLength - minRoadLength) + minRoadLength;
    }
    function getRandomBuildingSize(){
        return Math.random() * (maxBuildingSize - minBuildingSize) + minBuildingSize;
    }
    function getRandomBuildingDistance(){
        return Math.random() * (maxBuildingDistanceFromRoad - minBuildingDistanceFromRoad) + minBuildingDistanceFromRoad;
    }

    function zoomInMap(){
        setZoomScale(zoomScale + 0.2);
    }
    function zoomOutMap(){
        setZoomScale(zoomScale - 0.2);
    }
    function moveX(d: number){
        setXOffset(xOffset + d);
    }
    function moveY(d: number){
        setYOffset(yOffset + d);
    }
    return (
        <div>
            <div>Map of the city</div>
            <CityMap zoomScale={zoomScale} city={city} xOffSet={xOffset} yOffSet={yOffset}/>
            <button onClick={() => {addNewRoad()}}>Add random road</button>
            <button onClick={() => {addForwardRoad()}}>Extend road</button>
            <button onClick={() => {addCrossroadRoad()}}>Side road</button>
            <button onClick={() => {addBuilding()}}>Add building</button>
            <br/>
            <button onClick={() => {zoomInMap()}}>+</button>
            <button onClick={() => {zoomOutMap()}}>-</button>
            <button onClick={() => {moveX(-10*zoomScale)}}>Move right</button>
            <button onClick={() => {moveX(10*zoomScale)}}>Move left</button>
            <button onClick={() => {moveY(10*zoomScale)}}>Move up</button>
            <button onClick={() => {moveY(-10*zoomScale)}}>Move down</button>
        </div>
    );
}

export default CityPanel;