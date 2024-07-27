/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Components provide entities with attributes
 * that relate to in-game functionality.
 * Like entities, components are JUST DATA and not logic!
 */
export default interface Component<T> {
    type: string
    data?: T
}

export function component<T>(type: string, defaults?: T) {
    return (data?: T): Component<T> => (defaults ? { type, data: { ...defaults, ...data } } : { type, data })
}

export type ComponentFunction<T> = ReturnType<typeof component<T>>

export interface Transform {
    position: Vector2
    rotation: number
    scale: number
}

export const transform = component<Transform>('transform', { position: { x: 0, y: 0 }, rotation: 0, scale: 1 })

export interface Vector2 {
    x: number
    y: number
}

export const velocity = component<Vector2>('velocity', { x: 0, y: 0 })

export interface Label {
    txt: string;
    color: string;
    font: string;
    isVisible: boolean;
}

export const label = component<Label>('label', { txt: '', color: 'white', font: '10px verdana', isVisible: true })

export interface Sprite {
    spriteSource: HTMLImageElement;
}

export const sprite = component<Sprite>('sprite')

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

export interface AnimatedSprite {
    spriteSource: HTMLImageElement;
    animationSheet: AnimationSheet;
    currentFrame: number;
    animationName: string;
    scale: number;
    loop: boolean;
    isPlaying: boolean;
    flip: boolean | SpriteFlipOptions;

    // if (options === undefined) var options: AnimatedSpriteOptions = {};

    // // If there's no default animation set, we'll use the first one defined in the JSON object
    // this.animationName = options.animationName || Object.keys(animationSheet)[0];
    // this.scale = options.scale ?? 1.0;
    // this.loop = options.loop ?? true;
    // this.isPlaying = options.isPlaying ?? true;
    // this.flip = options.flip ?? false;
    // this.currentFrame = 0;
}

export const animatedSprite = component<AnimatedSprite>('animatedSprite')

export interface AudioSource {
    audioBuffer: AudioBuffer;
}

export const audioSource = component<AudioSource>('audioSource')

export interface Box {
    width: number;
    height: number;
    fillStyle: string;
}

export const box = component<Box>('box')

export interface BoxCollider {
    width: number;
    height: number;
}

export const boxCollider = component<BoxCollider>('boxCollider')

export interface KeyMapping {
    name: string;
    code: number;
}

export interface InputMapping {
    [index: string]: boolean | KeyMapping[] | string;

    mapping: KeyMapping[];
}

export const inputMapping = (data?: InputMapping): Component<InputMapping> => {
    const map: { [index: string]: boolean } = {}

    if (!data) return { type: 'inputMapping', data: { mapping: [] } }

    for (var i = 0; i < data.mapping.length; i++) {
        map[data.mapping[i].name] = false;
    }

    return { type: 'inputMapping', data: { ...data, ...map } }
}

export interface CameraOptions {
    offsetX?: number;
    offsetY?: number;
    drag?: number;
}

export interface Camera {
    centerX: number;
    centerY: number;

    offsetX: number;
    offsetY: number;
    drag: number;
}

export const camera = component<Camera>('camera', {
    centerX: 0,
    centerY: 0,
    offsetX: 0,
    offsetY: 0,
    drag: 0
})