import { describe, expect, it } from 'vitest';

import Entity from './entity';
import { Scene, SceneOptions, ISceneServices } from './scene';
import { System } from './system';
import InputManager from './services/inputmanager';
import AssetLoader from './services/assetloader';
import AudioManager from './services/audiomanager';
import Game from './game';
import { Component } from './main';
import EventManager from './services/eventmanager';

const mockSceneServices: ISceneServices = {
    input: new InputManager(new EventManager()),
    assets: new AssetLoader(),
    audio: new AudioManager(),
    event: new EventManager(),
    game: new Game(),
};

describe('Scene', (): void => {
    it('should auto-register Entities', (): void => {
        const sceneOptions: SceneOptions = {
            sceneId: 'test',
            entities: [(): Entity => new Entity(), (): Component<any>[] => []],
        };

        const scene = new Scene(sceneOptions, mockSceneServices);
        scene.initialize(scene, mockSceneServices);

        expect(Object.values(scene.gameEntities).length).to.equal(2);
    });

    it('should auto-register Systems', (): void => {
        const sceneOptions: SceneOptions = {
            sceneId: 'test',
            systems: [
                { id: 'system1', requiredComponents: [], update: (): void => {} },
                { id: 'system2', requiredComponents: [], update: (): void => {} },
            ],
        };

        const scene = new Scene(sceneOptions, mockSceneServices);
        scene.initialize(scene, mockSceneServices);

        expect(Object.values(scene.systems).length).to.equal(2);
    });

    it('should throw an error if a system ID has already been registered', (): void => {
        const scene = new Scene({ sceneId: 'test' }, mockSceneServices);

        const system: System = { id: 'system1', requiredComponents: [], update: (): void => {} };

        scene.registerSystem(system);

        expect(function(): void {
            scene.registerSystem(system);
        }).to.throw(/has already been registered/g);
    });

    it('should expose the entity array through getEntityArray', (): void => {
        const scene = new Scene({ sceneId: 'test' }, mockSceneServices);
        const entity = new Entity('entity-test');

        scene.addEntity(entity);

        expect(scene.getEntityArray()).to.equal(scene.gameEntities);
        expect(scene.getEntityArray().length).to.equal(1);
        expect(scene.getEntityArray()[0].id).to.equal('entity-test');
    });
});
