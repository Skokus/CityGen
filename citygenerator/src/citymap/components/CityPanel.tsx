import {useEffect, useRef, useState} from "react";
import City from "../models/City";
import PointRenderer from "../renderers/PointRenderer";
import Point from "../models/road/Point";
import RoadRenderer from "../renderers/RoadRenderer";
import CityMap from "./CityMap";

function CityPanel() {

    const [city, setCity] = useState(City.getExampleCity());
    const [counter, setCounter] = useState(0);

    useEffect(() => {

    });

    function addNewRoad(){
        city.addNewRoad(100);
        setCity(city);
        setCounter(counter + 1);
    }

    function addForwardRoad(){
        city.addExtentionRoad(100);
        setCity(city);
        setCounter(counter + 1);
    }

    function addCrossroadRoad(){
        city.addSideRoad(100);
        setCity(city);
        setCounter(counter + 1);
    }

    return (
        <div>
            <div>Map of the city</div>
            <CityMap city={city}/>
            <button onClick={() => {addNewRoad()}}>Add random road</button>
            <button onClick={() => {addForwardRoad()}}>Extend road</button>
            <button onClick={() => {addCrossroadRoad()}}>Side road</button>
        </div>
    );
}

export default CityPanel;