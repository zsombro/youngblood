/* eslint-disable @typescript-eslint/no-explicit-any */
export class Position {
    public x: number;
    public y: number;
    public constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

export class Velocity {
    public x: number;
    public y: number;
    public constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

export class Label {
    public txt: string;
    public color: string;
    public font: string;
    public isVisible: boolean;

    public constructor(txt: string, options: { color: string; font: string; isVisible: boolean }) {
        this.txt = txt;

        this.color = options.color || '#000';
        this.font = options.font || 'monospace';
        this.isVisible = options.isVisible || true;
    }
}

export class Sprite {
    public spriteSource: HTMLImageElement;

    public constructor(spriteSource: HTMLImageElement) {
        this.spriteSource = spriteSource;
    }
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

export class AnimatedSprite {
    public spriteSource: HTMLImageElement;
    public animationSheet: AnimationSheet;
    public currentFrame: number;
    public animationName: string;
    public scale: number;
    public loop: boolean;
    public isPlaying: boolean;
    public flip: boolean | SpriteFlipOptions;

    public constructor(spriteSource: HTMLImageElement, animationSheet: AnimationSheet, options: AnimatedSpriteOptions) {
        this.spriteSource = spriteSource;
        this.animationSheet = animationSheet;

        if (options === undefined) var options: AnimatedSpriteOptions = {};

        // If there's no default animation set, we'll use the first one defined in the JSON object
        this.animationName = options.animationName || Object.keys(animationSheet)[0];
        this.scale = options.scale || 1.0;
        this.loop = options.loop || true;
        this.isPlaying = options.isPlaying || true;
        this.flip = options.flip || false;

        this.currentFrame = 0;
    }
}

export class AudioSource {
    public audioBuffer: AudioBuffer;
    public constructor(audioBuffer: AudioBuffer) {
        this.audioBuffer = audioBuffer;
    }
}

export class Box {
    public width: number;
    public height: number;
    public fillStyle: string;
    public constructor(width: number, height: number, fillStyle: string) {
        this.width = width;
        this.height = height;
        this.fillStyle = fillStyle;
    }
}

export class BoxCollider {
    public width: number;
    public height: number;
    public constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }
}

export interface KeyMapping {
    name: string;
    code: number;
}

export class InputMapping {
    [index: string]: boolean;

    public mapping: any;

    // for eg. mapping = [ {name: 'up', code: 38} ]
    public constructor(mapping: KeyMapping[]) {
        this.mapping = mapping;

        for (var i = 0; i < mapping.length; i++) {
            this[mapping[i].name] = false;
        }
    }
}
