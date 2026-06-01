import { System } from '../system';
import { default as Component } from '../components/component';
import { default as Entity } from '../entity';
import { FrameData } from '../framerateManager';
import { Scene, ISceneServices } from '../scene';
type PhysicsBodyType = 'static' | 'kinetic';
export interface PhysicsObject {
    width: number;
    height: number;
    bodyType: PhysicsBodyType;
}
export declare const physicsObject: (data?: PhysicsObject | undefined) => Component<PhysicsObject>;
export declare class PhysicsSystem implements System {
    id: string;
    requiredComponents: string[];
    private engine;
    private worldBodyCache;
    update(e: Entity, scene: Scene, sceneServices: ISceneServices, frameData: FrameData): void;
    onBeforeUpdate(scene: Scene, services: ISceneServices, frameData: FrameData): void;
}
export {};
