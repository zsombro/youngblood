/* eslint-disable @typescript-eslint/no-explicit-any */

interface AssetData {
    type: 'image' | 'audio' | 'json';
    url: string;
}

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

async function fetchObject(url: string): Promise<any> {
    return fetch(url).then((response: Response): Promise<any> => response.json());
}

export function getExtension(url: string): string {
    const extensions = url.match(/\.[a-zA-Z0-9]+/g);

    return extensions[extensions.length - 1];
}

export default class AssetLoader {
    private taskQueueLength: number;
    private completedTasks: number;
    private assets: { [index: string]: any };

    public constructor() {
        this.taskQueueLength = 0;
        this.completedTasks = 0;
        this.assets = {};
    }

    public async load(assetListUrl: string): Promise<void> {
        const response = await fetch(assetListUrl);
        const json = await response.json();
        const assetData = json.assets;

        this.completedTasks = 0;
        this.taskQueueLength = assetData.length;

        await Promise.all(assetData.map(this.fetchAsset.bind(this)));
    }

    public progress(): number {
        return this.completedTasks / this.taskQueueLength;
    }

    public get(name: string): object {
        return this.assets[name];
    }

    private async fetchAsset(asset: AssetData): Promise<any> {
        const extension = getExtension(asset.url);
        const assetName = asset.url.replace(extension, '');

        switch (asset.type) {
            case 'audio':
                this.assets[assetName] = await fetchAudio(asset.url);
                break;
            case 'image':
                this.assets[assetName] = await fetchImage(asset.url);
                break;
            case 'json':
                this.assets[assetName] = await fetchObject(asset.url);
                break;
        }

        this.completedTasks++;
    }
}
