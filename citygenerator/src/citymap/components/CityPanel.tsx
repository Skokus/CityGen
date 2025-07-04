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
    return (
        <div>
            <div>Map of the city</div>
            <CityMap city={city}/>
            <button onClick={() => {addNewRoad()}}>Add random road</button>
            <button onClick={() => {addForwardRoad()}}>Extend road</button>
            <button onClick={() => {addCrossroadRoad()}}>Side road</button>
            <button onClick={() => {addBuilding()}}>Add building</button>
        </div>
    );
}

export default CityPanel;