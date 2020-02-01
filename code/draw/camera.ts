export { Camera }

import * as Three from 'three';
import { DEFAULT_FOV, RESOLUTION, CLIPPING } from '../data/constants';

class Camera
{
    private _pivot: Three.Group;
    private _camera: Three.PerspectiveCamera;
    public get pivot(): Three.Group { return this._pivot; }
    public get instance(): Three.PerspectiveCamera { return this._camera; }
    public get fov(): number { return this._camera.fov; }
    public set fov(value: number) { this._camera.fov = value; }
    public constructor()
    {
        this._pivot = new Three.Group();
        this._pivot.position.set(0,0,0);
        this._camera = new Three.PerspectiveCamera(
            DEFAULT_FOV,
            RESOLUTION.X / RESOLUTION.Y,
            CLIPPING.NEAR,
            CLIPPING.FAR);
        this._camera.position.z = 2.2;
        this._pivot.add(this._camera);
    }
}