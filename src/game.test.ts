import { describe, expect, it } from 'vitest';
import { Game } from './main';

describe('Game', (): void => {
    it('should automatically register input and camera management for new Scenes', (): void => {
        const game = new Game();

        game.addScene({ sceneId: 'test' });

        const scene = game.removeScene('test');

        expect(scene?.systems.map(s => s.id)).to.contain('inputMappingSystem');
        expect(scene?.systems.map(s => s.id)).to.contain('cameraMovementSystem');
    });

    it('should return null when trying to remove a non-existing Scene', (): void => {
        const game = new Game();

        expect(game.removeScene('missing')).to.equal(null);
    });
});
