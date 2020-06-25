/* eslint-disable @typescript-eslint/no-explicit-any */
import { Position, Velocity, Sprite, AnimatedSprite, InputMapping } from './component';

export default class Entity {
    [x: string]: Record<string, any>;

    public id: any;
    public count: any;

    public constructor() {
        this.id = Entity.prototype.count;

        Entity.prototype.count++;
    }

    public addComponent(component: Record<string, any>): void {
        this[component.constructor.name] = component;
    }

    public removeComponent(componentName: string): void {
        delete this[componentName];
    }

    public hasComponent(componentName: string): boolean {
        return !!this[componentName];
    }

    public hasComponents(componentArray: string[]): boolean {
        let len = componentArray.length;
        for (var i = 0; i < len; i++) {
            if (!this.hasComponent(componentArray[i])) return false;
        }

        return true;
    }

    public get(name: 'Position'): Position;
    public get(name: 'Velocity'): Velocity;
    public get(name: 'Sprite'): Sprite;
    public get(name: 'InputMapping'): InputMapping;
    public get(name: 'AnimatedSprite'): AnimatedSprite;
    public get(name: string): any {
        switch (name) {
            case 'Velocity':
                return this[name] as Velocity;
            case 'Position':
                return this[name] as Position;
            case 'Sprite':
                return this[name] as Sprite;
            case 'AnimatedSprite':
                return this[name] as AnimatedSprite;
            case 'InputMapping':
                return this[name] as InputMapping;
            default:
                return this[name];
        }
    }
}

Entity.prototype.count = 0;
