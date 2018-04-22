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

		// TODO: remove?
		this.scene.shadowsEnabled = false;

		const camera = new BABYLON.UniversalCamera("camera", new BABYLON.Vector3(-11, 1, 13), this.scene);
		camera.rotation = new BABYLON.Vector3(0.19, 9, 0);
		camera.speed = 0.4;
		camera.attachControl(canvas, true);

		const hemiLight = new BABYLON.HemisphericLight('hemiLight', new BABYLON.Vector3(-0.5, -1, -0.5), this.scene);
		hemiLight.intensity = 0.2;

		const pointLight = new BABYLON.PointLight('pointLight', new BABYLON.Vector3(-12, 5, 14), this.scene);
		pointLight.intensity = 0.50;

		const pointLight_2 = new BABYLON.PointLight('pointLight_2', new BABYLON.Vector3(8, 35, 22), this.scene);
		pointLight_2.intensity = 0.50;

		let box = BABYLON.MeshBuilder.CreateBox("box", {width: 1, height: 1, depth: 1}, this.scene);
		box.position.y = 2;
		box.rotation = new BABYLON.Vector3(.5, .5, .5);
		const red = new BABYLON.StandardMaterial("red", this.scene);
		red.diffuseColor = new BABYLON.Color3(1, 0, 0);
		box.material = red;

		let ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 80, height: 80, subdivisions: 8}, this.scene);
		/*
		const green = new BABYLON.StandardMaterial("red", this.scene);
		green.diffuseColor = new BABYLON.Color3(0, 0.6, 0.20);
		ground.material = green;
		*/
		let groundTexture = new BABYLON.Texture("grass.jpg", this.scene);
		groundTexture.uScale = 60;
		groundTexture.vScale = 60;
		let groundMaterial = new BABYLON.StandardMaterial("grass", this.scene);
		groundMaterial.diffuseTexture = groundTexture;
		const installMaterialWhenTextureReady = () => {
			if (groundTexture.isReady()) {
				ground.material = groundMaterial;
				this.scene.render();
				clearInterval(intervalID);
			}
		}
		let intervalID = setInterval(installMaterialWhenTextureReady, 100);
	}
}
