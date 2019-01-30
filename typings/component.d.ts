export declare class Component {
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
    x: number;
    y: number;
    txt: string;
    color: string;
    font: string;
    constructor(x: number, y: number, txt: string, options: {
        color: string;
        font: string;
    });
}
export declare class Sprite extends Component {
    spriteSource: HTMLImageElement;
    constructor(spriteSource: HTMLImageElement);
}
export declare class AnimatedSprite extends Component {
    spriteSource: HTMLImageElement;
    animationSheet: any;
    animationName: any;
    scale: any;
    loop: any;
    isPlaying: any;
    currentFrame: number;
    constructor(spriteSource: HTMLImageElement, animationSheet: {}, options: any);
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
export declare class InputMapping extends Component {
    [index: string]: boolean;
    mapping: any;
    constructor(mapping: {
        [x: string]: any;
        length: number;
    });
}
