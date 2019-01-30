import { Component } from './component';
export default class Entity {
    [x: string]: any;
    id: any;
    count: any;
    constructor();
    addComponent(component: Component): void;
    removeComponent(componentName: string | number): void;
    hasComponent(componentName: any): boolean;
    hasComponents(componentArray: Array<Component>): boolean;
}
