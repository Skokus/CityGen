import WorldEventItem from "./WorldEventItem"
import "./WorldEventPanel.css"

function WorldEventPanel({worldevents}) {
  return (
    <div>
      {worldevents.map(worldevent => (
        <WorldEventItem worldevent={worldevent}/>
      ))}
    </div>
  );
}

export default WorldEventPanel;