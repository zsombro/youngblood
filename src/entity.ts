/* eslint-disable @typescript-eslint/no-explicit-any */
import Component from './component';

export default class Entity {
    [x: string]: Component;

    public id: any;
    public count: any;

    public constructor() {
        this.id = Entity.prototype.count;

        Entity.prototype.count++;
    }

    public addComponent(component: Component): void {
        this[component.name] = component;
    }

    public removeComponent(componentName: string): void {
        delete this[componentName];
    }

    public hasComponent(componentName: string): boolean {
        return this[componentName] != null;
    }

    public hasComponents(componentArray: string[]): boolean {
        let len = componentArray.length;
        for (var i = 0; i < len; i++) {
            if (!this.hasComponent(componentArray[i])) return false;
        }

        return true;
    }
}

Entity.prototype.count = 0;
