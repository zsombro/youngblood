import { default as Component } from '../components/component';
import { System } from '../system';
export declare const AudioSystem: System;
interface AudioSourceOptions {
    isPlaying: boolean;
    playbackMode: 'loop' | 'oneshot';
}
export interface AudioSource {
    buffer: AudioBuffer;
    audioChannelId: string;
    options: AudioSourceOptions;
}
export declare const audioSource: (data?: AudioSource | undefined) => Component<AudioSource>;
export {};
