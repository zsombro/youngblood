import Entity from './entity';
import { System } from './system';
import InputManager from './services/inputmanager';
import AudioManager from './services/audiomanager';
import AssetLoader from './services/assetloader';
import { Component } from './main';
export interface SceneOptions {
    sceneId: string;
    alwaysInitialize?: boolean;
    init?: SceneInitCallback;
    systems?: System[];
    entities?: EntityFunction[];
}
export interface ISceneServices {
    input: InputManager;
    audio: AudioManager;
    assets: AssetLoader;
    event: {
        dispatch(event: string, params: unknown): void;
        on(event: string, callback: Function): void;
    };
    game: {
        switchToScene(name: string): void;
    };
}
export type SceneInitCallback = (context: Scene, services: ISceneServices) => void;
export type EntityFunction = (services: ISceneServices) => Entity | Component[];
export declare class Scene {
    id: string;
    initialized: boolean;
    initCallback: SceneInitCallback;
    alwaysInitialize: boolean;
    systems: System[];
    gameEntities: Entity[];
    private options;
    private services;
    constructor(options: SceneOptions, services: ISceneServices);
    initialize(context: Scene, services: ISceneServices): void;
    registerSystem(system: System): void;
    registerSystems(systems: System[]): void;
    unregisterSystem(id: String): void;
    addEntity(entity: Entity | Component[]): void;
    removeEntity(id: string): void;
    getEntitiesWith(componentName: string): Entity[];
}
