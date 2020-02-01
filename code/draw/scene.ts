export { Scene }

import * as Three from 'three';

class Scene
{
    protected _scene: Three.Scene;
    public get instance(): Three.Scene { return this._scene; }
    public constructor()
    {
        this._scene = new Three.Scene();
        this.init();
    }
    protected init(): void
    {
        // virtual
    }
    public update(): void
    {
        // virtual
    }
}