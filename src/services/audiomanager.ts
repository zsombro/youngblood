import EventManager from "./eventmanager";

export default class AudioManager {
	private audioContext: AudioContext | null = null;
	private channels: { [id: string]: AudioChannel } = {};
	private masterVolume: GainNode | null = null;

	public constructor() {
		try {
			this.audioContext = new AudioContext();

			this.masterVolume = this.audioContext.createGain();
			this.masterVolume.connect(this.audioContext.destination);

            this.createChannel('default')
		} catch (e) {
			console.error(e);
		}
	}

	/**
	 * Create a new audio channel with it's own volume control.
	 * @param id Channel ID. This ID can be used to control this channel individually.
	 * @returns 
	 */
	public createChannel(id: string) {
		if (this.channels[id]) {
			console.error(`Channel ID ${id} already exists`)
			return
		}

		if (!this.audioContext || !this.masterVolume) {
			console.error('Audio manager is not initialized')
			return
		}
		
		this.channels[id] = new AudioChannel(id, this.audioContext, this.masterVolume)
	}
	
	public playSound(buffer: AudioBuffer, channelId: string = 'default', loop: boolean = false): void {
		this.channels[channelId].loadSound(buffer)
		this.channels[channelId].play()
	}

	public pausePlayback(channelIds: string[]): void {
		this.batchedChannelOperation(channelIds, channel => channel.pause())
	}

	public continuePlayback(channelIds: string[]): void {
		this.batchedChannelOperation(channelIds, channel => channel.play())
	}

    public setChannelVolume(id: string, volume: number) {
        this.channels[id].setVolume(volume)
    }

	private batchedChannelOperation(channelIds: string[], callback: (c: AudioChannel) => void): void {
		if (channelIds) {
			channelIds.forEach(id => {
				const channel = this.channels[id]
				if (channel) callback(channel)
			})
		} else {
			Object.values(this.channels).forEach(c => callback(c))
		}
	}
}

class AudioChannel {
	name: string
	context: AudioContext
	buffer: AudioBuffer | null

	private audioNode: GainNode
	private playing: AudioBufferSourceNode | null
	private startedPlayingAt: number
	private pausedAt: number

	constructor(name: string, context: AudioContext, masterChannel: GainNode) {
		this.name = name
		this.context = context
		this.buffer = null
		this.audioNode = context.createGain()
		this.audioNode.connect(masterChannel)

		this.playing = null
		this.startedPlayingAt = 0
		this.pausedAt = 0
	}

	loadSound(buffer: AudioBuffer) {
		this.buffer = buffer
	}
	
	play() {
		if (!this.buffer) throw new Error(`No buffer loaded on Channel ${this.name}`)

		try {
			const source = this.context.createBufferSource();
			source.buffer = this.buffer;
			source.loop = false;

			source.connect(this.audioNode);
			source.start(0, this.pausedAt / 1000);
			this.pausedAt = 0
			this.startedPlayingAt = Date.now()

			this.playing = source
		} catch (e) {
			console.error('Audio playback error', e)
		}
	}

	pause() {
		if (!this.playing) return

		this.pausedAt = Date.now() - this.startedPlayingAt
		this.playing.disconnect()
		this.playing = null
	}
	
	setLoop(newValue: boolean) {
		if (!this.playing) return

		this.playing.loop = newValue
	}

	setVolume(value: number) {
		// TODO Check range

		this.audioNode.gain.value = value
	}
}