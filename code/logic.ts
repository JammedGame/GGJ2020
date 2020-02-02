import { Renderer } from "./draw/renderer"
import { Scene } from "./draw/scene";
import { Tilemap } from "./logic/tilemap"
import { World } from "./draw/world";
import { Api } from "./data/api";
import { Input } from "./input";
import { Settings } from "./settings";
import { convertCoordinatesGeographicToPlanar, convertCoordinatesPolarToPlanar } from "./util/converter";
import { WORLD_WIDTH } from "./data/constants";

export { GameLogic }

import * as Three from 'three';

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

        this._world = new World(this._renderer.camera);
        this._renderer.setActiveScene(this._world);
        (<World>this._world).player.hookCamera(this._renderer.camera);

        this._apiData = new Api();
		this._apiData.setScrapedData();

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
		// this._tilemap.setPollutionAt(london[0], london[1], 300);
		// this._tilemap.setWindAt(london[0], london[1], 1, 1);
		// let belgrade = convertCoordinatesGeographicToPlanar(20, 44);
		// this._tilemap.setPollutionAt(belgrade[0], belgrade[1], 300);
		// let equator = convertCoordinatesGeographicToPlanar(0, 0);
        // this._tilemap.setPollutionAt(equator[0], equator[1], 300);
        this._tilemap.interpolateWind();
        Settings.debugTilemap = this._tilemap.debug.bind(this._tilemap);
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
            
            this._world.omozon.update(this._tilemap);
            this._world.player.move(this._input.direction);
            this._world.update();
            if(Settings.zoom)
            {
                this._tilemap.setTrailAt(this._world.player.position.x,
                    this._world.player.position.y, true);
            }
        }
        requestAnimationFrame(this.update.bind(this));
    }
}