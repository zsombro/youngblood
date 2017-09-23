class Game {
	constructor(canvasContext) {
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
							that.currentScene.systems[s].update.call(that.services, entity);
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

					// Render an animated sprite
					if (cur.hasComponents(['AnimatedSprite', 'Position'])) {
						var c = cur.AnimatedSprite;
						var f = c.animationSheet[c.animationName];
						
						that.canvasContext.drawImage(c.spriteSource, 
							f.startX + c.currentFrame * f.frameWidth, f.startY, 
							f.frameWidth, f.frameHeight,
							cur.Position.x, cur.Position.y,
							f.frameWidth * c.scale, f.frameHeight * c.scale);
					
						if (c.isPlaying) {
							if (c.currentFrame == f.frames - 1)
								c.currentFrame = 0;
							else
								c.currentFrame++;
						}
					}

					// @ifdef DEBUG
					ctx.fillStyle = 'rgba(0, 0, 0, 1)';
					ctx.fillText(that.services.inputService.pressedKeys, 40, 60);
					// @endif
					
				}
			}
		}
		
		// @ifdef DEBUG
		console.log('Game object created');
		// @endif
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
			console.error("Scene doesn't exist: " + sceneId);
		}
	}
	
	setDebugMode(isDebug) {
		Game.prototype.debugMode = isDebug;
	}

	getDebugMode() {
		return Game.prototype.debugMode;
	}
	
	log(message) {
		if (Game.prototype.debugMode) console.log(message);
	}
}

Game.prototype.debugMode = false;