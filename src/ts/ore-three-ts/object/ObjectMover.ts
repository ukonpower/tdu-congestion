import * as THREE from 'three';

export class ObjectMover {
	private objPos: THREE.Vector3;
	private objRot: THREE.Euler;

	private basePos: THREE.Vector3;
	private goalPos: THREE.Vector3;
	private distancePos: THREE.Vector3;

	private baseRot: THREE.Vector3;
	private goalRot: THREE.Vector3;
	private distanceRot: THREE.Vector3;

	private x: number = 0;
	private duration: number = 1.0;

	private deltaTime: number = 0.016;

	private isMoving: boolean = false;
	private onFinish: Function;

	constructor(obj: THREE.Object3D) {

		this.objPos = obj.position;
		this.objRot = obj.rotation;
		this.setBaseTransform();

	}

	private setBaseTransform() {

		this.basePos = this.objPos.clone();
		this.baseRot = this.objRot.toVector3();

	}

	public move(position: THREE.Vector3 = null, rotation: THREE.Euler = null, duration: number = 1.0,callback?: Function) {

		// if(this.isMoving){
		// 	return;
		// }
		
		if (!position) {
			position = this.objPos.clone();
		}

		if (!rotation) {
			rotation = this.objRot.clone();
		}

		if(callback){
			this.onFinish = callback;
		}

		this.duration = duration;

		this.setBaseTransform();

		this.goalPos = position.clone();
		this.goalRot = rotation.toVector3();

		this.distancePos = new THREE.Vector3().subVectors(this.goalPos,this.basePos);
		this.distanceRot = new THREE.Vector3().subVectors(this.goalRot,this.baseRot);

		this.x = 0;
		this.isMoving = true;
	}

	public update() {

		let end = false;

		if (this.isMoving) {

			this.x += this.deltaTime / this.duration; 

			if(this.x > 1.0){

				this.x = 1.0;
				this.isMoving = false;
				end = true; 

			} 

			var w = this.sigmoid(6, this.x);

			this.objPos.set(this.basePos.x + this.distancePos.x * w,this.basePos.y + this.distancePos.y * w,this.basePos.z+ this.distancePos.z* w,);
			this.objRot.set(this.baseRot.x + this.distanceRot.x * w,this.baseRot.y + this.distanceRot.y * w,this.baseRot.z+ this.distanceRot.z* w,);

			if(end){

				this.x = 0.0;

				if(this.onFinish){

					this.onFinish();

				}
			}
		}
	}

	private sigmoid(a, x) {

		var e1 = Math.exp(-a * (2 * x - 1));
		var e2 = Math.exp(-a);
		return (1 + (1 - e1) / (1 + e1) * (1 + e2) / (1 - e2)) / 2;

	}
}