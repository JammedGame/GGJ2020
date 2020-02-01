export { World }

import { Sun } from "./sun";
import { Scene } from "./scene";
import { Globe } from "./globe";
import { Player } from "./player";
import { Camera } from "./camera";

class World extends Scene
{
    private _sun: Sun;
    private _globe: Globe;
    private _player: Player;
    public get player(): Player { return this._player; }
    public constructor(camera: Camera)
    {
        super(camera);
    }
    protected init(camera)
    {
        // override
        this._sun = new Sun();
        this._globe = new Globe();
        this._player = new Player();
        this._scene.add(this._globe.instance);
        this._scene.add(camera.pivot);
        camera.pivot.add(this._sun.instance);
        camera.pivot.add(this._player.instance);
        this._player.hookCamera(camera);
    }
    public update()
    {
        // override
        this._globe.update();
    }
}