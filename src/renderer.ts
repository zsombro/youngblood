import { AnimatedSprite, Animation, Box, Position, Label, Sprite } from './components/component';
import { Scene } from './scene';
import TiledMap, { Layer, TiledSheetData } from './components/tiledMap';

export type Renderer = (entity: Scene) => void;

function renderBox(p: Position, b: Box, ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = b.fillStyle;
    ctx.fillRect(p.x, p.y, b.width, b.height);
}

function renderLabel(p: Position, l: Label, ctx: CanvasRenderingContext2D): void {
    if (l.isVisible) {
        ctx.fillStyle = l.color;
        ctx.fillText(l.txt, p.x, p.y);
    }
}

function renderSprite(p: Position, s: Sprite, ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(s.spriteSource, p.x, p.y);
}

function renderAnimatedSprite(p: Position, sprite: AnimatedSprite, ctx: CanvasRenderingContext2D): void {
    const f: Animation = sprite.animationSheet[sprite.animationName];

    if (sprite.flip) {
        ctx.translate(p.x, 0);
        ctx.scale(-1, 1);
    }

    ctx.drawImage(
        sprite.spriteSource,
        f.startX + sprite.currentFrame * f.frameWidth,
        f.startY,
        f.frameWidth,
        f.frameHeight,
        sprite.flip ? -sprite.scale * f.frameWidth : p.x,
        p.y,
        f.frameWidth * sprite.scale,
        f.frameHeight * sprite.scale,
    );

    if (sprite.flip) ctx.setTransform(1, 0, 0, 1, 0, 0);

    if (sprite.isPlaying) {
        if (sprite.currentFrame >= f.frames - 1) sprite.currentFrame = 0;
        else sprite.currentFrame++;
    }
}

function renderImageLayer(position: Position, layer: Layer, ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(layer.image, layer.x, layer.y, ctx.canvas.width, ctx.canvas.height);
}

export function getTilesheetCoordinateById(id: number, sheet: TiledSheetData): { x: number; y: number } {
    return {
        x: (id % sheet.columns) * sheet.tilewidth - sheet.tilewidth,
        y: Math.floor(id / sheet.columns) * sheet.tileheight,
    };
}

function renderTileLayer(
    position: Position,
    layer: Layer,
    sheet: TiledSheetData,
    scalingFactor: number,
    ctx: CanvasRenderingContext2D,
): void {
    for (let i = 0; i < layer.data.length; i++) {
        if (layer.data[i] === 0) continue;

        const { x, y } = getTilesheetCoordinateById(layer.data[i], sheet);
        ctx.drawImage(
            sheet.image,
            x,
            y,
            sheet.tilewidth,
            sheet.tileheight,
            position.x + (i % layer.width) * (sheet.tilewidth * scalingFactor),
            position.y + Math.floor(i / layer.width) * (sheet.tileheight * scalingFactor),
            sheet.tilewidth * scalingFactor,
            sheet.tileheight * scalingFactor,
        );
    }
}

function renderTiledMap(position: Position, map: TiledMap, ctx: CanvasRenderingContext2D): void {
    for (const layer of map.data.layers) {
        switch (layer.type) {
            case 'imagelayer':
                renderImageLayer(position, layer, ctx);
                break;
            case 'tilelayer':
                renderTileLayer(position, layer, map.spriteSheet, map.options.scale, ctx);
                break;
        }
    }
}

export default (ctx: CanvasRenderingContext2D): Renderer => (scene: Scene): void => {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (const currentEntity of Object.values(scene.gameEntities).filter((e): boolean => e.hasComponent('Position'))) {
        const position = currentEntity.get('Position');

        if (currentEntity.hasComponent('Box')) renderBox(position, currentEntity.get('Box'), ctx);

        if (currentEntity.hasComponent('Label')) renderLabel(position, currentEntity.get('Label'), ctx);

        if (currentEntity.hasComponent('Sprite')) renderSprite(position, currentEntity.get('Sprite'), ctx);

        if (currentEntity.hasComponent('AnimatedSprite'))
            renderAnimatedSprite(position, currentEntity.get('AnimatedSprite'), ctx);

        if (currentEntity.hasComponent('TiledMap')) renderTiledMap(position, currentEntity.get('TiledMap'), ctx);
    }
};
