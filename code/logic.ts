import { Renderer } from "./draw/renderer"
import { Scene } from "./draw/scene";
import { Tile, Tilemap } from "./tilemap/tilemap"
import { World } from "./draw/world";
import { Api } from "./data/api";

export { GameLogic }

class GameLogic
{
    private _scene: Scene;
	private _renderer: Renderer;
    private _tilemap: Tilemap;
    private _apiData: any;
    public constructor()
    {
        this._renderer = new Renderer('canvas-parent');
        this._scene = new World();
		this._renderer.setActiveScene(this._scene);
        this._tilemap = new Tilemap(64, 32);
        let api = new Api();
        this._apiData = api.getApiData('Belgrade', 'Central Serbia', 'Serbia');
    }
    public run()
    {
        this._renderer.start();
    }
}