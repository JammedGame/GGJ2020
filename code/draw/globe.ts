export { Globe }

import * as Three from 'three';
import { GLOBE_SCALE, GLOBE_PRECISION, MAPS } from '../data/constants';
import { Settings } from '../settings';

class Globe
{
    private _debugGlobe: boolean;
    private _mesh: Three.Mesh;
    private _material: Three.Material;
    private _sphereGeometry: Three.Geometry;
    private _colorMap: Three.Texture;
    private _normalMap: Three.Texture;
    private _specularMap: Three.Texture;
    private _bumpMap: Three.Texture;
    public get instance(): Three.Mesh { return this._mesh; }
    public constructor()
    {
        this._colorMap = new Three.TextureLoader().load(MAPS.COLOR);
        this._normalMap = new Three.TextureLoader().load(MAPS.NORMAL);
        this._specularMap = new Three.TextureLoader().load(MAPS.SPECULAR);
        this._bumpMap = new Three.TextureLoader().load(MAPS.BUMP);
        this._debugGlobe = Settings.debugGlobe;
        this.generateMaterial();
        this._sphereGeometry = new Three.SphereGeometry(
            GLOBE_SCALE,
            GLOBE_PRECISION,
            GLOBE_PRECISION / 2
        );
        
        this._mesh = new Three.Mesh(this._sphereGeometry, this._material);
        this._mesh.name = 'Globe';
    }
    public update()
    {
        if(Settings.debugGlobe != this._debugGlobe)
        {
            this._debugGlobe = Settings.debugGlobe;
            this.generateMaterial();
            this._mesh.material = this._material;
        }
    }
    private generateMaterial()
    {
        if(!Settings.debugGlobe)
        {
            this._material = new Three.MeshStandardMaterial({
                map: this._colorMap,
                // todo temp disabled
                //normalMap: this._normalMap,
                //emissiveMap: this._specularMap,
                //displacementMap: this._bumpMap,
                displacementScale: 0.01
            });
        }
        else
        {
            this._material = new Three.MeshNormalMaterial();
            this._material.flatShading = true;
        }
    }
}