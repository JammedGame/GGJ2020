export { Omozon }

import * as Three from 'three';
import { OZONE_SCALE, GLOBE_PRECISION, MAPS, WORLD_WIDTH, WORLD_HEIGHT } from '../data/constants';
import { Settings } from '../settings';
import THREE = require('three');
import { Colors } from 'three';
import { Tilemap } from '../logic/tilemap';

class Omozon
{
    private _geometry: Three.Geometry;
    private _mesh: Three.Mesh;
    private _material: Three.Material;
    private _quad_size_x: number;
    private _quad_size_y: number;

    public get instance(): Three.Mesh { return this._mesh; }
    public constructor()
    {
        this._material = new THREE.ShaderMaterial({
            fragmentShader: this.fragmentShader(),
            vertexShader: this.vertexShader(),
            transparent: true,
            depthTest: false,
            side: Three.BackSide,
            vertexColors: Three.FaceColors
        });

        this._geometry = new THREE.Geometry();

        this._quad_size_x = 360.0 / WORLD_WIDTH;
        this._quad_size_y = 180.0 / WORLD_HEIGHT;

        for (let j : number = 0; j < WORLD_HEIGHT; j++)
            for (let i : number = 0; i < WORLD_WIDTH; i++)
            {
                let quad_longitude : number = 180 + (i + 0.5) * this._quad_size_x;
                let quad_latitude : number = -90 + (0.5 + j) * this._quad_size_y;

                this.addQuad(quad_longitude, quad_latitude);
            }

        this._geometry.colorsNeedUpdate = true;
        this._mesh = new Three.Mesh(this._geometry, this._material);
        this._mesh.name = 'Omozon';
        this._mesh.renderOrder = 999;
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

    update(tileMap: Tilemap)
    {
        for(let x = 0; x < WORLD_WIDTH; x++)
        {
            for(let y = 0; y < WORLD_HEIGHT; y++)
            {
                let ozone : number = tileMap.getOzoneAt(x, y);
                let index = x + y * WORLD_WIDTH;
                let alpha = ozone * 0.6;

                this._geometry.faces[index * 2 + 0].color = new Three.Color(alpha, alpha, alpha);
                this._geometry.faces[index * 2 + 1].color = new Three.Color(alpha, alpha, alpha);
            }
        }

        this._geometry.elementsNeedUpdate = true;
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
        gl_FragColor = vec4(1, 0.9, 0.9, vColor.r);
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