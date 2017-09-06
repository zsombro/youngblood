var DirectionalInputSystem = {
    systemId: 'directionalInput',
    requiredComponents: ['DirectionalInput'],
    update: function (entity) {
        
        entity.DirectionalInput.up = this.inputService.isPressed(38);
        entity.DirectionalInput.down = this.inputService.isPressed(40);
        entity.DirectionalInput.left = this.inputService.isPressed(37);
        entity.DirectionalInput.right = this.inputService.isPressed(39);
    }
}

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