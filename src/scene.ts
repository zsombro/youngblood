import Entity from './entity';
import { System, SystemScope, SystemType } from './system';

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
    game: { switchToScene(name: string): void };
}

export type SceneInitCallback = (context: Scene, services: SceneServices) => void;

export class Scene {
    public sceneId: string;
    public initialized: boolean;
    public initCallback: SceneInitCallback;
    public alwaysInitialize: boolean;
    public gameEntities: { [index: string]: Entity };
    public systems: { [index: string]: System };
    public assets: {};

    public constructor(options: SceneOptions) {
        this.sceneId = options.sceneId;

        this.initialized = false;

        this.alwaysInitialize = options.alwaysInitialize || true;

        this.initCallback = options.init;
        // This stuff is really not ready yet dudes
        // this.systemScope = options.scope || SystemScope.LOCAL;
        // this.systemType = options.type || SystemType.NONRENDER;

        this.gameEntities = {};
        this.systems = {};
    }

    public registerSystem(system: System): void {
        this.systems[system.systemId] = system;
    }

    public unregisterSystem(system: System): void {
        delete this.systems[system.systemId];
    }

    public addEntity(entity: Entity): void {
        this.gameEntities[entity.id] = entity;
    }
}
