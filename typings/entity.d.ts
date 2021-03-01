import Component, { Position, Velocity, Sprite, AnimatedSprite, InputMapping } from './component';
export default class Entity {
    [x: string]: Component;
    id: any;
    count: any;
    constructor();
    addComponent(component: Component): void;
    removeComponent(componentName: string): void;
    hasComponent(componentName: string): boolean;
    hasComponents(componentArray: string[]): boolean;
    get(name: 'Position'): Position;
    get(name: 'Velocity'): Velocity;
    get(name: 'Sprite'): Sprite;
    get(name: 'InputMapping'): InputMapping;
    get(name: 'AnimatedSprite'): AnimatedSprite;
}
