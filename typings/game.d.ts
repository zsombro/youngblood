import { Scene } from './scene';
export default class Game {
    private canvasContext;
    private services;
    private gameScenes;
    private currentScene;
    private fps;
    private debugMode;
    private interval;
    private then;
    private now;
    private delta;
    constructor(canvasContext: CanvasRenderingContext2D);
    startRendering(fps: number): void;
    addScene(scene: Scene): void;
    switchToScene(sceneId: string): void;
    setDebugMode(isDebug: boolean): void;
    getDebugMode(): boolean;
    log(message: string): void;
    private startSystem;
}
