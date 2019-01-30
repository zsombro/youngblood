export default class AudioManager {
    audioContext: any;
    songsPlaying: any[];
    masterVolume: any;
    musicVolume: any;
    effectsVolume: any;
    constructor();
    setBackgroundMusic(buffer: AudioBuffer, loop: boolean): void;
    playSound(buffer: AudioBuffer, loop: boolean): void;
}
