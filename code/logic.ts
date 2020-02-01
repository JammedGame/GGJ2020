import { Renderer } from "./draw/renderer"
import { Scene } from "./draw/scene";
import { Tile, Tilemap } from "./logic/tilemap"
import { World } from "./draw/world";
import { Api } from "./data/api";
import { Input } from "./input";
import { Settings } from "./settings";
import { convertCoordinatesGeographicToPlanar, convertCoordinatesPolarToPlanar } from "./util/converter";

export { GameLogic }

class GameLogic
{
    private _input: Input;
    private _scene: Scene;
	private _renderer: Renderer;
    private _tilemap: Tilemap;
    private _apiData: Api;
    public constructor()
    {
        this._input = new Input();
        this._renderer = new Renderer('canvas-parent');
        this._scene = new World();
        this._renderer.setActiveScene(this._scene);
        (<World>this._scene).player.hookCamera(this._renderer.camera);
		this._tilemap = new Tilemap();
		this._tilemap.setPollutionAt(0, 0, 10); // temp
		this._tilemap.setWindAt(0, 0, 1, 1); // temp
		this._tilemap.setWindAt(3, 3, -0.5, -0.5); // temp
		this._tilemap.interpolateWind();
		Settings.debugTilemap = this._tilemap.debug.bind(this._tilemap);
        this._apiData = new Api();
        this._apiData.getApiData();
        console.log(this._apiData.allCities);

    }
    public run()
    {
        this._renderer.start();
        this.update();
    }
    public update()
    {
        if(!Settings.pause)
        {
            this._scene.update();
        }
        requestAnimationFrame(this.update.bind(this));
    }
}