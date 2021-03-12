import Entity from './entity';
import { Scene, SceneServices } from './scene';
export interface System {
    systemId: string;
    requiredComponents: string[];
    update: (e: Entity, scene: Scene, services: SceneServices) => void;
}
export declare var InputMappingSystem: System;
