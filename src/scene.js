class Scene {
	constructor(options) {
		this.sceneId = options.sceneId || 'defaultScene';
		
		this.initialized = false;
		
		this.initCallback = options.init || (() => {});
		
		this.alwaysInitialize = options.alwaysInitialize || true;
		
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