class GridClassCalculator {

    static getNodeHash(x: number, y: number, seed: number): number {
        return this.generateHash(x ^ this.generateHash(seed ^ y));
    }

    static getAngleHash(x: number, y: number, seed: number): number{
        return this.generateHash(y ^ this.generateHash(seed ^ x))/2147483647;
    }
    static getOffsetHash(x: number, y: number, seed: number): number{
        return this.getNodeHash(x, y, seed)/2147483647;
    }

    static getNodeConnectionTest(x1: number, y1: number, x2: number, y2: number, seed: number): number {
        return this.generateHash(this.getNodeHash(x1, y1, seed) ^ this.getNodeHash(x2, y2, seed))/2147483647;
    }

    //https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
    static generateHash(number: number): number {
        let string = number.toString(2);
        let hash = 0;
        for (const char of string) {
            hash = (hash << 5) - hash + char.charCodeAt(0);
            hash |= 0; // Constrain to 32bit integer
        }
        return hash;
    };
}

export default GridClassCalculator;