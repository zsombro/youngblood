import { Engine as f, Bodies as b, Composite as x } from "matter-js";
const c = (i) => typeof i == "function" ? i().type : i;
class m {
  constructor(e = crypto.randomUUID()) {
    this.id = e;
  }
  addComponent(e) {
    this[e.type] = e;
  }
  addComponents(e) {
    e.forEach(this.addComponent.bind(this));
  }
  removeComponent(e) {
    delete this[c(e)];
  }
  hasComponent(e) {
    return this[c(e)] != null;
  }
  hasComponents(e) {
    let t = e.length;
    if (!t) return !1;
    for (var s = 0; s < t; s++)
      if (!this.hasComponent(e[s])) return !1;
    return !0;
  }
  get(e) {
    return this[c(e)]?.data;
  }
}
class E {
  constructor(e, t) {
    this.options = null, this.services = null, this.id = e.sceneId, this.initialized = !1, this.alwaysInitialize = e.alwaysInitialize ?? !0, this.initCallback = e.init ?? (() => {
    }), this.options = e, this.services = t, this.gameEntities = [], this.systems = [];
  }
  initialize(e, t) {
    this.options?.systems && this.registerSystems(this.options.systems), this.options?.entities && this.options.entities.forEach((s) => this.addEntity(s(t))), this.initCallback(e, t), this.initialized = !0;
  }
  registerSystem(e) {
    if (this.systems.map((t) => t.id).includes(e.id))
      throw new Error(`System with ID ${e.id} has already been registered!`);
    this.systems.push(e);
  }
  registerSystems(e) {
    e.forEach(this.registerSystem.bind(this));
  }
  unregisterSystem(e) {
    delete this.systems[this.systems.findIndex((t) => t.id === e)];
  }
  addEntity(e) {
    if (e instanceof m)
      this.gameEntities.push(e);
    else {
      const t = new m();
      t.addComponents(e), this.gameEntities.push(t);
    }
    this.services?.event.dispatch("scene.entity_added", e);
  }
  removeEntity(e) {
    delete this.gameEntities[this.gameEntities.findIndex((t) => t.id === e)];
  }
  getEntitiesWith(e) {
    return this.gameEntities.filter((t) => t.hasComponent(e));
  }
}
class M {
  constructor(e) {
    this.pressedKeys = [], window.addEventListener(
      "keydown",
      (t) => {
        this.pressedKeys.indexOf(t.keyCode) === -1 && this.pressedKeys.push(t.keyCode), e.dispatch("input.keydown", { code: t.key });
      },
      !1
    ), window.addEventListener(
      "keyup",
      (t) => {
        this.pressedKeys.splice(this.pressedKeys.indexOf(t.keyCode), 1), e.dispatch("input.keyup", { code: t.key });
      },
      !1
    );
  }
  isPressed(e) {
    return this.pressedKeys.indexOf(e) !== -1;
  }
}
class k {
  constructor() {
    this.audioContext = null, this.channels = {}, this.masterVolume = null;
    try {
      this.audioContext = new AudioContext(), this.masterVolume = this.audioContext.createGain(), this.masterVolume.connect(this.audioContext.destination), this.createChannel("default");
    } catch (e) {
      console.error(e);
    }
  }
  /**
   * Create a new audio channel with it's own volume control.
   * @param id Channel ID. This ID can be used to control this channel individually.
   * @returns 
   */
  createChannel(e) {
    if (this.channels[e]) {
      console.error(`Channel ID ${e} already exists`);
      return;
    }
    if (!this.audioContext || !this.masterVolume) {
      console.error("Audio manager is not initialized");
      return;
    }
    this.channels[e] = new A(e, this.audioContext, this.masterVolume);
  }
  playSound(e, t = "default", s = !1) {
    this.channels[t].loadSound(e), this.channels[t].play();
  }
  pausePlayback(e) {
    this.batchedChannelOperation(e, (t) => t.pause());
  }
  continuePlayback(e) {
    this.batchedChannelOperation(e, (t) => t.play());
  }
  setChannelVolume(e, t) {
    this.channels[e].setVolume(t);
  }
  batchedChannelOperation(e, t) {
    e ? e.forEach((s) => {
      const n = this.channels[s];
      n && t(n);
    }) : Object.values(this.channels).forEach((s) => t(s));
  }
}
class A {
  constructor(e, t, s) {
    this.name = e, this.context = t, this.buffer = null, this.audioNode = t.createGain(), this.audioNode.connect(s), this.playing = null, this.startedPlayingAt = 0, this.pausedAt = 0;
  }
  loadSound(e) {
    this.buffer = e;
  }
  play() {
    if (!this.buffer) throw new Error(`No buffer loaded on Channel ${this.name}`);
    try {
      const e = this.context.createBufferSource();
      e.buffer = this.buffer, e.loop = !1, e.connect(this.audioNode), e.start(0, this.pausedAt / 1e3), this.pausedAt = 0, this.startedPlayingAt = Date.now(), this.playing = e;
    } catch (e) {
      console.error("Audio playback error", e);
    }
  }
  pause() {
    this.playing && (this.pausedAt = Date.now() - this.startedPlayingAt, this.playing.disconnect(), this.playing = null);
  }
  setLoop(e) {
    this.playing && (this.playing.loop = e);
  }
  setVolume(e) {
    this.audioNode.gain.value = e;
  }
}
let d = null;
function T() {
  if (typeof AudioContext > "u")
    throw new Error("AudioContext is not available in this environment");
  return d || (d = new AudioContext()), d;
}
function p(i) {
  return new Promise(
    (e, t) => {
      const s = new Image();
      s.onload = () => e(s), s.onerror = (n) => t(n), s.src = i;
    }
  );
}
async function I(i) {
  return fetch(i).then((e) => e.arrayBuffer()).then((e) => T().decodeAudioData(e));
}
async function j(i) {
  return fetch(i).then((e) => e.json());
}
async function L(i) {
  const t = await (await fetch(i)).json(), s = {
    width: t.width,
    height: t.height,
    layers: []
  };
  for (const n of t.layers)
    switch (n.type) {
      case "imagelayer":
        s.layers.push({ ...n, image: await p(n.image) });
        break;
      case "tilelayer":
        s.layers.push({ ...n, data: n.data });
        break;
      case "objectgroup":
        s.layers.push({ ...n, objects: n.objects });
        break;
    }
  return s;
}
async function F(i) {
  const t = await (await fetch(i)).json();
  return {
    ...t,
    image: await p(t.image)
  };
}
function B(i) {
  const e = i.match(/\.[a-zA-Z0-9]+/g);
  return e ? e[e.length - 1] : "";
}
class P {
  constructor() {
    this.taskQueueLength = 0, this.completedTasks = 0, this.assets = {}, this.loaders = {}, this.registerLoader("image", p), this.registerLoader("audio", I), this.registerLoader("json", j), this.registerLoader("tiled-map", L), this.registerLoader("tiled-set", F);
  }
  registerLoader(e, t) {
    this.loaders[e] = t;
  }
  async load(e) {
    const n = (await (await fetch(e)).json()).assets;
    return this.completedTasks = 0, this.taskQueueLength = n.length, await Promise.all(n.map(this.fetchAsset.bind(this))), this.assets;
  }
  progress() {
    return this.completedTasks / this.taskQueueLength;
  }
  get(e) {
    return this.assets[e];
  }
  async fetchAsset(e) {
    const t = B(e.url), s = e.url.replace(t, "");
    this.assets[s] = await this.loaders[e.type](e.url), this.completedTasks++;
  }
}
function r(i, e) {
  return (t) => e ? { type: i, data: { ...e, ...t } } : { type: i, data: t };
}
const h = r("transform", { position: { x: 0, y: 0 }, rotation: 0, scale: 1 }), q = r("velocity", { x: 0, y: 0 }), g = r("label", { txt: "", color: "white", font: "10px verdana", isVisible: !0 }), y = r("sprite"), w = r("animatedSprite"), S = r("box"), Q = (i) => {
  const e = {};
  if (!i) return { type: "inputMapping", data: { mapping: [] } };
  for (var t = 0; t < i.mapping.length; t++)
    e[i.mapping[t].name] = !1;
  return { type: "inputMapping", data: { ...i, ...e } };
}, u = r("camera", {
  centerX: 0,
  centerY: 0,
  offsetX: 0,
  offsetY: 0,
  drag: 0
}), l = r("tiledMap");
function V(i, e, t) {
  t.fillStyle = e.fillStyle, t.fillRect(i.position.x, i.position.y, e.width, e.height);
}
function z(i, e, t) {
  e.isVisible && (t.fillStyle = e.color, t.font = e.font, t.fillText(e.txt, i.position.x, i.position.y));
}
function D(i, e, t) {
  t.drawImage(e.spriteSource, i.position.x, i.position.y);
}
function O(i, e, t) {
  const s = e.animationSheet[e.animationName];
  e.flip && (t.translate(i.position.x, 0), t.scale(-1, 1)), t.drawImage(
    e.spriteSource,
    s.startX + e.currentFrame * s.frameWidth,
    s.startY,
    s.frameWidth,
    s.frameHeight,
    e.flip ? -e.scale * s.frameWidth : i.position.x,
    i.position.y,
    s.frameWidth * e.scale,
    s.frameHeight * e.scale
  ), e.flip && t.setTransform(1, 0, 0, 1, 0, 0), e.isPlaying && (e.currentFrame >= s.frames - 1 ? e.currentFrame = 0 : e.currentFrame++);
}
function C(i, e, t) {
  t.fillStyle = "magenta", t.fillRect(i.x, i.y, i.width, i.height), t.fillStyle = "black", t.fillText(e, i.x + 10, i.y + 20);
}
function N(i, e, t) {
  if (!e.image) {
    C(e, "Image not found", t);
    return;
  }
  t.drawImage(e.image, e.x, e.y, t.canvas.width, t.canvas.height);
}
function W(i, e) {
  return {
    x: i % e.columns * e.tilewidth - e.tilewidth,
    y: Math.floor(i / e.columns) * e.tileheight
  };
}
function K(i, e, t, s, n) {
  if (!e.data) {
    C(e, "Tile data not found", n);
    return;
  }
  for (let a = 0; a < e.data.length; a++) {
    if (e.data[a] === 0) continue;
    const { x: o, y: v } = W(e.data[a], t);
    n.drawImage(
      t.image,
      o,
      v,
      t.tilewidth,
      t.tileheight,
      i.position.x + a % e.width * (t.tilewidth * s),
      i.position.y + Math.floor(a / e.width) * (t.tileheight * s),
      t.tilewidth * s,
      t.tileheight * s
    );
  }
}
function R(i, e, t) {
  for (const s of e.data.layers)
    switch (s.type) {
      case "imagelayer":
        N(i, s, t);
        break;
      case "tilelayer":
        K(i, s, e.spriteSheet, e.options.scale, t);
        break;
    }
}
const X = (i) => (e) => {
  i.fillStyle = "white", i.fillRect(0, 0, i.canvas.width, i.canvas.height);
  let t = null;
  const s = e.getEntitiesWith(u);
  s.length > 0 && (t = s[0].get(u));
  for (const n of e.getEntitiesWith(h)) {
    const a = n.get(h), o = h(a).data;
    o && (t && (o.position.x = i.canvas.width / 2 + a.position.x - t.centerX + t.offsetX, o.position.y = i.canvas.height / 2 + a.position.y - t.centerY + t.offsetY), n.hasComponent(S) && V(o, n.get(S), i), n.hasComponent(g) && z(o, n.get(g), i), n.hasComponent(y) && D(o, n.get(y), i), n.hasComponent(w) && O(o, n.get(w), i), n.hasComponent(l) && R(o, n.get(l), i));
  }
};
class Y {
  constructor(e) {
    this.fps = 0, this.interval = 0, this.then = 0, this.now = 0, this.delta = 0, this.currentFrame = 0, this.setFramerate(e);
  }
  processFrame(e) {
    this.now = Date.now(), this.delta = this.now - this.then, this.delta > this.interval && (this.then = this.now - this.delta % this.interval, this.currentFrame < this.fps ? this.currentFrame++ : this.currentFrame = 0, e({ delta: this.delta, currentFrame: this.currentFrame }));
  }
  setFramerate(e) {
    this.fps = e, this.then = Date.now(), this.interval = 1e3 / this.fps;
  }
  get framerate() {
    return this.fps;
  }
}
const $ = {
  id: "velocitySystem",
  requiredComponents: ["transform", "velocity"],
  update: function(i) {
    const e = i.get(h), t = i.get(q);
    e.position.x += t.x, e.position.y += t.y;
  }
}, _ = {
  id: "inputMappingSystem",
  requiredComponents: ["inputMapping"],
  update: function(i, e, t) {
    const s = i.get(Q);
    for (let n = 0; n < s.mapping.length; n++) {
      const a = s.mapping[n];
      s[a.name] = t.input.isPressed(a.code);
    }
  }
}, G = {
  id: "tiledMapSystem",
  requiredComponents: ["tiledMap", "transform", "inputMapping"],
  update: function(i) {
    i.get(l);
  }
}, U = {
  id: "cameraMovementSystem",
  requiredComponents: ["transform", "camera"],
  update: function(i) {
    const e = i.get(h), t = i.get(u);
    t.centerX = e.position.x, t.centerY = e.position.y;
  }
};
class H {
  constructor() {
    this.dispatchQueue = [], this.executionQueue = [];
  }
  on(e, t) {
    this.executionQueue.filter((s) => s.event === e).forEach((s) => t(s.params));
  }
  dispatch(e, t) {
    this.dispatchQueue.push({ event: e, params: t });
  }
  emptyQueue() {
    this.executionQueue = this.dispatchQueue, this.dispatchQueue = [];
  }
}
const Z = {
  id: "audioSystem",
  requiredComponents: [],
  update(i, e, t) {
    t.event.on("audio.create_channel", (s) => {
      t.audio.createChannel(s.id);
    }), t.event.on("audio.set_channel_volume", (s) => {
      t.audio.setChannelVolume(s.id, s.value);
    }), t.event.on("audio.play_sound", (s) => {
      t.audio.playSound(s.audioBuffer, s.channelId);
    }), t.event.on("audio.pause", (s) => {
      t.audio.pausePlayback(s.channels);
    }), t.event.on("audio.resume", (s) => {
      t.audio.continuePlayback(s.channels);
    });
  }
}, J = {
  id: "scriptSystem",
  requiredComponents: ["script"],
  update(i, e, t, s) {
    i.get(ee).update(i);
  }
}, ee = r("script"), te = r("physicsObject");
class ie {
  constructor() {
    this.id = "PhysicsSystem", this.requiredComponents = ["transform", "physicsObject"], this.engine = f.create(), this.worldBodyCache = {};
  }
  update(e, t, s, n) {
    const a = e.get(h).position, o = e.get(te);
    this.worldBodyCache[e.id] || (this.worldBodyCache[e.id] = b.rectangle(a.x, a.y, o.width, o.height, { isStatic: o.bodyType === "static" }), x.add(this.engine.world, this.worldBodyCache[e.id])), e.get(h).position.x = this.worldBodyCache[e.id].position.x, e.get(h).position.y = this.worldBodyCache[e.id].position.y;
  }
  onBeforeUpdate(e, t, s) {
    f.update(this.engine, s.delta);
  }
}
class ne {
  /**
   * Returns a new `Game` instance.
   */
  constructor() {
    this.renderer = null, this.framerateManager = new Y(60), this.eventManager = new H(), this.gameScenes = {}, this.currentScene = null, this.services = {
      input: new M(this.eventManager),
      audio: new k(),
      assets: new P(),
      event: {
        dispatch: this.eventManager.dispatch.bind(this.eventManager),
        on: this.eventManager.on.bind(this.eventManager)
      },
      game: {
        switchToScene: this.switchToScene.bind(this)
      }
    }, console.info("Game created");
  }
  /**
   * This is what's gonna kickstart your game when you're done setting it up!
   *
   * @param canvasSelector CSS selector for the `canvas` you want to render into. Leaving this empty assumes
   * you only have one `<canvas>` element on your page. _Irrelevant if you've registered
   * a custom renderer._
   */
  startRendering(e) {
    if (!this.renderer) {
      const t = this.getCanvas(e);
      if (!t)
        throw new Error("No canvas element was found in the document");
      const s = t.getContext("2d");
      if (!s)
        throw new Error("2D rendering context could not be created");
      s.imageSmoothingEnabled = !1, this.setRenderer(X(s));
    }
    this.startSystem(), console.info(`Started rendering at ${this.framerateManager.framerate}fps`);
  }
  /**
   * Set an upper framerate limit. `60` by default!
   * @param fps
   */
  setFramerate(e) {
    return this.framerateManager.setFramerate(e), this;
  }
  /**
   * You can set a custom renderer instead of the default 2D one. It's a function
   * that will be called at the end of every game loop.
   * @param renderingFunction A function that takes a `Scene` object and does something with it.
   */
  setRenderer(e) {
    return this.renderer = e, this;
  }
  /**
   * Register a new `Scene`. You'll need at least one to do anything!
   * @param sceneOptions Settings for your scene, like it's name or how it should be
   * initialized.
   */
  addScene(e) {
    const t = new E(e, this.services);
    return t.registerSystems([
      Z,
      J,
      $,
      _,
      U,
      G,
      new ie()
    ]), this.gameScenes[e.sceneId] = t, this.currentScene == null && this.switchToScene(e.sceneId), console.info(`Scene added: ${e.sceneId}`), this;
  }
  /**
   * Remove a scene from the system.
   * @param sceneId The sceneId you provided when registering the System
   * @returns The scene itself before it's deleted, just in case
   */
  removeScene(e) {
    const t = this.gameScenes[e];
    return delete this.gameScenes[e], t;
  }
  /**
   * Switch to a different scene. Also available as a `SceneService`. If you don't call it
   * before starting the game, it will start with the first one you added.
   * @param sceneId The id provided when the scene was registered
   */
  switchToScene(e) {
    return this.gameScenes[e] == null ? (console.error(`Scene doesn't exist: ${e}`), this) : (this.currentScene = this.gameScenes[e], (!this.currentScene.initialized || this.currentScene.alwaysInitialize) && this.currentScene.initialize(this.currentScene, this.services), this);
  }
  startSystem() {
    window.requestAnimationFrame(() => this.startSystem()), this.framerateManager.processFrame((e) => {
      this.currentScene && this.renderer && (this.update(e), this.renderer(this.currentScene));
    });
  }
  update(e) {
    if (!this.currentScene) return;
    const t = this.currentScene;
    for (let s = 0; s < t.systems.length; s++) {
      const n = t.systems[s];
      if (n.onBeforeUpdate?.(t, this.services, e), n.requiredComponents.length === 0) {
        n.update(null, t, this.services, e);
        continue;
      }
      for (let a = 0; a < t.gameEntities.length; a++) {
        const o = t.gameEntities[a];
        n.requiredComponents && o.hasComponents(n.requiredComponents) && n.update(o, t, this.services, e);
      }
    }
    this.eventManager.emptyQueue();
  }
  getCanvas(e = "canvas") {
    switch (typeof e) {
      case "string":
        return document.querySelector(e);
      case "object":
        return e;
    }
  }
}
export {
  U as CameraMovementSystem,
  m as Entity,
  ne as Game,
  _ as InputMappingSystem,
  ie as PhysicsSystem,
  E as Scene,
  w as animatedSprite,
  S as box,
  u as camera,
  r as component,
  Q as inputMapping,
  g as label,
  te as physicsObject,
  y as sprite,
  l as tiledMap,
  h as transform,
  q as velocity
};
//# sourceMappingURL=youngblood.mjs.map
