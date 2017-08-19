class Entity {
	constructor() {
		this.id = Entity.prototype.count;
		Entity.prototype.count++;
	}
	
	addComponent(component) {
		this[component.name] = component;
	}
	
	removeComponent(componentName) {
		delete this[componentName];
	}

	hasComponent(componentName) {
		return (this[componentName] != null);
	}

	hasComponents(componentArray) {

		componentArray.forEach(function(element) {
			if (!this.hasComponent(element))
				return false;
		}, this);

		return true;
	}
}

Entity.prototype.count = 0;