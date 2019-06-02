export default class AudioManager {
    private audioContext;
    private songsPlaying;
    private masterVolume;
    private musicVolume;
    private effectsVolume;
    constructor();
    setBackgroundMusic(buffer: AudioBuffer, loop: boolean): void;
    playSound(buffer: AudioBuffer, loop: boolean): void;
}
