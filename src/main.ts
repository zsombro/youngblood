import Game from './game';
import { Scene } from './scene';
import type { SceneOptions, SceneInitCallback, ISceneServices } from './scene';
import Entity from './entity';
import EntityManager from './entityManager';

import {
    component,
    transform,
    velocity,
    sprite,
    animatedSprite,
    box,
    inputMapping,
    label,
    camera,
} from './components/component';
import type {
    Transform,
    Vector2,
    Sprite,
    AnimatedSprite,
    AnimatedSpriteOptions,
    AnimationSheet,
    Box,
    InputMapping,
    Label,
    Camera,
} from './components/component';

import tiledMap from './components/tiledMap';
import type { TiledMapData, TiledSheetData, TiledMap } from './components/tiledMap';

import type Component from './components/component';

import { CameraMovementSystem, InputMappingSystem } from './system';
import type { System } from './system';
import { PhysicsSystem, physicsObject } from './systems/physicsSystem';
import type { PhysicsObject } from './systems/physicsSystem';

export {
    Game,
    Scene,
    SceneOptions,
    ISceneServices as SceneServices,
    SceneInitCallback,
    System,
    Entity,
    EntityManager,
    component, Component,
    transform, Transform,
    velocity, Vector2,
    animatedSprite, AnimatedSprite,
    sprite, Sprite,
    AnimatedSpriteOptions,
    AnimationSheet,
    box, Box,
    camera, Camera,
    inputMapping, InputMapping,
    InputMappingSystem,
    CameraMovementSystem,
    PhysicsSystem,
    physicsObject, PhysicsObject,
    label, Label,
    tiledMap, TiledMap,
    TiledMapData,
    TiledSheetData,
};
