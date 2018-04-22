import CookieCutterSuburbia from './CookieCutterSuburbia';
import SmartRender from './SmartRender';
import HouseBuilder from './HouseBuilder';

const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('renderCanvas');
const suburbia = new CookieCutterSuburbia(canvas);
const scene = suburbia.scene;

/*
 * TODO:
 * - Switch sphere to box - rotate, scale and position it
 * - Add texture to grass
 */

/* ===================================================================================================
 * Smart Renderer
 */
const smartRender = new SmartRender(scene);
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
const houseBuilder = new HouseBuilder(scene, () => {
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
			houseBuilder.addHouseCreateInstance((house) => {
				addAnother();
			});
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
scene.debugLayer.show();
