import * as THREE from 'three';

import vert from './shaders/floor.vs';
import frag from './shaders/floor.fs';

export default class Floor extends THREE.Object3D{

    private uni: any;

    constructor(){

        super();
        this.createGeo();

    }

    createGeo(){

        let geo = new THREE.PlaneBufferGeometry( 250, 250, 150, 150 );

        this.uni = {
            time: { vaue: 0 }
        }
        
        let mat = new THREE.ShaderMaterial({
            vertexShader: vert,
            fragmentShader: frag,
            uniforms: this.uni,
        });
        
        let plane = new THREE.Points( geo, mat );
        plane.rotateX( Math.PI / 2.0 );
        this.add( plane );

    }

    update( time: number ){
        this.uni.time.value = time;
    }
}