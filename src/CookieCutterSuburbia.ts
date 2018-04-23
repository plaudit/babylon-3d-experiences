import * as BABYLON from 'babylonjs';
import Texture = BABYLON.Texture;

export default class CookieCutterSuburbia {
	public scene: BABYLON.Scene;

	private readonly frameRate = 200;
	private box: BABYLON.Mesh;
	private yRot: BABYLON.Animation;
	private boxAnimatable: BABYLON.Animatable = null;

	constructor(canvas: HTMLCanvasElement) {
		const adaptToDeviceRatio = false;
		const engine = new BABYLON.Engine(canvas, true, {}, adaptToDeviceRatio);

		const scene = new BABYLON.Scene(engine);
		scene.clearColor = new BABYLON.Color4(0.5, 0.8, 0.8, 1);
		scene.ambientColor = new BABYLON.Color3(0.3, 0.3, 0.3);

		const camera = new BABYLON.UniversalCamera("camera", new BABYLON.Vector3(-5, 1.5, 4), scene);
		camera.rotation = new BABYLON.Vector3(0.14, 8.5, 0);
		camera.speed = 0.4;
		camera.attachControl(canvas, true);

		const hemiLight = new BABYLON.HemisphericLight('hemiLight', new BABYLON.Vector3(-0.5, -1, -0.5), scene);
		hemiLight.intensity = 0.2;

		const pointLight = new BABYLON.PointLight('pointLight', new BABYLON.Vector3(-3, 5, 3), scene);
		pointLight.intensity = 0.50;

		const pointLight_2 = new BABYLON.PointLight('pointLight_2', new BABYLON.Vector3(8, 35, 22), scene);
		pointLight_2.intensity = 0.50;

		// Create box
		const box = BABYLON.MeshBuilder.CreateBox("box", {width: 1, height: 1, depth: 1}, scene);
		box.position.y = 1.5;
		box.rotation = new BABYLON.Vector3(Math.PI/4, Math.PI/4, Math.PI/4);

		// Create ground
		const ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 80, height: 80, subdivisions: 8}, scene);

		// Material for box
		const red = new BABYLON.StandardMaterial("red", scene);
		red.diffuseColor = new BABYLON.Color3(1, 0, 0);
		box.material = red;

		// Material for ground
		const groundTexture = new BABYLON.Texture("./grass.jpg", scene);
		groundTexture.uScale = 8;
		groundTexture.vScale = 8;
		groundTexture.wrapU = Texture.MIRROR_ADDRESSMODE;
		groundTexture.wrapV = Texture.MIRROR_ADDRESSMODE;
		const groundMaterial = new BABYLON.StandardMaterial("grass", scene);
		groundMaterial.diffuseTexture = groundTexture;
		const installMaterialWhenTextureReady = () => {
			if (groundTexture.isReady()) {
				ground.material = groundMaterial;
				scene.render();
				clearInterval(intervalID);
			}
		}
		let intervalID = setInterval(installMaterialWhenTextureReady, 100);

		// Rotate box the box
		let yRot = new BABYLON.Animation("yRot", "rotation.y", this.frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
		var keyFramesR = [];
		keyFramesR.push({
			frame: 0,
			value: 0
		});
		keyFramesR.push({
			frame: 2 * this.frameRate,
			value: 2 * Math.PI
		});
		yRot.setKeys(keyFramesR);

		this.yRot = yRot;
		this.box = box;
		this.scene = scene;
	}

	public toggleAnimation() {
		if (this.boxAnimatable === null) {
			this.boxAnimatable = this.scene.beginDirectAnimation(this.box, [this.yRot], 0, 2 * this.frameRate, true);
		} else {
			this.boxAnimatable.stop();
			this.boxAnimatable = null;
		}
	}
}
