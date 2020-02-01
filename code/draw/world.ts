export { World }

import { Sun } from "./sun";
import { Scene } from "./scene";
import { Globe } from "./globe";
import { Player } from "./player";
import { Omozon } from "./omozon";

class World extends Scene
{
    private _sun: Sun;
    private _globe: Globe;
    private _player: Player;
    private _omozon: Omozon;
    public get player(): Player { return this._player; }
    public constructor()
    {
        super();
    }
    protected init()
    {
        // override
        this._sun = new Sun();
        this._globe = new Globe();
        this._player = new Player();
        this._omozon = new Omozon();
        this._scene.add(this._sun.instance);
        this._scene.add(this._omozon.instance);
        this._scene.add(this._globe.instance);
        this._scene.add(this._player.instance);
    }
    public update()
    {
        // override
        this._globe.update();
    }
}