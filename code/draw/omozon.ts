export { Omozon }

import * as Three from 'three';
import { OZONE_SCALE, GLOBE_PRECISION, MAPS } from '../data/constants';
import { Settings } from '../settings';
import THREE = require('three');
import { Colors } from 'three';

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
        this._material = new THREE.ShaderMaterial({
            fragmentShader: this.fragmentShader(),
            vertexShader: this.vertexShader(),
            transparent: true,
            depthWrite: false,
            depthTest: false,
            vertexColors: Three.FaceColors
        });

        this._geometry = new THREE.Geometry();

        this._quadsX = 72;
        this._quadsY = 36;
        this._quad_size_x = 360.0 / this._quadsX;
        this._quad_size_y = 180.0 / this._quadsY;

        for (let i : number = 0; i < this._quadsX; i++)
            for (let j : number = 0; j < this._quadsY; j++)
            {
                let quad_longitude : number = i * this._quad_size_x;
                let quad_latitude : number = -90 + (0.5 + j) * this._quad_size_y;

                this.addQuad(quad_longitude, quad_latitude);
            }

        this._geometry.colorsNeedUpdate = true;
        this._mesh = new Three.Mesh(this._geometry, this._material);
        this._mesh.name = 'Omozon';
        this._mesh.renderOrder = -999;
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

        let color = new Three.Color(0.5, 0.5, 0.5);

        this._geometry.faces.push
        (
            new THREE.Face3( quad_start + 1, quad_start + 0, quad_start + 2, null, color),
            new THREE.Face3( quad_start + 3, quad_start + 2, quad_start + 0, null, color),
        );
    }

    vertexShader() {
        return `
          varying vec3 vColor;

          void main() {
            vColor = color;

            vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * modelViewPosition;
          }
        `
      }

    fragmentShader() {
      return `
      varying vec3 vColor;

      void main() {
        gl_FragColor = vec4(1, 1, 1, vColor.r);
      }
    `
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