import { AnimatedSprite, Animation, Box, Transform, Label, Sprite, transform, Camera, camera, box, label, sprite, animatedSprite } from './components/component';
import Entity from './entity';
import { Scene } from './scene';
import tiledMap, { Layer, TiledSheetData, TiledMap } from './components/tiledMap';

export type Renderer = (entity: Scene) => void;

export interface RenderOrderCache {
    scene: Scene | null;
    signature: string;
    entities: Entity[];
}

export function ensureSceneCamera(scene: Scene, initializedScenes: WeakSet<Scene>): void {
    if (initializedScenes.has(scene))
        return;

    if (scene.getEntitiesWith(camera).length === 0) {
        const cameraEntity = new Entity();
        cameraEntity.addComponents([transform(), camera()]);
        scene.addEntity(cameraEntity);
    }

    initializedScenes.add(scene);
}

export function createRenderOrderCache(): RenderOrderCache {
    return {
        scene: null,
        signature: '',
        entities: [],
    };
}

function getEntityZIndex(entity: Entity): number {
    const tf = entity.get(transform) as Transform | undefined;
    const z = Number(tf?.zIndex ?? 0);

    return Number.isFinite(z) ? z : 0;
}

function getRenderOrderSignature(entities: Entity[]): string {
    return entities.map(entity => `${entity.id}:${getEntityZIndex(entity)}`).join('|');
}

export function getSortedRenderEntities(scene: Scene, cache: RenderOrderCache): Entity[] {
    const entitiesWithTransform = scene.getEntitiesWith(transform);
    const signature = getRenderOrderSignature(entitiesWithTransform);

    if (cache.scene === scene && cache.signature === signature)
        return cache.entities;

    cache.scene = scene;
    cache.signature = signature;
    cache.entities = [...entitiesWithTransform].sort((a, b) => getEntityZIndex(a) - getEntityZIndex(b));

    return cache.entities;
}

const degToRad = (degrees: number): number => degrees * (Math.PI / 180);

function withEntityRotation(
    tf: Transform,
    ctx: CanvasRenderingContext2D,
    draw: (x: number, y: number) => void,
): void {
    const rotation = Number(tf.rotation ?? 0);

    if (!Number.isFinite(rotation) || rotation === 0) {
        draw(tf.position.x, tf.position.y);
        return;
    }

    ctx.save();
    ctx.translate(tf.position.x, tf.position.y);
    ctx.rotate(degToRad(rotation));
    draw(0, 0);
    ctx.restore();
}

function renderBox(transform: Transform, b: Box, ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = b.fillStyle;
    withEntityRotation(transform, ctx, (x, y): void => {
        ctx.fillRect(x, y, b.width, b.height);
    });
}

function renderLabel(transform: Transform, l: Label, ctx: CanvasRenderingContext2D): void {
    if (l.isVisible) {
        ctx.fillStyle = l.color;
        ctx.font = l.font;
        withEntityRotation(transform, ctx, (x, y): void => {
            ctx.fillText(l.txt, x, y);
        });
    }
}

function renderSprite(transform: Transform, s: Sprite, ctx: CanvasRenderingContext2D): void {
    withEntityRotation(transform, ctx, (x, y): void => {
        ctx.drawImage(s.spriteSource, x, y);
    });
}

function renderAnimatedSprite(transform: Transform, sprite: AnimatedSprite, ctx: CanvasRenderingContext2D): void {
    const f: Animation = sprite.animationSheet[sprite.animationName];

    ctx.save();
    ctx.translate(transform.position.x, transform.position.y);

    if (transform.rotation)
        ctx.rotate(degToRad(transform.rotation));

    if (sprite.flip)
        ctx.scale(-1, 1);

    ctx.drawImage(
        sprite.spriteSource,
        f.startX + sprite.currentFrame * f.frameWidth,
        f.startY,
        f.frameWidth,
        f.frameHeight,
        sprite.flip ? -sprite.scale * f.frameWidth : 0,
        0,
        f.frameWidth * sprite.scale,
        f.frameHeight * sprite.scale,
    );

    ctx.restore();

    if (sprite.isPlaying) {
        if (sprite.currentFrame >= f.frames - 1) sprite.currentFrame = 0;
        else sprite.currentFrame++;
    }
}

function renderMissingLayer(layer: Layer, message: string, ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = 'magenta';
    ctx.fillRect(layer.x, layer.y, layer.width, layer.height);
    ctx.fillStyle = 'black';
    ctx.fillText(message, layer.x + 10, layer.y + 20);
}

function renderImageLayer(Transform: Transform, layer: Layer, ctx: CanvasRenderingContext2D): void {
    if (!layer.image) {
        renderMissingLayer(layer, 'Image not found', ctx);
        return;
    };

    ctx.drawImage(layer.image, layer.x, layer.y, ctx.canvas.width, ctx.canvas.height);
}

export function getTilesheetCoordinateById(id: number, sheet: TiledSheetData): { x: number; y: number } {
    return {
        x: (id % sheet.columns) * sheet.tilewidth - sheet.tilewidth,
        y: Math.floor(id / sheet.columns) * sheet.tileheight,
    };
}

function renderTileLayer(
    transform: Transform,
    layer: Layer,
    sheet: TiledSheetData,
    scalingFactor: number,
    ctx: CanvasRenderingContext2D,
): void {
    if (!layer.data) {
        renderMissingLayer(layer, 'Tile data not found', ctx);
        return;
    };

    for (let i = 0; i < layer.data.length; i++) {
        if (layer.data[i] === 0) continue;

        const { x, y } = getTilesheetCoordinateById(layer.data[i], sheet);
        ctx.drawImage(
            sheet.image,
            x,
            y,
            sheet.tilewidth,
            sheet.tileheight,
            transform.position.x + (i % layer.width) * (sheet.tilewidth * scalingFactor),
            transform.position.y + Math.floor(i / layer.width) * (sheet.tileheight * scalingFactor),
            sheet.tilewidth * scalingFactor,
            sheet.tileheight * scalingFactor,
        );
    }
}

function renderTiledMap(Transform: Transform, map: TiledMap, ctx: CanvasRenderingContext2D): void {
    for (const layer of map.data.layers) {
        switch (layer.type) {
            case 'imagelayer':
                renderImageLayer(Transform, layer, ctx);
                break;
            case 'tilelayer':
                renderTileLayer(Transform, layer, map.spriteSheet, map.options.scale, ctx);
                break;
        }
    }
}

export default (ctx: CanvasRenderingContext2D): Renderer => {
    const renderOrderCache = createRenderOrderCache();
    const initializedScenes = new WeakSet<Scene>();

    return (scene: Scene): void => {
        ensureSceneCamera(scene, initializedScenes);

        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        const cameras = scene.getEntitiesWith(camera);
        const cam = cameras[0]?.get(camera) as Camera | undefined;

        if (!cam)
            return;

        const cameraOffsetX = ctx.canvas.width / 2 - cam.centerX + cam.offsetX;
        const cameraOffsetY = ctx.canvas.height / 2 - cam.centerY + cam.offsetY;

        ctx.save();
        ctx.translate(cameraOffsetX, cameraOffsetY);

        for (const currentEntity of getSortedRenderEntities(scene, renderOrderCache)) {
            const tf = currentEntity.get(transform);
            const renderTransform = tf;
            if (!renderTransform) continue;

            if (currentEntity.hasComponent(box)) renderBox(renderTransform, currentEntity.get(box), ctx);

            if (currentEntity.hasComponent(label)) renderLabel(renderTransform, currentEntity.get(label), ctx);

            if (currentEntity.hasComponent(sprite)) renderSprite(renderTransform, currentEntity.get(sprite), ctx);

            if (currentEntity.hasComponent(animatedSprite))
                renderAnimatedSprite(renderTransform, currentEntity.get(animatedSprite), ctx);

            if (currentEntity.hasComponent(tiledMap)) renderTiledMap(renderTransform, currentEntity.get(tiledMap), ctx);
        }

        ctx.restore();
    };
};
