export default class AssetLoader {
    completionCallback: any;
    loadCounter: number;
    readyCounter: number;
    assets: {
        [index: string]: any;
    };
    audio: any;
    imageTypes: string[];
    objectTypes: string[];
    audioTypes: string[];
    constructor(completionCallback?: () => void);
    addImageTask(url: string, name?: string): void;
    addHttpTask(url: string, name?: string): void;
    addBufferTask(url: string, name?: string): void;
    addTaskList(url: string): void;
    isReady(): boolean;
    getProgress(): number;
    getAsset(name: string | number): any;
    attemptCompletionCallback(callback: any): void;
    deriveObjectName(url: any, name: any): any;
}
