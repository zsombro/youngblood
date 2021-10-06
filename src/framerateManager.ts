export default class FramerateManager {
    private fps: number;
    private interval: number;
    private then: number;
    private now: number;
    private delta: number;

    public constructor(fps: number) {
        this.setFramerate(fps);
    }

    public processFrame(callback: Function): void {
        this.now = Date.now();
        this.delta = this.now - this.then;

        if (this.delta > this.interval) {
            this.then = this.now - (this.delta % this.interval);

            callback();
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
