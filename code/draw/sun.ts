export { Sun }

import * as Three from 'three';

class Sun
{
    private _light: Three.DirectionalLight;
    public get instance(): Three.Light { return this._light; }
    public constructor()
    {
        this._light = new Three.DirectionalLight( 0xffffff, 0.8);
        this._light.position.set( 0, 1.5, 1.5 );
    }
}