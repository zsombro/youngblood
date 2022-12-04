export interface FrameData {
    delta: number;
    currentFrame: number;
}

export type FrameFunction = (frameData: FrameData) => void;

export default class FramerateManager {
    private fps: number;
    private interval: number;
    private then: number;
    private now: number;
    private delta: number;

    private currentFrame: number = 0;

    public constructor(fps: number) {
        this.setFramerate(fps);
    }

    public processFrame(callback: FrameFunction): void {
        this.now = Date.now();
        this.delta = this.now - this.then;

        if (this.delta > this.interval) {
            this.then = this.now - (this.delta % this.interval);

            if (this.currentFrame < this.fps)
                this.currentFrame++;
            else
                this.currentFrame = 0;
            
            callback({ delta: this.delta, currentFrame: this.currentFrame });
        }
    }

    public setFramerate(newValue: number): void {
        this.fps = newValue;
        this.then = Date.now();
        this.interval = 1000 / this.fps;
    }

    public get framerate(): number {
        return this.fps;
    }
}
