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

class Label extends Component {
	constructor(x, y, txt, options) {
		super();

		this.x = x;
		this.y = y;
		this.txt = txt;

		this.color = options.color || '#000';
		this.font = options.font || 'monospace';
	}
}

class Sprite extends Component {
	constructor(spriteSource) {
		super();

		this.spriteSource = spriteSource;
	}
}

class AnimatedSprite extends Component {
	constructor(spriteSource, animationSheet, options) {
		super();

		this.spriteSource = spriteSource;
		this.animationSheet = animationSheet;

		if (options === undefined)
			var options = {};
		
		// If there's no default animation set, we'll use the first one defined in the JSON object
		this.animationName = options.animationName || Object.keys(animationSheet)[0];
		this.scale = options.scale || 1.0;
		this.loop = options.loop || true;	
		this.isPlaying = options.isPlaying || true;

		this.currentFrame = 0;
	}
}

class AudioSource extends Component {
	constructor(audioBuffer) {
		super();
		
		this.audioBuffer = audioBuffer;
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

class InputMapping extends Component {

	// for eg. mapping = [ {name: 'up', code: 38} ]
	constructor(mapping) {
		super();

		this.mapping = mapping;

		for (var i = 0; i < mapping.length; i++) {
			this[mapping[i].name] = false;
		}
	}
}