class Scene {
	constructor(options) {
		this.sceneId = options.sceneId || 'defaultScene';
		
		this.initialized = false;
		
		this.initCallback = options.init || (() => {});
		
		this.alwaysInitialize = options.alwaysInitialize || true;
		
		this.gameEntities = {};
		this.systems = {};
	}

	registerSystem(systemCallback) {
		this.systems[systemCallback.name] = systemCallback;
	}

	unregisterSystem(systemCallback) {
		delete this.systems[systemCallback.name];
	}

	addEntity(entity) {
		this.gameEntities[entity.id] = entity;
	}
}