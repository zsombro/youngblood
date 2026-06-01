import { Scene } from './scene';
import { TiledSheetData } from './components/tiledMap';
export type Renderer = (entity: Scene) => void;
export declare function getTilesheetCoordinateById(id: number, sheet: TiledSheetData): {
    x: number;
    y: number;
};
declare const _default: (ctx: CanvasRenderingContext2D) => Renderer;
export default _default;
