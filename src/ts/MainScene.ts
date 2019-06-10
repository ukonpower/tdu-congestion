import * as ORE from 'ore-three-ts'
import * as THREE from 'three';

import NoisePostProcessing from './NoisePostProcessing';
import Atrium from './Atrium';
import Floor from './Floor/Floor';
import BoxVisualiser from './BoxVisualizer';

//global variables
declare var data: any;

export default class MainScene extends ORE.BaseScene {

	private atrium: Atrium;
	private floor: Floor;
	private boxVisual: BoxVisualiser;

	private cController: ORE.TransformAnimator;
	private raycaster: THREE.Raycaster;

	private transforms: any;

	private pp: NoisePostProcessing;

	private mouse: THREE.Vector2;

	constructor(renderer) {

		super(renderer);
		
		this.name = "MainScene";

		window.addEventListener('mousemove',this.onMouseMove.bind(this));
		
		this.onResize(window.innerWidth, window.innerHeight);
		
		this.init();

	}

	init() {

		this.transforms = {

			all: {

				pos: new THREE.Vector3(0, 70, 100),
				rot: new THREE.Euler(-Math.PI / 5, 0, 0),

			},

			Atrium: {
			
				pos: new THREE.Vector3(37, 20, 60),
				rot: new THREE.Euler(-Math.PI / 5, 0, 0),
			
			},
			
			Convini: {
			
				pos: new THREE.Vector3(-10, 20, 30),
				rot: new THREE.Euler(-Math.PI / 6, 0, 0),
			
			},
			
			Syokudo: {
			
				pos: new THREE.Vector3(-40, 20, -20),
				rot: new THREE.Euler(-Math.PI / 6, 0, 0),
			
			},

		}

		//atrium
		this.atrium = new Atrium();
		this.scene.add(this.atrium);
		
		//data floor
		// this.floor = new Floor();
		// this.scene.add(this.floor);

		//box visualizer
		this.boxVisual = new BoxVisualiser( 150, 80 );
		this.boxVisual.position.y = -5.5;
		this.scene.add( this.boxVisual );

		//camera & controller
		this.camera.position.copy(this.transforms.all.pos);
		this.camera.rotation.copy(this.transforms.all.rot);
		
		this.cController = new ORE.TransformAnimator(this.camera);
		this.cController.force = true;
		
		//lights
		let light = new THREE.DirectionalLight();
		this.scene.add( light );
		let alight = new THREE.AmbientLight();
		this.scene.add( alight );

		//raycaster 
		this.raycaster = new THREE.Raycaster();

		this.mouse = new THREE.Vector2(0,0);

		//post processing
		this.pp = new NoisePostProcessing(this.renderer);

	}

	showStatus(name: string){
		document.querySelector('.status').classList.add('v');
		document.querySelector('.status-place').innerHTML = name;
	}

	hideStatus(){
		document.querySelector('.status').classList.remove('v');
	}

	animate() {
		
		if (this.cController) {
		
			this.cController.update();
		
		}

		if (this.atrium) {
		
			this.atrium.update(this.time);
		
		}

		if ( this.floor ){

			this.floor.update( this.time );

		}

		if ( this.boxVisual ){

			this.boxVisual.update(this.time);
		
		}
		
		// this.camera.rotation.y = this.transforms.all.rot.y + this.mouse.x * -0.05;
		// this.camera.rotation.x = this.transforms.all.rot.x + this.mouse.y * 0.05;

		this.pp.update(this.time);

		this.pp.render(this.scene,this.camera);

		// this.renderer.render(this.scene, this.camera);	
	
	}

	onResize(width, height) {
	
		super.onResize(width, height);
	
		if (width / height > 1.0) {
	
		} else {
	
		}
	
	}

	onMouseMove(e: MouseEvent) {

		this.mouse.set(e.x / window.innerWidth * 2.0 - 1, -(e.y / window.innerHeight) * 2 + 1);
		
	}

	changeMeter(value: number){

		(document.querySelector( '.status' ) as HTMLElement ).style.transition = '2s';
		(document.querySelector( '.status-congestion-meter' ) as HTMLElement ).style.height = ( value * 100).toString() + '%';
		(document.querySelector( '.status-congestion-percentage' ) as HTMLElement ).innerHTML = ( value * 100 ).toString() + '%';
	}

	onTouchStart(e) {

		let m = new THREE.Vector2(this.cursor.x / window.innerWidth * 2.0 - 1, -(this.cursor.y / window.innerHeight) * 2 + 1);
		this.raycaster.setFromCamera(m, this.camera);

		const intersects = this.raycaster.intersectObjects(this.atrium.children[0].children);

		for (let i = 0; i < intersects.length; i++) {
			
			let pos = new THREE.Vector3().addVectors(intersects[i].object.position, new THREE.Vector3(0,15,20));
			let name = intersects[i].object.name;

			switch (name) {
			
				case 'atrium':
					this.cController.move(pos , this.transforms.Atrium.rot, 2);
					this.changeMeter(0.5);
					break;
				case 'rounge':
					this.cController.move(pos, this.transforms.Convini.rot, 2);
					this.changeMeter(0.5);
					break;
				case 'syokudo':
					this.cController.move(pos, this.transforms.Syokudo.rot, 2);
					this.changeMeter(0.7);
					break;
				default:
			
			}

			if(name != 'map'){
				this.showStatus(name);
			}
		
		}

		if (intersects.length == 0) {

			this.cController.move(this.transforms.all.pos, this.transforms.all.rot, 2);
		
			this.hideStatus();
		}
	}


	onTouchMove(e) {
	
		e.preventDefault();
	
	}

	onTouchEnd(e) {

	}

}