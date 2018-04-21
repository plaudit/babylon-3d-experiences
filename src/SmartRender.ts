import * as BABYLON from 'babylonjs';

export default class SmartRenderer {
	public alwaysRender: boolean = true;
	public forceRenderOnce: boolean = false;

	private scene: BABYLON.Scene;
	private lastPosition: BABYLON.Vector3 = null;
	private lastRotation: BABYLON.Vector3 = null;

	constructor(scene: BABYLON.Scene) {
		this.scene = scene;
		scene.getEngine().runRenderLoop(this.onRender);
		window.addEventListener('resize', this.onWinResize);
	}

	private readonly onWinResize = (): void => {
		this.scene.getEngine().resize();
		this.forceRenderOnce = true;
	}

	private readonly onRender = (): void => {
		if (this.isRenderNeeded()) {
			const activeCamera = <BABYLON.TargetCamera>this.scene.activeCamera;
			this.lastPosition = activeCamera.position.clone();
			this.lastRotation = activeCamera.rotation.clone();

			this.forceRenderOnce = false;

			console.log('Rendering');
			this.scene.render();
		}
	}

	private isRenderNeeded(): boolean {
		if (this.alwaysRender == true || this.forceRenderOnce === true || this.scene.animatables.length > 0) {
			return true;
		}

		// Has camera moved?
		const activeCamera = <BABYLON.TargetCamera>this.scene.activeCamera;
		activeCamera.update(); // Must call update so position and lastRotation are correct
		if (!this.lastPosition.equals(activeCamera.position) || !this.lastRotation.equals(activeCamera.rotation)) {
			return true;
		}

		if (this.scene.debugLayer.isVisible()) {
			return true;
		}

		return false;
	}
}
