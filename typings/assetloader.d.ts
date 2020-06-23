export declare function getExtension(url: string): string;
export default class AssetLoader {
    private completionCallback;
    private loadCounter;
    private readyCounter;
    private assets;
    private audio;
    constructor(completionCallback?: () => void);
    static load(assetListUrl: string): Promise<void>;
    private static fetchAsset;
    isReady(): boolean;
    getProgress(): number;
    getAsset(name: string | number): object;
    attemptCompletionCallback(callback: Function): void;
    private deriveObjectName;
}
