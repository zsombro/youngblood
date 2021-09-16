import 'mocha';
import { expect } from 'chai';

import Entity from './entity';
import { Scene, SceneOptions, SceneServices } from './scene';
import { System } from './system';
import InputManager from './services/inputmanager';
import AssetLoader from './services/assetloader';
import AudioManager from './services/audiomanager';
import Game from './game';
import { Component } from './main';

const mockSceneServices: SceneServices = {
    input: new InputManager(),
    assets: new AssetLoader(),
    audio: new AudioManager(),
    game: new Game(),
};

describe('Scene', (): void => {
    it('should auto-register Entities', (): void => {
        const sceneOptions: SceneOptions = {
            sceneId: 'test',
            entities: [(): Entity => new Entity(), (): Component[] => []],
        };

        const scene = new Scene(sceneOptions);
        scene.initialize(scene, mockSceneServices);

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
        scene.initialize(scene, mockSceneServices);

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
