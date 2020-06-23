/* eslint-disable @typescript-eslint/no-explicit-any */

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
    const response = await fetch(url);
    const data = await response.arrayBuffer();

    return audioContext.decodeAudioData(data);
}

async function fetchObject(url: string): Promise<any> {
    const response = await fetch(url);
    return response.json();
}

const fetchType: Record<string, Function> = {
    '.png': fetchImage,
    '.jpg': fetchImage,
    '.gif': fetchImage,
    '.wav': fetchAudio,
    '.mp3': fetchAudio,
    '.ogg': fetchAudio,
    '.json': fetchObject,
    '.txt': fetchObject,
};

export function getExtension(url: string): string {
    const extensions = url.match(/\.[a-zA-Z0-9]+/g);

    return extensions[extensions.length - 1];
}

export default class AssetLoader {
    private completionCallback: Function;
    private loadCounter: number;
    private readyCounter: number;
    private assets: { [index: string]: any };
    private audio: AudioContext;

    public constructor(completionCallback?: () => void) {
        this.completionCallback = completionCallback || ((): void => {});
        this.loadCounter = 0;
        this.readyCounter = 0;
        this.assets = {};

        // asset loader uses it's own audio context to decode incoming buffers
        this.audio = new AudioContext();
    }

    public static async load(assetListUrl: string): Promise<void> {
        const assetList = await fetch(assetListUrl);

        if (!assetList.ok) throw Error(`Failed to fetch asset list from ${assetListUrl}`);

        const assets = (await assetList.text()).split('\n');

        const loadedAssets = [];
        for (let i = 0; i < assets.length; i++) {
            loadedAssets.push(await AssetLoader.fetchAsset(assets[i]));
        }
    }

    private static async fetchAsset(assetUrl: string): Promise<any> {
        return fetchType[getExtension(assetUrl)](assetUrl);
    }

    // you can even track progress with this thing. it's kinda the point actually
    public isReady(): boolean {
        if (this.loadCounter == 0) return false;
        else return this.readyCounter == this.loadCounter;
    }

    public getProgress(): number {
        if (this.loadCounter != 0) return (this.readyCounter / this.loadCounter) * 100;
        else return 0;
    }

    public getAsset(name: string | number): object {
        return this.assets[name];
    }

    public attemptCompletionCallback(callback: Function): void {
        if (this.readyCounter == this.loadCounter && callback !== undefined) callback();
    }

    private deriveObjectName(url: string, name: string): string {
        if (name === undefined) {
            let f = url.slice(url.lastIndexOf('/') + 1);
            return f.slice(0, f.indexOf('.'));
        } else return name;
    }
}
