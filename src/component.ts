// Components provide entities with attributes
// that relate to in-game functionality
// Like entities, components are JUST DATA and not logic

export class Component {

	name: any;

	constructor(name: string) {
		this.name = name;
	}
}

export class Position extends Component {
	x: number;
	y: number;
	constructor(x: number, y: number) {
		super("Position");
		
		this.x = x;
		this.y = y;
	}
}

export class Velocity extends Component {
	x: number;
	y: number;
	constructor(x: number, y: number) {
		super("Velocity");
		
		this.x = x;
		this.y = y;
	}
}

export class Label extends Component {

	x: number;
	y: number;
	txt: string;
	color: string;
	font: string;
	
	constructor(x: number, y: number, txt: string, options: { color: string; font: string; }) {
		super("Label");

		this.x = x;
		this.y = y;
		this.txt = txt;

		this.color = options.color || '#000';
		this.font = options.font || 'monospace';
	}
}

export class Sprite extends Component {

	spriteSource: HTMLImageElement;

	constructor(spriteSource: HTMLImageElement) {
		super("Sprite");

		this.spriteSource = spriteSource;
	}
}

export class AnimatedSprite extends Component {

	spriteSource: HTMLImageElement;
	animationSheet: any;
	animationName: any;
	scale: any;
	loop: any;
	isPlaying: any;
	currentFrame: number;

	// TODO: Interface for options?
	constructor(spriteSource: HTMLImageElement, animationSheet: {}, options: any) {
		super("AnimatedSprite");

		this.spriteSource = spriteSource;
		this.animationSheet = animationSheet;

		if (options === undefined)
			var options: any = {};
		
		// If there's no default animation set, we'll use the first one defined in the JSON object
		this.animationName = options.animationName || Object.keys(animationSheet)[0];
		this.scale = options.scale || 1.0;
		this.loop = options.loop || true;	
		this.isPlaying = options.isPlaying || true;

		this.currentFrame = 0;
	}
}

export class AudioSource extends Component {
	audioBuffer: any;
	constructor(audioBuffer: AudioBuffer) {
		super("AudioSource");
		
		this.audioBuffer = audioBuffer;
	}
}

export class Box extends Component {
	width: number;
	height: number;
	fillStyle: string;
	constructor(width: number, height: number, fillStyle: string) {
		super("Box");
		
		this.width = width;
		this.height = height;
		this.fillStyle = fillStyle;
	}
}

export class BoxCollider extends Component {
	width: number;
	height: number;
	constructor(width: number, height: number) {
		super("BoxCollider");
		
		this.width = width;
		this.height = height;
	}
}

export class InputMapping extends Component {
	[index: string]: boolean;

	mapping: any;

	// for eg. mapping = [ {name: 'up', code: 38} ]
	constructor(mapping: { [x: string]: any; length: number; }) {
		super("InputMapping");

		this.mapping = mapping;

		for (var i = 0; i < mapping.length; i++) {
			this[mapping[i].name] = false;
		}
	}
}