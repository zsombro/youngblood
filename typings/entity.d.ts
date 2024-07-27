import Component, { ComponentFunction } from './components/component';
export default class Entity {
    [x: string]: Component<any> | Function | string;
    id: string;
    constructor(id?: string);
    addComponent(component: Component<any>): void;
    addComponents(components: Component<any>[]): void;
    removeComponent(component: string | ComponentFunction<any>): void;
    hasComponent(component: string | ComponentFunction<any>): boolean;
    hasComponents(componentArray: string[]): boolean;
    get<T>(component: string | ComponentFunction<T>): T;
}
