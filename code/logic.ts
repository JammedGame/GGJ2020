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
        let api = new Api();
        this._apiData = api.getApiData('Belgrade', 'Central Serbia', 'Serbia');
    }
    public run()
    {
        this._renderer.start();
		this._tilemap = new Tilemap(4, 4);
		// this._tilemap.setPollutionAt(0, 0, 10);
		// for (var x = 0; x < 4; x++) {
		// 	for (var y = 0; y < 4; y++) {
		// 		this._tilemap.setWindAt(x, y, 1, 1);
		// 	}
		// }
		// this._tilemap.enableLogging();
    }
}