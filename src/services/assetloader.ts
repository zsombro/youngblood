/* eslint-disable @typescript-eslint/no-explicit-any */

import { TiledMapData, TiledSheetData } from '../components/tiledMap';

interface AssetData {
    type: 'image' | 'audio' | 'json' | 'tiled-map' | 'tiled-set';
    url: string;
}

type Asset 
    = HTMLImageElement 
    | AudioBuffer
    | Object 
    | TiledMapData 
    | TiledSheetData

type AssetFunction = (url: string) => Asset;

const audioContext = new AudioContext();

function fetchImage(url: string): Promise<HTMLImageElement> {
    return new Promise(
        (resolve, reject): void => {
            const image = new Image();
            image.onload = (): void => resolve(image);
            image.onerror = (ev: string | Event): void => reject(ev);
            image.src = url;
        },
    );
}

async function fetchAudio(url: string): Promise<AudioBuffer> {
    return fetch(url)
        .then((response: Response): Promise<ArrayBuffer> => response.arrayBuffer())
        .then((buffer: ArrayBuffer): Promise<AudioBuffer> => audioContext.decodeAudioData(buffer));
}

async function fetchObject(url: string): Promise<unknown> {
    return fetch(url).then((response: Response): Promise<unknown> => response.json());
}

async function fetchTiledMap(url: string): Promise<TiledMapData> {
    const response = await fetch(url);
    const data = await response.json();

    const result: TiledMapData = {
        width: data.width,
        height: data.height,
        layers: [],
    };

    for (const layer of data.layers) {
        switch (layer.type) {
            case 'imagelayer':
                result.layers.push({ ...layer, image: await fetchImage(layer.image) });
                break;
            case 'tilelayer':
                result.layers.push({ ...layer, data: layer.data });
                break;
            case 'objectgroup':
                result.layers.push({ ...layer, objects: layer.objects });
                break;
        }
    }

    return result;
}

async function fetchTiledSet(url: string): Promise<TiledSheetData> {
    const response = await fetch(url);
    const data = await response.json();

    return {
        ...data,
        image: await fetchImage(data.image),
    };
}

export function getExtension(url: string): string {
    const extensions = url.match(/\.[a-zA-Z0-9]+/g);

    return extensions[extensions.length - 1];
}

export default class AssetLoader {
    private taskQueueLength: number;
    private completedTasks: number;
    private assets: Record<string, Asset>;
    private loaders: Record<string, AssetFunction>;

    public constructor() {
        this.taskQueueLength = 0;
        this.completedTasks = 0;
        this.assets = {};

        this.loaders = {};

        this.registerLoader('image', fetchImage);
        this.registerLoader('audio', fetchAudio);
        this.registerLoader('json', fetchObject);
        this.registerLoader('tiled-map', fetchTiledMap);
        this.registerLoader('tiled-set', fetchTiledSet);
    }

    public registerLoader(type: string, loader: AssetFunction) {
        this.loaders[type] = loader;
    }

    public async load(assetListUrl: string): Promise<Record<string, Asset>> {
        const response = await fetch(assetListUrl);
        const json = await response.json();
        const assetData: AssetData[] = json.assets;

        this.completedTasks = 0;
        this.taskQueueLength = assetData.length;

        await Promise.all(assetData.map(this.fetchAsset.bind(this)));

        return this.assets;
    }

    public progress(): number {
        return this.completedTasks / this.taskQueueLength;
    }

    public get(name: string): object {
        return this.assets[name];
    }

    private async fetchAsset(asset: AssetData): Promise<void> {
        const extension = getExtension(asset.url);
        const assetName = asset.url.replace(extension, '');

        this.assets[assetName] = await this.loaders[asset.type](asset.url);

        // switch (asset.type) {
        //     case 'audio':
        //         this.assets[assetName] = await fetchAudio(asset.url);
        //         break;
        //     case 'image':
        //         this.assets[assetName] = await fetchImage(asset.url);
        //         break;
        //     case 'json':
        //         this.assets[assetName] = await fetchObject(asset.url);
        //         break;
        //     case 'tiled-map':
        //         this.assets[assetName] = await fetchTiledMap(asset.url);
        //         break;
        //     case 'tiled-set':
        //         this.assets[assetName] = await fetchTiledSet(asset.url);
        // }

        this.completedTasks++;
    }
}
