import * as BABYLON from 'babylonjs';

export default class CookieCutterSuburbia {
	public scene: BABYLON.Scene;

	constructor(canvas: HTMLCanvasElement) {
		const engine = new BABYLON.Engine(
			canvas,
			true,	// antialias
			{},		// options
			true	// adaptToDeviceRatio
		);

		this.scene = new BABYLON.Scene(engine);

		const camera = new BABYLON.UniversalCamera("camera", new BABYLON.Vector3(0, 5, -10), this.scene);
		camera.speed = 0.5;
		camera.setTarget(BABYLON.Vector3.Zero());
		camera.attachControl(canvas, true);

		const light1 = new BABYLON.HemisphericLight("hemisphericLight", new BABYLON.Vector3(0, 1, 0), this.scene);
		const light2 = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(0, 1, -1), this.scene);

		let sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {segments: 16, diameter: 1}, this.scene);
		// Move the sphere upward 1/2 of its height.
		sphere.position.y = 2;
		const red = new BABYLON.StandardMaterial("red", this.scene);
		red.diffuseColor = new BABYLON.Color3(1, 0, 0);
		//red.specularColor = new BABYLON.Color3(0.5, 0.6, 0.87);
		//red.emissiveColor = new BABYLON.Color3(1, 1, 1);
		//red.ambientColor = new BABYLON.Color3(0.23, 0.98, 0.53);
		sphere.material = red;

		let ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 6, height: 6, subdivisions: 2}, this.scene);
		const green = new BABYLON.StandardMaterial("red", this.scene);
		green.diffuseColor = new BABYLON.Color3(0, 0.6, 0.20);
		ground.material = green;
	}
}
