import Entity from './entity';
import { System } from './system';
import InputManager from './inputmanager';
import AudioManager from './audiomanager';
import AssetLoader from './assetloader';
export interface SceneOptions {
    sceneId: string;
    alwaysInitialize?: boolean;
    init: SceneInitCallback;
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
    gameEntities: {
        [index: string]: Entity;
    };
    systems: {
        [index: string]: System;
    };
    assets: {};
    constructor(options: SceneOptions);
    registerSystem(system: System): void;
    unregisterSystem(system: System): void;
    addEntity(entity: Entity): void;
}
