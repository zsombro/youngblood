/* eslint-disable @typescript-eslint/no-explicit-any */
import Component, { ComponentFunction, component } from './components/component';

const ctype = (type: string | ComponentFunction<any>) => typeof type === 'function' ? type().type : type


export default class Entity {
    [x: string]: Component<any> | Function | string

    id: string

    constructor(id = crypto.randomUUID()) {
        this.id = id
    }

    public addComponent(component: Component<any>): void {
        this[component.type] = component.data
    }

    public addComponents(components: Component<any>[]): void {
        components.forEach(this.addComponent.bind(this));
    }

    public removeComponent(component: string | ComponentFunction<any>): void {
        this[ctype(component)] = undefined;
    }

    public hasComponent(component: string | ComponentFunction<any>): boolean {
        return this[ctype(component)] != null;
    }

    public hasComponents(componentArray: string[]): boolean {
        let len = componentArray.length;

        if (!len) return false;
        
        for (var i = 0; i < len; i++) {
            if (!this.hasComponent(componentArray[i])) return false;
        }

        return true;
    }

    public get<T>(component: string | ComponentFunction<T>): T {
        return this[ctype(component)] as T;
    }
}
