import RiverPoint from "./RiverPoint";

class LakePoint extends RiverPoint {

    public getDistancedRiverPoint(distance: number, angle: number): RiverPoint {
        return new LakePoint(this.x + distance * Math.cos(angle), this.y + distance * Math.sin(angle), angle);
    }

    public getRiverHashValue(seed: number): number {
        return super.getRiverHashValue(seed);
    }
}

export default LakePoint;