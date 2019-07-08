import * as THREE from 'three';
import GLTFLoader from 'three-gltf-loader'

import vert from './shaders/atrium.vs';
import frag from './shaders/atrium.fs';

export default class Atrium extends THREE.Object3D{
	private loader: GLTFLoader;
	private uni: any;
	private mat: THREE.ShaderMaterial;
	public onLoad: Function;
	
	constructor(){
		super();

		this.loader = new GLTFLoader();

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
			
			this.add(object);

			if( this.onLoad ){

				this.onLoad();

			}
		});
	}

	update(time:number){
		this.uni.time.value = time;
	}
}