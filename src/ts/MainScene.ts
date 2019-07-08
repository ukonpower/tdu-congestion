import * as ORE from 'ore-three-ts'
import * as THREE from 'three';

import NoisePostProcessing from './NoisePostProcessing';
import Atrium from './Atrium';
import BoxVisualiser from './BoxVisualizer';
import { CongestionDataFetcher, congestionData } from './CongestionDataFetcher';
import TouchUI from './TouchUI/TouchUI';

//global variables
declare var data: any;

declare interface TouchUIs{
	atrium: TouchUI,
	lounge: TouchUI,
	syokudo: TouchUI,
}

export default class MainScene extends ORE.BaseScene {

	private congestionDataFetcher: CongestionDataFetcher;

	private atrium: Atrium;
	private boxVisual: BoxVisualiser;

	
	private isFocus: boolean = false;
	private cController: ORE.TransformAnimator;
	private raycaster: THREE.Raycaster;
	private radian: number = 0;
	private radius: number = 20;
	private targetObj: THREE.Object3D;
	private targetRot: THREE.Vector3;
	private rotateSpeed: number = 0.0;

	private transforms: any;

	private pp: NoisePostProcessing;

	private mouse: THREE.Vector2;

	private touchUis: TouchUIs = {
		atrium: new TouchUI(),
		lounge: new TouchUI(),
		syokudo: new TouchUI(),
	}

	constructor(renderer) {

		super(renderer);

		this.name = "MainScene";

		window.addEventListener( 'mousemove', this.onMouseMove.bind( this ) );
		document.querySelector( '.status-back').addEventListener( 'click', this.resetCamera.bind(this) );

		this.init();
		
		this.onResize(window.innerWidth, window.innerHeight);

		document.querySelector( '.loading' ).classList.add( 'rm' );
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

		this.atrium.onLoad = () => {

			let keys = Object.keys( this.touchUis );
			
			this.touchUis.atrium.position.copy( this.scene.getObjectByName('atrium').position );
			this.touchUis.lounge.position.copy( this.scene.getObjectByName('rounge').position );
			this.touchUis.syokudo.position.copy( this.scene.getObjectByName('syokudo').position );

			keys.forEach( (key) => {

				this.scene.add( this.touchUis[key] );

			});

		}		

		this.scene.add(this.atrium);

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
		
		if( this.isFocus ){

			this.rotateSpeed *= 0.98;
			this.radian += this.rotateSpeed;

			let baseQ = new THREE.Quaternion().setFromEuler( new THREE.Euler().setFromVector3( this.targetRot ) );
			let q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3( 0, 1, 0 ), this.radian ).multiply( baseQ );
			
			this.camera.quaternion.copy( q );

			this.camera.position.x = this.targetObj.position.x + Math.sin( this.radian ) * this.radius;
			this.camera.position.z = this.targetObj.position.z + Math.cos( this.radian ) * this.radius;

		}

		if (this.cController) {

			this.cController.update();

		}

		if (this.atrium) {

			this.atrium.update(this.time);

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

		let keys = Object.keys( this.touchUis );
		keys.forEach( (key) => {

			this.touchUis[key].update( this.time, this.camera.position.y );

		});
	}

	onResize(width, height) {
		
		super.onResize(width, height);

		if (width / height > 1.0) {

			//pc
			
			this.transforms.all.pos = new THREE.Vector3(0, 150, -20),
			this.transforms.all.rot = new THREE.Euler(-Math.PI / 2, 0, 0),
						
			this.camera.fov = 60.0;


		} else {

			//phone 
			
			this.transforms.all.pos = new THREE.Vector3(0, 130, -20),
			this.transforms.all.rot = new THREE.Euler(-Math.PI / 2, 0, 0),
			this.camera.fov = 90.0;

		}

		if( !this.isFocus ){

			this.resetCamera();
			
		}
		this.camera.updateProjectionMatrix();

	}

	onDataFetch( data: congestionData ){
		
		
		this.boxVisual.updateData( data );

	}

	changeMeter(value: number) {

		(document.querySelector('.status') as HTMLElement).style.transition = '1s';
		(document.querySelector('.status-congestion-meter') as HTMLElement).style.height = (value * 100).toString() + '%';
		(document.querySelector('.status-congestion-percentage') as HTMLElement).innerHTML = (value * 100).toString() + '%';

	}

	showStatus(name: string) {

		document.querySelector('.status').classList.add('v');

		document.querySelector('.status-place').innerHTML = name.toLocaleUpperCase();

	}

	hideStatus() {

		document.querySelector('.status').classList.remove('v');

	}

	switchLocation(name: string) {

		let obj = this.scene.getObjectByName(name);
		if( !obj ) return;

		if( obj == this.targetObj ) return;

		if( name == 'rounge' ) name = 'lounge';

		if( !this.transforms[name] ){

			console.warn( 'transform data ga naiyo' );
			return;
		
		}
		
		let pos = new THREE.Vector3().addVectors( obj.position, new THREE.Vector3(0, 15, this.radius));
		let rot = this.transforms[name].rot;

		this.targetObj = obj;
		this.targetRot = rot;

		this.cController.move( pos, rot, 2 , () => {			
			this.isFocus = true;
			this.radian = 0;
			this.radius = 20;
			this.rotateSpeed = 0.0;
		} );

		this.changeMeter( this.congestionDataFetcher.data[name][0] );
		
		this.showStatus(name);

	}

	resetCamera(){

		this.isFocus = false;
		this.cController.move( this.transforms.all.pos, this.transforms.all.rot, 2, ()=>{});
		this.targetObj = null;
		this.hideStatus();

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

			}

		}

	}

	onTouchMove(e) {
		
		this.rotateSpeed -= this.cursor.deltaX * 0.0005;

		e.preventDefault();

	}

	onTouchEnd(e) {

	}

}