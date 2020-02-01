export { Scene }

import * as Three from 'three';

class Scene
{
    private _scene: Three.Scene;
    public get instance(): Three.Scene { return this._scene; }
    public constructor()
    {
        this._scene = new Three.Scene();
        this.initScene();
    }
    private initScene() : void
    {
        let geometry = new Three.BoxGeometry();
        let material = new Three.MeshBasicMaterial( { color: 0x00ff00 } );
        let cube = new Three.Mesh( geometry, material );
        this._scene.add( cube );
    }
}