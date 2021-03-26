/* eslint-disable @typescript-eslint/no-explicit-any */
import Component, {
    Position,
    Velocity,
    Sprite,
    AnimatedSprite,
    InputMapping,
    Label,
    Box,
} from './components/component';
import TiledMap from './components/tiledMap';

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

    public get(name: 'Position'): Position;
    public get(name: 'Velocity'): Velocity;
    public get(name: 'Sprite'): Sprite;
    public get(name: 'InputMapping'): InputMapping;
    public get(name: 'AnimatedSprite'): AnimatedSprite;
    public get(name: 'TiledMap'): TiledMap;
    public get(name: 'Label'): Label;
    public get(name: 'Box'): Box;
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
            case 'Label':
                return this[name] as Label;
            case 'Box':
                return this[name] as Box;
            case 'TiledMap':
                return this[name] as TiledMap;
            default:
                return this[name];
        }
    }
}

Entity.prototype.count = 0;
