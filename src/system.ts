import Entity from './entity';
import { SceneServices } from './scene';
import { InputMapping } from './component';

export enum SystemScope {
    Local, // default
    Global,
}

export enum SystemType {
    NonRender, // default
    Render,
}

export interface System {
    systemId: string;
    type?: SystemType;
    requiredComponents: string[];
    update: (e: Entity, services: SceneServices) => void;
}

export var InputMappingSystem = {
    systemId: 'inputMappingSystem',
    type: SystemType.NonRender,
    requiredComponents: ['InputMapping'],
    update: function(entity: Entity, services: SceneServices): void {
        const inputMapping = entity['InputMapping'] as InputMapping;

        for (var i = 0; i < inputMapping.mapping.length; i++) {
            let c = inputMapping.mapping[i];
            inputMapping[c.name] = services.input.isPressed(c.code);
        }
    },
};

var RenderSystem: System = {
    systemId: 'renderSystem',
    type: SystemType.Render,
    requiredComponents: [],
    update: function(entity: Entity): void {},
};
