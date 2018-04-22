import * as BABYLON from 'babylonjs';

interface newHouseCallBack {
	(house: BABYLON.AbstractMesh): void;
}

export default class HouseBuilder {
	private readonly scene: BABYLON.Scene;
	private readonly callback: (() => void) | undefined;

	private readonly incrementX = 1;
	private readonly incrementZ = -1;
	private readonly xStart = -10;
	private readonly xEnd = 10;
	private nextX: number;
	private nextZ: number;

	private originalHouse: BABYLON.Mesh = null;
	private houses: BABYLON.AbstractMesh[] = null;

	constructor(scene: BABYLON.Scene, callback?: () => void) {
		this.scene = scene;
		this.callback = callback;
		this.clearHouses();
	}

	public addHouseFromModel(callback?: newHouseCallBack): void {
		BABYLON.SceneLoader.Append("./", "house.babylon", this.scene, () => {
			console.log('House loaded');

			this.originalHouse = <BABYLON.Mesh>this.scene.getNodeByID("house");
			this.addAndPosition(this.originalHouse);

			this.executeCallbacks();
		});
	}

	public addHouseClone(callback?: newHouseCallBack): void {
		console.log('Clone');

		const house = <BABYLON.Mesh>this.originalHouse.clone("house_" + this.houses.length);
		this.addAndPosition(house);

		this.executeCallbacks(callback, house);
	}

	public addHouseCreateInstance(callback?: newHouseCallBack): void {
		console.log('New instance');

		const house = <BABYLON.InstancedMesh>this.originalHouse.createInstance("house_" + this.houses.length);
		this.addAndPosition(house);

		this.executeCallbacks(callback, house);
	}

	private addAndPosition(house: BABYLON.AbstractMesh) {
		this.houses.push(house);

		house.position.y = 0;
		house.position.x = this.nextX;
		house.position.z = this.nextZ;

		this.nextX += this.incrementX;
		if (this.nextX >= this.xEnd) {
			this.nextX = this.xStart;
			this.nextZ += this.incrementZ;
		}
	}

	public executeCallbacks(callback?: newHouseCallBack, house?: BABYLON.AbstractMesh): void {
		window.setTimeout(() => {
			if (callback !== undefined) {
				callback(house);
			}
			if (this.callback !== undefined) {
				this.callback();
			}
		}, 0);
	}

	public clearHouses() {
		if (this.houses !== null) {
			this.houses.forEach(value => {
				if (value !== this.originalHouse) {
					value.dispose();
				}
			});
		}
		this.houses = [];
		if (this.originalHouse !== null) {
			this.houses.push(this.originalHouse);
		}

		this.nextX = this.xStart;
		this.nextZ = 10;

		this.executeCallbacks();
	}
}
