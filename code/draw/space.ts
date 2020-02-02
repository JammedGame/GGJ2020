export { Space }

import * as Three from 'three';

class Space
{
    private _mesh: Three.Mesh;
    private _material: Three.Material;
    private _geometry: Three.Geometry;
    public get instance(): Three.Mesh { return this._mesh; }
    public constructor()
    {
        this._material = new Three.MeshBasicMaterial({
            color: 0x888888,
            map: new Three.TextureLoader().load('resources/space.png'),
        });
        this._geometry = new Three.BoxGeometry(8.9, 5);
        this._mesh = new Three.Mesh(this._geometry, this._material);
        this._mesh.position.z = -3;
        this._mesh.name = 'Space';
    }
}