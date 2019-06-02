![Build status](https://travis-ci.com/zsombro/youngblood.svg?branch=master)
# youngblood.js

`youngblood.js` is a simple game development framework for web browsers, written in TypeScript. The aim of this framework is to be
simple to use and understand. The JavaScript code for a very basic setup is just a few lines of code:

```javascript
<canvas id="canvas"></canvas>
<script src="youngblood.js"></script>
<script>
  var g = new yb.Game(document.getElementById('canvas').getContext('2d'));
  
  g.startRendering(60);
</script>
```
This won't do anything though. Keep reading to learn how to do *actual* stuff!

# Basics
Youngblood.js builds on a modern game development pattern called Entity-Component-System. The idea behind ECS is that every entity 
in your game is just data that is described by it's components and handled by systems that you specify. Components can be added, removed
or changed on the fly and your systems immediately respond to these changes. *However, it's crucial to understand that components don't
contain game logic.* Defining an Entity in Youngblood.js looks like this:

```javascript
var e = new yb.Entity(); // at this point, your entity also receives a unique numeral identifier
e.addComponent(new yb.Position(0, 0));

scene.addEntity(e); // let's assume that 'scene' was defined earlier
```

It's important to note that an Entity can only hold one instance of given component, so for example, nothing can have two positions
at the same time. Obviously if you're trying to describe a unique game mechanic that requires this possibility, you can come up with
a custom Component that allows this.

# Defining a scene

Another very important concept in Youngblood.js is the *scene system*. Scenes are the basic building blocks of your game that basically
separate menus, cutscenes, levels or anything that contains a very different set of game mechanics. Every game in Youngblood.js **must**
at least one scene! Scenes are self-contained, they all have their separate set of entities and systems. Defining one is super easy:

```javascript
var s = new yb.Scene({
  sceneId: 'scene1',
  init: initFunction,
  alwaysInitialize: false
});
```

# Systems

Systems are the heart of your game. They will contain the game logic that handles operations on the entities that make
up your game. A system in Youngblood.js consists of two main things: a list of components they require and a function that will do the actual magic. When the game loops through your entities, it will check if a given entity has every component required
before passing it to a given system. You can register them in the *init function* of your scene like this:

```javascript
function movementSystem(entity) {
    entity.Position.x += entity.Velocity.x;
    entity.Position.y += entity.Velocity.y;
}

function initFunction() {
  this.registerSystem({
    systemId: 'movementSystem',
    requiredComponents: ['Position', 'Velocity'],
    update: movementSystem
  });
  
  *...some more code...*
}
```

# Plans, To-Dos, Missing stuff

This is a very early version of the framework which only contains the bare basics. Lots of rendering options, input handling, asset
management and audio playback features are missing. I also don't work on this framework all the time, just when I have the time
and a few ideas on how to improve it.
