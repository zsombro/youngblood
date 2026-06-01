export interface MapObject {
    name: string;
    x: number;
    y: number;
}
export interface Layer {
    type: 'imagelayer' | 'tilelayer' | 'objectgroup';
    x: number;
    y: number;
    width: number;
    height: number;
    data?: number[];
    objects?: MapObject[];
    image?: HTMLImageElement;
}
export interface TiledMapData {
    width: number;
    height: number;
    layers: Layer[];
}
export interface TiledSheetData {
    image: HTMLImageElement;
    imageheight: number;
    imagewidth: number;
    tileheight: number;
    tilewidth: number;
    tilecount: number;
    columns: number;
}
export interface TiledMap {
    data: TiledMapData;
    spriteSheet: TiledSheetData;
    options: {
        scale: number;
    };
}
declare const _default: (data?: TiledMap | undefined) => import('./component').default<TiledMap>;
export default _default;
