import { camera, inputMapping, transform, velocity } from './components/component';
import Entity from './entity';
import { FrameData } from './framerateManager';
import { tiledMap } from './main';
import { Scene, ISceneServices } from './scene';

export interface System {
    id: string;
    requiredComponents: string[];
    eventSubscriptions?: (e: Entity, scene: Scene, services: ISceneServices) => { [x: string]: Function };
    update: (e: Entity, scene: Scene, services: ISceneServices, frameData: FrameData) => void;
    onSceneSwitched?: (scene: Scene, services: ISceneServices) => void;
    onSceneResumed?: (scene: Scene, services: ISceneServices) => void;
    onBeforeUpdate?: (scene: Scene, services: ISceneServices, frameData: FrameData) => void;
}

export const VelocitySystem: System = {
    id: 'velocitySystem',
    requiredComponents: ['transform', 'velocity'],
    update: function(entity) {
        const pos = entity.get(transform)
        const vel = entity.get(velocity)

        pos.position.x += vel.x
        pos.position.y += vel.y
    }
};

export const InputMappingSystem: System = {
    id: 'inputMappingSystem',
    requiredComponents: ['inputMapping'],
    update: function(entity: Entity, scene: Scene, services: ISceneServices): void {
        const input = entity.get(inputMapping);

        for (let i = 0; i < input.mapping.length; i++) {
            const c = input.mapping[i];
            input[c.name] = services.input.isPressed(c.code);
        }
    },
};

export const TiledMapSystem: System = {
    id: 'tiledMapSystem',
    requiredComponents: ['tiledMap', 'transform', 'inputMapping'],
    update: function(entity: Entity): void {
        const mapData = entity.get(tiledMap);
    },
};

export const CameraMovementSystem: System = {
    id: 'cameraMovementSystem',
    requiredComponents: ['transform', 'camera'],
    update: function(entity: Entity): void {
        const tf = entity.get(transform);
        const cam = entity.get(camera);

        cam.centerX = tf.position.x;
        cam.centerY = tf.position.y;
    },
};
