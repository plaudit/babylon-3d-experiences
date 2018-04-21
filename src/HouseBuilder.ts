import * as BABYLON from 'babylonjs';

interface newHouseCallBack {
	(house: BABYLON.AbstractMesh): void;
}

export default class HouseBuilder {
	private scene: BABYLON.Scene;
	private callback: (() => void) | undefined;
	private originalHouse: BABYLON.Mesh;
	private houses: BABYLON.AbstractMesh[] = [];

	constructor(scene: BABYLON.Scene, callback?: () => void) {
		this.scene = scene;
		this.callback = callback;
	}

	public addHouseFromModel(callback?: newHouseCallBack): void {
		BABYLON.SceneLoader.Append("./", "house.babylon", this.scene, () => {
			console.log('House loaded');

			this.originalHouse = <BABYLON.Mesh>this.scene.getNodeByID("house");
			this.houses.push(this.originalHouse);

			if (callback !== undefined) {
				callback(this.originalHouse);
			}
			if (this.callback !== undefined) {
				this.callback();
			}
		});
	}

	public addHouseClone(callback?: newHouseCallBack): void {
		console.log('clone');

		const house = <BABYLON.Mesh>this.originalHouse.clone("house_" + this.houses.length);
		this.addAndPosition(house);

		callback(house);
	}

	public addHouseCreateInstance(callback?: newHouseCallBack): void {
		console.log('new instance');

		const house = <BABYLON.InstancedMesh>this.originalHouse.createInstance("house_" + this.houses.length);
		this.addAndPosition(house);

		callback(house);
	}

	private addAndPosition(house: BABYLON.AbstractMesh) {
		this.houses.push(house);

		house.position.y =+ this.houses.length * 2;
	}
}
