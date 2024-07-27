import 'mocha';
import { expect } from 'chai';

import Entity from './entity';
import Component, { component } from './components/component';

const c1 = component<any>('c1')
const c2 = component<any>('c2')

describe('Entity', (): void => {
    it('should auto-generate IDs if not supplied', (): void => {
        const e = new Entity();

        expect(e.id).not.to.be.null;
    });

    it('should use IDs if provided', (): void => {
        const e = new Entity();

        expect(e.id).to.be.equal('aaa');
    });

    it('should add components', (): void => {
        const e = new Entity();
        const c = c1();
        e.addComponent(c);

        expect(e['c1']).to.be.equal(c);
    });

    it('should remove components', (): void => {
        const e = new Entity();
        const c = c1();
        e.addComponent(c);
        e.removeComponent('c1');

        expect(e['c1']).to.be.undefined;
    });

    it('should be able to test for multiple components', (): void => {
        const e = new Entity();
        e.addComponent(c1());
        e.addComponent(c2());

        expect(e.hasComponents(['c1', 'c2'])).to.be.true;
    });

    it('should return false if a system has no component requirements', (): void => {
        const e = new Entity();
        e.addComponent(c1());

        expect(e.hasComponents([])).to.be.false;
    });
});
