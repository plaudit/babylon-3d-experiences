import * as BABYLON from 'babylonjs';

export default class HouseBuilder {
	private scene: BABYLON.Scene;
	private callback: (() => void) | undefined;

	constructor(scene: BABYLON.Scene, callback?: () => void) {
		this.scene = scene;
		this.callback = callback;
	}

	public addHouseFromModel(callback?: () => void): void {
		BABYLON.SceneLoader.Append("./", "house.babylon", this.scene, () => {
			console.log('House loaded');
			if (callback !== undefined) {
				callback();
			}
			if (this.callback !== undefined) {
				this.callback();
			}
		});
	}

	public addHouseClone(callback?: () => void): void {
		console.log('clone');

		callback();
	}

	public addHouseNewInstance(callback?: () => void): void {
		console.log('new instance');

		callback();
	}

}
