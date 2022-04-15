interface Event {
    event: string;
    params: any;
}

export default class EventManager {
    private dispatchQueue: Event[]
    private executionQueue: Event[]

    constructor() {
        this.dispatchQueue = []
        this.executionQueue = []
    }
    
    public on(event: string, callback: Function) {
        this.executionQueue
            .filter(e => e.event === event)
            .forEach(e => callback(e.params))
    }

    public dispatch(event: string, params: any) {
        this.dispatchQueue.push({ event, params })
    }

    public emptyQueue() {
        this.executionQueue = this.dispatchQueue
        this.dispatchQueue = []
    }
}