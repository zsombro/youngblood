import Component, { Position, Velocity, Sprite, AnimatedSprite, InputMapping, Label, Box, Camera } from './components/component';
import TiledMap from './components/tiledMap';
export default class Entity {
    [x: string]: Component | string;
    id: string;
    constructor();
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
}
