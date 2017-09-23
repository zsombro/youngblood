var InputMappingSystem = {
    systemId: 'inputMappingSystem',
    requiredComponents: ['InputMapping'],
    update: function (entity) {

        const l = entity.InputMapping.mapping.length;
        for (var i = 0; i < l; i++) {
            let c = entity.InputMapping.mapping[i];
            entity.InputMapping[c.name] = this.inputService.isPressed(c.code);
        }
    }
}