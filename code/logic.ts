import { Renderer } from "./draw/renderer"
import { Scene } from "./draw/scene";
import { Tile, Tilemap } from "./logic/tilemap"
import { World } from "./draw/world";
import { Api } from "./data/api";

export { GameLogic }

class GameLogic
{
    private _scene: Scene;
	private _renderer: Renderer;
    private _tilemap: Tilemap;
    private _apiData: Api;
    public constructor()
    {
        this._renderer = new Renderer('canvas-parent');
        this._scene = new World();
		this._renderer.setActiveScene(this._scene);
        this._tilemap = new Tilemap(64, 32);
        document.addEventListener('keydown', event => this.key(event.key));
        this._apiData = new Api();
        this._apiData.getApiData();

        console.log(this._apiData.allCities);

    }
    public run()
    {
        this._renderer.start();
		this._tilemap = new Tilemap(4, 4);
    }
    private key(event)
    {
        // console.log(event);
		if (event == "t") {
			if (!this._tilemap.debuggingEnabled) {
				this._tilemap.debuggingEnabled = true;
				this._tilemap.setPollutionAt(0, 0, 10);
				for (var x = 0; x < 4; x++) {
					for (var y = 0; y < 4; y++) {
						this._tilemap.setWindAt(x, y, 1, 1);
					}
				}
				this._tilemap.log();
				console.log("press T to advance simulation step-by-step");
			} else {
				this._tilemap.simulate();
				this._tilemap.log();
			}
		}
    }
}