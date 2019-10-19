import { Scene } from './scene';
export default class Game {
    private canvasContext;
    private services;
    private gameScenes;
    private currentScene;
    private fps;
    private interval;
    private then;
    private now;
    private delta;
    constructor(canvasContext: CanvasRenderingContext2D);
    startRendering(fps: number): void;
    addScene(scene: Scene): void;
    switchToScene(sceneId: string): void;
    private startSystem;
}
