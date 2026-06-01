import { TiledMapData, TiledSheetData } from '../components/tiledMap';
type Asset = HTMLImageElement | AudioBuffer | Object | TiledMapData | TiledSheetData;
type AssetFunction = (url: string) => Asset;
export declare function getExtension(url: string): string;
export default class AssetLoader {
    private taskQueueLength;
    private completedTasks;
    private assets;
    private loaders;
    constructor();
    registerLoader(type: string, loader: AssetFunction): void;
    load(assetListUrl: string): Promise<Record<string, Asset>>;
    progress(): number;
    get(name: string): object;
    private fetchAsset;
}
export {};
