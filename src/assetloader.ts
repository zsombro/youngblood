/* eslint-disable @typescript-eslint/no-explicit-any */
export default class AssetLoader {
    private completionCallback: Function;
    private loadCounter: number;
    private readyCounter: number;
    private assets: { [index: string]: any };
    private audio: AudioContext;
    private imageTypes: string[];
    private objectTypes: string[];
    private audioTypes: string[];

    public constructor(completionCallback?: () => void) {
        this.completionCallback = completionCallback || ((): void => {});
        this.loadCounter = 0;
        this.readyCounter = 0;
        this.assets = {};

        // asset loader uses it's own audio context to decode incoming buffers
        this.audio = new ((window as any).AudioContext || (window as any).webkitAudioContext)();

        this.imageTypes = ['.png', '.jpg', '.gif'];
        this.objectTypes = ['.txt', 'json'];
        this.audioTypes = ['.wav', '.mp3', '.ogg'];
    }

    public addImageTask(url: string, name?: string): void {
        let that = this;

        let i = new Image();
        i.src = url;
        i.onload = function(): void {
            that.readyCounter++;
            that.attemptCompletionCallback(that.completionCallback);
        };

        this.assets[this.deriveObjectName(url, name)] = i;
        this.loadCounter++;
    }

    public addHttpTask(url: string, name?: string): void {
        let r = new XMLHttpRequest();
        let that = this;
        r.onreadystatechange = function(): void {
            if (r.readyState == 4 && r.status == 200) {
                that.assets[that.deriveObjectName(url, name)] = JSON.parse(r.responseText);
                that.readyCounter++;
                that.attemptCompletionCallback(that.completionCallback);
            }
        };

        r.overrideMimeType('application/json');
        r.open('GET', url, true);
        r.send(null);

        this.loadCounter++;
    }

    public addBufferTask(url: string, name?: string): void {
        let that = this;
        let r = new XMLHttpRequest();
        r.responseType = 'arraybuffer';
        r.open('GET', url, true);

        r.onload = function(): void {
            that.audio.decodeAudioData(
                r.response,
                function(buffer: AudioBuffer): void {
                    that.assets[that.deriveObjectName(url, name)] = buffer;
                    that.readyCounter++;
                    that.attemptCompletionCallback(that.completionCallback);
                },
                function(): void {
                    console.log('Error decoding audio');
                },
            );
        };

        r.send();

        this.loadCounter++;
    }

    public addTaskList(url: string): void {
        let that = this;
        // load a list of txt files
        var r = new XMLHttpRequest();
        r.onreadystatechange = function(): void {
            if (r.readyState == 4 && r.status == 200) {
                let fileList = r.responseText.split('\n');
                for (var i = 0; i < fileList.length; i++) {
                    var ext =
                        fileList[i].indexOf('\r') == -1 ? fileList[i].slice(-4) : fileList[i].slice(-5).slice(0, -1);

                    if (that.imageTypes.indexOf(ext) != -1) {
                        that.addImageTask(fileList[i]);
                    }
                    if (that.objectTypes.indexOf(ext) != -1) {
                        that.addHttpTask(fileList[i]);
                    }
                    if (that.audioTypes.indexOf(ext) != -1) {
                        that.addBufferTask(fileList[i]);
                    }
                }
            }
        };

        r.overrideMimeType('application/json');
        r.open('GET', url, true);
        r.send(null);
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
