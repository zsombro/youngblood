import Entity from './entity';
import { System } from './system';

import InputManager from './services/inputmanager';
import AudioManager from './services/audiomanager';
import AssetLoader from './services/assetloader';
import { Component } from './main';
import { ComponentFunction } from './components/component';
import EntityManager from './entityManager';

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

export type EntityFunction = (services: ISceneServices) => Entity | Component<any>[];

export class Scene {
    public id: string;
    public initialized: boolean;
    public initCallback: SceneInitCallback;
    public alwaysInitialize: boolean;
    public systems: System[];
    public get gameEntities(): Entity[] {
        return this.entityManager.entities;
    }

    public getEntityArray(): Entity[] {
        return this.entityManager.entities;
    }

    private options: SceneOptions | null = null;
    private services: ISceneServices | null = null;
    private entityManager: EntityManager;

    public constructor(options: SceneOptions, services: ISceneServices) {
        this.id = options.sceneId;
        this.initialized = false;
        this.alwaysInitialize = options.alwaysInitialize ?? true;
        this.initCallback = options.init ?? ((): void => { });
        this.options = options;
        this.services = services;

        this.entityManager = new EntityManager();
        this.systems = [];
    }

    public initialize(context: Scene, services: ISceneServices): void {
        if (this.options?.systems) this.registerSystems(this.options.systems);
        if (this.options?.entities) this.options.entities.forEach((entity): void => this.addEntity(entity(services)));

        this.initCallback(context, services);
        this.initialized = true;
    }

    public registerSystem(system: System): void {
        if (this.systems.map(s => s.id).includes(system.id))
            throw new Error(`System with ID ${system.id} has already been registered!`)

        this.systems.push(system);
    }

    public registerSystems(systems: System[]): void {
        systems.forEach(this.registerSystem.bind(this));
    }

    public unregisterSystem(id: String): void {
        const index = this.systems.findIndex(e => e.id === id);

        if (index === -1)
            return;

        const lastIndex = this.systems.length - 1;

        if (index !== lastIndex)
            this.systems[index] = this.systems[lastIndex];

        this.systems.pop();
    }

    public addEntity(entity: Entity | Component<any>[]): void {
        if (entity instanceof Entity) {
            this.entityManager.addEntity(entity);
        } else {
            const e = new Entity();
            e.addComponents(entity);
            this.entityManager.addEntity(e);
        }

        this.services?.event.dispatch('scene.entity_added', entity);
    }

    public removeEntity(id: string): void {
        this.services?.event.dispatch('scene.entity_removed', this.entityManager.removeEntity(id));
    }

    public findEntityById(id: string): Entity | undefined {
        return this.entityManager.findEntityById(id);
    }

    public getEntitiesWith(component: string | ComponentFunction<any>): Entity[] {
        return this.getEntityArray().filter(e => e.hasComponent(component))
    }
}
