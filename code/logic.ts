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
        this._scene = new World(this._renderer.camera);
        this._renderer.setActiveScene(this._scene);
        this._tilemap = new Tilemap(64, 32);
        this._apiData = new Api();
        this._apiData.getApiData();
    }
    public run()
    {
        this._renderer.start();
        this.update();
		this._tilemap = new Tilemap(4, 4);
    }
    public update()
    {
        if(!Settings.pause)
        {
            this._scene.update();
            (<World>this._scene).player.move(this._input.direction);
        }
        requestAnimationFrame(this.update.bind(this));
    }
}