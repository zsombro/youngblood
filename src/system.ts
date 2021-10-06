import Entity from './entity';
import { Scene, SceneServices } from './scene';

export interface System {
    systemId: string;
    requiredComponents: string[];
    update: (e: Entity, scene: Scene, services: SceneServices) => void;
}

export const InputMappingSystem: System = {
    systemId: 'inputMappingSystem',
    requiredComponents: ['InputMapping'],
    update: function(entity: Entity, scene: Scene, services: SceneServices): void {
        const inputMapping = entity.get('InputMapping');

        for (var i = 0; i < inputMapping.mapping.length; i++) {
            let c = inputMapping.mapping[i];
            inputMapping[c.name] = services.input.isPressed(c.code);
        }
    },
};

export const TiledMapSystem: System = {
    systemId: 'tiledMapSystem',
    requiredComponents: ['TiledMap', 'Position', 'InputMapping'],
    update: function(entity: Entity): void {
        const mapData = entity.get('TiledMap');
    },
};

export const CameraMovementSystem: System = {
    systemId: 'cameraMovementSystem',
    requiredComponents: ['Position', 'Camera'],
    update: function(entity: Entity): void {
        const position = entity.get('Position');
        const camera = entity.get('Camera');

        camera.centerX = position.x;
        camera.centerY = position.y;
    },
};
