import { System } from "../system";
import Component, { component, transform } from "../components/component";
import Entity from "../entity";

import { Bodies, Body, Composite, Engine } from 'matter-js';
import { FrameData } from "../framerateManager";
import { Scene, ISceneServices } from "../scene";

type PhysicsBodyType = 'static' | 'kinetic'

export interface PhysicsObject {
    width: number
    height: number
    bodyType: PhysicsBodyType
}

export const physicsObject = component<PhysicsObject>('physicsObject')

export class PhysicsSystem implements System {
    id: string = 'PhysicsSystem'
    requiredComponents = ['transform', 'physicsObject']

    private engine = Engine.create()
    private worldBodyCache: { [key: string]: Body } = {}

    update(e: Entity, scene: Scene, sceneServices: ISceneServices, frameData: FrameData) {
        const pos = e.get(transform).position
        const physObject = e.get(physicsObject)

        if (!this.worldBodyCache[e.id]) {
            this.worldBodyCache[e.id] = Bodies.rectangle(pos.x, pos.y, physObject.width, physObject.height, { isStatic: physObject.bodyType === 'static' })
            Composite.add(this.engine.world, this.worldBodyCache[e.id])
        }

        e.get(transform).position.x = this.worldBodyCache[e.id].position.x;
        e.get(transform).position.y = this.worldBodyCache[e.id].position.y;
    }

    onBeforeUpdate(scene: Scene, services: ISceneServices, frameData: FrameData) {
        Engine.update(this.engine, frameData.delta)
    }
}
