import WorldEvent from "./WorldEvent";

class WorldEventManager {

    static instance: WorldEventManager;
    private worldEvents: WorldEvent[];

    private constructor() {
        this.worldEvents = [];
    }

    public static getInstance(): WorldEventManager {
        if (!WorldEventManager.instance) {
            WorldEventManager.instance = new WorldEventManager();
        }
        return WorldEventManager.instance;
    }

    public getWorldEvents(): WorldEvent[] {
        return this.worldEvents;
    }

    public addWorldEvent(worldEvent: WorldEvent): void {
        this.worldEvents.push(worldEvent);
    }

}

export default WorldEventManager;