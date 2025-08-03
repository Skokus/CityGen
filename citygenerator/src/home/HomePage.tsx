import WorldEventPanel from "../worldevent/components/WorldEventPanel";
import WorldEvent from "../worldevent/models/WorldEvent";
import "./HomePage.css"
import CityMap from "../citymap/components/CityMap";
import City from "../citymap/models/City";
import CityPanel from "../citymap/components/CityPanel";


function HomePage() {
  
  return (
    <div>
      <div className="title">Medieval City Simulator</div>
      <div className="container">
        <div className="mainpanel">
          <CityPanel/>
        </div>
          {/*<div className="sidepanel">
          <WorldEventPanel/>
        </div>*/}
      </div>
    </div>
  );
}

export default HomePage;