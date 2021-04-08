import Entity from './entity';
import { System } from './system';
import InputManager from './services/inputmanager';
import AudioManager from './services/audiomanager';
import AssetLoader from './services/assetloader';
export interface SceneOptions {
    sceneId: string;
    alwaysInitialize?: boolean;
    init?: SceneInitCallback;
    systems?: System[];
    entities?: Entity[];
}
export interface SceneServices {
    input: InputManager;
    audio: AudioManager;
    assets: AssetLoader;
    game: {
        switchToScene(name: string): void;
    };
}
export declare type SceneInitCallback = (context: Scene, services: SceneServices) => void;
export declare class Scene {
    sceneId: string;
    initialized: boolean;
    initCallback: SceneInitCallback;
    alwaysInitialize: boolean;
    systems: {
        [index: string]: System;
    };
    gameEntities: {
        [index: string]: Entity;
    };
    constructor(options: SceneOptions);
    registerSystem(system: System): void;
    unregisterSystem(system: System): void;
    addEntity(entity: Entity): void;
    removeEntity(id: number): void;
}
