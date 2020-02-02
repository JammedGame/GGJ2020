export { Renderer }

import * as Three from 'three';
import { RESOLUTION } from '../data/constants';
import { Camera } from './camera';
import { Scene } from './scene';
import { Log } from '../util/log';
import { Settings } from '../settings';

class Renderer
{
    private _scene: Scene;
    private _camera: Camera;
    private _canvasParent: HTMLDivElement;
    private _renderer: Three.Renderer;
    public get camera(): Camera { return this._camera; }
    public constructor(canvasID: string)
    {
        this._canvasParent = <HTMLDivElement> document.getElementById(canvasID);
        this._camera = new Camera();
        this._renderer = new Three.WebGLRenderer();
        this._renderer.setSize(window.innerWidth, window.innerHeight);
        this._canvasParent.appendChild( this._renderer.domElement );
        window.addEventListener( 'resize', this.resize.bind(this), false );
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
    public render() : void
    {
        if(!Settings.pause)
        {
            this._renderer.render(this._scene.instance, this._camera.instance);
        }
        requestAnimationFrame(this.render.bind(this));
    }
    private resize() : void
    {
        console.log('resize');
        this._renderer.setSize( window.innerWidth, window.innerHeight );
    }
}