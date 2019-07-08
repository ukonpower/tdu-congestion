import * as THREE from 'three';

import vert from './shaders/touchUI.vs';
import frag from './shaders/touchUI.fs';

export default class TouchUI extends THREE.Object3D{

    private uni: any;

    constructor(){

        super();
        this.createGeo();

    }

    createGeo(){

        let geo = new THREE.RingBufferGeometry( 1.0, 1.03, 20,3.0 );

        this.uni = {
            time: { value: 0 },
            cPos: { value: 0 }
        }
        
        let mat = new THREE.ShaderMaterial({
            vertexShader: vert,
            fragmentShader: frag,
            uniforms: this.uni,
            transparent: true
        });
        
        let plane = new THREE.Mesh( geo, mat );
        plane.rotateX( -Math.PI / 2.0 );
        this.add( plane );

    }

    update( time: number, cPos: number ){        

        this.uni.time.value = time;
        this.uni.cPos.value = cPos;
    
    }
}