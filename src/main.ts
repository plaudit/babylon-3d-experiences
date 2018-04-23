import CookieCutterSuburbia from './CookieCutterSuburbia';
import SmartRender from './SmartRender';
import HouseBuilder from './HouseBuilder';

const canvas = <HTMLCanvasElement>document.getElementById('renderCanvas');
const suburbia = new CookieCutterSuburbia(canvas);
const scene = suburbia.scene;

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
const housesNumberToAdd = <HTMLInputElement>document.getElementById("housesNumberToAdd");
document.getElementById("cloneHouse").addEventListener("click", (event: Event) => {
	event.preventDefault();
	let numberToAdd = parseInt(housesNumberToAdd.value);
	function addAnother() {
		if (numberToAdd-- > 0)
			houseBuilder.addHouseClone(addAnother);
	}
	addAnother();
});
document.getElementById("createInstanceHouse").addEventListener("click", (event: Event) => {
	event.preventDefault();
	let numberToAdd = parseInt(housesNumberToAdd.value);
	function addAnother() {
		if (numberToAdd-- > 0)
			houseBuilder.addHouseCreateInstance(addAnother);
	}
	addAnother();
});
document.getElementById("clearHouses").addEventListener("click", (event: Event) => {
	event.preventDefault();
	houseBuilder.clearHouses();
});
document.getElementById("mergeHouses").addEventListener("click", (event: Event) => {
	event.preventDefault();
	houseBuilder.mergeHouses();
});

/* ===================================================================================================
 * Box animation
 */
document.getElementById("animationToggle").addEventListener("click", (event: Event) => {
	event.preventDefault();
	suburbia.toggleAnimation();
});

/* ===================================================================================================
 * LOD
 */
document.getElementById("lodManual").addEventListener("click", (event: Event) => {
	event.preventDefault();
	houseBuilder.lodManual();
});
document.getElementById("lodAutomatic").addEventListener("click", (event: Event) => {
	event.preventDefault();
	houseBuilder.lodAutomatic();
});
document.getElementById("lodRemoveAll").addEventListener("click", (event: Event) => {
	event.preventDefault();
	houseBuilder.lodRemoveAll();
});
/* ===================================================================================================
 * Debugger
 */
document.getElementById("debugLayerToggle").addEventListener("click", (event: Event) => {
	event.preventDefault();

	if (scene.debugLayer.isVisible()) {
		scene.debugLayer.hide();
	} else {
		scene.debugLayer.show();
	}
});
