import Entity from './entity';
export declare const SystemScope: {
    LOCAL: string;
    GLOBAL: string;
};
export declare const SystemType: {
    NONRENDER: string;
    RENDER: string;
};
export interface System {
    systemId: string;
    type: string;
    requiredComponents: Array<string>;
    update: (e: Entity) => void;
}
export declare var InputMappingSystem: {
    systemId: string;
    type: string;
    requiredComponents: string[];
    update: (entity: Entity) => void;
};
