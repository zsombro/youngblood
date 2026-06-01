import { default as Component } from '../components/component';
import { System } from '../system';
export declare const CollisionSystem: System;
export interface CollisionBox {
    offsetX: number;
    offsetY: number;
    width: number;
    height: number;
}
export declare const collisionBox: (data?: CollisionBox | undefined) => Component<CollisionBox>;
