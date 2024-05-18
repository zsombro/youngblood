import Component from "../components/component";
import Entity from "../entity";
import { ISceneServices, Scene } from "../scene";
import { System } from "../system";

export const CollisionSystem: System = {
    id: 'CollisionSystem',
    requiredComponents: ['CollisionBox'],
    update(e: Entity, scene: Scene, services: ISceneServices) {
        for (let i = 0, len = scene.gameEntities.length; i < len; i++) {
            if (scene.gameEntities[i].id === e.id || !e.hasComponent('CollisionBox')) continue

            if (intersects(e, scene.gameEntities[i]))
                services.event.dispatch('collision.collides', {
                    entityId: scene.gameEntities[i].id
                })
        }
    }
}

function intersects(a: Entity, b: Entity): boolean {
    const boxA = <CollisionBox>a['CollisionBox']
    const boxB = <CollisionBox>b['CollisionBox']

    return boxA.offsetX < boxB.offsetX + boxB.width 
        && boxA.offsetX + boxA.width > boxB.offsetX 
        && boxA.offsetY < boxB.offsetY + boxB.height 
        && boxA.offsetY + boxA.height > boxB.offsetY
}

export class CollisionBox extends Component {
    offsetX: number
    offsetY: number
    width: number
    height: number

    constructor() {
        super('CollisionBox')
    }
}