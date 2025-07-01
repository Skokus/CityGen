import WorldEventItem from "./WorldEventItem"
import "./WorldEventPanel.css"
import WorldEvent from "../models/WorldEvent";
import WorldEventManager from "../models/WorldEventManager";

function WorldEventPanel() {

  const eventManager = WorldEventManager.getInstance();
  const worldEvents = eventManager.getWorldEvents();

  function addWorldEvent() {
    eventManager.addWorldEvent(new WorldEvent("First", "Nice desc"));
  }

  return (
    <div>
      <button onClick={()=> addWorldEvent()}>Add WorldEvent</button>
      {worldEvents.map(worldEvent => (
        <WorldEventItem worldEvent={worldEvent}/>
      ))}
    </div>
  );
}

export default WorldEventPanel;