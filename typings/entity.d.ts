import { Component } from './component';
export default class Entity {
    [x: string]: Component;
    id: any;
    count: any;
    constructor();
    addComponent(component: Component): void;
    removeComponent(componentName: string | number): void;
    hasComponent(componentName: string): boolean;
    hasComponents(componentArray: string[]): boolean;
}
