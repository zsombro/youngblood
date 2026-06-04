import { System } from "../system";
import { component, transform } from "../components/component";
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

const degToRad = (degrees: number): number => degrees * (Math.PI / 180)
const radToDeg = (radians: number): number => radians * (180 / Math.PI)

export class PhysicsSystem implements System {
    id: string = 'PhysicsSystem'
    requiredComponents = ['transform', 'physicsObject']

    private engine = Engine.create()
    private worldBodyCache: { [key: string]: Body } = {}
    private lastDelta = 1

    private addBodyForEntity(entity: Entity) {
        if (this.worldBodyCache[entity.id] || !entity.hasComponents(this.requiredComponents))
            return

        const { position, rotation } = entity.get(transform)
        const physObject = entity.get(physicsObject)

        const body = Bodies.rectangle(position.x, position.y, physObject.width, physObject.height, {
            angle: degToRad(rotation),
            isStatic: physObject.bodyType === 'static',
        })

        this.worldBodyCache[entity.id] = body
        Composite.add(this.engine.world, body)
    }

    private removeBodyForEntity(entity: Entity | null) {
        if (!entity)
            return

        const body = this.worldBodyCache[entity.id]
        if (!body)
            return

        Composite.remove(this.engine.world, body)
        delete this.worldBodyCache[entity.id]
    }

    update(e: Entity, scene: Scene, sceneServices: ISceneServices, frameData: FrameData) {
        if (!this.worldBodyCache[e.id])
            return

        e.get(transform).position.x = this.worldBodyCache[e.id].position.x;
        e.get(transform).position.y = this.worldBodyCache[e.id].position.y;
        e.get(transform).rotation = radToDeg(this.worldBodyCache[e.id].angle);
    }

    onBeforeUpdate(scene: Scene, services: ISceneServices, frameData: FrameData) {
        services.event.on('scene.entity_added', (entity: Entity) => {
            this.addBodyForEntity(entity)
        })

        services.event.on('scene.entity_removed', (entity: Entity | null) => {
            this.removeBodyForEntity(entity)
        })

        Engine.update(this.engine, frameData.delta, frameData.delta / this.lastDelta)
        this.lastDelta = frameData.delta
    }
}
