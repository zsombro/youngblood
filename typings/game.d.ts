import { SceneOptions } from './scene';
import { Renderer } from './renderer';
export default class Game {
    private renderer;
    private services;
    private gameScenes;
    private currentScene;
    private fps;
    private interval;
    private then;
    private now;
    private delta;
    /**
     * Returns a new `Game` instance.
     */
    constructor();
    /**
     * This is what's gonna kickstart your game when you're done setting it up!
     *
     * @param canvasSelector The `canvas` you want to render into. Leaving this empty assumes
     * you only have one `<canvas>` element on your page. Irrelevant if you've registered
     * a custom renderer.
     */
    startRendering(canvasSelector?: string): void;
    /**
     * Set an upper framerate limit. `60` by default!
     * @param fps
     */
    setFramerate(fps: number): Game;
    /**
     * You can set a custom renderer instead of the default 2D one. It's a function
     * that will be called at the end of every game loop.
     * @param f A function that takes a `Scene` object and does something with it.
     */
    setRenderer(f: Renderer): Game;
    /**
     * Register a new `Scene`. You'll need at least one to do anything!
     * @param sceneOptions Settings for your scene, like it's name or how it should be
     * initialized.
     */
    addScene(sceneOptions: SceneOptions): Game;
    /**
     * Switch to a different scene. Also available as a `SceneService`. If you don't call it
     * before starting the game, it will start with the first one you added.
     * @param sceneId The id provided when the scene was registered
     */
    switchToScene(sceneId: string): Game;
    private startSystem;
}
