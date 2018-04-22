import CookieCutterSuburbia from './CookieCutterSuburbia';
import SmartRender from './SmartRender';
import HouseBuilder from './HouseBuilder';

const canvas: HTMLCanvasElement = document.getElementById('renderCanvas') as HTMLCanvasElement;
const suburbia = new CookieCutterSuburbia(canvas);
const scene = suburbia.scene;

/*
 * TODO:
 * - Animate in
 * - Change example to a tree lot - Grow trees in
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
/*
const houseAnimation = new BABYLON.Animation("houseAnimation", "position.y", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
houseAnimation.setKeys([
	{frame: 0, value: 2},
	{frame: 20, value: 0},
])
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

				/*
				house.animations = [houseAnimation];
				let newAnimation = scene.beginAnimation(house, 0, 20, false, 1, () => {
					house.animations = [];
					console.log('animatables', scene.animatables.length);
					addAnother();
				});
				*/
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
// TODO: look into https://www.babylonjs.com/js/loader.js
scene.debugLayer.show();
