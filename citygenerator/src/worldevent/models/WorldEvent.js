export default class WorldEvent {

  constructor(name, description) {
    this.name = name;
    this.description = description;
  }
  
  static getExampleWorldEvents(){
    return [new WorldEvent("First", "Nice desc"), 
            new WorldEvent("Ending", "World Ender"), 
            new WorldEvent("Third", "Nice desc312321"),
            new WorldEvent("First", "Nice desc"), 
            new WorldEvent("Ending", "World Ender"), 
            new WorldEvent("Third", "Nice desc312321")];
  }

}