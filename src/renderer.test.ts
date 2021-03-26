import 'mocha';
import { expect } from 'chai';

import { getTilesheetCoordinateById } from './renderer';
import { TiledSheetData } from './components/tiledMap';

describe('Renderer', (): void => {
    it('should translate tile IDs to coordinates', (): void => {
        const data: TiledSheetData = {
            image: null,
            imageheight: 128,
            imagewidth: 128,
            tileheight: 16,
            tilewidth: 16,
            tilecount: 64,
            columns: 8,
        };

        const position1 = getTilesheetCoordinateById(1, data);
        const position2 = getTilesheetCoordinateById(2, data);
        const position3 = getTilesheetCoordinateById(14, data);

        expect(position1).to.deep.equal({ x: 0, y: 0 });
        expect(position2).to.deep.equal({ x: 16, y: 0 });
        expect(position3).to.deep.equal({ x: 80, y: 16 });
    });
});
