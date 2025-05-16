import WorldEventPanel from "../worldevent/components/WorldEventPanel";
import WorldEvent from "../worldevent/models/WorldEvent";
import "./HomePage.css"
import CityMap from "../citymap/components/CityMap";
import City from "../citymap/models/City";


function HomePage() {
  
  return (
    <div>
      <div className="title">Medieval City Generator</div>
      <div className="container">
        <div className="mainpanel">
          <CityMap city={City.getExampleCity()}/>
        </div>
        <div className="sidepanel">
          <WorldEventPanel worldevents={WorldEvent.getExampleWorldEvents()}/>
        </div>
      </div>
    </div>
  );
}

export default HomePage;