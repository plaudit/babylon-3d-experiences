(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BABYLON = require("babylonjs");
var Texture = BABYLON.Texture;
var CookieCutterSuburbia = /** @class */ (function () {
    function CookieCutterSuburbia(canvas) {
        this.frameRate = 200;
        this.boxAnimatable = null;
        var adaptToDeviceRatio = false;
        var engine = new BABYLON.Engine(canvas, true, {}, adaptToDeviceRatio);
        var scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color4(0.5, 0.8, 0.8, 1);
        scene.ambientColor = new BABYLON.Color3(0.3, 0.3, 0.3);
        var camera = new BABYLON.UniversalCamera("camera", new BABYLON.Vector3(-5, 1.5, 4), scene);
        camera.rotation = new BABYLON.Vector3(0.14, 8.5, 0);
        camera.speed = 0.4;
        camera.attachControl(canvas, true);
        var hemiLight = new BABYLON.HemisphericLight('hemiLight', new BABYLON.Vector3(-0.5, -1, -0.5), scene);
        hemiLight.intensity = 0.2;
        var pointLight = new BABYLON.PointLight('pointLight', new BABYLON.Vector3(-3, 5, 3), scene);
        pointLight.intensity = 0.50;
        var pointLight_2 = new BABYLON.PointLight('pointLight_2', new BABYLON.Vector3(8, 35, 22), scene);
        pointLight_2.intensity = 0.50;
        // Create box
        var box = BABYLON.MeshBuilder.CreateBox("box", { width: 1, height: 1, depth: 1 }, scene);
        box.position.y = 1.5;
        box.rotation = new BABYLON.Vector3(Math.PI / 4, Math.PI / 4, Math.PI / 4);
        // Create ground
        var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 80, height: 80, subdivisions: 8 }, scene);
        // Material for box
        var red = new BABYLON.StandardMaterial("red", scene);
        red.diffuseColor = new BABYLON.Color3(1, 0, 0);
        box.material = red;
        // Material for ground
        var groundTexture = new BABYLON.Texture("./grass.jpg", scene);
        groundTexture.uScale = 8;
        groundTexture.vScale = 8;
        groundTexture.wrapU = Texture.MIRROR_ADDRESSMODE;
        groundTexture.wrapV = Texture.MIRROR_ADDRESSMODE;
        var groundMaterial = new BABYLON.StandardMaterial("grass", scene);
        groundMaterial.diffuseTexture = groundTexture;
        var installMaterialWhenTextureReady = function () {
            if (groundTexture.isReady()) {
                ground.material = groundMaterial;
                scene.render();
                clearInterval(intervalID);
            }
        };
        var intervalID = setInterval(installMaterialWhenTextureReady, 100);
        // Rotate box the box
        var yRot = new BABYLON.Animation("yRot", "rotation.y", this.frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
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
    CookieCutterSuburbia.prototype.toggleAnimation = function () {
        if (this.boxAnimatable === null) {
            this.boxAnimatable = this.scene.beginDirectAnimation(this.box, [this.yRot], 0, 2 * this.frameRate, true);
        }
        else {
            this.boxAnimatable.stop();
            this.boxAnimatable = null;
        }
    };
    return CookieCutterSuburbia;
}());
exports.default = CookieCutterSuburbia;
},{"babylonjs":"babylonjs"}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BABYLON = require("babylonjs");
var HouseBuilder = /** @class */ (function () {
    function HouseBuilder(scene, callback) {
        this.incrementX = 1;
        this.incrementZ = -1;
        this.xStart = 0;
        this.xEnd = 20;
        this.originalHouse = null;
        this.houses = [];
        this.scene = scene;
        this.callback = callback;
        this.clearHouses();
    }
    HouseBuilder.prototype.getOriginalHouse = function (callback) {
        var _this = this;
        if (this.originalHouse !== null) {
            // Already loaded
            this.executeCallbacks(callback, this.originalHouse);
        }
        else {
            // Not yet loaded
            BABYLON.SceneLoader.Append("./", "house.babylon", this.scene, function () {
                var house = _this.scene.getNodeByID("house");
                // Very first one, we hide it because it is meant as more a template
                house.setEnabled(false);
                _this.originalHouse = house;
                _this.executeCallbacks(callback, house);
            });
        }
    };
    HouseBuilder.prototype.addHouseClone = function (callback) {
        var _this = this;
        this.getOriginalHouse(function (originalHouse) {
            var house = originalHouse.clone("house_" + _this.houses.length);
            _this.addAndPosition(house);
            _this.executeCallbacks(callback, house);
        });
    };
    HouseBuilder.prototype.addHouseCreateInstance = function (callback) {
        var _this = this;
        this.getOriginalHouse(function (originalHouse) {
            var house = originalHouse.createInstance("house_" + _this.houses.length);
            _this.addAndPosition(house);
            _this.executeCallbacks(callback, house);
        });
    };
    HouseBuilder.prototype.addAndPosition = function (house) {
        this.houses.push(house);
        house.position.y = 0;
        house.position.x = this.nextX;
        house.position.z = this.nextZ;
        this.nextX += this.incrementX;
        if (this.nextX >= this.xEnd) {
            this.nextX = this.xStart;
            this.nextZ += this.incrementZ;
        }
    };
    HouseBuilder.prototype.executeCallbacks = function (callback, house) {
        var _this = this;
        window.setTimeout(function () {
            if (callback !== undefined) {
                callback(house);
            }
            if (_this.callback !== undefined) {
                _this.callback();
            }
        }, 0);
    };
    HouseBuilder.prototype.clearHouses = function () {
        if (this.houses.length > 0) {
            // Remove the houses
            this.houses.forEach(function (value) {
                value.dispose();
            });
            this.houses = [];
        }
        // Restart positioning
        this.nextX = this.xStart;
        this.nextZ = 0;
        // Inform callback that a change took place
        this.executeCallbacks();
    };
    HouseBuilder.prototype.mergeHouses = function () {
        var mergedHouses = BABYLON.Mesh.MergeMeshes(this.houses, true, true);
        var red = new BABYLON.StandardMaterial("red", this.scene);
        red.diffuseColor = new BABYLON.Color3(1, 0, 0);
        mergedHouses.material = red;
    };
    HouseBuilder.prototype.lodManual = function () {
        var _this = this;
        this.lodRemoveAll();
        this.getOriginalHouse(function (arg) {
            var original = arg;
            _this._lodRemoveAll(original);
            // Create box
            var box = BABYLON.MeshBuilder.CreateBox(original.id + "_box", { width: 0.5, height: 0.7, depth: 0.5 }, _this.scene);
            var boxMaterial = new BABYLON.StandardMaterial(original.id + "_material", _this.scene);
            boxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
            box.material = boxMaterial;
            box.setEnabled(false);
            original.addLODLevel(15, box);
        });
    };
    HouseBuilder.prototype.lodAutomatic = function () {
        var _this = this;
        this.getOriginalHouse(function (arg) {
            var original = arg;
            _this._lodRemoveAll(original);
            original.simplify([
                { quality: 0.6, distance: 10, optimizeMesh: true },
                { quality: 0.2, distance: 15, optimizeMesh: true },
            ], true, BABYLON.SimplificationType.QUADRATIC, function () {
                alert('Done.');
            });
        });
    };
    HouseBuilder.prototype.lodRemoveAll = function () {
        var _this = this;
        this.getOriginalHouse(function (arg) {
            _this._lodRemoveAll(arg);
        });
    };
    HouseBuilder.prototype._lodRemoveAll = function (original) {
        original.getLODLevels().forEach(function (lodLevel) {
            original.removeLODLevel(lodLevel.mesh);
        });
    };
    return HouseBuilder;
}());
exports.default = HouseBuilder;
},{"babylonjs":"babylonjs"}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SmartRenderer = /** @class */ (function () {
    function SmartRenderer(scene) {
        var _this = this;
        this.alwaysRender = false;
        this.forceRenderOnce = true;
        this.lastPosition = null;
        this.lastRotation = null;
        this.onWinResize = function () {
            _this.scene.getEngine().resize();
            _this.forceRenderOnce = true;
        };
        this.onRender = function () {
            if (_this.isRenderNeeded()) {
                var activeCamera = _this.scene.activeCamera;
                _this.lastPosition = activeCamera.position.clone();
                _this.lastRotation = activeCamera.rotation.clone();
                _this.forceRenderOnce = false;
                _this.scene.render();
            }
        };
        this.scene = scene;
        scene.getEngine().runRenderLoop(this.onRender);
        window.addEventListener('resize', this.onWinResize);
    }
    SmartRenderer.prototype.isRenderNeeded = function () {
        if (this.alwaysRender == true || this.forceRenderOnce === true || this.scene.animatables.length > 0) {
            return true;
        }
        // Has the camera moved?
        var activeCamera = this.scene.activeCamera;
        activeCamera.update(); // Must call update so position and lastRotation are correct
        if (!this.lastPosition.equals(activeCamera.position) || !this.lastRotation.equals(activeCamera.rotation)) {
            return true;
        }
        // Always render if debug layer is open since the user may be modifying properties
        if (this.scene.debugLayer.isVisible()) {
            return true;
        }
        return false;
    };
    return SmartRenderer;
}());
exports.default = SmartRenderer;
},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CookieCutterSuburbia_1 = require("./CookieCutterSuburbia");
var SmartRender_1 = require("./SmartRender");
var HouseBuilder_1 = require("./HouseBuilder");
var canvas = document.getElementById('renderCanvas');
var suburbia = new CookieCutterSuburbia_1.default(canvas);
var scene = suburbia.scene;
/* ===================================================================================================
 * Smart Renderer
 */
var smartRender = new SmartRender_1.default(scene);
var smartRenderToggle = document.getElementById("smartRenderToggle");
function updateSmartRenderToggleStyleClass() {
    smartRenderToggle.classList.toggle("toggleOff", !smartRender.alwaysRender);
}
smartRenderToggle.addEventListener("click", function (event) {
    smartRender.alwaysRender = !smartRender.alwaysRender;
    updateSmartRenderToggleStyleClass();
});
updateSmartRenderToggleStyleClass();
/* ===================================================================================================
 * Houses
 */
var houseBuilder = new HouseBuilder_1.default(scene, function () {
    // Rerender when house loaded
    smartRender.forceRenderOnce = true;
});
var housesNumberToAdd = document.getElementById("housesNumberToAdd");
document.getElementById("cloneHouse").addEventListener("click", function (event) {
    event.preventDefault();
    var numberToAdd = parseInt(housesNumberToAdd.value);
    function addAnother() {
        if (numberToAdd-- > 0)
            houseBuilder.addHouseClone(addAnother);
    }
    addAnother();
});
document.getElementById("createInstanceHouse").addEventListener("click", function (event) {
    event.preventDefault();
    var numberToAdd = parseInt(housesNumberToAdd.value);
    function addAnother() {
        if (numberToAdd-- > 0)
            houseBuilder.addHouseCreateInstance(addAnother);
    }
    addAnother();
});
document.getElementById("clearHouses").addEventListener("click", function (event) {
    event.preventDefault();
    houseBuilder.clearHouses();
});
document.getElementById("mergeHouses").addEventListener("click", function (event) {
    event.preventDefault();
    houseBuilder.mergeHouses();
});
/* ===================================================================================================
 * Box animation
 */
document.getElementById("animationToggle").addEventListener("click", function (event) {
    event.preventDefault();
    suburbia.toggleAnimation();
});
/* ===================================================================================================
 * LOD
 */
document.getElementById("lodManual").addEventListener("click", function (event) {
    event.preventDefault();
    houseBuilder.lodManual();
});
document.getElementById("lodAutomatic").addEventListener("click", function (event) {
    event.preventDefault();
    houseBuilder.lodAutomatic();
});
document.getElementById("lodRemoveAll").addEventListener("click", function (event) {
    event.preventDefault();
    houseBuilder.lodRemoveAll();
});
/* ===================================================================================================
 * Debugger
 */
document.getElementById("debugLayerToggle").addEventListener("click", function (event) {
    event.preventDefault();
    if (scene.debugLayer.isVisible()) {
        scene.debugLayer.hide();
    }
    else {
        scene.debugLayer.show();
    }
});
},{"./CookieCutterSuburbia":1,"./HouseBuilder":2,"./SmartRender":3}]},{},[4])

