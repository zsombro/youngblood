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
    entities?: EntityFunction[];
}

export interface SceneServices {
    input: InputManager;
    audio: AudioManager;
    assets: AssetLoader;
    game: { switchToScene(name: string): void };
}

export type SceneInitCallback = (context: Scene, services: SceneServices) => void;

export type EntityFunction = (services: SceneServices) => Entity;

export class Scene {
    public sceneId: string;
    public initialized: boolean;
    public initCallback: SceneInitCallback;
    public alwaysInitialize: boolean;
    public systems: { [index: string]: System };
    public gameEntities: { [index: string]: Entity };

    private options: SceneOptions = null;

    public constructor(options: SceneOptions) {
        this.sceneId = options.sceneId;

        this.initialized = false;

        this.alwaysInitialize = options.alwaysInitialize || true;

        this.initCallback = options.init || ((): void => {});

        this.gameEntities = {};
        this.systems = {};

        this.options = options;
    }

    public initialize(context: Scene, services: SceneServices): void {
        if (this.options.systems) this.options.systems.forEach((s): void => this.registerSystem(s));
        if (this.options.entities) this.options.entities.forEach((entity): void => this.addEntity(entity(services)));

        this.initCallback(context, services);
        this.initialized = true;
    }

    public registerSystem(system: System): void {
        if (this.systems[system.systemId])
            throw new Error(`System with system ID '${system.systemId}' has already been registered`);

        this.systems[system.systemId] = system;
    }

    public unregisterSystem(system: System): void {
        delete this.systems[system.systemId];
    }

    public addEntity(entity: Entity): void {
        this.gameEntities[entity.id] = entity;
    }

    public removeEntity(id: number): void {
        delete this.gameEntities[id];
    }
}
