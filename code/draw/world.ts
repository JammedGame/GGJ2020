export { World }

import { Sun } from "./sun";
import { Scene } from "./scene";
import { Globe } from "./globe";

class World extends Scene
{
    private _sun: Sun;
    private _globe: Globe;
    public constructor()
    {
        super();
    }
    protected init()
    {
        // override
        this._sun = new Sun();
        this._globe = new Globe();
        this._scene.add(this._sun.instance);
        this._scene.add(this._globe.instance);
    }
}