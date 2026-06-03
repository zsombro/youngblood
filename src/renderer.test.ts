import { describe, expect, it } from 'vitest';

import Entity from './entity';
import render, { ensureSceneCamera, getTilesheetCoordinateById, getSortedRenderEntities, createRenderOrderCache } from './renderer';
import { box, camera, transform } from './components/component';
import { TiledSheetData } from './components/tiledMap';
import { ISceneServices, Scene } from './scene';

const mockSceneServices = {
    input: {},
    audio: {},
    assets: {},
    event: { dispatch: (): void => {}, on: (): void => {} },
    game: { switchToScene: (): void => {} },
} as unknown as ISceneServices;

function createScene(): Scene {
    return new Scene({ sceneId: 'renderer-test' }, mockSceneServices);
}

function createEntity(id: string, zIndex: number): Entity {
    const entity = new Entity(id);
    entity.addComponent(transform({ position: { x: 0, y: 0 }, rotation: 0, scale: 1, zIndex }));
    return entity;
}

function createMockContext(): CanvasRenderingContext2D {
    return {
        canvas: { width: 100, height: 50 },
        fillStyle: 'white',
        font: '',
        fillRect: (): void => {},
        fillText: (): void => {},
        drawImage: (): void => {},
        save: (): void => {},
        restore: (): void => {},
        translate: (): void => {},
        rotate: (): void => {},
        scale: (): void => {},
        setTransform: (): void => {},
    } as unknown as CanvasRenderingContext2D;
}

describe('Renderer', (): void => {
    it('should translate tile IDs to coordinates', (): void => {
        const data: TiledSheetData = {
            image: new Image(),
            imageheight: 128,
            imagewidth: 128,
            tileheight: 16,
            tilewidth: 16,
            tilecount: 64,
            columns: 8,
        };

        const position1 = getTilesheetCoordinateById(1, data);
        const position2 = getTilesheetCoordinateById(2, data);
        const position3 = getTilesheetCoordinateById(14, data);

        expect(position1).to.deep.equal({ x: 0, y: 0 });
        expect(position2).to.deep.equal({ x: 16, y: 0 });
        expect(position3).to.deep.equal({ x: 80, y: 16 });
    });

    it('should sort render entities by zIndex in ascending order', (): void => {
        const scene = createScene();
        const cache = createRenderOrderCache();

        scene.addEntity(createEntity('high', 10));
        scene.addEntity(createEntity('low', -1));
        scene.addEntity(createEntity('mid', 2));

        const sorted = getSortedRenderEntities(scene, cache);

        expect(sorted.map(entity => entity.id)).to.deep.equal(['low', 'mid', 'high']);
    });

    it('should preserve entity order when zIndex values are equal', (): void => {
        const scene = createScene();
        const cache = createRenderOrderCache();

        scene.addEntity(createEntity('first', 0));
        scene.addEntity(createEntity('second', 0));
        scene.addEntity(createEntity('third', 0));

        const sorted = getSortedRenderEntities(scene, cache);

        expect(sorted.map(entity => entity.id)).to.deep.equal(['first', 'second', 'third']);
    });

    it('should reuse the cached render order when scene signature is unchanged', (): void => {
        const scene = createScene();
        const cache = createRenderOrderCache();

        scene.addEntity(createEntity('a', 1));
        scene.addEntity(createEntity('b', 2));

        const firstResult = getSortedRenderEntities(scene, cache);
        const secondResult = getSortedRenderEntities(scene, cache);

        expect(secondResult).to.equal(firstResult);
    });

    it('should invalidate cache on entity and zIndex changes', (): void => {
        const scene = createScene();
        const cache = createRenderOrderCache();

        scene.addEntity(createEntity('a', 0));
        scene.addEntity(createEntity('b', 1));

        const initial = getSortedRenderEntities(scene, cache);

        scene.addEntity(createEntity('c', -1));
        const afterAdd = getSortedRenderEntities(scene, cache);
        expect(afterAdd).not.to.equal(initial);
        expect(afterAdd.map(entity => entity.id)).to.deep.equal(['c', 'a', 'b']);

        const entityA = scene.findEntityById('a');
        if (!entityA) throw new Error('Expected entity a to exist');
        entityA.get(transform).zIndex = 5;

        const afterZIndexChange = getSortedRenderEntities(scene, cache);
        expect(afterZIndexChange).not.to.equal(afterAdd);
        expect(afterZIndexChange.map(entity => entity.id)).to.deep.equal(['c', 'b', 'a']);

        scene.removeEntity('c');
        const afterRemove = getSortedRenderEntities(scene, cache);
        expect(afterRemove).not.to.equal(afterZIndexChange);
        expect(afterRemove.map(entity => entity.id)).to.deep.equal(['b', 'a']);
    });

    it('should inject a default camera entity on first scene render when missing', (): void => {
        const scene = createScene();
        const renderer = render(createMockContext());

        expect(scene.getEntitiesWith(camera).length).to.equal(0);

        renderer(scene);

        expect(scene.getEntitiesWith(camera).length).to.equal(1);
    });

    it('should not inject duplicate default cameras on subsequent renders', (): void => {
        const scene = createScene();
        const renderer = render(createMockContext());

        renderer(scene);
        renderer(scene);

        expect(scene.getEntitiesWith(camera).length).to.equal(1);
    });

    it('should keep existing camera without injecting a new one', (): void => {
        const scene = createScene();
        const initializedScenes = new WeakSet<Scene>();
        const existingCameraEntity = createEntity('existing-camera', 0);
        existingCameraEntity.addComponent(camera());
        scene.addEntity(existingCameraEntity);

        ensureSceneCamera(scene, initializedScenes);

        expect(scene.getEntitiesWith(camera).length).to.equal(1);
    });

    it('should always use camera-relative coordinates during rendering', (): void => {
        const drawCalls: number[][] = [];
        const translateCalls: number[][] = [];
        const ctx = createMockContext();
        ctx.fillRect = (...args: number[]): void => {
            drawCalls.push(args);
        };
        ctx.translate = (...args: number[]): void => {
            translateCalls.push(args);
        };

        const scene = createScene();
        scene.addEntity([
            transform({ position: { x: 10, y: 20 }, rotation: 0, scale: 1 }),
            box({ width: 5, height: 5, fillStyle: 'black' }),
        ]);

        const renderer = render(ctx);
        renderer(scene);

        const cameraTranslate = translateCalls.find(call => call[0] === 50 && call[1] === 25);
        const boxDraw = drawCalls.find(call => call[2] === 5 && call[3] === 5);
        expect(cameraTranslate).to.deep.equal([50, 25]);
        expect(boxDraw).to.deep.equal([10, 20, 5, 5]);
    });

    it('should rotate entities when transform.rotation is set', (): void => {
        const rotateCalls: number[] = [];
        const ctx = createMockContext();
        ctx.rotate = (angle: number): void => {
            rotateCalls.push(angle);
        };

        const scene = createScene();
        scene.addEntity([
            transform({ position: { x: 10, y: 20 }, rotation: 90, scale: 1 }),
            box({ width: 5, height: 5, fillStyle: 'black' }),
        ]);

        const renderer = render(ctx);
        renderer(scene);

        expect(rotateCalls[0]).toBeCloseTo(Math.PI / 2, 6);
    });

    it('should not rotate entities when transform.rotation is 0', (): void => {
        const rotateCalls: number[] = [];
        const ctx = createMockContext();
        ctx.rotate = (angle: number): void => {
            rotateCalls.push(angle);
        };

        const scene = createScene();
        scene.addEntity([
            transform({ position: { x: 10, y: 20 }, rotation: 0, scale: 1 }),
            box({ width: 5, height: 5, fillStyle: 'black' }),
        ]);

        const renderer = render(ctx);
        renderer(scene);

        expect(rotateCalls).to.deep.equal([]);
    });
});
