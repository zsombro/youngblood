class Game {
	constructor(canvasContext) {
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
		}
		
		// this is where the magic happens (private function)
		var interval = 1000 / this.fps;
		var then = Date.now();
		var now, delta;
		function startSystem() {
			window.requestAnimationFrame(startSystem);
			
			now = Date.now();
			delta = now - then;
			
			if (delta > interval) {
				then = now - (delta % interval);

				if (!that.currentScene)
					return;
				
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

						if (entity.hasComponents(system.requiredComponents))
							that.currentScene.systems[s].update(entity);
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

						that.canvasContext.fillRect(cur.Position.x, 
							cur.Position.y, 
							cur.Box.width, 
							cur.Box.height);
					}

					// Render a single sprite
					if (cur.hasComponent('Sprite') && cur.hasComponent('Position')) {
						that.canvasContext.drawImage(cur.Sprite.spriteSource,
							cur.Position.x,
							cur.Position.y);
					}
				}
			}
		}
		
		console.log('Game object created');
	}

	addScene(scene) {
		this.gameScenes[scene.sceneId] = scene;

		if (this.currentScene == null)
			this.switchToScene(scene.sceneId);
	}

	switchToScene(sceneId) {
		if (this.gameScenes[sceneId] != null) {
			this.currentScene = this.gameScenes[sceneId];

			if (!this.currentScene.initialized || this.currentScene.alwaysInitialize)
				this.currentScene.initCallback();
			
		} else {
			this.log("Scene doesn't exist: " + sceneId);
		}
	}
	
	setDebugMode(isDebug) {
		Game.prototype.debugMode = isDebug;
	}
	
	log(message) {
		if (Game.prototype.debugMode) console.log(message);
	}
}

Game.prototype.debugMode = false;