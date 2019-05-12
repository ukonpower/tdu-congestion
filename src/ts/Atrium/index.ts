import * as ORE from 'ore-three-ts';
import * as THREE from 'three';
import GLTFLoader from 'three-gltf-loader'

import vert from './shaders/atrium.vs';
import frag from './shaders/atrium.fs';

export default class Atrium extends ORE.BaseObject{
	private loader: GLTFLoader;
	private uni: any;
	private mat: THREE.ShaderMaterial;
	public _obj: THREE.Object3D;
	
	constructor(){
		super();

		this.loader = new GLTFLoader();
		this._obj = new THREE.Object3D();

		this.uni = {
			time:{
				value: 0
			}
		}
		this.mat = new THREE.ShaderMaterial({
			vertexShader:vert,
			fragmentShader: frag,
			uniforms:this.uni,
			transparent: true
		});
		this.mat.wireframe = true;

		this.loader.load('./assets/models/TDU.glb',(gltf)=>{
			var object: any = gltf.scene;

            object.traverse((child:THREE.Mesh) => {
                if (child.isMesh) {
					child.receiveShadow = true;
					child.material = this.mat;
                }
			});
			
			this._obj.add(object);
		});
	}

	update(time:number){
		this.uni.time.value = time;
	}
}