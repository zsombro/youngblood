import 'mocha';
import { expect } from 'chai';

import Entity from './entity';
import Component from './components/component';

class C1 extends Component {}
class C2 extends Component {}

describe('Entity', (): void => {
    it('should auto-generate IDs if not supplied', (): void => {
        const e = new Entity();

        expect(e.id).not.to.be.null;
    });

    it('should use IDs if provided', (): void => {
        const e = new Entity('aaa');

        expect(e.id).to.be.equal('aaa');
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

    it('should return false if a system has no component requirements', (): void => {
        const e = new Entity();
        e.addComponent(new C1('C1'));

        expect(e.hasComponents([])).to.be.false;
    });
});
