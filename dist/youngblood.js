'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Components provide entities with attributes
// that relate to in-game functionality
// Like entities, components are JUST DATA and not logic

var Component = function Component() {
	_classCallCheck(this, Component);

	this.name = this.constructor.name;
};

var Position = function (_Component) {
	_inherits(Position, _Component);

	function Position(x, y) {
		_classCallCheck(this, Position);

		var _this = _possibleConstructorReturn(this, (Position.__proto__ || Object.getPrototypeOf(Position)).call(this));

		_this.x = x;
		_this.y = y;
		return _this;
	}

	return Position;
}(Component);

var Velocity = function (_Component2) {
	_inherits(Velocity, _Component2);

	function Velocity(x, y) {
		_classCallCheck(this, Velocity);

		var _this2 = _possibleConstructorReturn(this, (Velocity.__proto__ || Object.getPrototypeOf(Velocity)).call(this));

		_this2.x = x;
		_this2.y = y;
		return _this2;
	}

	return Velocity;
}(Component);

var Sprite = function (_Component3) {
	_inherits(Sprite, _Component3);

	function Sprite(spriteSource) {
		_classCallCheck(this, Sprite);

		var _this3 = _possibleConstructorReturn(this, (Sprite.__proto__ || Object.getPrototypeOf(Sprite)).call(this));

		_this3.spriteSource = spriteSource;
		return _this3;
	}

	return Sprite;
}(Component);

var AnimatedSprite = function (_Component4) {
	_inherits(AnimatedSprite, _Component4);

	function AnimatedSprite(spriteSource, animationSheet) {
		_classCallCheck(this, AnimatedSprite);

		var _this4 = _possibleConstructorReturn(this, (AnimatedSprite.__proto__ || Object.getPrototypeOf(AnimatedSprite)).call(this));

		_this4.spriteSource = spriteSource;
		_this4.animationSheet = animationSheet;
		return _this4;
	}

	return AnimatedSprite;
}(Component);

var Box = function (_Component5) {
	_inherits(Box, _Component5);

	function Box(width, height, fillStyle) {
		_classCallCheck(this, Box);

		var _this5 = _possibleConstructorReturn(this, (Box.__proto__ || Object.getPrototypeOf(Box)).call(this));

		_this5.width = width;
		_this5.height = height;
		_this5.fillStyle = fillStyle;
		return _this5;
	}

	return Box;
}(Component);

var BoxCollider = function (_Component6) {
	_inherits(BoxCollider, _Component6);

	function BoxCollider(width, height) {
		_classCallCheck(this, BoxCollider);

		var _this6 = _possibleConstructorReturn(this, (BoxCollider.__proto__ || Object.getPrototypeOf(BoxCollider)).call(this));

		_this6.width = width;
		_this6.height = height;
		return _this6;
	}

	return BoxCollider;
}(Component);

var DirectionalInput = function (_Component7) {
	_inherits(DirectionalInput, _Component7);

	function DirectionalInput() {
		_classCallCheck(this, DirectionalInput);

		var _this7 = _possibleConstructorReturn(this, (DirectionalInput.__proto__ || Object.getPrototypeOf(DirectionalInput)).call(this));

		_this7.up = false;
		_this7.down = false;
		_this7.left = false;
		_this7.right = false;
		return _this7;
	}

	return DirectionalInput;
}(Component);

var Entity = function () {
	function Entity() {
		_classCallCheck(this, Entity);

		this.id = Entity.prototype.count;
		Entity.prototype.count++;
	}

	_createClass(Entity, [{
		key: 'addComponent',
		value: function addComponent(component) {
			this[component.name] = component;
		}
	}, {
		key: 'removeComponent',
		value: function removeComponent(componentName) {
			delete this[componentName];
		}
	}, {
		key: 'hasComponent',
		value: function hasComponent(componentName) {
			return this[componentName] != null;
		}
	}, {
		key: 'hasComponents',
		value: function hasComponents(componentArray) {

			var len = componentArray.length;
			for (var i = 0; i < len; i++) {
				if (!this.hasComponent(componentArray[i])) return false;
			}

			return true;
		}
	}]);

	return Entity;
}();

Entity.prototype.count = 0;

var Game = function () {
	function Game(canvasContext) {
		_classCallCheck(this, Game);

		var that = this;

		this.canvasContext = canvasContext;

		canvasContext.webkitImageSmoothingEnabled = false;
		canvasContext.imageSmoothingEnabled = false; // future

		try {
			this.audioContext == new (window.AudioContext || window.webkitAudioContext)();
		} catch (e) {
			console.log('WebAudio API is not supported by this browser');
		}

		this.inputService = new InputService();

		this.step = null;
		this.onKeyPress = null;

		this.songsPlaying = [];

		this.gameScenes = {};
		this.currentScene = null;
		this.sceneEntities = {};
		this.sceneSystems = {};

		this.fps = 60;
		this.startRendering = function (fps) {
			that.fps = fps | 60;

			startSystem();
		};

		// this is where the magic happens (private function)
		var interval = 1000 / this.fps;
		var then = Date.now();
		var now, delta;
		function startSystem() {
			window.requestAnimationFrame(startSystem);

			now = Date.now();
			delta = now - then;

			if (delta > interval) {
				then = now - delta % interval;

				if (!that.currentScene) return;

				// SYSTEM FLOW:
				// registered systems
				//	(systems are registered on a per scene basis)
				// default render system
				//	(this system is the same for every scene, but it could be possible to apply separate shaders)

				// TODO: figure out a way to register custom render systems for components that might have special
				// rendering requirements (this would also allow the development of a WebGL/ThreeJS plugin of sorts)
				for (var e in that.currentScene.gameEntities) {
					for (var s in that.currentScene.systems) {
						var entity = that.currentScene.gameEntities[e];
						var system = that.currentScene.systems[s];

						if (entity.hasComponents(system.requiredComponents)) that.currentScene.systems[s].update.call(that, entity);
					}
				}

				that.canvasContext.fillStyle = 'white';
				that.canvasContext.fillRect(0, 0, that.canvasContext.canvas.width, that.canvasContext.canvas.height);

				// render system
				var cur;
				for (var e in that.currentScene.gameEntities) {
					cur = that.currentScene.gameEntities[e];

					// This basic shape is more of a testing thing
					if (cur.hasComponent('Box') && cur.hasComponent('Position')) {
						that.canvasContext.fillStyle = cur.Box.fillStyle;

						that.canvasContext.fillRect(cur.Position.x, cur.Position.y, cur.Box.width, cur.Box.height);
					}

					// Render a single sprite
					if (cur.hasComponent('Sprite') && cur.hasComponent('Position')) {
						that.canvasContext.drawImage(cur.Sprite.spriteSource, cur.Position.x, cur.Position.y);
					}

					if (that.getDebugMode()) {
						ctx.fillStyle = 'rgba(0, 0, 0, 1)';
						ctx.fillText(that.inputService.pressedKeys, 40, 60);
					}
				}
			}
		}

		console.log('Game object created');
	}

	_createClass(Game, [{
		key: 'addScene',
		value: function addScene(scene) {
			this.gameScenes[scene.sceneId] = scene;

			if (this.currentScene == null) this.switchToScene(scene.sceneId);
		}
	}, {
		key: 'switchToScene',
		value: function switchToScene(sceneId) {
			if (this.gameScenes[sceneId] != null) {
				this.currentScene = this.gameScenes[sceneId];

				if (!this.currentScene.initialized || this.currentScene.alwaysInitialize) this.currentScene.initCallback();
			} else {
				this.log("Scene doesn't exist: " + sceneId);
			}
		}
	}, {
		key: 'setDebugMode',
		value: function setDebugMode(isDebug) {
			Game.prototype.debugMode = isDebug;
		}
	}, {
		key: 'getDebugMode',
		value: function getDebugMode() {
			return Game.prototype.debugMode;
		}
	}, {
		key: 'log',
		value: function log(message) {
			if (Game.prototype.debugMode) console.log(message);
		}
	}]);

	return Game;
}();

Game.prototype.debugMode = false;

var InputService = function () {
	function InputService() {
		_classCallCheck(this, InputService);

		var that = this;

		this.pressedKeys = [];

		window.addEventListener('keydown', function (e) {
			if (that.pressedKeys.indexOf(e.keyCode) === -1) that.pressedKeys.push(e.keyCode);
		}, false);

		window.addEventListener('keyup', function (e) {
			that.pressedKeys.splice(that.pressedKeys.indexOf(e.keyCode), 1);
		}, false);
	}

	_createClass(InputService, [{
		key: 'isPressed',
		value: function isPressed(key) {
			return this.pressedKeys.indexOf(key) !== -1;
		}
	}]);

	return InputService;
}();

var SystemScope = {
	LOCAL: 'local',
	GLOBAL: 'global'
};

var SystemType = {
	RENDER: 'render',
	NONRENDER: 'nonrender'
};

var Scene = function () {
	function Scene(options) {
		_classCallCheck(this, Scene);

		this.sceneId = options.sceneId || 'defaultScene';

		this.initialized = false;

		this.initCallback = options.init || function () {};

		this.alwaysInitialize = options.alwaysInitialize || true;

		this.systemScope = options.scope || SystemScope.LOCAL;
		this.systemType = options.type || SystemType.NONRENDER;

		this.gameEntities = {};
		this.systems = {};
	}

	_createClass(Scene, [{
		key: 'registerSystem',
		value: function registerSystem(system) {
			this.systems[system.systemId] = system;
		}
	}, {
		key: 'unregisterSystem',
		value: function unregisterSystem(system) {
			delete this.systems[system.systemId];
		}
	}, {
		key: 'addEntity',
		value: function addEntity(entity) {
			this.gameEntities[entity.id] = entity;
		}
	}]);

	return Scene;
}();

var DirectionalInputSystem = {
	systemId: 'directionalInput',
	requiredComponents: ['DirectionalInput'],
	update: function update(entity) {

		entity.DirectionalInput.up = this.inputService.isPressed(38);
		entity.DirectionalInput.down = this.inputService.isPressed(40);
		entity.DirectionalInput.left = this.inputService.isPressed(37);
		entity.DirectionalInput.right = this.inputService.isPressed(39);
	}
};