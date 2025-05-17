interface Renderer {
    draw(ctx: CanvasRenderingContext2D, scale: number, xOffSet: number, yOffSet: number): void;
}
export default Renderer;