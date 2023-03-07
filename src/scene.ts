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
    event: { dispatch(event: string, params: unknown): void, on(event: string, callback: Function): void };
    game: { switchToScene(name: string): void };
}

export type SceneInitCallback = (context: Scene, services: ISceneServices) => void;

export type EntityFunction = (services: ISceneServices) => Entity | Component[];

export class Scene {
    public id: string;
    public initialized: boolean;
    public initCallback: SceneInitCallback;
    public alwaysInitialize: boolean;
    public systems: System[];
    public gameEntities: Entity[];

    private options: SceneOptions = null;

    public constructor(options: SceneOptions) {
        this.id = options.sceneId;

        this.initialized = false;

        this.alwaysInitialize = options.alwaysInitialize ?? true;

        this.initCallback = options.init ?? ((): void => {});

        this.gameEntities = [];
        this.systems = [];

        this.options = options;
    }

    public initialize(context: Scene, services: ISceneServices): void {
        if (this.options.systems) this.options.systems.forEach((s): void => this.registerSystem(s));
        if (this.options.entities) this.options.entities.forEach((entity): void => this.addEntity(entity(services)));

        this.initCallback(context, services);
        this.initialized = true;
    }

    public registerSystem(system: System): void {
        if (this.systems.map(s => s.id).includes(system.id))
            throw new Error(`System with ID ${system.id} has already been registered!`)

        this.systems.push(system);
    }

    public unregisterSystem(id: String): void {
        this.systems[this.systems.findIndex(e => e.id === id)] = undefined
    }

    public addEntity(entity: Entity | Component[]): void {
        if (entity instanceof Entity) {
            this.gameEntities.push(entity);
        } else {
            const e = new Entity();
            e.addComponents(entity);
            this.gameEntities.push(e);
        }
    }

    public removeEntity(id: string): void {
        this.gameEntities[this.gameEntities.findIndex(e => e.id === id)] = undefined
    }

    public getEntitiesWith(componentName: string): Entity[] {
        return this.gameEntities.filter(e => e.hasComponent(componentName))
    }
}
