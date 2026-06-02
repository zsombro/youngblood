import { default as Entity } from './entity';
export default class EntityManager {
    private entitiesArray;
    private entitiesObject;
    private idToIndex;
    constructor();
    get entities(): Entity[];
    addEntity(entity: Entity): void;
    removeEntity(id: string): boolean;
    findEntityById(id: string): Entity | undefined;
}
