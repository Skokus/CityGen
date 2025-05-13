import "./WorldEventItem.css"

function WorldEventItem({worldevent}) {
  return (
    <div className="item">
      <div className="name">{worldevent.name}</div>
      <div className="description">{worldevent.description}</div>
    </div>
  );
}

export default WorldEventItem;