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