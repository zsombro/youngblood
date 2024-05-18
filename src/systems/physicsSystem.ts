import { System } from "../system";
import Component from "../components/component";
import Entity from "../entity";

import { Bodies, Body, Composite, Engine } from 'matter-js';
import { FrameData } from "../framerateManager";
import { Scene, ISceneServices } from "../scene";

export class PhysicsSystem implements System {
    id: string = 'PhysicsSystem'
    requiredComponents = ['Position', 'PhysicsObject']

    private engine = Engine.create()
    private worldBodyCache: { [key: string]: Body } = {}

    update(e: Entity, scene: Scene, sceneServices: ISceneServices, frameData: FrameData) {
        const pos = e.get('Position')
        const physicsObject: PhysicsObject = e.get('PhysicsObject')

        if (!this.worldBodyCache[e.id]) {
            this.worldBodyCache[e.id] = Bodies.rectangle(pos.x, pos.y, physicsObject.width, physicsObject.height, { isStatic: physicsObject.bodyType === 'static' })
            Composite.add(this.engine.world, this.worldBodyCache[e.id])
        }

        e.get('Position').x = this.worldBodyCache[e.id].position.x;
        e.get('Position').y = this.worldBodyCache[e.id].position.y;
    }

    onBeforeUpdate(scene: Scene, services: ISceneServices, frameData: FrameData) {
        Engine.update(this.engine, frameData.delta)
    }
}

type PhysicsBodyType = 'static' | 'kinetic'

export class PhysicsObject extends Component {
    width: number
    height: number
    bodyType: PhysicsBodyType

    constructor(width: number, height: number, bodyType: PhysicsBodyType) {
        super('PhysicsObject')

        this.width = width
        this.height = height
        this.bodyType = bodyType
    }
}