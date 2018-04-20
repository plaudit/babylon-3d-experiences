import * as BABYLON from 'babylonjs';

class Main {
	private engine: BABYLON.Engine;
	private scene: BABYLON.Scene;
	private canvas: HTMLCanvasElement;

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;

		const engine = this.engine = new BABYLON.Engine(
			this.canvas,
			true,	// antialias
			{},		// options
			true	// adaptToDeviceRatio
		);

		const scene = this.scene = new BABYLON.Scene(this.engine);

		// Add a camera to the scene and attach it to the canvas
		const camera = new BABYLON.ArcRotateCamera('Camera', Math.PI / 2, Math.PI / 2, 2, BABYLON.Vector3.Zero(), scene);
		camera.attachControl(canvas, true);

		// Add lights to the scene
		const light1 = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(1, 1, 0), scene);
		const light2 = new BABYLON.PointLight('light2', new BABYLON.Vector3(0, 1, -1), scene);

		// This is where you create and manipulate meshes
		const sphere = BABYLON.MeshBuilder.CreateSphere('sphere', {}, scene);

		// Register a render loop to repeatedly render the scene
		engine.runRenderLoop(function () {
			scene.render();
		});


		// Watch for browser/canvas resize events
		window.addEventListener('resize', function () {
			engine.resize();
		});
	}
}

console.log('test');
const canvas: HTMLCanvasElement = document.getElementById('renderCanvas') as HTMLCanvasElement;
new Main(canvas);