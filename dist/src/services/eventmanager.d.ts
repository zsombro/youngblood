export default class EventManager {
    private dispatchQueue;
    private executionQueue;
    constructor();
    on(event: string, callback: Function): void;
    dispatch(event: string, params: object): void;
    emptyQueue(): void;
}
