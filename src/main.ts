import CookieCutterSuburbia from './CookieCutterSuburbia';
import SmartRender from './SmartRender';
import HouseBuilder from './HouseBuilder';
import ILoadingScreen = BABYLON.ILoadingScreen;

const canvas: HTMLCanvasElement = document.getElementById('renderCanvas') as HTMLCanvasElement;
const suburbia = new CookieCutterSuburbia(canvas);
const engine = suburbia.scene.getEngine();

const smartRender = new SmartRender(suburbia.scene);
const smartRenderToggle = document.getElementById("smartRenderToggle");
function updateSmartRenderToggleStyleClass() {
	smartRenderToggle.classList.toggle("toggleOff", !smartRender.alwaysRender);
}
smartRenderToggle.addEventListener("click", (event: Event) => {
	smartRender.alwaysRender = !smartRender.alwaysRender;
	updateSmartRenderToggleStyleClass();
});
updateSmartRenderToggleStyleClass();

const houseBuilder = new HouseBuilder(suburbia.scene, () => {
	// Rerender when house loaded
	event.preventDefault();
	smartRender.forceRenderOnce = true;
});
houseBuilder.addHouseFromModel();
const housesNumberToAdd = <HTMLInputElement>document.getElementById("housesNumberToAdd");
document.getElementById("cloneHouse").addEventListener("click", (event: Event) => {
	event.preventDefault();

	let numberToAdd = parseInt(housesNumberToAdd.value);
	function addAnother() {
		if (numberToAdd-- >= 0)
			houseBuilder.addHouseClone(addAnother);
	}
	addAnother();
});
document.getElementById("newInstanceHouse").addEventListener("click", (event: Event) => {
	event.preventDefault();

	let numberToAdd = parseInt(housesNumberToAdd.value);
	function addAnother() {
		if (numberToAdd-- >= 0)
			houseBuilder.addHouseNewInstance(addAnother);
	}
	addAnother();
});

// TODO: look into https://www.babylonjs.com/js/loader.js
suburbia.scene.debugLayer.show();
