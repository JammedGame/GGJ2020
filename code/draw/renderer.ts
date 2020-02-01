export { Renderer }

import * as Three from 'three';
import { RESOLUTION } from '../data/constants';
import { Camera } from './camera';
import { Scene } from './scene';
import { Log } from '../util/log';

class Renderer
{
    private _stop: boolean;
    private _scene: Scene;
    private _camera: Camera;
    private _canvasParent: HTMLDivElement;
    private _renderer: Three.Renderer;
    public constructor(canvasID: string)
    {
        this._canvasParent = <HTMLDivElement> document.getElementById(canvasID);
        this._camera = new Camera();
        this._renderer = new Three.WebGLRenderer();
        this._renderer.setSize(RESOLUTION.X, RESOLUTION.Y);
        this._canvasParent.appendChild( this._renderer.domElement );
    }
    public setActiveScene(scene: Scene) : void
    {
        this._scene = scene;
    }
    public start() : void
    {
        if(!this._scene)
        {
            Log.error('Scene not set');
            return;
        }
        this.render();
    }
    public stop() : void
    {
        this._stop = true;
    }
    public render() : void
    {
        /// Render stuff
        if(this._stop)
        {
            this._stop = false;
            return;
        }
        this._renderer.render(this._scene.instance, this._camera.instance);
        requestAnimationFrame(this.render.bind(this));
    }
}