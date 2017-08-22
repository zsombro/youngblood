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

		let len = componentArray.length;
		for (var i = 0; i < len; i++) {
			if (!this.hasComponent(componentArray[i]))
				return false;
		}

		return true;
	}
}

Entity.prototype.count = 0;