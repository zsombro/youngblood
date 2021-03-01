import { Scene } from './scene';
import { Animation } from './component';

export type Renderer = (scene: Scene) => void;

export default (ctx: CanvasRenderingContext2D): Renderer => (scene: Scene): void => {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    var cur: any;
    for (var e in scene.gameEntities) {
        cur = scene.gameEntities[e];

        // This basic shape is more of a testing thing
        if (cur.hasComponents(['Box', 'Position'])) {
            ctx.fillStyle = cur.Box.fillStyle;

            ctx.fillRect(cur.Position.x, cur.Position.y, cur.Box.width, cur.Box.height);
        }

        if (cur.hasComponents(['Label', 'Position'])) {
            ctx.fillStyle = cur.Label.color;

            ctx.fillText(cur.Label.txt, cur.Position.x, cur.Position.y);
        }

        // Render a single sprite
        if (cur.hasComponents(['Sprite', 'Position'])) {
            ctx.drawImage(cur.Sprite.spriteSource, cur.Position.x, cur.Position.y);
        }

        // Render an animated sprite
        if (cur.hasComponents(['AnimatedSprite', 'Position'])) {
            var c = cur.get('AnimatedSprite');
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
