import Entity from './entity';
import { Scene, SceneServices } from './scene';
export interface System {
    systemId: string;
    requiredComponents: string[];
    update: (e: Entity, scene: Scene, services: SceneServices) => void;
}
export declare const InputMappingSystem: System;
export declare const TiledMapSystem: System;
export declare const CameraMovementSystem: System;
