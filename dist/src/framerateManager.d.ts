export interface FrameData {
    delta: number;
    currentFrame: number;
}
export type FrameFunction = (frameData: FrameData) => void;
export default class FramerateManager {
    private fps;
    private interval;
    private then;
    private now;
    private delta;
    private currentFrame;
    constructor(fps: number);
    processFrame(callback: FrameFunction): void;
    setFramerate(newValue: number): void;
    get framerate(): number;
}
