/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Components provide entities with attributes
 * that relate to in-game functionality.
 * Like entities, components are JUST DATA and not logic!
 */
export default class Component {
    public name: any;

    public constructor(name: string) {
        this.name = name;
    }
}

export class Position extends Component {
    public x: number;
    public y: number;
    public constructor(x: number, y: number) {
        super('Position');

        this.x = x;
        this.y = y;
    }
}

export class Velocity extends Component {
    public x: number;
    public y: number;
    public constructor(x: number, y: number) {
        super('Velocity');

        this.x = x;
        this.y = y;
    }
}

export class Label extends Component {
    public txt: string;
    public color: string;
    public font: string;
    public isVisible: boolean;

    public constructor(txt: string, options: { color: string; font: string; isVisible: boolean }) {
        super('Label');

        this.txt = txt;

        this.color = options.color || '#000';
        this.font = options.font || 'monospace';
        this.isVisible = options.isVisible || true;
    }
}

export class Sprite extends Component {
    public spriteSource: HTMLImageElement;

    public constructor(spriteSource: HTMLImageElement) {
        super('Sprite');

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

export class AnimatedSprite extends Component {
    public spriteSource: HTMLImageElement;
    public animationSheet: AnimationSheet;
    public currentFrame: number;
    public animationName: string;
    public scale: number;
    public loop: boolean;
    public isPlaying: boolean;
    public flip: boolean | SpriteFlipOptions;

    public constructor(spriteSource: HTMLImageElement, animationSheet: AnimationSheet, options: AnimatedSpriteOptions) {
        super('AnimatedSprite');

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

export class AudioSource extends Component {
    public audioBuffer: AudioBuffer;
    public constructor(audioBuffer: AudioBuffer) {
        super('AudioSource');

        this.audioBuffer = audioBuffer;
    }
}

export class Box extends Component {
    public width: number;
    public height: number;
    public fillStyle: string;
    public constructor(width: number, height: number, fillStyle: string) {
        super('Box');

        this.width = width;
        this.height = height;
        this.fillStyle = fillStyle;
    }
}

export class BoxCollider extends Component {
    public width: number;
    public height: number;
    public constructor(width: number, height: number) {
        super('BoxCollider');

        this.width = width;
        this.height = height;
    }
}

export interface KeyMapping {
    name: string;
    code: number;
}

export class InputMapping extends Component {
    [index: string]: boolean;

    public mapping: any;

    // for eg. mapping = [ {name: 'up', code: 38} ]
    public constructor(mapping: KeyMapping[]) {
        super('InputMapping');

        this.mapping = mapping;

        for (var i = 0; i < mapping.length; i++) {
            this[mapping[i].name] = false;
        }
    }
}
