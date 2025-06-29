import "./WorldEventItem.css"
import WorldEvent from "../models/WorldEvent";

interface WorldEventItemProps {
    worldEvent: WorldEvent;
}

function WorldEventItem(props: WorldEventItemProps){
    return (
        <div className="item">
            <div className="name">{props.worldEvent.name}</div>
            <div className="description">{props.worldEvent.description}</div>
        </div>
    );
}

export default WorldEventItem;