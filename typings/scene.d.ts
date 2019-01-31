import Entity from './entity';
import { System } from './system';
export interface SceneOptions {
    sceneId?: string;
    alwaysInitialize?: boolean;
    init?: Function;
}
export declare class Scene {
    sceneId: any;
    initialized: boolean;
    initCallback: any;
    alwaysInitialize: any;
    systemScope: any;
    systemType: any;
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
