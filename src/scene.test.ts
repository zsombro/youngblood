import { describe, expect, it } from 'vitest';

import Entity from './entity';
import { Scene, SceneOptions, ISceneServices } from './scene';
import { System } from './system';
import InputManager from './services/inputmanager';
import AssetLoader from './services/assetloader';
import { Component } from './main';
import EventManager from './services/eventmanager';

const createMockSceneServices = (): { services: ISceneServices, eventManager: EventManager } => {
    const eventManager = new EventManager()

    return {
        eventManager,
        services: {
            input: new InputManager(eventManager),
            assets: new AssetLoader(),
            audio: {} as any,
            event: eventManager,
            game: { switchToScene: (): void => {} },
        },
    }
}

describe('Scene', (): void => {
    it('should auto-register Entities', (): void => {
        const { services } = createMockSceneServices();
        const sceneOptions: SceneOptions = {
            sceneId: 'test',
            entities: [(): Entity => new Entity(), (): Component<any>[] => []],
        };

        const scene = new Scene(sceneOptions, services);
        scene.initialize(scene, services);

        expect(Object.values(scene.gameEntities).length).to.equal(2);
    });

    it('should auto-register Systems', (): void => {
        const { services } = createMockSceneServices();
        const sceneOptions: SceneOptions = {
            sceneId: 'test',
            systems: [
                { id: 'system1', requiredComponents: [], update: (): void => {} },
                { id: 'system2', requiredComponents: [], update: (): void => {} },
            ],
        };

        const scene = new Scene(sceneOptions, services);
        scene.initialize(scene, services);

        expect(Object.values(scene.systems).length).to.equal(2);
    });

    it('should throw an error if a system ID has already been registered', (): void => {
        const { services } = createMockSceneServices();
        const scene = new Scene({ sceneId: 'test' }, services);

        const system: System = { id: 'system1', requiredComponents: [], update: (): void => {} };

        scene.registerSystem(system);

        expect(function(): void {
            scene.registerSystem(system);
        }).to.throw(/has already been registered/g);
    });

    it('should expose the entity array through getEntityArray', (): void => {
        const { services } = createMockSceneServices();
        const scene = new Scene({ sceneId: 'test' }, services);
        const entity = new Entity('entity-test');

        scene.addEntity(entity);

        expect(scene.getEntityArray()).to.equal(scene.gameEntities);
        expect(scene.getEntityArray().length).to.equal(1);
        expect(scene.getEntityArray()[0].id).to.equal('entity-test');
    });

    it('should dispatch scene.entity_added with the concrete Entity instance', (): void => {
        const { services, eventManager } = createMockSceneServices();
        const scene = new Scene({ sceneId: 'test' }, services);
        const entity = new Entity('entity-added-event-test');

        scene.addEntity(entity);

        let addedEntity: Entity | null = null
        eventManager.emptyQueue();
        eventManager.on('scene.entity_added', (e: Entity) => {
            addedEntity = e
        });

        expect(addedEntity).to.equal(entity);
    });

    it('should dispatch scene.entity_added with created Entity when adding component arrays', (): void => {
        const { services, eventManager } = createMockSceneServices();
        const scene = new Scene({ sceneId: 'test' }, services);
        const components = [
            { type: 'testComp', data: { value: 1 } },
        ] as unknown as Component<any>[]

        scene.addEntity(components);

        let addedEntity: Entity | null = null
        eventManager.emptyQueue();
        eventManager.on('scene.entity_added', (e: Entity) => {
            addedEntity = e
        });

        expect(addedEntity).toBeInstanceOf(Entity);
    });

    it('should dispatch scene.entity_removed with null when id is not found', (): void => {
        const { services, eventManager } = createMockSceneServices();
        const scene = new Scene({ sceneId: 'test' }, services);

        scene.removeEntity('missing-id');

        let removedEntity: Entity | null | undefined
        eventManager.emptyQueue();
        eventManager.on('scene.entity_removed', (e: Entity | null) => {
            removedEntity = e
        });

        expect(removedEntity).to.equal(null);
    });
});
