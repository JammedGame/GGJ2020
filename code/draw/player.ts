export { Player }

import * as Three from 'three';
import { PLAYER_SCALE } from '../data/constants';
import { Camera } from './camera';

class Player
{
    private _mesh: Three.Mesh;
    private _material: Three.Material;
    private _geometry: Three.Geometry;
    private _camera: Camera;
    public get instance(): Three.Mesh { return this._mesh; }
    public constructor()
    {
        this._material = new Three.MeshBasicMaterial({ color: 0xdddddd });
        this._geometry = new Three.BoxGeometry(PLAYER_SCALE, PLAYER_SCALE);
        this._mesh = new Three.Mesh(this._geometry, this._material);
        this._mesh.position.z = 0.6;
        this._mesh.name = 'Player';
    }
}