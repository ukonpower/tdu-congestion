import * as ORE from './ore-three-ts'
import * as THREE from 'three';

import Atrium from './Atrium';

export default class MainScene extends ORE.BaseScene {
	private atrium: Atrium;
	private r: number = 20;
	private pY: number = 10;
	private cController: ORE.ObjectMover;
	private raycaster: THREE.Raycaster;

	private transforms: any;

	constructor(renderer) {
		super(renderer);
		this.name = "MainScene";
		this.onResize(window.innerWidth, window.innerHeight);
		this.init();
	}

	init() {
		// let box = new THREE.BoxGeometry(1,1,1);
		// let mt = new THREE.MeshNormalMaterial();
		// this.scene.add(new THREE.Mesh(box,mt));

		this.transforms = {
			all: {
				pos: new THREE.Vector3(0, 20, 70),
				rot: new THREE.Euler(-Math.PI / 15, 0, 0),
			},
			Atrium: {
				pos: new THREE.Vector3(-30, 20, 30),
				rot: new THREE.Euler(-Math.PI / 6, 0, 0),
			},
			Convini: {
				pos: new THREE.Vector3(0, 20, 30),
				rot: new THREE.Euler(-Math.PI / 7, 0, 0),
			},
			Syokudo: {
				pos: new THREE.Vector3(30, 20, 30),
				rot: new THREE.Euler(-Math.PI / 7, 0, 0),
			},
		}

		this.atrium = new Atrium();
		this.scene.add(this.atrium);
		this.camera.position.copy(this.transforms.all.pos);
		this.camera.rotation.copy(this.transforms.all.rot);
		this.cController = new ORE.ObjectMover(this.camera);
		this.raycaster = new THREE.Raycaster();
	}

	animate() {
		this.renderer.render(this.scene, this.camera);

		if (this.cController) {
			this.cController.update();
		}

		if (this.atrium) {
			this.atrium.update(this.time);
		}
	}

	onResize(width, height) {
		super.onResize(width, height);
		if (width / height > 1.0) {
			this.r = 20;
			this.pY = 10;
		} else {
			this.r = 30;
			this.pY = 12;
		}
	}

	onTouchStart(e) {
		let m = new THREE.Vector2(this.cursor.x / window.innerWidth * 2.0 - 1, -(this.cursor.y / window.innerHeight) * 2 + 1);
		this.raycaster.setFromCamera(m, this.camera);

		const intersects = this.raycaster.intersectObjects(this.atrium.children[0].children);

		if (intersects.length > 0) {
			switch (intersects[0].object.name) {
				case 'Atrium':
					this.cController.move(this.transforms.Atrium.pos, this.transforms.Atrium.rot, 2);
					break;
				case 'Cube':
					this.cController.move(this.transforms.Convini.pos, this.transforms.Convini.rot, 2);
					break;
				case 'Syokudo':
					this.cController.move(this.transforms.Syokudo.pos, this.transforms.Syokudo.rot, 2);
					break;
			}
		} else {
			this.cController.move(this.transforms.all.pos, this.transforms.all.rot, 2);
		}
	}

	onTouchMove(e) {
		e.preventDefault();
	}

	onTouchEnd(e) {

	}
}