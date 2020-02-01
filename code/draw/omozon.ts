export { Omozon }

import * as Three from 'three';
import { OZONE_SCALE, GLOBE_PRECISION, MAPS, WORLD_WIDTH, WORLD_HEIGHT } from '../data/constants';
import { Settings } from '../settings';
import THREE = require('three');

class Omozon
{
    private _geometry: Three.Geometry;
    private _mesh: Three.Mesh;
    private _material: Three.Material;
    private _quadsX: number;
    private _quadsY: number;
    private _quad_size_x: number;
    private _quad_size_y: number;

    public get instance(): Three.Mesh { return this._mesh; }
    public constructor()
    {
        let uniforms = {
            colorB: {type: 'vec3', value: new THREE.Color(0x000000)},
            colorA: {type: 'vec3', value: new THREE.Color(0xFFFFFF)}
        }

        this._material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            fragmentShader: this.fragmentShader(),
            vertexShader: this.vertexShader(),
            transparent: true,
            depthWrite: false,
            depthTest: false,
        });

        this._geometry = new THREE.Geometry();

        this._quadsX = WORLD_WIDTH;
        this._quadsY = WORLD_HEIGHT;
        this._quad_size_x = 360.0 / this._quadsX;
        this._quad_size_y = 180.0 / this._quadsY;

        for (let i : number = 0; i < this._quadsX; i++)
            for (let j : number = 0; j < this._quadsY; j++)
            {
                let quad_longitude : number = i * this._quad_size_x;
                let quad_latitude : number = -90 + (0.5 + j) * this._quad_size_y;

                this.addQuad(quad_longitude, quad_latitude);
            }

        this._mesh = new Three.Mesh(this._geometry, this._material);
        this._mesh.name = 'Omozon';
        this._mesh.renderOrder = -999;
    }

    vertexShader() {
        return `
          varying float alpha;

          void main() {
            alpha = 0.5;

            vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * modelViewPosition;
          }
        `
      }

    fragmentShader() {
      return `
      uniform vec3 colorA;
      uniform vec3 colorB;
      varying float alpha;

      void main() {
        gl_FragColor = vec4(1, 1, 1, alpha);
      }
    `
    }

    addQuad(x : number, y : number)
    {
        let quad_start = this._geometry.vertices.length;

        this._geometry.vertices.push
        (
            spherical2Cartesion(x - this._quad_size_x * 0.5, y + this._quad_size_y * 0.5, OZONE_SCALE),
            spherical2Cartesion(x + this._quad_size_x * 0.5, y + this._quad_size_y * 0.5, OZONE_SCALE),
            spherical2Cartesion(x + this._quad_size_x * 0.5, y - this._quad_size_y * 0.5, OZONE_SCALE),
            spherical2Cartesion(x - this._quad_size_x * 0.5, y - this._quad_size_y * 0.5, OZONE_SCALE),
        );

        this._geometry.faces.push
        (
            new THREE.Face3( quad_start + 1, quad_start + 0, quad_start + 2),
            new THREE.Face3( quad_start + 3, quad_start + 2, quad_start + 0),
        );
    }
}

function spherical2Cartesion(longitude : number, latitude : number, r : number) : THREE.Vector3
{
    let x : number = longitude / 180.0 * Math.PI;
    let y : number = latitude / 180.0 * Math.PI;

    return new THREE.Vector3
    (
        r * Math.cos(y) * Math.cos(x),
        r * Math.sin(y),
        r * Math.cos(y) * Math.sin(x),
    );
};