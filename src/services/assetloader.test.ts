import { describe, expect, it } from 'vitest';

import { getExtension } from './assetloader';

describe('AssetLoader', (): void => {
    it('should get file extensions from URLs', (): void => {
        expect(getExtension('test.mp3')).to.be.equal('.mp3');
        expect(getExtension('assets/data/test.json')).to.be.equal('.json');
        expect(getExtension('assets/gfx/test.something.png')).to.be.equal('.png');
    });
});
