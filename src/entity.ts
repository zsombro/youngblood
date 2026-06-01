/* eslint-disable @typescript-eslint/no-explicit-any */
import Component, { ComponentFunction, component } from './components/component';

const ctype = (type: string | ComponentFunction<any>) => typeof type === 'function' ? type().type : type


export default class Entity {
    [x: string]: Component<any> | Function | string | undefined

    id: string

    constructor(id: string = crypto.randomUUID()) {
        this.id = id
    }

    public addComponent(component: Component<any>): void {
        this[component.type] = component
    }

    public addComponents(components: Component<any>[]): void {
        components.forEach(this.addComponent.bind(this));
    }

    public removeComponent(component: string | ComponentFunction<any>): void {
        delete this[ctype(component)];
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
        return (this[ctype(component)] as Component<T> | undefined)?.data as T;
    }
}
