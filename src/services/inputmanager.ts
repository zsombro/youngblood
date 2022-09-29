import EventManager from "./eventmanager";

export default class InputManager {
    public pressedKeys: number[];

    public constructor(eventManager: EventManager) {
        var that = this;

        this.pressedKeys = [];

        window.addEventListener(
            'keydown',
            function(e): void {
                if (that.pressedKeys.indexOf(e.keyCode) === -1) that.pressedKeys.push(e.keyCode);
                eventManager.dispatch('input.keydown', { code: e.key })
            },
            false,
        );

        window.addEventListener(
            'keyup',
            function(e): void {
                that.pressedKeys.splice(that.pressedKeys.indexOf(e.keyCode), 1);
                eventManager.dispatch('input.keyup', { code: e.key })
            },
            false,
        );
    }

    public isPressed(key: number): boolean {
        return this.pressedKeys.indexOf(key) !== -1;
    }
}
