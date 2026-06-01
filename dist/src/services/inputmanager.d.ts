import { default as EventManager } from './eventmanager';
export default class InputManager {
    pressedKeys: number[];
    constructor(eventManager: EventManager);
    isPressed(key: number): boolean;
}
