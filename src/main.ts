import CookieCutterSuburbia from './CookieCutterSuburbia';
import SmartRender from './SmartRender';

const canvas: HTMLCanvasElement = document.getElementById('renderCanvas') as HTMLCanvasElement;
const suburbia = new CookieCutterSuburbia(canvas);

const smartRender = new SmartRender(suburbia.scene);
document.getElementById("smartRenderToggle").addEventListener("click", (event: Event) => {
	smartRender.alwaysRender = !smartRender.alwaysRender;
	(<HTMLElement>event.target).classList.toggle("toggleOff", !smartRender.alwaysRender);
});

// TODO: look into https://www.babylonjs.com/js/loader.js
//suburbia.scene.debugLayer.show();
