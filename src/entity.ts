import { Component } from './component';

export default class Entity {
	[x: string]: any;

	id: any;
	count: any;

	constructor() {
		this.id = Entity.prototype.count;

		Entity.prototype.count++;
	}
	
	addComponent(component: Component) {
		this[component.name] = component;
	}
	
	removeComponent(componentName: string | number) {
		delete this[componentName];
	}

	hasComponent(componentName: any) {
		return (this[componentName] != null);
	}

	hasComponents(componentArray: Array<Component>) {

		let len = componentArray.length;
		for (var i = 0; i < len; i++) {
			if (!this.hasComponent(componentArray[i]))
				return false;
		}

		return true;
	}
}

Entity.prototype.count = 0;