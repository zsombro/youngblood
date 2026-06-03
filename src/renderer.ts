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

function renderBox(transform: Transform, b: Box, ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = b.fillStyle;
    ctx.fillRect(transform.position.x, transform.position.y, b.width, b.height);
}

function renderLabel(transform: Transform, l: Label, ctx: CanvasRenderingContext2D): void {
    if (l.isVisible) {
        ctx.fillStyle = l.color;
        ctx.font = l.font;
        ctx.fillText(l.txt, transform.position.x, transform.position.y);
    }
}

function renderSprite(transform: Transform, s: Sprite, ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(s.spriteSource, transform.position.x, transform.position.y);
}

function renderAnimatedSprite(transform: Transform, sprite: AnimatedSprite, ctx: CanvasRenderingContext2D): void {
    const f: Animation = sprite.animationSheet[sprite.animationName];

    if (sprite.flip) {
        ctx.translate(transform.position.x, 0);
        ctx.scale(-1, 1);
    }

    ctx.drawImage(
        sprite.spriteSource,
        f.startX + sprite.currentFrame * f.frameWidth,
        f.startY,
        f.frameWidth,
        f.frameHeight,
        sprite.flip ? -sprite.scale * f.frameWidth : transform.position.x,
        transform.position.y,
        f.frameWidth * sprite.scale,
        f.frameHeight * sprite.scale,
    );

    if (sprite.flip) ctx.setTransform(1, 0, 0, 1, 0, 0);

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

        for (const currentEntity of getSortedRenderEntities(scene, renderOrderCache)) {
            const tf = currentEntity.get(transform);
            const renderTransform = transform(tf).data;
            if (!renderTransform) continue;
            renderTransform.position.x = ctx.canvas.width / 2 + tf.position.x - cam.centerX + cam.offsetX;
            renderTransform.position.y = ctx.canvas.height / 2 + tf.position.y - cam.centerY + cam.offsetY;

            if (currentEntity.hasComponent(box)) renderBox(renderTransform, currentEntity.get(box), ctx);

            if (currentEntity.hasComponent(label)) renderLabel(renderTransform, currentEntity.get(label), ctx);

            if (currentEntity.hasComponent(sprite)) renderSprite(renderTransform, currentEntity.get(sprite), ctx);

            if (currentEntity.hasComponent(animatedSprite))
                renderAnimatedSprite(renderTransform, currentEntity.get(animatedSprite), ctx);

            if (currentEntity.hasComponent(tiledMap)) renderTiledMap(renderTransform, currentEntity.get(tiledMap), ctx);
        }
    };
};
