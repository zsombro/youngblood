/**
 * Components provide entities with attributes
 * that relate to in-game functionality.
 * Like entities, components are JUST DATA and not logic!
 */
export default interface Component<T> {
    type: string;
    data?: T;
}
export declare function component<T>(type: string, defaults?: T): (data?: T) => Component<T>;
export type ComponentFunction<T> = ReturnType<typeof component<T>>;
export interface Transform {
    position: Vector2;
    rotation: number;
    scale: number;
}
export declare const transform: (data?: Transform | undefined) => Component<Transform>;
export interface Vector2 {
    x: number;
    y: number;
}
export declare const velocity: (data?: Vector2 | undefined) => Component<Vector2>;
export interface Label {
    txt: string;
    color: string;
    font: string;
    isVisible: boolean;
}
export declare const label: (data?: Label | undefined) => Component<Label>;
export interface Sprite {
    spriteSource: HTMLImageElement;
}
export declare const sprite: (data?: Sprite | undefined) => Component<Sprite>;
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
}
export declare const animatedSprite: (data?: AnimatedSprite | undefined) => Component<AnimatedSprite>;
export interface AudioSource {
    audioBuffer: AudioBuffer;
}
export declare const audioSource: (data?: AudioSource | undefined) => Component<AudioSource>;
export interface Box {
    width: number;
    height: number;
    fillStyle: string;
}
export declare const box: (data?: Box | undefined) => Component<Box>;
export interface BoxCollider {
    width: number;
    height: number;
}
export declare const boxCollider: (data?: BoxCollider | undefined) => Component<BoxCollider>;
export interface KeyMapping {
    name: string;
    code: number;
}
export interface InputMapping {
    [index: string]: boolean | KeyMapping[] | string;
    mapping: KeyMapping[];
}
export declare const inputMapping: (data?: InputMapping) => Component<InputMapping>;
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
export declare const camera: (data?: Camera | undefined) => Component<Camera>;
