import { component } from './component';

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
    options: { scale: number };
}

export default component<TiledMap>('tiledMap')