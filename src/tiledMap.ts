import Component, { Sprite } from './component';

export interface MapObject {
    name: string;
    x: number;
    y: number;
}

export interface Layer {
    type: 'imagelayer' | 'tilelayer' | 'objectgroup';
    data?: number[];
    objects?: MapObject[];
}

export interface TiledMapData {
    width: number;
    height: number;
    layers: Layer[];
}

export default class TiledMap extends Component {
    public data: TiledMapData;
    public spriteSheet: Sprite;

    public constructor(data: TiledMapData, spriteSheet: Sprite) {
        super('TiledMap');

        this.data = data;
        this.spriteSheet = spriteSheet;
    }
}
