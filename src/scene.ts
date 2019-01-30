
import Entity from './entity';
import { System, SystemScope, SystemType } from './system';

export default class Scene {

	sceneId: any;
	initialized: boolean;
	initCallback: any;
	alwaysInitialize: any;
	systemScope: any;
	systemType: any;
	gameEntities: { [index: string]: Entity };
	systems: { [index: string]: System };
	assets: {};

	constructor(options: any) {
		this.sceneId = options.sceneId || 'defaultScene';
		
		this.initialized = false;
		
		this.initCallback = options.init || (() => {});
		
		this.alwaysInitialize = options.alwaysInitialize || true;

		this.systemScope = options.scope || SystemScope.LOCAL;
		this.systemType = options.type || SystemType.NONRENDER;
		
		this.gameEntities = {};
		this.systems = {};
	}

	registerSystem(system: System) {
		this.systems[system.systemId] = system;
	}

	unregisterSystem(system: System) {
		delete this.systems[system.systemId];
	}

	addEntity(entity: Entity) {
		this.gameEntities[entity.id] = entity;
	}
}