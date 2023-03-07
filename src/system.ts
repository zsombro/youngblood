import Entity from './entity';
import { FrameData } from './framerateManager';
import { Scene, ISceneServices } from './scene';

export interface System {
    id: string;
    requiredComponents: string[];
    eventSubscriptions?: (e: Entity, scene: Scene, services: ISceneServices) => { [x: string]: Function };
    update: (e: Entity, scene: Scene, services: ISceneServices, frameData: FrameData) => void;
}

export const VelocitySystem: System = {
    id: 'velocitySystem',
    requiredComponents: ['Position', 'Velocity'],
    update: function(entity) {
        const pos = entity.get('Position')
        const vel = entity.get('Velocity')

        pos.x += vel.x
        pos.y += vel.y
    }
};

export const InputMappingSystem: System = {
    id: 'inputMappingSystem',
    requiredComponents: ['InputMapping'],
    update: function(entity: Entity, scene: Scene, services: ISceneServices): void {
        const inputMapping = entity.get('InputMapping');

        for (var i = 0; i < inputMapping.mapping.length; i++) {
            let c = inputMapping.mapping[i];
            inputMapping[c.name] = services.input.isPressed(c.code);
        }
    },
};

export const TiledMapSystem: System = {
    id: 'tiledMapSystem',
    requiredComponents: ['TiledMap', 'Position', 'InputMapping'],
    update: function(entity: Entity): void {
        const mapData = entity.get('TiledMap');
    },
};

export const CameraMovementSystem: System = {
    id: 'cameraMovementSystem',
    requiredComponents: ['Position', 'Camera'],
    update: function(entity: Entity): void {
        const position = entity.get('Position');
        const camera = entity.get('Camera');

        camera.centerX = position.x;
        camera.centerY = position.y;
    },
};
