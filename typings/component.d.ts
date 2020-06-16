export declare class Position {
    x: number;
    y: number;
    constructor(x: number, y: number);
}
export declare class Velocity {
    x: number;
    y: number;
    constructor(x: number, y: number);
}
export declare class Label {
    txt: string;
    color: string;
    font: string;
    isVisible: boolean;
    constructor(txt: string, options: {
        color: string;
        font: string;
        isVisible: boolean;
    });
}
export declare class Sprite {
    spriteSource: HTMLImageElement;
    constructor(spriteSource: HTMLImageElement);
}
export interface AnimatedSpriteOptions {
    animationName?: string;
    scale?: number;
    loop?: boolean;
    isPlaying?: boolean;
    flip?: boolean | SpriteFlipOptions;
}
export interface SpriteFlipOptions {
    vertical?: boolean;
    horizontal?: boolean;
}
export interface AnimationSheet {
    [x: string]: Animation;
}
export interface Animation {
    startX: number;
    startY: number;
    frames: number;
    frameWidth: number;
    frameHeight: number;
    isVertical?: boolean;
}
export declare class AnimatedSprite {
    spriteSource: HTMLImageElement;
    animationSheet: AnimationSheet;
    currentFrame: number;
    animationName: string;
    scale: number;
    loop: boolean;
    isPlaying: boolean;
    flip: boolean | SpriteFlipOptions;
    constructor(spriteSource: HTMLImageElement, animationSheet: AnimationSheet, options: AnimatedSpriteOptions);
}
export declare class AudioSource {
    audioBuffer: AudioBuffer;
    constructor(audioBuffer: AudioBuffer);
}
export declare class Box {
    width: number;
    height: number;
    fillStyle: string;
    constructor(width: number, height: number, fillStyle: string);
}
export declare class BoxCollider {
    width: number;
    height: number;
    constructor(width: number, height: number);
}
export interface KeyMapping {
    name: string;
    code: number;
}
export declare class InputMapping {
    [index: string]: boolean;
    mapping: any;
    constructor(mapping: KeyMapping[]);
}
