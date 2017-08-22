class System {
    constructor(options) {
        this.systemId = options.systemId || "defaultSystem";
        this.requiredComponents = options.requiredComponents || [];
        this.update = options.update || (() => {});
    }
}