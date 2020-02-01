export { Omozon }

import * as Three from 'three';
import { OZONE_SCALE, GLOBE_PRECISION, MAPS } from '../data/constants';
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
            transparent: true
        })

        this._geometry = new THREE.Geometry();

        this._quadsX = 72;
        this._quadsY = 36;
        this._quad_size_x = 360.0 / this._quadsX;
        this._quad_size_y = 180.0 / this._quadsY;

        for (let i : number = 0; i < this._quadsX; i++)
            for (let j : number = 0; j < this._quadsY; j++)
                this.addQuad(i * this._quad_size_x, -90 + j * this._quad_size_y);

        this._mesh = new Three.Mesh(this._geometry, this._material);
        this._mesh.name = 'Omozon';
    }

    vertexShader() {
        return `
          varying vec3 vUv;

          void main() {
            vUv = position;

            vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * modelViewPosition;
          }
        `
      }

    fragmentShader() {
      return `
      uniform vec3 colorA;
      uniform vec3 colorB;
      varying vec3 vUv;

      void main() {
        gl_FragColor = vec4(0, 0, 1, 0.5);
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