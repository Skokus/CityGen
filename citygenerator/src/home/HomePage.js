import City from "../citymap/models/City";
import WorldEventPanel from "../worldevent/components/WorldEventPanel";
import WorldEvent from "../worldevent/models/WorldEvent";
import "./HomePage.css"

function HomePage() {
  
  return (
    <div>
      <div className="title">Medieval City Generator</div>
      <div className="container">
        <div className="mainpanel">
          <City/>
        </div>
        <div classame="sidepanel">
          <WorldEventPanel worldevents={WorldEvent.getExampleWorldEvents()}/>
        </div>
      </div>
    </div>
  );
}

export default HomePage;