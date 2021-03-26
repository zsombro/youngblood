import 'mocha';
import { expect } from 'chai';

import Entity from './entity';
import Component from './components/component';

class C1 extends Component {}
class C2 extends Component {}

describe('Entity', (): void => {
    it('should auto-increment IDs', (): void => {
        const e = new Entity();
        const e2 = new Entity();

        expect(e.id).to.be.equal(0);
        expect(e2.id).to.be.equal(1);
    });

    it('should add components', (): void => {
        const e = new Entity();
        const c = new C1('C1');
        e.addComponent(c);

        expect(e['C1']).to.be.equal(c);
    });

    it('should remove components', (): void => {
        const e = new Entity();
        const c = new C1('C1');
        e.addComponent(c);
        e.removeComponent('C1');

        expect(e['C1']).to.be.undefined;
    });

    it('should be able to test for multiple components', (): void => {
        const e = new Entity();
        e.addComponent(new C1('C1'));
        e.addComponent(new C2('C2'));

        expect(e.hasComponents(['C1', 'C2'])).to.be.true;
    });
});
