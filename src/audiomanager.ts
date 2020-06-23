export default class AudioManager {
    private audioContext: AudioContext;
    private songsPlaying: AudioBuffer[];
    private masterVolume: GainNode;
    private musicVolume: GainNode;
    private effectsVolume: GainNode;

    public constructor() {
        try {
            this.audioContext = new AudioContext();

            this.songsPlaying = [];

            this.masterVolume = this.audioContext.createGain();

            this.musicVolume = this.audioContext.createGain();
            this.musicVolume.connect(this.masterVolume);

            this.effectsVolume = this.audioContext.createGain();
            this.effectsVolume.connect(this.masterVolume);

            this.masterVolume.connect(this.audioContext.destination);
        } catch (e) {
            console.error(e);
        }
    }

    public setBackgroundMusic(buffer: AudioBuffer, loop: boolean): void {
        if (this.songsPlaying.indexOf(buffer) == -1) {
            var that = this;
            var source = this.audioContext.createBufferSource();

            source.buffer = buffer;
            source.loop = loop || false;

            source.connect(this.musicVolume);
            source.start();

            source.onended = function(): void {
                if (!loop) that.songsPlaying.splice(that.songsPlaying.indexOf(buffer), 1);
            };

            this.songsPlaying.push(buffer);
        }
    }

    public playSound(buffer: AudioBuffer, loop: boolean): void {
        var source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        source.loop = loop || false;

        source.connect(this.effectsVolume);

        source.start();
    }
}
