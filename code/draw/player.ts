export { Player }

import * as Three from 'three';
import { PLAYER_SCALE, GLOBE_PRECISION } from '../data/constants';
import { Camera } from './camera';
import { MovementDirection } from '../input';

class Player
{
    private _mesh: Three.Mesh;
    private _moveCooldown: number;
    private _position: Three.Vector2;
    private _material: Three.Material;
    private _geometry: Three.Geometry;
    private _camera: Camera;
    public get instance(): Three.Mesh { return this._mesh; }
    public constructor()
    {
        this._moveCooldown = 0;
        this._position = new Three.Vector2(GLOBE_PRECISION / 2, GLOBE_PRECISION / 4);
        this._material = new Three.MeshBasicMaterial({ color: 0xeecccc });
        this._geometry = new Three.BoxGeometry(PLAYER_SCALE, PLAYER_SCALE);
        this._mesh = new Three.Mesh(this._geometry, this._material);
        this._mesh.rotateZ((45 / 180) * Math.PI);
        this._mesh.position.z = 1;
        this._mesh.name = 'Player';
    }
    public hookCamera(camera: Camera) : void
    {
        this._camera = camera;
        this.updatePosition(this._position);
    }
    public update(playerPos: Three.Vector2) : void
    {
    }
    public move(direction: MovementDirection) : void
    {
        if(this._moveCooldown > 0)
        {
            this._moveCooldown--;
            return;
        }
        if(direction == MovementDirection.none) return;
        console.log(direction);
        if(direction == MovementDirection.up)
        {
            if(this._position.y < GLOBE_PRECISION / 2 - 1)
            {
                this._position.y++;
            }
        }
        else if(direction == MovementDirection.down)
        {
            if(this._position.y > 0)
            {
                this._position.y--;
            }
        }
        else if(direction == MovementDirection.left)
        {
            if(this._position.x < GLOBE_PRECISION - 1)
            {
                this._position.x++;
            }
        }
        else if(direction == MovementDirection.right)
        {
            if(this._position.x > 0)
            {
                this._position.x--;
            }
        }
        this._moveCooldown = 20;
        this.updatePosition(this._position);
    }
    private updatePosition(playerPos: Three.Vector2) : void
    {
        let radf = Math.PI / 180;
        let angleFactor = 180 / (GLOBE_PRECISION / 2);
        let x: number = playerPos.x;
        let wx: number = GLOBE_PRECISION / 2 - 1;
        let kx: number = (x > wx) ? (wx - x) : -(x - wx);
        let rx: number = (kx + 0.5) * angleFactor;
        let y: number = playerPos.y;
        let wy: number = (GLOBE_PRECISION / 2) / 2 - 1;
        let ky: number = (y > wy) ? (wy - y) : -(y - wy);
        let ry: number = (ky + 0.5) * angleFactor;
        let euler = new Three.Euler(ry * radf, rx * radf, 0, 'YXZ');
        this._camera.pivot.setRotationFromEuler(euler);
    }
}