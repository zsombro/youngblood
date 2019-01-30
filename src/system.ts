import Entity from './entity';

export const SystemScope = {
	LOCAL: 'local', // default
	GLOBAL: 'global'
}

export const SystemType = {
	NONRENDER: 'nonrender', // default
	RENDER: 'render'
}

export interface System {
    systemId: string,
    type: string,
    requiredComponents: Array<string>,
    update: (e: Entity) => void
}

export var InputMappingSystem = {
    systemId: 'inputMappingSystem',
    type: SystemType.NONRENDER,
    requiredComponents: ['InputMapping'],
    update: function (entity: Entity) {

        const l = entity.InputMapping.mapping.length;
        for (var i = 0; i < l; i++) {
            let c = entity.InputMapping.mapping[i];
            entity.InputMapping[c.name] = this.input.isPressed(c.code);
        }
    }
}

var RenderSystem: System = {
    systemId: 'renderSystem',
    type: SystemType.RENDER,
    requiredComponents: [],
    update: function (entity: Entity) {
        
    }
}