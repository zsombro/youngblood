import 'mocha';
import { expect } from 'chai';

import Entity from './entity';
import { Scene, SceneOptions } from './scene';
import { System } from './system';

describe('Scene', (): void => {
    it('should auto-register Entities', (): void => {
        const sceneOptions: SceneOptions = {
            sceneId: 'test',
            entities: [new Entity(), new Entity()],
        };

        const scene = new Scene(sceneOptions);

        expect(Object.values(scene.gameEntities).length).to.equal(2);
    });

    it('should auto-register Systems', (): void => {
        const sceneOptions: SceneOptions = {
            sceneId: 'test',
            systems: [
                { systemId: 'system1', requiredComponents: [], update: (): void => {} },
                { systemId: 'system2', requiredComponents: [], update: (): void => {} },
            ],
        };

        const scene = new Scene(sceneOptions);

        expect(Object.values(scene.systems).length).to.equal(2);
    });

    it('should throw an error if a system ID has already been registered', (): void => {
        const scene = new Scene({ sceneId: 'test' });

        const system: System = { systemId: 'system1', requiredComponents: [], update: (): void => {} };

        scene.registerSystem(system);

        expect(function(): void {
            scene.registerSystem(system);
        }).to.throw(/has already been registered/g);
    });
});
