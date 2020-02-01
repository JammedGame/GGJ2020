export { Globe }

import * as Three from 'three';
import { GLOBE_SCALE, GLOBE_PRECISION } from '../data/constants';

class Globe
{
    private _mesh: Three.Mesh;
    private _material: Three.MeshStandardMaterial;
    private _sphereGeometry: Three.Geometry;
    private _colorMap: Three.Texture;
    private _normalMap: Three.Texture;
    private _specularMap: Three.Texture;
    private _bumpMap: Three.Texture;
    public get instance(): Three.Mesh { return this._mesh; }
    public constructor()
    {
        this._colorMap = new Three.TextureLoader().load("../../resources/earth.jpg");
        this._normalMap = new Three.TextureLoader().load("../../resources/normal.jpg");
        this._specularMap = new Three.TextureLoader().load("../../resources/specular.jpg");
        this._bumpMap = new Three.TextureLoader().load("../../resources/bump.jpg");
        this._material = new Three.MeshStandardMaterial({
            map: this._colorMap,
            normalMap: this._normalMap,
            emissiveMap: this._specularMap,
            displacementMap: this._bumpMap,
            displacementScale: 0.1
        });
        this._sphereGeometry = new Three.SphereGeometry(
            GLOBE_SCALE,
            GLOBE_PRECISION,
            GLOBE_PRECISION
        );
        this._mesh = new Three.Mesh(this._sphereGeometry, this._material);
    }
}