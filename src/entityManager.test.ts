import { describe, expect, it } from 'vitest';

import EntityManager from './entityManager';
import Entity from './entity';

describe('EntityManager', (): void => {
    it('should add entities to array and object storage', (): void => {
        const manager = new EntityManager();
        const first = new Entity('first');
        const second = new Entity('second');

        manager.addEntity(first);
        manager.addEntity(second);

        expect(manager.entities.length).to.equal(2);
        expect(manager.entities[0].id).to.equal('first');
        expect(manager.entities[1].id).to.equal('second');
        expect(manager.findEntityById('first')).to.equal(first);
        expect(manager.findEntityById('second')).to.equal(second);
    });

    it('should remove an entity using swap-and-pop and delete index entries', (): void => {
        const manager = new EntityManager();
        const first = new Entity('first');
        const second = new Entity('second');
        const third = new Entity('third');

        manager.addEntity(first);
        manager.addEntity(second);
        manager.addEntity(third);

        const removed = manager.removeEntity('second');

        expect(removed).to.equal(second);
        expect(manager.entities.length).to.equal(2);
        expect(manager.findEntityById('second')).to.equal(undefined);
        expect(manager.findEntityById('first')).to.equal(first);
        expect(manager.findEntityById('third')).to.equal(third);
        expect(manager.entities.map(e => e.id)).to.contain('first');
        expect(manager.entities.map(e => e.id)).to.contain('third');
    });

    it('should return null when removing a non-existing entity', (): void => {
        const manager = new EntityManager();

        expect(manager.removeEntity('missing')).to.equal(null);
    });

    it('should throw on duplicate entity ids', (): void => {
        const manager = new EntityManager();
        manager.addEntity(new Entity('dup'));

        expect((): void => {
            manager.addEntity(new Entity('dup'));
        }).to.throw(/already been registered/g);
    });
});
