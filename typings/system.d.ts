import Entity from './entity';
import { SceneServices } from './scene';
export interface System {
    systemId: string;
    requiredComponents: string[];
    update: (e: Entity, services: SceneServices) => void;
}
export declare var InputMappingSystem: {
    systemId: string;
    requiredComponents: string[];
    update: (entity: Entity, services: SceneServices) => void;
};
