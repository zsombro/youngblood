import { Scene, SceneServices, SceneOptions } from './scene';

import InputManager from './services/inputmanager';
import AudioManager from './services/audiomanager';
import AssetLoader from './services/assetloader';

import Entity from './entity';
import render, { Renderer } from './renderer';
import FramerateManager from './framerateManager';

export default class Game {
    private renderer: Renderer;
    private services: SceneServices;
    private gameScenes: { [index: string]: Scene };
    private currentScene: Scene;
    private framerateManager: FramerateManager;

    /**
     * Returns a new `Game` instance.
     */
    public constructor() {
        this.renderer = null;

        this.services = {
            input: new InputManager(),
            audio: new AudioManager(),
            assets: new AssetLoader(),
            game: {
                switchToScene: this.switchToScene.bind(this),
            },
        };

        this.gameScenes = {};
        this.currentScene = null;

        this.framerateManager = new FramerateManager(60);

        console.info('Game created');
    }

    /**
     * This is what's gonna kickstart your game when you're done setting it up!
     *
     * @param canvasSelector CSS selector for the `canvas` you want to render into. Leaving this empty assumes
     * you only have one `<canvas>` element on your page. _Irrelevant if you've registered
     * a custom renderer._
     */
    public startRendering(canvasSelector: string = 'canvas'): void {
        if (!this.renderer) {
            const canvas = document.querySelector(canvasSelector) as HTMLCanvasElement;
            if (!canvas) throw new Error('No canvas element was found in the document');

            const ctx = canvas.getContext('2d');
            ctx.imageSmoothingEnabled = false;
            this.setRenderer(render(ctx));
        }

        this.startSystem();

        console.info(`Started rendering at ${this.framerateManager}fps`);
    }

    /**
     * Set an upper framerate limit. `60` by default!
     * @param fps
     */
    public setFramerate(fps: number): Game {
        this.framerateManager.setFramerate(fps);

        return this;
    }

    /**
     * You can set a custom renderer instead of the default 2D one. It's a function
     * that will be called at the end of every game loop.
     * @param renderingFunction A function that takes a `Scene` object and does something with it.
     */
    public setRenderer(renderingFunction: Renderer): Game {
        this.renderer = renderingFunction;

        return this;
    }

    /**
     * Register a new `Scene`. You'll need at least one to do anything!
     * @param sceneOptions Settings for your scene, like it's name or how it should be
     * initialized.
     */
    public addScene(sceneOptions: SceneOptions): Game {
        this.gameScenes[sceneOptions.sceneId] = new Scene(sceneOptions);

        if (this.currentScene == null) this.switchToScene(sceneOptions.sceneId);

        console.info(`Scene added: ${sceneOptions.sceneId}`);

        return this;
    }

    /**
     * Switch to a different scene. Also available as a `SceneService`. If you don't call it
     * before starting the game, it will start with the first one you added.
     * @param sceneId The id provided when the scene was registered
     */
    public switchToScene(sceneId: string): Game {
        if (this.gameScenes[sceneId] == null) {
            console.error("Scene doesn't exist: " + sceneId);
            return this;
        }

        this.currentScene = this.gameScenes[sceneId];

        if (!this.currentScene.initialized || this.currentScene.alwaysInitialize)
            this.currentScene.initialize(this.currentScene, this.services);

        return this;
    }

    private startSystem(): void {
        window.requestAnimationFrame((): void => this.startSystem());

        this.framerateManager.processFrame(
            (): void => {
                if (!this.currentScene) return;

                this.update();
                this.renderer(this.currentScene);
                console.log('end frame');
            },
        );
    }

    private update(): void {
        for (const e in this.currentScene.gameEntities) {
            const entity: Entity = this.currentScene.gameEntities[e];

            for (const s in this.currentScene.systems) {
                const system = this.currentScene.systems[s];

                if (entity.hasComponents(system.requiredComponents))
                    system.update(entity, this.currentScene, this.services);
            }
        }
    }
}
