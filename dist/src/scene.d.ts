import { default as Entity } from './entity';
import { System } from './system';
import { default as InputManager } from './services/inputmanager';
import { default as AudioManager } from './services/audiomanager';
import { default as AssetLoader } from './services/assetloader';
import { Component } from './main';
import { ComponentFunction } from './components/component';
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
export type EntityFunction = (services: ISceneServices) => Entity | Component<any>[];
export declare class Scene {
    id: string;
    initialized: boolean;
    initCallback: SceneInitCallback;
    alwaysInitialize: boolean;
    systems: System[];
    get gameEntities(): Entity[];
    private options;
    private services;
    private entityManager;
    constructor(options: SceneOptions, services: ISceneServices);
    initialize(context: Scene, services: ISceneServices): void;
    registerSystem(system: System): void;
    registerSystems(systems: System[]): void;
    unregisterSystem(id: String): void;
    addEntity(entity: Entity | Component<any>[]): void;
    removeEntity(id: string): void;
    findEntityById(id: string): Entity | undefined;
    getEntitiesWith(component: string | ComponentFunction<any>): Entity[];
}
