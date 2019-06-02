import Entity from './entity';
import { SceneServices } from './scene';
export declare enum SystemScope {
    Local = 0,
    Global = 1
}
export declare enum SystemType {
    NonRender = 0,
    Render = 1
}
export interface System {
    systemId: string;
    type?: SystemType;
    requiredComponents: string[];
    update: (e: Entity, services: SceneServices) => void;
}
export declare var InputMappingSystem: {
    systemId: string;
    type: SystemType;
    requiredComponents: string[];
    update: (entity: Entity, services: SceneServices) => void;
};
