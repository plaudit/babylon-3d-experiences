import CookieCutterSuburbia from './CookieCutterSuburbia';
import SmartRender from './SmartRender';
import HouseBuilder from './HouseBuilder';

const canvas: HTMLCanvasElement = document.getElementById('renderCanvas') as HTMLCanvasElement;
const suburbia = new CookieCutterSuburbia(canvas);

/*
 * TODO:
 * - Animate in
 * - Change example to a tree lot - Grow trees in
 */

/* ===================================================================================================
 * Smart Renderer
 */
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

/* ===================================================================================================
 * Houses
 */
const houseBuilder = new HouseBuilder(suburbia.scene, () => {
	// Rerender when house loaded
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
document.getElementById("createInstanceHouse").addEventListener("click", (event: Event) => {
	event.preventDefault();

	let numberToAdd = parseInt(housesNumberToAdd.value);
	function addAnother() {
		if (numberToAdd-- >= 0)
			houseBuilder.addHouseCreateInstance(addAnother);
	}
	addAnother();
});
document.getElementById("clearHouses").addEventListener("click", (event: Event) => {
	event.preventDefault();

	houseBuilder.clearHouses();
});

/* ===================================================================================================
 * Debugger
 */
// TODO: look into https://www.babylonjs.com/js/loader.js
suburbia.scene.debugLayer.show();
