export { Scene }

import * as Three from 'three';
import { Camera } from './camera';

class Scene
{
    protected _scene: Three.Scene;
    public get instance(): Three.Scene { return this._scene; }
    public constructor(camera: Camera)
    {
        this._scene = new Three.Scene();
        this.init(camera);
    }
    protected init(camera: Camera): void
    {
        // virtual
    }
    public update(): void
    {
        // virtual
    }
}