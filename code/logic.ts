import { Renderer } from "./draw/renderer"
import { Scene } from "./draw/scene";
import { Tile, Tilemap } from "./tilemap/tilemap"
import { World } from "./draw/world";

export { GameLogic }

class GameLogic
{
    private _scene: Scene;
	private _renderer: Renderer;
	private _tilemap: Tilemap;
    public constructor()
    {
        this._renderer = new Renderer('canvas-parent');
        this._scene = new World();
		this._renderer.setActiveScene(this._scene);
        this._tilemap = new Tilemap(64, 32);
        document.addEventListener('keydown', event => this.key(event.key));
    }
    public run()
    {
        this._renderer.start();
    }
    private key(event)
    {
        //console.log(event);
    }
}