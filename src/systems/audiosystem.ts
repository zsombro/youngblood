import Component from "../components/component";
import Entity from "../entity";
import { ISceneServices, Scene } from "../scene";
import { System } from "../system";

export const AudioSystem: System = {
    id: 'audioSystem',
    requiredComponents: [],
    update(e: Entity, scene: Scene, services: ISceneServices) {
        services.event.on('audio.create_channel', (e: { id: string }) => {
            services.audio.createChannel(e.id)
        })

        services.event.on('audio.set_channel_volume', (e: { id: string, value: number }) => {
            services.audio.setChannelVolume(e.id, e.value)
        })

        services.event.on('audio.play_sound', (e: AudioPlaybackOptions) => {
            services.audio.playSound(e.audioBuffer, e.channelId)
        })

        services.event.on('audio.pause', (e: { channels: string[] } ) => {
            services.audio.pausePlayback(e.channels)
        })

        services.event.on('audio.resume', (e: { channels: string[] } ) => {
            services.audio.continuePlayback(e.channels)
        })
    },
}

interface AudioPlaybackOptions {
    audioBuffer: AudioBuffer
    channelId?: string
    loop: boolean
}

interface AudioSourceOptions {
    isPlaying: boolean;
    playbackMode: 'loop' | 'oneshot';
}

const defaultOptions: AudioSourceOptions = { isPlaying: false, playbackMode: 'oneshot' }

export class AudioSource extends Component {
    buffer: AudioBuffer
    audioChannelId: string
    options: AudioSourceOptions

    constructor(buffer: AudioBuffer, audioChannelId: string, options?: AudioSourceOptions) {
        super('AudioSource')

        this.buffer = buffer
        this.audioChannelId = audioChannelId
        this.options = options ?? defaultOptions
    }
}