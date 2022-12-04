import Entity from './entity';
import { FrameData } from './framerateManager';
import { Scene, SceneServices } from './scene';
export interface System {
    systemId: string;
    requiredComponents: string[];
    eventSubscriptions?: (e: Entity, scene: Scene, services: SceneServices) => {
        [x: string]: Function;
    };
    update: (e: Entity, scene: Scene, services: SceneServices, frameData: FrameData) => void;
}
export declare const VelocitySystem: System;
export declare const InputMappingSystem: System;
export declare const TiledMapSystem: System;
export declare const CameraMovementSystem: System;
