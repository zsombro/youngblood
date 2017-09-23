'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AssetLoader = function () {
	function AssetLoader() {
		_classCallCheck(this, AssetLoader);

		// asset loader uses it's own audio context to decode incoming buffers
		this.audio = new (window.AudioContext || window.webkitAudioContext)();

		this.imageTypes = ['.png', '.jpg', '.gif'];
		this.objectTypes = ['.txt', 'json'];
		this.audioTypes = ['.wav', '.mp3', '.ogg'];
	}

	_createClass(AssetLoader, [{
		key: 'addTaskList',
		value: function addTaskList(url) {}
	}]);

	return AssetLoader;
}();

var AudioManager = function () {
	function AudioManager() {
		_classCallCheck(this, AudioManager);

		try {
			this.audioContext == new (window.AudioContext || window.webkitAudioContext)();

			this.songsPlaying = [];

			this.masterVolume = this.audioContext.createGain();

			this.musicVolume = this.audioContext.createGain();
			this.musicVolume.connect(this.masterVolume);

			this.effectsVolume = this.audioContext.createGain();
			this.effectsVolume.connect(this.masterVolume);

			this.masterVolume.connect(this.audioContext.destination);
		} catch (e) {
			console.error('WebAudio API is not supported by this browser');
		}
	}

	_createClass(AudioManager, [{
		key: 'setBackgroundMusic',
		value: function setBackgroundMusic(buffer, loop) {
			if (this.songsPlaying.indexOf(buffer) == -1) {
				var that = this;
				var source = this.audioContext.createBufferSource();

				source.buffer = buffer;
				source.loop = loop || false;

				source.connect(this.musicVolume);
				source.start();

				source.onended = function () {
					if (!loop) that.songsPlaying.splice(that.songsPlaying.indexOf(buffer), 1);
				};

				this.songsPlaying.push(buffer);
			}
		}
	}, {
		key: 'playSound',
		value: function playSound(buffer, loop) {
			var source = this.audioContext.createBufferSource();
			source.buffer = buffer;
			source.loop = loop || false;

			source.connect(this.effectsVolume);

			source.start();
		}
	}]);

	return AudioManager;
}();
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

	function AnimatedSprite(spriteSource, animationSheet, options) {
		_classCallCheck(this, AnimatedSprite);

		var _this4 = _possibleConstructorReturn(this, (AnimatedSprite.__proto__ || Object.getPrototypeOf(AnimatedSprite)).call(this));

		_this4.spriteSource = spriteSource;
		_this4.animationSheet = animationSheet;

		if (options === undefined) var options = {};

		// If there's no default animation set, we'll use the first one defined in the JSON object
		_this4.animationName = options.animationName || Object.keys(animationSheet)[0];
		_this4.scale = options.scale || 1.0;
		_this4.loop = options.loop || true;
		_this4.isPlaying = options.isPlaying || true;

		_this4.currentFrame = 0;
		return _this4;
	}

	return AnimatedSprite;
}(Component);

var AudioSource = function (_Component5) {
	_inherits(AudioSource, _Component5);

	function AudioSource(audioBuffer) {
		_classCallCheck(this, AudioSource);

		var _this5 = _possibleConstructorReturn(this, (AudioSource.__proto__ || Object.getPrototypeOf(AudioSource)).call(this));

		_this5.audioBuffer = audioBuffer;
		return _this5;
	}

	return AudioSource;
}(Component);

var Box = function (_Component6) {
	_inherits(Box, _Component6);

	function Box(width, height, fillStyle) {
		_classCallCheck(this, Box);

		var _this6 = _possibleConstructorReturn(this, (Box.__proto__ || Object.getPrototypeOf(Box)).call(this));

		_this6.width = width;
		_this6.height = height;
		_this6.fillStyle = fillStyle;
		return _this6;
	}

	return Box;
}(Component);

var BoxCollider = function (_Component7) {
	_inherits(BoxCollider, _Component7);

	function BoxCollider(width, height) {
		_classCallCheck(this, BoxCollider);

		var _this7 = _possibleConstructorReturn(this, (BoxCollider.__proto__ || Object.getPrototypeOf(BoxCollider)).call(this));

		_this7.width = width;
		_this7.height = height;
		return _this7;
	}

	return BoxCollider;
}(Component);

var InputMapping = function (_Component8) {
	_inherits(InputMapping, _Component8);

	// for eg. mapping = [ {name: 'up', code: 38} ]
	function InputMapping(mapping) {
		_classCallCheck(this, InputMapping);

		var _this8 = _possibleConstructorReturn(this, (InputMapping.__proto__ || Object.getPrototypeOf(InputMapping)).call(this));

		_this8.mapping = mapping;

		for (var i = 0; i < mapping.length; i++) {
			_this8[mapping[i].name] = false;
		}
		return _this8;
	}

	return InputMapping;
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

		// these are classes that lower level functionality to systems
		// mostly through browser APIs
		this.services = {};
		this.services.inputService = new InputService();
		this.services.audioManager = new AudioManager();

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

						if (entity.hasComponents(system.requiredComponents)) that.currentScene.systems[s].update.call(that.services, entity);
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

					// Render an animated sprite
					if (cur.hasComponents(['AnimatedSprite', 'Position'])) {
						var c = cur.AnimatedSprite;
						var f = c.animationSheet[c.animationName];

						that.canvasContext.drawImage(c.spriteSource, f.startX + c.currentFrame * f.frameWidth, f.startY, f.frameWidth, f.frameHeight, cur.Position.x, cur.Position.y, f.frameWidth * c.scale, f.frameHeight * c.scale);

						if (c.isPlaying) {
							if (c.currentFrame == f.frames - 1) c.currentFrame = 0;else c.currentFrame++;
						}
					}

					ctx.fillStyle = 'rgba(0, 0, 0, 1)';
					ctx.fillText(that.services.inputService.pressedKeys, 40, 60);
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
				console.error("Scene doesn't exist: " + sceneId);
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

var InputMappingSystem = {
	systemId: 'inputMappingSystem',
	requiredComponents: ['InputMapping'],
	update: function update(entity) {

		var l = entity.InputMapping.mapping.length;
		for (var i = 0; i < l; i++) {
			var c = entity.InputMapping.mapping[i];
			entity.InputMapping[c.name] = this.inputService.isPressed(c.code);
		}
	}
};