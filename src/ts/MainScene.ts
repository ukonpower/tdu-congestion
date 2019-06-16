import * as ORE from 'ore-three-ts'
import * as THREE from 'three';

import NoisePostProcessing from './NoisePostProcessing';
import Atrium from './Atrium';
import Floor from './Floor/Floor';
import BoxVisualiser from './BoxVisualizer';
import { CongestionDataFetcher, congestionData } from './CongestionDataFetcher';

//global variables
declare var data: any;

export default class MainScene extends ORE.BaseScene {

	private congestionDataFetcher: CongestionDataFetcher;

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

		window.addEventListener('mousemove', this.onMouseMove.bind(this));

		this.onResize(window.innerWidth, window.innerHeight);

		this.init();

	}

	init() {

		this.congestionDataFetcher = new CongestionDataFetcher();
		this.congestionDataFetcher.onDataFetch = this.onDataFetch.bind(this);

		this.transforms = {

			all: {

				pos: new THREE.Vector3(0, 70, 100),
				rot: new THREE.Euler(-Math.PI / 5, 0, 0),

			},

			atrium: {

				pos: new THREE.Vector3(37, 20, 60),
				rot: new THREE.Euler(-Math.PI / 5, 0, 0),

			},

			lounge: {

				pos: new THREE.Vector3(-10, 20, 30),
				rot: new THREE.Euler(-Math.PI / 6, 0, 0),

			},

			syokudo: {

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
		this.boxVisual = new BoxVisualiser( 50, 200, 2.0 );
		this.scene.add(this.boxVisual);

		//camera & controller
		this.camera.position.copy(this.transforms.all.pos);
		this.camera.rotation.copy(this.transforms.all.rot);

		this.cController = new ORE.TransformAnimator(this.camera);
		this.cController.force = true;

		//lights
		let light = new THREE.DirectionalLight();
		this.scene.add(light);
		let alight = new THREE.AmbientLight();
		this.scene.add(alight);

		//raycaster 
		this.raycaster = new THREE.Raycaster();

		this.mouse = new THREE.Vector2(0, 0);

		//post processing
		this.pp = new NoisePostProcessing(this.renderer);

	}

	animate() {

		if (this.cController) {

			this.cController.update();

		}

		if (this.atrium) {

			this.atrium.update(this.time);

		}

		if (this.floor) {

			this.floor.update(this.time);

		}

		if (this.boxVisual) {

			this.boxVisual.update(this.time);

		}

		this.pp.update(this.time);


		if (true) {

			this.pp.render(this.scene, this.camera);

		}else{

			this.renderer.render(this.scene, this.camera);

		}

	}

	onResize(width, height) {

		super.onResize(width, height);

		if (width / height > 1.0) {

		} else {

		}

	}

	onDataFetch( data: congestionData ){

		this.boxVisual.updateData( data );

	}

	changeMeter(value: number) {

		(document.querySelector('.status') as HTMLElement).style.transition = '2s';
		(document.querySelector('.status-congestion-meter') as HTMLElement).style.height = (value * 100).toString() + '%';
		(document.querySelector('.status-congestion-percentage') as HTMLElement).innerHTML = (value * 100).toString() + '%';

	}

	showStatus(name: string) {

		document.querySelector('.status').classList.add('v');

		document.querySelector('.status-place').innerHTML = name;

	}

	hideStatus() {

		document.querySelector('.status').classList.remove('v');

	}

	switchLocation(name: string) {

		let obj = this.scene.getObjectByName(name);
		if( !obj ) return;

		if( name == 'rounge' ) name = 'lounge';

		if( !this.transforms[name] ){

			console.warn( 'transform data ga naiyo' );
			return;
		
		}
		
		let pos = new THREE.Vector3().addVectors( obj.position, new THREE.Vector3(0, 15, 20));
		let rot = this.transforms[name].rot;

		this.cController.move( pos, rot, 2 );

		this.changeMeter( this.congestionDataFetcher.data[name][0] );
		
		this.showStatus(name);

	}

	resetCamera(){

		this.cController.move(this.transforms.all.pos, this.transforms.all.rot, 2);

	}

	onMouseMove(e: MouseEvent) {

		this.mouse.set(e.x / window.innerWidth * 2.0 - 1, -(e.y / window.innerHeight) * 2 + 1);

	}

	onTouchStart(e) {

		let m = new THREE.Vector2(this.cursor.x / window.innerWidth * 2.0 - 1, -(this.cursor.y / window.innerHeight) * 2 + 1);
		this.raycaster.setFromCamera(m, this.camera);

		const intersects = this.raycaster.intersectObjects(this.atrium.children[0].children);

		for( let i = 0; i < intersects.length; i++ ){
			
			let name = intersects[i].object.name;			

			if( name != 'map' ){
				
				//move camera
				this.switchLocation( name );

			}else{

				this.resetCamera();

				this.hideStatus();

			}

		}

		if( intersects.length == 0 ){

			this.resetCamera();

			this.hideStatus();

		}

	}

	onTouchMove(e) {

		e.preventDefault();

	}

	onTouchEnd(e) {

	}

}