
export default class InputManager {

    pressedKeys: any[];

    constructor() {
        var that = this;

        this.pressedKeys = [];

        window.addEventListener('keydown', 
        function (e) {
            if ( that.pressedKeys.indexOf(e.keyCode) === -1)
                that.pressedKeys.push(e.keyCode);
        }, 
        false);

          window.addEventListener('keyup', 
          function (e) {
            that.pressedKeys.splice(that.pressedKeys.indexOf(e.keyCode), 1);
          }, 
        false);
    }

    isPressed(key: number) {
		  return (this.pressedKeys.indexOf(key) !== -1);
	}
}