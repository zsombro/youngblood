/* eslint-disable @typescript-eslint/no-explicit-any */
import Component, {
    Position,
    Velocity,
    Sprite,
    AnimatedSprite,
    InputMapping,
    Label,
    Box,
    Camera,
} from './components/component';
import TiledMap from './components/tiledMap';

export default class Entity {
    [x: string]: Component | string;

    public id: string;

    public constructor(id: string = crypto.randomUUID()) {
        this.id = id;
    }

    public addComponent(component: Component): void {
        this[component.name] = component;
    }

    public addComponents(components: Component[]): void {
        components.forEach(this.addComponent.bind(this));
    }

    public removeComponent(componentName: string): void {
        this[componentName] = undefined;
    }

    public hasComponent(componentName: string): boolean {
        return this[componentName] != null;
    }

    public hasComponents(componentArray: string[]): boolean {
        let len = componentArray.length;

        if (!len) return false;
        
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
    public get(name: 'Camera'): Camera;
    public get(name: 'Label'): Label;
    public get(name: 'Box'): Box;
    public get(name: string): unknown {
        return this[name];
    }
}
