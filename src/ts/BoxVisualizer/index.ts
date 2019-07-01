
import * as THREE from 'three';
import vert from './shaders/boxVisualizer.vs';
import frag from './shaders/boxVisualizer.fs';
import { congestionData } from '../CongestionDataFetcher';

export default class BoxVisualizer extends THREE.Object3D {

    private num: number;
    private width: number;
    private resolution: number;
    private size: number;

    private uni: any;

    constructor( resolution: number, width: number ,size: number ) {
        
        super();

        this.num = resolution * resolution;
        this.width = width;
        this.resolution = resolution;
        this.size = size;

        this.createVoxel();
    }

    createVoxel() {
        let originBox = new THREE.BoxBufferGeometry( this.size, 1 ,this.size );
        let geo = new THREE.InstancedBufferGeometry();

        let vertice = ( originBox.attributes.position as THREE.BufferAttribute ).clone();
        geo.addAttribute('position', vertice);

        let normal = ( originBox.attributes.normal as THREE.BufferAttribute ).clone();
        geo.addAttribute('normals', normal);

        let uv = ( originBox.attributes.normal as THREE.BufferAttribute ).clone();
        geo.addAttribute('uv', uv);

        let indices = originBox.index.clone();
        geo.setIndex(indices);
 
        let offsetPos = new THREE.InstancedBufferAttribute(new Float32Array(this.num * 3), 3, false, );
        let num = new THREE.InstancedBufferAttribute(new Float32Array(this.num * 1), 1, false, 1);

        let offsetUV = new THREE.InstancedBufferAttribute(new Float32Array(this.num * 2), 2, false, 1);

        for (let i = 0; i < this.resolution; i++) {
            for( let j = 0; j < this.resolution; j++ ){
                let x = (i / this.resolution) * this.width - this.width / 2;
                let z = (j / this.resolution) * this.width - this.width / 2;
                
                
                offsetPos.setXYZ(j + i * this.resolution,x,0,z);

                num.setX(i,i);                

                offsetUV.setXY(j + i * this.resolution, i / this.resolution, j / this.resolution);
            }
        }
        
        geo.addAttribute('offsetPos', offsetPos);
        geo.addAttribute('num', num);
        geo.addAttribute('offsetUV',offsetUV);

        let cUni = {
            time: {
                value: 0
            },
            atriumW: {
                value: 0.0
            },
            loungeW: {
                value: 0.0
            },
            syokudoW: {
                value: 0.0
            }
        }

        this.uni = THREE.UniformsUtils.merge([THREE.ShaderLib.standard.uniforms,cUni]);
        this.uni.diffuse.value = new THREE.Vector3(1.0,1.0,1.0);
        this.uni.roughness.value = 1.0;

        let mat = new THREE.ShaderMaterial({
            vertexShader: vert,
            fragmentShader: frag,
            uniforms: this.uni,
            flatShading: true,
            lights: true,
            transparent: true,
            depthTest: false
        })

        this.frustumCulled = false;
        let mesh = new THREE.Mesh(geo, mat);
        mesh.frustumCulled = false;
        this.add( mesh );
        
    }

    update( time: number ) {

        this.uni.time.value = time;

    }

    updateData( data: congestionData ){
        
        this.uni.atriumW.value = data.atrium[0];
        this.uni.loungeW.value = data.lounge[0];
        this.uni.syokudoW.value = data.syokudo[0];

    }
}