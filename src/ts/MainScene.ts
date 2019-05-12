import * as ORE from 'ore-three-ts'
import * as THREE from 'three';

import GLTF2Loader from 'three-gltf2-loader'
GLTF2Loader(THREE)

export default class MainScene extends ORE.BaseScene{
	private box: THREE.Mesh;
	private light: THREE.Light;

	constructor(renderer){
		super(renderer);
		this.name = "MainScene";
		this.init();
	}

	init(){
		this.camera.position.set(0,1.5,3);
        this.camera.lookAt(0,0,0);

        var boxGeo = new THREE.BoxGeometry(1,1,1);
        var boXMat = new THREE.MeshNormalMaterial();
        this.box = new THREE.Mesh(boxGeo,boXMat);
		this.scene.add(this.box);

        this.light = new THREE.DirectionalLight();
        this.light.position.y = 10;
		this.scene.add(this.light);
	}

	animate(){
        this.box.rotateY(0.01);
		this.renderer.render(this.scene,this.camera);
	}

	onResize(width, height) {
		super.onResize(width,height);
	}

    onTouchStart(cursor) { }

    onTouchMove(cursor) { }

    onTouchEnd(cursor) { }
}