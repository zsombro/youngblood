export default class Component {
    name: any;
    constructor(name: string);
}
export declare class Position extends Component {
    x: number;
    y: number;
    constructor(x: number, y: number);
}
export declare class Velocity extends Component {
    x: number;
    y: number;
    constructor(x: number, y: number);
}
export declare class Label extends Component {
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
export declare class Sprite extends Component {
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
export declare class AnimatedSprite extends Component {
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
export declare class AudioSource extends Component {
    audioBuffer: any;
    constructor(audioBuffer: AudioBuffer);
}
export declare class Box extends Component {
    width: number;
    height: number;
    fillStyle: string;
    constructor(width: number, height: number, fillStyle: string);
}
export declare class BoxCollider extends Component {
    width: number;
    height: number;
    constructor(width: number, height: number);
}
export interface KeyMapping {
    name: string;
    code: number;
}
export declare class InputMapping extends Component {
    [index: string]: boolean;
    mapping: any;
    constructor(mapping: KeyMapping[]);
}
