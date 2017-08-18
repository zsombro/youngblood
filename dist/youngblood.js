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

var Box = function (_Component4) {
	_inherits(Box, _Component4);

	function Box(width, height, fillStyle) {
		_classCallCheck(this, Box);

		var _this4 = _possibleConstructorReturn(this, (Box.__proto__ || Object.getPrototypeOf(Box)).call(this));

		_this4.width = width;
		_this4.height = height;
		_this4.fillStyle = fillStyle;
		return _this4;
	}

	return Box;
}(Component);

var BoxCollider = function (_Component5) {
	_inherits(BoxCollider, _Component5);

	function BoxCollider(width, height) {
		_classCallCheck(this, BoxCollider);

		var _this5 = _possibleConstructorReturn(this, (BoxCollider.__proto__ || Object.getPrototypeOf(BoxCollider)).call(this));

		_this5.width = width;
		_this5.height = height;
		return _this5;
	}

	return BoxCollider;
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

		this.step = null;
		this.onKeyPress = null;

		this.songsPlaying = [];

		this.gameScenes = {};
		this.currentScene = null;
		this.sceneEntities = {};
		this.sceneSystems = {};

		this.pressedKeys = [];

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
						that.currentScene.systems[s](that.currentScene.gameEntities[e]);
					}
				}

				that.canvasContext.fillStyle = 'rgba(240, 240, 240, 1)';
				that.canvasContext.fillRect(0, 0, that.canvasContext.width, that.canvasContext.height);

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
		key: 'log',
		value: function log(message) {
			if (Game.prototype.debugMode) console.log(message);
		}
	}]);

	return Game;
}();

Game.prototype.debugMode = false;

var Scene = function () {
	function Scene(options) {
		_classCallCheck(this, Scene);

		this.sceneId = options.sceneId || 'defaultScene';

		this.initialized = false;

		this.initCallback = options.init || function () {};

		this.alwaysInitialize = options.alwaysInitialize || true;

		this.gameEntities = {};
		this.systems = {};
	}

	_createClass(Scene, [{
		key: 'registerSystem',
		value: function registerSystem(systemCallback) {
			this.systems[systemCallback.name] = systemCallback;
		}
	}, {
		key: 'unregisterSystem',
		value: function unregisterSystem(systemCallback) {
			delete this.systems[systemCallback.name];
		}
	}, {
		key: 'addEntity',
		value: function addEntity(entity) {
			this.gameEntities[entity.id] = entity;
		}
	}]);

	return Scene;
}();