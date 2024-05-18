import Component, { Position, Velocity, Sprite, AnimatedSprite, InputMapping, Label, Box, Camera } from './components/component';
import TiledMap from './components/tiledMap';
import { PhysicsObject } from './systems/physicsSystem';
export default class Entity {
    [x: string]: Component | string;
    id: string;
    constructor(id?: string);
    addComponent(component: Component): void;
    addComponents(components: Component[]): void;
    removeComponent(componentName: string): void;
    hasComponent(componentName: string): boolean;
    hasComponents(componentArray: string[]): boolean;
    get(name: 'Position'): Position;
    get(name: 'Velocity'): Velocity;
    get(name: 'Sprite'): Sprite;
    get(name: 'InputMapping'): InputMapping;
    get(name: 'AnimatedSprite'): AnimatedSprite;
    get(name: 'TiledMap'): TiledMap;
    get(name: 'Camera'): Camera;
    get(name: 'Label'): Label;
    get(name: 'Box'): Box;
    get(name: 'PhysicsObject'): PhysicsObject;
}
