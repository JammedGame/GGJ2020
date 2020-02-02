export { Player }

import * as Three from 'three';
import { PLAYER_SCALE, GLOBE_PRECISION, PLAYER_Z_POSITION } from '../data/constants';
import { Camera } from './camera';
import { MovementDirection } from '../input';
import { Tilemap } from '../logic/tilemap';

const DEBOUNCE = 20;

class Player
{
    private _xEaseFactor: number = 0;
    private _yEaseFactor: number = 0;
    private _mesh: Three.Mesh;
    private _moveCooldown: number;
    private _position: Three.Vector2;
    private _material: Three.Material;
    private _geometry: Three.Geometry;
    private _camera: Camera;
    public get instance(): Three.Mesh { return this._mesh; }
    public get position(): Three.Vector2 { return this._position; }
    public constructor()
    {
        this._moveCooldown = 0;
        this._position = new Three.Vector2(36, 28);
        this._material = new Three.MeshBasicMaterial({ color: 0xeecccc });
        this._geometry = new Three.BoxGeometry(PLAYER_SCALE, PLAYER_SCALE);
        this._mesh = new Three.Mesh(this._geometry, this._material);
        this._mesh.rotateZ((45 / 180) * Math.PI);
        this._mesh.position.z = PLAYER_Z_POSITION;
        this._mesh.name = 'Player';
    }
    public hookCamera(camera: Camera) : void
    {
        this._camera = camera;
        this.updatePosition(this._position);
    }
    public update() : void
    {

    }
    public move(direction: MovementDirection) : void
    {
        if(this._moveCooldown > 0)
        {
            this._moveCooldown--;
            if(Math.abs(this._yEaseFactor) > 0)
            {
                let yFactorSign = this._yEaseFactor / Math.abs(this._yEaseFactor);
                this._yEaseFactor = yFactorSign * this._moveCooldown / DEBOUNCE;
                this.updatePosition(this._position);
            }
            else if(Math.abs(this._xEaseFactor) > 0)
            {
                let xFactorSign = this._xEaseFactor / Math.abs(this._xEaseFactor);
                this._xEaseFactor = xFactorSign * this._moveCooldown / DEBOUNCE;
                this.updatePosition(this._position);
            }
            return;
        }
        else
        {
            this._xEaseFactor = 0;
            this._yEaseFactor = 0;
        }
        if(direction == MovementDirection.none) return;

        if(direction == MovementDirection.up)
        {
            if(this._position.y < GLOBE_PRECISION / 2 - 1)
            {
                this._position.y++;
                this._yEaseFactor = -1;
            }
        }
        else if(direction == MovementDirection.down)
        {
            if(this._position.y > 0)
            {
                this._position.y--;
                this._yEaseFactor = 1;
            }
        }
        else if(direction == MovementDirection.left)
        {
            if(this._position.x < GLOBE_PRECISION - 1)
            {
                this._position.x++;
            }
            else
            {
                this._position.x = 0;
            }
            this._xEaseFactor = -1;
        }
        else if(direction == MovementDirection.right)
        {
            if(this._position.x > 0)
            {
                this._position.x--;
            }
            else
            {
                this._position.x = GLOBE_PRECISION - 1;
            }
            this._xEaseFactor = 1;
        }
        this._moveCooldown = DEBOUNCE;
        this.updatePosition(this._position);
    }
    private updatePosition(playerPos: Three.Vector2) : void
    {
        let radf = Math.PI / 180;
        let angleFactor = 180 / (GLOBE_PRECISION / 2);
        let x: number = playerPos.x;
        let wx: number = GLOBE_PRECISION / 2 - 1;
        let kx: number = (x > wx) ? (wx - x) : -(x - wx);
        kx += GLOBE_PRECISION / 4;
        kx = kx % GLOBE_PRECISION;
        kx -= this._xEaseFactor;
        let rx: number = (kx + 0.5) * angleFactor;
        let y: number = playerPos.y;
        let wy: number = (GLOBE_PRECISION / 2) / 2 - 1;
        let ky: number = (y > wy) ? (wy - y) : -(y - wy);
        ky -= this._yEaseFactor;
        let ry: number = (ky + 0.5) * angleFactor;
        let euler = new Three.Euler(ry * radf, rx * radf, 0, 'YXZ');
        this._camera.pivot.setRotationFromEuler(euler);
    }
}