import Scene from './scene';

import InputManager from './inputmanager';
import AudioManager from './audiomanager';
import AssetLoader from './assetloader';

export default class Game {

	canvasContext: CanvasRenderingContext2D;
	services: { input: InputManager; audio: AudioManager; assets: AssetLoader; game: any };
	gameScenes: { [index:string]: Scene };
	currentScene: any;
	sceneEntities: {};
	sceneSystems: {};
	fps: number;
	debugMode: any;
	interval: number;
	then: number;
	now: number;
	delta: number;

	constructor(canvasContext: CanvasRenderingContext2D) {
		
		this.canvasContext = canvasContext;
		
		canvasContext.imageSmoothingEnabled = false;

		// these are classes that offer lower level functionality to systems
		// mostly through browser APIs
		this.services = {
			input: new InputManager(),
			audio: new AudioManager(),
			assets: new AssetLoader(),
			game: {
				switchToScene: this.switchToScene.bind(this),
			}
		};
		
		this.gameScenes = {};
		this.currentScene = null;
		this.sceneEntities = {};
		this.sceneSystems = {};
		
		
		this.fps = 60;
		this.then = Date.now();
				
		// @ifdef DEBUG
		console.log('Game object created');
		// @endif
	}

	startRendering(fps: number) {
		this.fps = fps || 60;
		
		this.startSystem();
	}

	addScene(scene: Scene) {
		this.gameScenes[scene.sceneId] = scene;

		// services can be accessed from a scene's init callback
		this.gameScenes[scene.sceneId].assets = this.services.assets;
		// Object.assign(this.gameScenes[scene.sceneId], this.services);

		if (this.currentScene == null)
			this.switchToScene(scene.sceneId);
	}

	switchToScene(sceneId: string) {
		if (this.gameScenes[sceneId] != null) {
			this.currentScene = this.gameScenes[sceneId];

			if (!this.currentScene.initialized || this.currentScene.alwaysInitialize)
				this.currentScene.initCallback();
				//this.currentScene.initCallback.call(this.services);
			
		} else {
			console.error("Scene doesn't exist: " + sceneId);
		}
	}
	
	setDebugMode(isDebug: boolean) {
		Game.prototype.debugMode = isDebug;
	}

	getDebugMode() {
		return Game.prototype.debugMode;
	}
	
	log(message: string) {
		if (Game.prototype.debugMode) console.log(message);
	}

	private startSystem() {
		window.requestAnimationFrame(() => { this.startSystem(); });

		this.interval = 1000 / this.fps;
		
		this.now = Date.now();
		this.delta = this.now - this.then;
		
		if (this.delta > this.interval) {
			this.then = this.now - (this.delta % this.interval);

			if (!this.currentScene)
				return;
			
			// SYSTEM FLOW:
			// registered systems
			//	(systems are registered on a per scene basis)
			// default render system
			//	(this system is the same for every scene, but it could be possible to apply separate shaders)

			// TODO: figure out a way to register custom render systems for components that might have special
			// rendering requirements (this would also allow the development of a WebGL/ThreeJS plugin of sorts)
			for (var e in this.currentScene.gameEntities) {
				for (var s in this.currentScene.systems) {
					var entity = this.currentScene.gameEntities[e];
					var system = this.currentScene.systems[s];

					if (entity.hasComponents(system.requiredComponents))
						this.currentScene.systems[s].update.call(this.services, entity);
				}
			}
			
			this.canvasContext.fillStyle = 'white';
			this.canvasContext.fillRect(0, 0, this.canvasContext.canvas.width, this.canvasContext.canvas.height);
			
			// render system
			var cur;
			for (var e in this.currentScene.gameEntities) {
				cur = this.currentScene.gameEntities[e];
				
				// This basic shape is more of a testing thing
				if (cur.hasComponent('Box') && cur.hasComponent('Position')) {
					this.canvasContext.fillStyle = cur.Box.fillStyle;

					this.canvasContext.fillRect(cur.Position.x, 
						cur.Position.y, 
						cur.Box.width, 
						cur.Box.height);
				}

				// Render a single sprite
				if (cur.hasComponent('Sprite') && cur.hasComponent('Position')) {
					this.canvasContext.drawImage(cur.Sprite.spriteSource,
						cur.Position.x,
						cur.Position.y);

				}

				// Render an animated sprite
				if (cur.hasComponents(['AnimatedSprite', 'Position'])) {
					var c = cur.AnimatedSprite;
					var f = c.animationSheet[c.animationName];
					
					this.canvasContext.drawImage(c.spriteSource, 
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
				this.canvasContext.fillStyle = 'rgba(0, 0, 0, 1)';
				this.canvasContext.fillText(this.services.input.pressedKeys.toString(), 40, 60);
				// @endif
				
			}
		}
	}
}

// (<any>window).yb = {
// 	Game: Game,
// 	Scene: Scene,
// 	Entity: Entity,
// 	InputMappingSystem: InputMappingSystem
// };