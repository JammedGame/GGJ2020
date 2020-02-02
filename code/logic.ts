import { Renderer } from "./draw/renderer"
import { Scene } from "./draw/scene";
import { Tilemap } from "./simulation/tilemap"
import { Menu } from "./draw/menu";
import { World } from "./draw/world";
import { Api } from "./data/api";
import { Input } from "./input";
import { Settings } from "./settings";
import { convertCoordinatesGeographicToPlanar, convertCoordinatesPolarToPlanar } from "./util/converter";
import { WORLD_WIDTH, CANVAS_PARENT } from "./data/constants";

export { GameLogic }

import * as Three from 'three';

class GameLogic
{
    private _zoom: boolean;
    private _input: Input;
	private _menu: Menu;
	private _world: World;
	private _renderer: Renderer;
    private _tilemap: Tilemap;
    private _apiData: Api;
    public constructor()
    {
        this._zoom = false;
        this._input = new Input();
        this._renderer = new Renderer(CANVAS_PARENT);

		this._menu = new Menu(this._renderer.camera);
		this._menu.toggleShown(true);
        this._world = new World(this._renderer.camera);
		this._renderer.setActiveScene(this._menu);
        (<World>this._world).player.hookCamera(this._renderer.camera);

        this._apiData = new Api();
        this._apiData.setScrapedData();

        // this._apiData.getApiData();
        // setTimeout(() => {  console.log(JSON.stringify(this._apiData.allCities)); }, 10000);

		this._tilemap = new Tilemap();
		for (let i = 0; i < this._apiData.allCities.length; i++) {
			let city = this._apiData.allCities[i];
			let cityLocationGeographic = city.data.data.location.coordinates;
			let cityLocationPlanar = convertCoordinatesGeographicToPlanar(cityLocationGeographic[0], cityLocationGeographic[1]);
			let cityWeather = city.data.data.current.weather;
			let cityWind = convertCoordinatesPolarToPlanar(cityWeather.wd, cityWeather.ws);
			let cityPollution = city.data.data.current.pollution.aqius;
			this._tilemap.setWindAt(cityLocationPlanar[0], cityLocationPlanar[1], cityWind[0], cityWind[1]);
			this._tilemap.setPollutionAt(cityLocationPlanar[0], cityLocationPlanar[1], cityPollution);
		}
        // let london = convertCoordinatesGeographicToPlanar(0, 51.5);
        // let darwin = convertCoordinatesGeographicToPlanar(130.84185, -12.46113);
        // this._tilemap.setPollutionAt(darwin[0], darwin[1], 300);
        // this._tilemap.setWindAt(darwin[0], darwin[1], 1, 1);
        // this._tilemap.setWindAt(london[0], london[1], 1, 1);
        // this._tilemap.setPollutionAt(london[0], london[1], 300);
        this._tilemap.interpolateWind();
        Settings.debugTilemap = this._tilemap.debug.bind(this._tilemap);
        Settings.resetGame = this.reset.bind(this);
        console.log(this._apiData.allCities);
    }

    public reset()
    {
        console.log("RESET");
        this._tilemap.reset();
        this._world.player.reset();
    }

    public run()
    {
        this._renderer.start();
        this.update();
    }
    public update()
    {
		if (Settings.inMenu) {
			// render menu
		} else if(!Settings.pause)
        {

			if (this._renderer.isActiveScene(this._menu)) {
				this._renderer.setActiveScene(this._world);
			}

            this._tilemap.simulate();

            if(this._zoom != Settings.zoom) {
                this._zoom = Settings.zoom;
                this._tilemap.clearTrail();
            }

            this._world.omozon.update(this._tilemap);
            this._world.player.move(this._input.direction);
            this._world.update();
            if(Settings.zoom)
            {
                this._tilemap.setTrailAt(WORLD_WIDTH - this._world.player.position.x - 1,
                    this._world.player.position.y, true);
            }
        }
        requestAnimationFrame(this.update.bind(this));
    }
}