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
    return fetch(url)
        .then((response: Response): Promise<ArrayBuffer> => response.arrayBuffer())
        .then((buffer: ArrayBuffer): Promise<AudioBuffer> => audioContext.decodeAudioData(buffer));
}

async function fetchObject(url: string): Promise<any> {
    return fetch(url).then((response: Response): Promise<any> => response.json());
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
    private taskQueueLength: number;
    private completedTasks: number;
    private assets: { [index: string]: any };

    public constructor() {
        this.taskQueueLength = 0;
        this.completedTasks = 0;
        this.assets = {};
    }

    public async load(assetListUrl: string): Promise<void> {
        const assetUrls = await fetch(assetListUrl)
            .then((response: Response): Promise<string> => response.text())
            .then((text: string): string[] => text.split('\r\n'));

        this.completedTasks = 0;
        this.taskQueueLength = assetUrls.length;

        Promise.all(assetUrls.map(this.fetchAsset.bind(this)));
    }

    public progress(): number {
        return this.completedTasks / this.taskQueueLength;
    }

    public get(name: string): object {
        return this.assets[name];
    }

    private async fetchAsset(assetUrl: string): Promise<any> {
        const extension = getExtension(assetUrl);

        if (!fetchType[extension]) throw new Error(`Unsupported extension: ${extension}`);

        this.assets[assetUrl.replace(extension, '')] = await fetchType[extension](assetUrl);
    }
}
