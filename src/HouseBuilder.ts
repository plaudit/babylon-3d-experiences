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

	public getOriginalHouse(callback: newHouseCallback): void {
		if (this.originalHouse !== null) {
			// Already loaded
			this.executeCallbacks(callback, this.originalHouse);
		} else {
			// Not yet loaded
			BABYLON.SceneLoader.Append("./", "house.babylon", this.scene, () => {
				let house = <BABYLON.Mesh>this.scene.getNodeByID("house");

				// Very first one, we hide it because it is meant as more a template
				house.setEnabled(false);
				this.originalHouse = house;

				this.executeCallbacks(callback, house);
			});
		}
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
			// Remove the houses
			this.houses.forEach(value => {
				value.dispose();
			});
			this.houses = [];
		}

		// Restart positioning
		this.nextX = this.xStart;
		this.nextZ = 0;

		// Inform callback that a change took place
		this.executeCallbacks();
	}

	public mergeHouses() {
		let mergedHouses = BABYLON.Mesh.MergeMeshes(<BABYLON.Mesh[]>this.houses, true, true)

		const red = new BABYLON.StandardMaterial("red", this.scene);
		red.diffuseColor = new BABYLON.Color3(1, 0, 0);
		mergedHouses.material = red;
	}

	public lodManual() {
		this.lodRemoveAll();
		this.getOriginalHouse((arg) => {
			const original = arg as BABYLON.Mesh;
			this._lodRemoveAll(original);

			// Create box
			const box = BABYLON.MeshBuilder.CreateBox(original.id + "_box", {width: 0.5, height: 0.7, depth: 0.5}, this.scene);
			const boxMaterial = new BABYLON.StandardMaterial(original.id + "_material", this.scene);
			boxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
			box.material = boxMaterial;
			box.setEnabled(false);

			original.addLODLevel(15, box);
		});
	}

	public lodAutomatic() {
		alert('TODO: Implement');

		this.getOriginalHouse((arg) => {
			const original = arg as BABYLON.Mesh;
			this._lodRemoveAll(original);
			// TODO:
		});
	}

	public lodRemoveAll() {
		this.getOriginalHouse((arg) => {
			this._lodRemoveAll(arg as BABYLON.Mesh);
		});
	}
	private _lodRemoveAll(original: BABYLON.Mesh) {
		original.getLODLevels().forEach((lodLevel) => {
			original.removeLODLevel(lodLevel.mesh);
		})
	}

}
