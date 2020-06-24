export declare function getExtension(url: string): string;
export default class AssetLoader {
    private taskQueueLength;
    private completedTasks;
    private assets;
    constructor();
    load(assetListUrl: string): Promise<void>;
    progress(): number;
    get(name: string): object;
    private fetchAsset;
}
