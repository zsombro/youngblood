import { describe, expect, it } from 'vitest';

import Entity from '../entity';
import { transform } from '../components/component';
import { PhysicsSystem, physicsObject } from './physicsSystem';

describe('PhysicsSystem', (): void => {
    it('should convert transform rotation from degrees to radians for matter body angle', (): void => {
        const system = new PhysicsSystem();
        const entity = new Entity('physics-entity');
        entity.addComponents([
            transform({ position: { x: 100, y: 120 }, rotation: 180, scale: 1 }),
            physicsObject({ width: 20, height: 30, bodyType: 'kinetic' }),
        ]);

        system.update(entity, {} as any, {} as any, {} as any);

        const body = (system as any).worldBodyCache[entity.id];
        expect(body.angle).toBeCloseTo(Math.PI, 6);
    });

    it('should convert matter body angle from radians back to transform rotation degrees', (): void => {
        const system = new PhysicsSystem();
        const entity = new Entity('physics-entity-2');
        entity.addComponents([
            transform({ position: { x: 0, y: 0 }, rotation: 0, scale: 1 }),
            physicsObject({ width: 10, height: 10, bodyType: 'kinetic' }),
        ]);

        system.update(entity, {} as any, {} as any, {} as any);

        const body = (system as any).worldBodyCache[entity.id];
        body.angle = Math.PI / 2;

        system.update(entity, {} as any, {} as any, {} as any);

        expect(entity.get(transform).rotation).toBeCloseTo(90, 6);
    });
});
