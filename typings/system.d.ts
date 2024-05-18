import Entity from './entity';
import { FrameData } from './framerateManager';
import { Scene, ISceneServices } from './scene';
export interface System {
    id: string;
    requiredComponents: string[];
    eventSubscriptions?: (e: Entity, scene: Scene, services: ISceneServices) => {
        [x: string]: Function;
    };
    update: (e: Entity, scene: Scene, services: ISceneServices, frameData: FrameData) => void;
    onSceneSwitched?: (scene: Scene, services: ISceneServices) => void;
    onSceneResumed?: (scene: Scene, services: ISceneServices) => void;
    onBeforeUpdate?: (scene: Scene, services: ISceneServices, frameData: FrameData) => void;
}
export declare const VelocitySystem: System;
export declare const InputMappingSystem: System;
export declare const TiledMapSystem: System;
export declare const CameraMovementSystem: System;
