export default class InputManager {
    public pressedKeys: number[];

    public constructor() {
        var that = this;

        this.pressedKeys = [];

        window.addEventListener(
            'keydown',
            function(e): void {
                if (that.pressedKeys.indexOf(e.keyCode) === -1) that.pressedKeys.push(e.keyCode);
            },
            false,
        );

        window.addEventListener(
            'keyup',
            function(e): void {
                that.pressedKeys.splice(that.pressedKeys.indexOf(e.keyCode), 1);
            },
            false,
        );
    }

    public isPressed(key: number): boolean {
        return this.pressedKeys.indexOf(key) !== -1;
    }
}
