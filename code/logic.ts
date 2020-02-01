import { Renderer } from "./draw/renderer"
import { Scene } from "./draw/scene";
import { Tilemap } from "./logic/tilemap"
import { World } from "./draw/world";
import { Api } from "./data/api";
import { Input } from "./input";
import { Settings } from "./settings";
import { convertCoordinatesGeographicToPlanar, convertCoordinatesPolarToPlanar } from "./util/converter";

export { GameLogic }

class GameLogic
{
    private _input: Input;
    private _world: World;
	private _renderer: Renderer;
    private _tilemap: Tilemap;
    private _apiData: Api;
    public constructor()
    {
        this._input = new Input();
        this._renderer = new Renderer('canvas-parent');

		this._tilemap = new Tilemap();
		this._tilemap.setPollutionAt(54, 18, 10); // temp
		this._tilemap.setPollutionAt(55, 18, 10); // temp
		this._tilemap.setPollutionAt(56, 18, 10); // temp
		this._tilemap.setPollutionAt(57, 18, 10); // temp
		this._tilemap.setWindAt(54, 18, 1, 1); // temp
		this._tilemap.setWindAt(54, 24, -1, 0); // temp
        this._tilemap.interpolateWind();
        Settings.debugTilemap = this._tilemap.debug.bind(this._tilemap);

        this._world = new World();
        this._renderer.setActiveScene(this._world);
        (<World>this._world).player.hookCamera(this._renderer.camera);

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
            this._tilemap.simulate();
            this._world.update();
            this._world.omozon.update(this._tilemap);
        }
        requestAnimationFrame(this.update.bind(this));
    }
}