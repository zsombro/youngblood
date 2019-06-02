export default class AssetLoader {
    private completionCallback;
    private loadCounter;
    private readyCounter;
    private assets;
    private audio;
    private imageTypes;
    private objectTypes;
    private audioTypes;
    constructor(completionCallback?: () => void);
    addImageTask(url: string, name?: string): void;
    addHttpTask(url: string, name?: string): void;
    addBufferTask(url: string, name?: string): void;
    addTaskList(url: string): void;
    isReady(): boolean;
    getProgress(): number;
    getAsset(name: string | number): object;
    attemptCompletionCallback(callback: Function): void;
    private deriveObjectName;
}
