import 'mocha';
import { expect } from 'chai';
import { Game } from './main';

describe('Game', (): void => {
    it('should automatically register input and camera management for new Scenes', (): void => {
        const game = new Game();

        game.addScene({ sceneId: 'test' });

        const scene = game.removeScene('test');

        expect(scene.systems.map(s => s.id)).to.contain('inputMappingSystem');
        expect(scene.systems.map(s => s.id)).to.contain('cameraMovementSystem');
    });
});
