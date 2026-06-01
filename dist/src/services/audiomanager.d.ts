export default class AudioManager {
    private audioContext;
    private channels;
    private masterVolume;
    constructor();
    /**
     * Create a new audio channel with it's own volume control.
     * @param id Channel ID. This ID can be used to control this channel individually.
     * @returns
     */
    createChannel(id: string): void;
    playSound(buffer: AudioBuffer, channelId?: string, loop?: boolean): void;
    pausePlayback(channelIds: string[]): void;
    continuePlayback(channelIds: string[]): void;
    setChannelVolume(id: string, volume: number): void;
    private batchedChannelOperation;
}
