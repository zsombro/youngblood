// Components provide entities with attributes
// that relate to in-game functionality
// Like entities, components are JUST DATA and not logic

class Component {
	constructor() {
		this.name = this.constructor.name;
	}
}

class Position extends Component {
	constructor(x, y) {
		super();
		
		this.x = x;
		this.y = y;
	}
}

class Velocity extends Component {
	constructor(x, y) {
		super();
		
		this.x = x;
		this.y = y;
	}
}

class Sprite extends Component {
	constructor(spriteSource) {
		super();

		this.spriteSource = spriteSource;
	}
}

class Box extends Component {
	constructor(width, height, fillStyle) {
		super();
		
		this.width = width;
		this.height = height;
		this.fillStyle = fillStyle;
	}
}

class BoxCollider extends Component {
	constructor(width, height) {
		super();
		
		this.width = width;
		this.height = height;
	}
}