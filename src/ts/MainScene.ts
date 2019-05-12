import * as ORE from 'ore-three-ts'
import * as THREE from 'three';

import Atrium from './Atrium';

export default class MainScene extends ORE.BaseScene{
	private atrium: Atrium;
	private r: number = 20;
	private pY: number = 10;

	constructor(renderer){
		super(renderer);
		this.name = "MainScene";
		this.onResize(window.innerWidth,window.innerHeight);
		this.init();
	}

	init(){
		this.atrium = new Atrium();
		this.scene.add(this.atrium._obj);
		this.camera.lookAt(0,0,0);
	}

	animate(){
		this.renderer.render(this.scene,this.camera);
		this.camera.position.set(Math.sin(this.time * 0.5) * this.r,this.pY,Math.cos(this.time * 0.5) * this.r);
		this.camera.lookAt(0,0,0);

		if(this.atrium){
			this.atrium.update(this.time);
		}
	}

	onResize(width, height) {
		super.onResize(width,height);
		if(width / height > 1.0){
			this.r = 20;
			this.pY = 10;
		}else{
			this.r = 30;
			this.pY = 12;
		}
	}

    onTouchStart(cursor) { }

    onTouchMove(cursor) { }

    onTouchEnd(cursor) { }
}