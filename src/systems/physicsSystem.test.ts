import { describe, expect, it } from 'vitest';
import { Composite } from 'matter-js';

import Entity from '../entity';
import { transform } from '../components/component';
import { PhysicsSystem, physicsObject } from './physicsSystem';
import EventManager from '../services/eventmanager';
import { ISceneServices } from '../scene';

const runBeforeUpdate = (system: PhysicsSystem, eventManager: EventManager): void => {
    eventManager.emptyQueue();
    system.onBeforeUpdate({} as any, {
        event: {
            dispatch: eventManager.dispatch.bind(eventManager),
            on: eventManager.on.bind(eventManager),
        },
    } as ISceneServices, { delta: 16 } as any)
}

describe('PhysicsSystem', (): void => {
    it('should convert transform rotation from degrees to radians for matter body angle', (): void => {
        const system = new PhysicsSystem();
        const eventManager = new EventManager();
        const entity = new Entity('physics-entity');
        entity.addComponents([
            transform({ position: { x: 100, y: 120 }, rotation: 180, scale: 1 }),
            physicsObject({ width: 20, height: 30, bodyType: 'kinetic' }),
        ]);

        eventManager.dispatch('scene.entity_added', entity as unknown as object)
        runBeforeUpdate(system, eventManager)

        const body = (system as any).worldBodyCache[entity.id];
        expect(body.angle).toBeCloseTo(Math.PI, 6);
    });

    it('should convert matter body angle from radians back to transform rotation degrees', (): void => {
        const system = new PhysicsSystem();
        const eventManager = new EventManager();
        const entity = new Entity('physics-entity-2');
        entity.addComponents([
            transform({ position: { x: 0, y: 0 }, rotation: 0, scale: 1 }),
            physicsObject({ width: 10, height: 10, bodyType: 'kinetic' }),
        ]);

        eventManager.dispatch('scene.entity_added', entity as unknown as object)
        runBeforeUpdate(system, eventManager)

        const body = (system as any).worldBodyCache[entity.id];
        body.angle = Math.PI / 2;

        system.update(entity, {} as any, {} as any, {} as any);

        expect(entity.get(transform).rotation).toBeCloseTo(90, 6);
    });

    it('should remove world body cache and world body when entity is removed', (): void => {
        const system = new PhysicsSystem();
        const eventManager = new EventManager();
        const entity = new Entity('physics-entity-3');
        entity.addComponents([
            transform({ position: { x: 10, y: 20 }, rotation: 45, scale: 1 }),
            physicsObject({ width: 12, height: 14, bodyType: 'kinetic' }),
        ]);

        eventManager.dispatch('scene.entity_added', entity as unknown as object)
        runBeforeUpdate(system, eventManager)

        const body = (system as any).worldBodyCache[entity.id];
        expect(body).toBeTruthy();
        expect(Composite.allBodies((system as any).engine.world)).toContain(body);

        eventManager.dispatch('scene.entity_removed', entity as unknown as object)
        runBeforeUpdate(system, eventManager)

        expect((system as any).worldBodyCache[entity.id]).toBeUndefined();
        expect(Composite.allBodies((system as any).engine.world)).not.toContain(body);
    });
});
