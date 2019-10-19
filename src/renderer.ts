import { Scene } from './scene';
import { AnimatedSprite, Animation } from './component';

export type Renderer = (scene: Scene) => void;

export default (ctx: CanvasRenderingContext2D): Renderer => (scene: Scene): void => {
    var cur: any;
    for (var e in scene.gameEntities) {
        cur = scene.gameEntities[e];

        // This basic shape is more of a testing thing
        if (cur.hasComponent('Box') && cur.hasComponent('Position')) {
            ctx.fillStyle = cur.Box.fillStyle;

            ctx.fillRect(cur.Position.x, cur.Position.y, cur.Box.width, cur.Box.height);
        }

        if (cur.hasComponent('Label') && cur.hasComponent('Position')) {
            ctx.fillStyle = cur.Label.color;

            ctx.fillText(cur.Label.txt, cur.Position.x, cur.Position.y);
        }

        // Render a single sprite
        if (cur.hasComponent('Sprite') && cur.hasComponent('Position')) {
            ctx.drawImage(cur.Sprite.spriteSource, cur.Position.x, cur.Position.y);
        }

        // Render an animated sprite
        if (cur.hasComponents(['AnimatedSprite', 'Position'])) {
            var c: AnimatedSprite = cur.AnimatedSprite;
            var f: Animation = c.animationSheet[c.animationName];

            if (c.flip) {
                ctx.translate(cur.Position.x, 0);
                ctx.scale(-1, 1);
            }

            ctx.drawImage(
                c.spriteSource,
                f.startX + c.currentFrame * f.frameWidth,
                f.startY,
                f.frameWidth,
                f.frameHeight,
                c.flip ? -c.scale * f.frameWidth : cur.Position.x,
                cur.Position.y,
                f.frameWidth * c.scale,
                f.frameHeight * c.scale,
            );

            if (c.flip) ctx.setTransform(1, 0, 0, 1, 0, 0);

            if (c.isPlaying) {
                if (c.currentFrame >= f.frames - 1) c.currentFrame = 0;
                else c.currentFrame++;
            }
        }
    }
};
