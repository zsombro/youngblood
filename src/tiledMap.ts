import Component, { Sprite } from './component';

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

export default class TiledMap extends Component {
    public data: TiledMapData;
    public spriteSheet: TiledSheetData;

    public constructor(data: TiledMapData, spriteSheet: TiledSheetData) {
        super('TiledMap');

        this.data = data;
        this.spriteSheet = spriteSheet;
    }
}
