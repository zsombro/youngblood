export default class AudioManager {

    audioContext: any;
    songsPlaying: any[];
    masterVolume: any;
    musicVolume: any;
    effectsVolume: any;

    constructor() {
        
        try {
            this.audioContext = new ((<any>window).AudioContext || (<any>window).webkitAudioContext)();
            
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

    setBackgroundMusic(buffer: AudioBuffer, loop: boolean) {
        if (this.songsPlaying.indexOf(buffer) == -1) {
            var that = this;
            var source = this.audioContext.createBufferSource();
            
            source.buffer = buffer;
            source.loop = loop || false;		
            
            source.connect(this.musicVolume);
            source.start();
            
            source.onended = function() {
                if (!loop)
                    that.songsPlaying.splice(that.songsPlaying.indexOf(buffer), 1);
            }
            
            this.songsPlaying.push(buffer);
        }	
    }
    
    playSound(buffer: AudioBuffer, loop: boolean) {
        var source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        source.loop = loop || false;
        
        source.connect(this.effectsVolume);
        
        source.start();
    }
}