class AudioManager {
    constructor() {
        
        try {
            this.audioContext == new (window.AudioContext || window.webkitAudioContext)();
            
            this.songsPlaying = [];

            this.masterVolume = this.audioContext.createGain();
            
            this.musicVolume = this.audioContext.createGain();
            this.musicVolume.connect(this.masterVolume);
            
            this.effectsVolume = this.audioContext.createGain();
            this.effectsVolume.connect(this.masterVolume);
            
            this.masterVolume.connect(this.audioContext.destination);
		} catch (e) {
			console.log('WebAudio API is not supported by this browser');
		}
    }
}