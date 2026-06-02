import Entity from './entity';

export default class EntityManager {
    private entitiesArray: Entity[];
    private entitiesObject: Record<string, Entity>;
    private idToIndex: Record<string, number>;

    public constructor() {
        this.entitiesArray = [];
        this.entitiesObject = {};
        this.idToIndex = {};
    }

    public get entities(): Entity[] {
        return this.entitiesArray;
    }

    public addEntity(entity: Entity): void {
        if (this.entitiesObject[entity.id] != null)
            throw new Error(`Entity with ID ${entity.id} has already been registered!`)

        const index = this.entitiesArray.push(entity) - 1;

        this.entitiesObject[entity.id] = entity;
        this.idToIndex[entity.id] = index;
    }

    public removeEntity(id: string): Entity | null {
        const index = this.idToIndex[id];

        if (index == null)
            return null;

        const removed = this.entitiesObject[id];

        const lastIndex = this.entitiesArray.length - 1;

        if (index !== lastIndex) {
            const swapped = this.entitiesArray[lastIndex];
            this.entitiesArray[index] = swapped;
            this.idToIndex[swapped.id] = index;
        }

        this.entitiesArray.pop();

        delete this.entitiesObject[id];
        delete this.idToIndex[id];

        return removed;
    }

    public findEntityById(id: string): Entity | undefined {
        return this.entitiesObject[id];
    }
}
