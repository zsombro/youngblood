import EventManager from "./eventmanager";

export default class InputManager {
    public pressedKeys: number[] = [];

    public constructor(eventManager: EventManager) {

        window.addEventListener(
            'keydown',
            (e: KeyboardEvent) => {
                if (this.pressedKeys.indexOf(e.keyCode) === -1) this.pressedKeys.push(e.keyCode);
                eventManager.dispatch('input.keydown', { code: e.key })
            },
            false,
        );

        window.addEventListener(
            'keyup',
            (e: KeyboardEvent) => {
                this.pressedKeys.splice(this.pressedKeys.indexOf(e.keyCode), 1);
                eventManager.dispatch('input.keyup', { code: e.key })
            },
            false,
        );
    }

    public isPressed(key: number): boolean {
        return this.pressedKeys.indexOf(key) !== -1;
    }
}
