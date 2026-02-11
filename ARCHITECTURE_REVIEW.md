# Youngblood.js - Architectural Review

**Date:** 2026-02-11  
**Reviewer:** GitHub Copilot  
**Repository:** zsombro/youngblood  
**Purpose:** Comprehensive code architecture review focusing on soundness, patterns, and consistency

---

## Executive Summary

Youngblood.js is a **simple game development framework** for web browsers built on TypeScript. The codebase implements an **Entity-Component-System (ECS)** architecture pattern, which is an excellent choice for game development. Overall, the architecture is **sound and well-structured**, with clear separation of concerns and good adherence to ECS principles.

**Key Strengths:**
- Clean ECS implementation with proper separation of entities, components, and systems
- Well-organized service layer with dependency injection
- Good use of TypeScript for type safety
- Modular and extensible design

**Areas for Improvement:**
- Inconsistent error handling patterns
- Some type safety gaps (use of `any`)
- Event system implementation has architectural concerns
- Missing documentation for complex systems
- Test coverage could be expanded

---

## 1. Architectural Pattern Analysis

### 1.1 Entity-Component-System (ECS) Pattern ✅

**Assessment: EXCELLENT**

The codebase implements a textbook ECS architecture:

- **Entities** (`entity.ts`): Simple data containers with a unique ID
- **Components** (`components/component.ts`): Pure data structures (no behavior)
- **Systems** (`system.ts`, `systems/`): Pure logic that operates on entities with specific components

**Strengths:**
```typescript
// Clean component definition using factory pattern
export const transform = component<Transform>('transform', { 
    position: { x: 0, y: 0 }, 
    rotation: 0, 
    scale: 1 
})

// Systems correctly depend only on component types
export const VelocitySystem: System = {
    id: 'velocitySystem',
    requiredComponents: ['transform', 'velocity'],
    update: function(entity) {
        const pos = entity.get(transform)
        const vel = entity.get(velocity)
        pos.position.x += vel.x
        pos.position.y += vel.y
    }
};
```

**Recommendation:** This is well-done. Continue this pattern for all new systems and components.

---

## 2. Code Organization & Structure

### 2.1 Directory Structure ✅

**Assessment: GOOD**

```
src/
├── components/          # Component definitions
├── services/           # Service layer (input, audio, assets, events)
├── systems/           # Game systems (physics, audio, script)
├── entity.ts          # Entity implementation
├── scene.ts           # Scene management
├── game.ts            # Main game loop
└── renderer.ts        # Rendering system
```

**Strengths:**
- Clear separation by architectural layer
- Services are properly isolated
- Systems have their own directory

**Minor Issues:**
- `system.ts` contains both the interface AND three system implementations (VelocitySystem, InputMappingSystem, TiledMapSystem)
- These should be moved to `systems/` directory for consistency

**Recommendation:**
```
Move VelocitySystem → systems/velocitySystem.ts
Move InputMappingSystem → systems/inputMappingSystem.ts  
Move TiledMapSystem → systems/tiledMapSystem.ts
```

---

## 3. Type Safety & TypeScript Usage

### 3.1 Type Safety Issues ⚠️

**Assessment: NEEDS IMPROVEMENT**

**Issue 1: Excessive use of `any`**
```typescript
// entity.ts line 8
[x: string]: Component<any> | Function | string

// component.ts line 1
/* eslint-disable @typescript-eslint/no-explicit-any */
```

**Issue 2: Type coercion in Entity**
```typescript
// entity.ts - Dynamic property access loses type safety
public get<T>(component: string | ComponentFunction<T>): T {
    return this[ctype(component)] as T;  // Using 'as' - bypasses type checking
}
```

**Issue 3: Missing null checks**
```typescript
// scene.ts line 89
public removeEntity(id: string): void {
    this.gameEntities[this.gameEntities.findIndex(e => e.id === id)] = undefined
    // If entity not found, findIndex returns -1, setting this.gameEntities[-1] = undefined
}
```

**Recommendations:**
1. Replace `any` with proper generic types where possible
2. Add runtime null/undefined checks before array access
3. Consider using `Map` instead of dynamic object properties for Entity storage
4. Enable stricter TypeScript compiler options

---

## 4. Service Layer & Dependency Injection

### 4.1 Service Architecture ✅

**Assessment: GOOD**

The service layer is well-designed with clear interfaces:

```typescript
export interface ISceneServices {
    input: InputManager;
    audio: AudioManager;
    assets: AssetLoader;
    event: { dispatch(event: string, params: unknown): void, on(...): void };
    game: { switchToScene(name: string): void };
}
```

**Strengths:**
- Services are injected into scenes and systems
- Clear separation of concerns
- Services are stateful where needed (InputManager, AudioManager)

**Minor Issue:**
The `event` service interface is simplified and doesn't expose the full EventManager:
```typescript
event: {
    dispatch: this.eventManager.dispatch.bind(this.eventManager),
    on: this.eventManager.on.bind(this.eventManager),
}
```

This is actually GOOD - it's the Facade pattern limiting the API surface.

---

## 5. Event System Architecture

### 5.1 EventManager Implementation ⚠️

**Assessment: ARCHITECTURAL CONCERN**

**Issue: The event system has a significant design flaw**

```typescript
// eventmanager.ts
public on(event: string, callback: Function) {
    this.executionQueue
        .filter(e => e.event === event)
        .forEach(e => callback(e.params))
}
```

**Problems:**
1. **`on()` doesn't register listeners** - it immediately executes callbacks for events already in the queue
2. **No persistent subscription** - listeners aren't stored for future events
3. **Timing issues** - `emptyQueue()` is called at end of frame, but systems call `on()` during update

**Example of problematic usage:**
```typescript
// audiosystem.ts - This doesn't work as expected!
update(e: Entity, scene: Scene, services: ISceneServices) {
    services.event.on('audio.play_sound', (e: AudioPlaybackOptions) => {
        services.audio.playSound(e.audioBuffer, e.channelId)
    })
}
```

This callback will only fire if `audio.play_sound` was dispatched in the CURRENT frame before this system runs.

**Recommendation:**
Rewrite EventManager to use a proper pub/sub pattern:
```typescript
private listeners: Map<string, Function[]> = new Map();

public on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
        this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
}

public dispatch(event: string, params: object) {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(cb => cb(params));
}
```

---

## 6. Consistency Issues

### 6.1 Error Handling ⚠️

**Assessment: INCONSISTENT**

Different approaches used across the codebase:

**Pattern 1: Console error + early return**
```typescript
// game.ts line 145
if (this.gameScenes[sceneId] == null) {
    console.error(`Scene doesn't exist: ${sceneId}`);
    return this;
}
```

**Pattern 2: Throw exception**
```typescript
// game.ts line 66
if (!canvas)
    throw new Error("No canvas element was found in the document");
```

**Pattern 3: Silent failure**
```typescript
// scene.ts line 89
public removeEntity(id: string): void {
    this.gameEntities[this.gameEntities.findIndex(e => e.id === id)] = undefined
    // No error if entity doesn't exist
}
```

**Recommendation:**
Establish consistent error handling guidelines:
- **Throw errors** for programmer mistakes (invalid config, missing required params)
- **Log warnings** for recoverable issues (entity not found)
- **Return error codes/objects** for expected failures in user-facing APIs

### 6.2 Mutation vs. Immutability ⚠️

**Assessment: MIXED APPROACH**

The codebase is **mostly mutable** (which is fine for games), but inconsistent:

**Direct mutation (common):**
```typescript
// system.ts line 24
pos.position.x += vel.x
pos.position.y += vel.y
```

**Creation of new objects (rare):**
```typescript
// renderer.ts line 114
renderTransform = transform(tf).data;  // Creates new object
```

**Recommendation:**
For game performance, **direct mutation is appropriate**. However, document this choice and be consistent. The renderer's creation of `renderTransform` is good for not mutating game state during rendering.

### 6.3 Variable Declarations ⚠️

**Assessment: INCONSISTENT**

Mixed usage of `var`, `let`, and `const`:

```typescript
// entity.ts line 33 - uses 'let'
let len = componentArray.length;

// entity.ts line 37 - uses 'var'
for (var i = 0; i < len; i++) {

// component.ts line 137 - uses 'var'
for (var i = 0; i < data.mapping.length; i++) {
```

**Recommendation:**
- Use `const` by default
- Use `let` when reassignment is needed
- Never use `var` (it has function scope, not block scope)

---

## 7. System Update Loop

### 7.1 Game Loop Implementation ✅

**Assessment: GOOD**

```typescript
private update(frameData: FrameData): void {
    for (let i = 0; i < this.currentScene.systems.length; i++) {
        const system = this.currentScene.systems[i];

        system.onBeforeUpdate?.(this.currentScene, this.services, frameData)

        if (system.requiredComponents.length === 0) {
            system.update(null, this.currentScene, this.services, frameData);
            continue;
        }

        for (let j = 0; j < this.currentScene.gameEntities.length; j++) {
            const entity: Entity = this.currentScene.gameEntities[j];
            
            if (system.requiredComponents && entity.hasComponents(system.requiredComponents))
                system.update(entity, this.currentScene, this.services, frameData);
        }
    }

    this.eventManager.emptyQueue();
}
```

**Strengths:**
- Proper system ordering (systems run in registration order)
- `onBeforeUpdate` lifecycle hook
- Efficient filtering (only entities with required components)

**Potential Performance Issue:**
```typescript
entity.hasComponents(system.requiredComponents)  // Called every frame for every entity
```

For large entity counts, consider caching which entities match which systems.

**Recommendation for Performance (Future):**
```typescript
// When entity components change, update system caches
private systemEntityCache: Map<string, Entity[]> = new Map();

private updateSystemCache(system: System): void {
    this.systemEntityCache.set(
        system.id, 
        this.gameEntities.filter(e => e.hasComponents(system.requiredComponents))
    );
}
```

---

## 8. Scene Management

### 8.1 Scene Lifecycle ⚠️

**Assessment: MOSTLY GOOD, WITH ISSUES**

```typescript
// scene.ts
public removeEntity(id: string): void {
    this.gameEntities[this.gameEntities.findIndex(e => e.id === id)] = undefined
}

public unregisterSystem(id: String): void {
    this.systems[this.systems.findIndex(e => e.id === id)] = undefined
}
```

**Critical Bug:**
These methods leave `undefined` holes in arrays! This will cause errors in the game loop:

```typescript
for (let j = 0; j < this.currentScene.gameEntities.length; j++) {
    const entity: Entity = this.currentScene.gameEntities[j];
    // entity could be undefined!
    if (system.requiredComponents && entity.hasComponents(...))  // CRASH!
}
```

**Recommendation:**
```typescript
public removeEntity(id: string): void {
    const index = this.gameEntities.findIndex(e => e && e.id === id);
    if (index !== -1) {
        this.gameEntities.splice(index, 1);
    }
}

public unregisterSystem(id: String): void {
    const index = this.systems.findIndex(e => e && e.id === id);
    if (index !== -1) {
        this.systems.splice(index, 1);
    }
}
```

---

## 9. Component Design

### 9.1 Component Factory Pattern ✅

**Assessment: EXCELLENT**

The component factory pattern is elegant:

```typescript
export function component<T>(type: string, defaults?: T) {
    return (data?: T): Component<T> => (
        defaults ? { type, data: { ...defaults, ...data } } : { type, data }
    )
}

// Usage
export const transform = component<Transform>('transform', { 
    position: { x: 0, y: 0 }, 
    rotation: 0, 
    scale: 1 
})

// In game code
transform({ position: { x: 10, y: 20 }})  
// Returns: { type: 'transform', data: { position: { x: 10, y: 20 }, rotation: 0, scale: 1 }}
```

**Strengths:**
- Type-safe
- Default values
- Easy to use
- Consistent API

### 9.2 Special Case: inputMapping ⚠️

**Assessment: INCONSISTENT**

```typescript
export const inputMapping = (data?: InputMapping): Component<InputMapping> => {
    const map: { [index: string]: boolean } = {}

    if (!data) return { type: 'inputMapping', data: { mapping: [] } }

    for (var i = 0; i < data.mapping.length; i++) {
        map[data.mapping[i].name] = false;
    }

    return { type: 'inputMapping', data: { ...data, ...map } }
}
```

This is implemented differently than other components (not using the `component()` factory). While this provides custom initialization logic, it breaks the pattern.

**Recommendation:**
Keep it as-is (the custom logic is needed), but document why it's different.

---

## 10. Rendering System

### 10.1 Renderer Architecture ✅

**Assessment: GOOD**

The renderer is a **functional closure** that captures the canvas context:

```typescript
export default (ctx: CanvasRenderingContext2D): Renderer => (scene: Scene): void => {
    // Rendering logic
}
```

**Strengths:**
- Separates rendering from game logic
- Can be easily swapped (setRenderer)
- Camera system is well-integrated

**Issue: Render transform mutation**
```typescript
renderTransform = transform(tf).data;  // Creates new object
if (cam) {
    renderTransform.position.x = ...  // Then mutates it
    renderTransform.position.y = ...
}
```

This is fine, but the pattern of "create then mutate" is a bit awkward.

**Recommendation:**
Either fully immutable OR fully mutable:
```typescript
// Option 1: Pure immutable
renderTransform = cam 
    ? { ...tf, position: { x: ..., y: ... }}
    : tf;

// Option 2: Pure mutable (better for performance)
const renderTransform = { ...tf };  // Shallow copy
if (cam) {
    renderTransform.position.x = ...
}
```

---

## 11. Physics Integration

### 11.1 PhysicsSystem ✅

**Assessment: GOOD**

```typescript
export class PhysicsSystem implements System {
    private engine = Engine.create()
    private worldBodyCache: { [key: string]: Body } = {}

    update(e: Entity, ...) {
        if (!this.worldBodyCache[e.id]) {
            this.worldBodyCache[e.id] = Bodies.rectangle(...)
            Composite.add(this.engine.world, this.worldBodyCache[e.id])
        }
        
        e.get(transform).position.x = this.worldBodyCache[e.id].position.x;
        e.get(transform).position.y = this.worldBodyCache[e.id].position.y;
    }

    onBeforeUpdate(...) {
        Engine.update(this.engine, frameData.delta)
    }
}
```

**Strengths:**
- Proper lifecycle (onBeforeUpdate for physics engine step)
- Caching of physics bodies
- Clean integration with Matter.js

**Issue: Memory Leak**
Bodies are added to `worldBodyCache` but never removed when entities are destroyed.

**Recommendation:**
Add cleanup:
```typescript
onSceneSwitched(scene: Scene, services: ISceneServices) {
    // Clean up old bodies
    Object.values(this.worldBodyCache).forEach(body => {
        Composite.remove(this.engine.world, body);
    });
    this.worldBodyCache = {};
}
```

---

## 12. Public API Design

### 12.1 Fluent Interface ✅

**Assessment: EXCELLENT**

The main `Game` class uses a fluent interface:

```typescript
new Game()
    .setFramerate(60)
    .addScene(scene1)
    .addScene(scene2)
    .switchToScene('scene1')
    .startRendering();
```

This is great for developer experience!

### 12.2 Export Structure ⚠️

**Assessment: GOOD, MINOR ISSUES**

```typescript
// main.ts - Central export file
export {
    Game,
    Scene,
    Entity,
    transform, Transform,
    velocity, Vector2,
    // ... many more
};
```

**Issue:**
The example code uses a global `yb` namespace:
```javascript
new yb.Game()
yb.transform({ ... })
```

But the npm package exports don't match this structure. Need to verify Webpack config creates the `yb` global.

---

## 13. Testing

### 13.1 Test Coverage ⚠️

**Assessment: INSUFFICIENT**

**Current state:**
- 17 source files
- 5 test files
- Tests only for: `game.ts`, `entity.ts`, `scene.ts`, `renderer.ts`, `assetloader.ts`

**Missing tests:**
- Systems (VelocitySystem, InputMappingSystem, PhysicsSystem, etc.)
- Services (InputManager, AudioManager, EventManager)
- FramerateManager
- Component factories

### 13.2 Test Quality ✅

**Assessment: GOOD**

Existing tests are well-written:

```typescript
it('should add components', (): void => {
    const e = new Entity();
    const c = c1();
    e.addComponent(c);

    expect(e['c1']).to.be.equal(c);
});
```

**Recommendation:**
Expand test coverage, especially for:
1. EventManager (critical due to architectural issues)
2. Physics system
3. Scene entity/system management edge cases

---

## 14. Documentation

### 14.1 Code Documentation ⚠️

**Assessment: MINIMAL**

**TSDoc comments:** Present in `game.ts` public methods
```typescript
/**
 * Returns a new `Game` instance.
 */
public constructor() { ... }
```

**Missing documentation:**
- Component interfaces lack descriptions
- System interfaces not documented
- Service classes have minimal comments
- No architectural overview in code

**Recommendation:**
Add comprehensive TSDoc comments for:
- All public APIs
- Complex algorithms
- System requirements and behaviors

---

## 15. Potential Bugs & Edge Cases

### 15.1 Critical Issues

**Bug 1: Array holes in entity/system removal** (Documented in Section 8.1)
```typescript
// scene.ts lines 73, 89
this.systems[index] = undefined  // Leaves undefined in array
this.gameEntities[index] = undefined
```

**Bug 2: EventManager doesn't work as intended** (Documented in Section 5.1)
```typescript
// eventmanager.ts
public on(event: string, callback: Function) {
    this.executionQueue.filter(e => e.event === event).forEach(e => callback(e.params))
}
// This executes immediately, doesn't register for future events!
```

**Bug 3: Missing entity in test**
```typescript
// entity.test.ts line 18
it('should use IDs if provided', (): void => {
    const e = new Entity();  // No ID provided!
    expect(e.id).to.be.equal('aaa');  // This will fail
});
```

### 15.2 Potential Issues

**Issue 1: Scene initialization timing**
```typescript
// game.ts line 118
if (this.currentScene == null) this.switchToScene(sceneOptions.sceneId);
```
First scene is auto-switched to, but what if user wants control?

**Issue 2: No entity capacity limits**
Could add thousands of entities with no warning or performance degradation handling.

**Issue 3: AudioChannel pause/resume**
```typescript
// audiomanager.ts line 107
pause() {
    this.pausedAt = Date.now() - this.startedPlayingAt
    this.playing.disconnect()
    this.playing = null  // Can't resume after this!
}
```

---

## 16. Security Considerations

### 16.1 XSS Concerns ⚠️

**Issue: Label rendering**
```typescript
// renderer.ts line 16
ctx.fillText(l.txt, transform.position.x, transform.position.y);
```

Canvas text rendering is safe from XSS, but if `txt` comes from user input, consider sanitization.

### 16.2 Asset Loading ✅

**Assessment: SAFE**

Asset loading uses proper async/await and doesn't execute code:
```typescript
async function fetchObject(url: string): Promise<unknown> {
    return fetch(url).then((response: Response): Promise<unknown> => response.json());
}
```

---

## 17. Performance Considerations

### 17.1 Current Performance Characteristics

**Good:**
- Framerate limiting (60 FPS default)
- Efficient entity-component filtering
- Canvas rendering optimization (`imageSmoothingEnabled = false`)

**Could be improved:**
- System-entity cache (as discussed in Section 7.1)
- Object pooling for frequently created objects
- Spatial partitioning for collision detection (not implemented yet)

---

## 18. Recommendations Summary

### 18.1 Critical (Fix Now)

1. **Fix array removal bugs** in `scene.ts` (removeEntity, unregisterSystem)
2. **Rewrite EventManager** to use proper pub/sub pattern
3. **Fix entity.test.ts** - test is broken

### 18.2 High Priority

4. **Add null checks** for array access operations
5. **Consistent error handling** strategy
6. **Expand test coverage** especially for EventManager and Systems
7. **Document EventManager intended usage** if keeping current implementation

### 18.3 Medium Priority

8. **Reduce use of `any`** type
9. **Use `const`/`let` instead of `var`**
10. **Move systems from system.ts** to systems/ directory
11. **Add memory cleanup** for PhysicsSystem
12. **Add TSDoc comments** for public APIs

### 18.4 Low Priority (Polish)

13. Consider entity-system caching for performance
14. Add configuration validation
15. Consider immutability in renderer
16. Add capacity limits/warnings

---

## 19. Overall Assessment

### 19.1 Architecture Grade: **B+**

**Strengths:**
- Solid ECS implementation
- Clean separation of concerns
- Good use of TypeScript patterns
- Extensible and modular design
- Great public API (fluent interface)

**Weaknesses:**
- EventManager implementation is problematic
- Array mutation bugs in scene management
- Inconsistent error handling
- Limited test coverage
- Type safety gaps

### 19.2 Pattern Consistency Grade: **B**

**Consistent:**
- Component factory pattern
- System interface
- Service injection

**Inconsistent:**
- Error handling (throw vs. log vs. silent)
- Variable declarations (var/let/const)
- Event handling approach

---

## 20. Conclusion

**Youngblood.js has a fundamentally sound architecture** based on well-established ECS patterns. The codebase is clean, readable, and well-organized. The main areas needing attention are:

1. **Bug fixes** (array mutations, event system)
2. **Consistency** (error handling, variable declarations)
3. **Testing** (expand coverage)
4. **Documentation** (add TSDoc comments)

With these improvements, this would be an **excellent** game framework. The core architecture is solid and provides a great foundation for growth.

**Recommendation:** Address the critical bugs first, then focus on consistency and documentation. The architecture itself is well-designed and should be maintained as-is.
