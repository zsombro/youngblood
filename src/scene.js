const SystemScope = {
	LOCAL: 'local',
	GLOBAL: 'global'
}

const SystemType = {
	RENDER: 'render',
	NONRENDER: 'nonrender'
}

class Scene {
	constructor(options) {
		this.sceneId = options.sceneId || 'defaultScene';
		
		this.initialized = false;
		
		this.initCallback = options.init || (() => {});
		
		this.alwaysInitialize = options.alwaysInitialize || true;

		this.systemScope = options.scope || SystemScope.LOCAL;
		this.systemType = options.type || SystemType.NONRENDER;
		
		this.gameEntities = {};
		this.systems = {};
	}

	registerSystem(system) {
		this.systems[system.systemId] = system;
	}

	unregisterSystem(system) {
		delete this.systems[system.systemId];
	}

	addEntity(entity) {
		this.gameEntities[entity.id] = entity;
	}
}