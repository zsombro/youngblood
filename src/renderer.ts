import { AnimatedSprite, Animation, Box, Position, Label, Sprite } from './component';
import { Scene } from './scene';
import TiledMap, { Layer } from './tiledMap';

export type Renderer = (entity: Scene) => void;

function renderBox(p: Position, b: Box, ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = b.fillStyle;
    ctx.fillRect(p.x, p.y, b.width, b.height);
}

function renderLabel(p: Position, l: Label, ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = l.color;
    ctx.fillText(l.txt, p.x, p.y);
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
    throw new Error('Function not implemented.');
}

function renderTileLayer(position: Position, layer: Layer, ctx: CanvasRenderingContext2D): void {
    throw new Error('Function not implemented.');
}

function renderObjectLayer(position: Position, layer: Layer, ctx: CanvasRenderingContext2D): void {
    throw new Error('Function not implemented.');
}

function renderTiledMap(position: Position, map: TiledMap, ctx: CanvasRenderingContext2D): void {
    for (const layer of map.data.layers) {
        ({
            imagelayer: renderImageLayer,
            tilelayer: renderTileLayer,
            objectgroup: renderObjectLayer,
        }[layer.type](position, layer, ctx));
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
