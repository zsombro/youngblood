import 'mocha';
import { expect } from 'chai';

import Entity from './entity';
import Component from './component';

describe('Entity', (): void => {
    it('should auto-increment IDs', (): void => {
        const e = new Entity();
        const e2 = new Entity();

        expect(e.id).to.be.equal(0);
        expect(e2.id).to.be.equal(1);
    });

    it('should add components', (): void => {
        const e = new Entity();
        const c = new Component('c');
        e.addComponent(c);

        expect(e['c']).to.be.equal(c);
    });

    it('should be able to test for multiple components', (): void => {
        const e = new Entity();
        e.addComponent(new Component('c1'));
        e.addComponent(new Component('c2'));

        expect(e.hasComponents(['c1', 'c2'])).to.be.true;
    });
});
