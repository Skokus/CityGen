import "./HomePage.css"
import CityPanel from "../citymap/components/CityPanel";


function HomePage() {
  
  return (
    <div>
      <div className="title">Medieval City Simulator</div>
      <CityPanel/>
    </div>
  );
}

export default HomePage;