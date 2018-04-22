import * as BABYLON from 'babylonjs';

interface newHouseCallback {
	(house: BABYLON.AbstractMesh): void;
}

export default class HouseBuilder {
	private readonly scene: BABYLON.Scene;
	private readonly callback: (() => void) | undefined;

	private readonly incrementX = 1;
	private readonly incrementZ = -1;
	private readonly xStart = 0;
	private readonly xEnd = 20;
	private nextX: number;
	private nextZ: number;

	private originalHouse: BABYLON.Mesh = null;
	private houses: BABYLON.AbstractMesh[] = [];

	constructor(scene: BABYLON.Scene, callback?: () => void) {
		this.scene = scene;
		this.callback = callback;
		this.clearHouses();
	}

	public getOriginalHouse(callback?: newHouseCallback): void {
		if (this.originalHouse == null) {
			this.addHouseFromModel(callback);
		} else {
			this.executeCallbacks(callback, this.originalHouse);
		}
	}

	public addHouseFromModel(callback?: newHouseCallback): void {
		if (this.originalHouse !== null) {
			// Loaded a house previous, rename it so new one doesn't conflict
			this.originalHouse.id = "houseOriginal_" + this.houses.length;
		}
		BABYLON.SceneLoader.Append("./", "house.babylon", this.scene, () => {
			this.originalHouse = <BABYLON.Mesh>this.scene.getNodeByID("house");
			this.addAndPosition(this.originalHouse);
			this.executeCallbacks(callback, this.originalHouse);
		});
	}

	public addHouseClone(callback?: newHouseCallback): void {
		this.getOriginalHouse((originalHouse) => {
			const house = <BABYLON.Mesh>(originalHouse as BABYLON.Mesh).clone("house_" + this.houses.length);
			this.addAndPosition(house);
			this.executeCallbacks(callback, house);
		});
	}

	public addHouseCreateInstance(callback?: newHouseCallback): void {
		this.getOriginalHouse((originalHouse) => {
			const house = <BABYLON.InstancedMesh>(originalHouse as BABYLON.Mesh).createInstance("house_" + this.houses.length);
			this.addAndPosition(house);
			this.executeCallbacks(callback, house);
		});
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

	public executeCallbacks(callback?: newHouseCallback, house?: BABYLON.AbstractMesh): void {
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
		if (this.houses.length > 0) {
			this.houses.forEach(value => {
				if (value !== this.originalHouse) {
					value.dispose();
				}
			});

			this.houses = [];
			if (this.originalHouse !== null) {
				this.houses.push(this.originalHouse);
			}
		}

		this.nextX = this.xStart;
		this.nextZ = 0;

		this.executeCallbacks();
	}

	public mergeHouses() {
		let mergedHouses = BABYLON.Mesh.MergeMeshes(<BABYLON.Mesh[]>this.houses, true, true)

		const red = new BABYLON.StandardMaterial("red", this.scene);
		red.diffuseColor = new BABYLON.Color3(1, 0, 0);
		mergedHouses.material = red;
	}

}
