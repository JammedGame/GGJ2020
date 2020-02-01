import { Renderer } from "./draw/renderer"
import { Scene } from "./draw/scene";

export { GameLogic }

class GameLogic
{
    private _scene: Scene;
    private _renderer: Renderer;
    public constructor()
    {
        this._renderer = new Renderer('canvas-parent');
        this._scene = new Scene();
        this._renderer.setActiveScene(this._scene);
    }
    public run()
    {
        this._renderer.start();
    }
}