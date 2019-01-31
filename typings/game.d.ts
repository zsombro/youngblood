import { Scene } from './scene';
import InputManager from './inputmanager';
import AudioManager from './audiomanager';
import AssetLoader from './assetloader';
export default class Game {
    canvasContext: CanvasRenderingContext2D;
    services: {
        input: InputManager;
        audio: AudioManager;
        assets: AssetLoader;
        game: any;
    };
    gameScenes: {
        [index: string]: Scene;
    };
    currentScene: any;
    sceneEntities: {};
    sceneSystems: {};
    fps: number;
    debugMode: any;
    interval: number;
    then: number;
    now: number;
    delta: number;
    constructor(canvasContext: CanvasRenderingContext2D);
    startRendering(fps: number): void;
    addScene(scene: Scene): void;
    switchToScene(sceneId: string): void;
    setDebugMode(isDebug: boolean): void;
    getDebugMode(): any;
    log(message: string): void;
    private startSystem;
}
