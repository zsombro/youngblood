# Welcome!

If you're here, that means you've at least considered contributing to Youngblood which is great! I really appreciate the intention to help, however there are a couple of things that I'd like to clarify before you jump in with any grand expectations:

- This is very much a hobby project. This means that I only work on it every once in a while when I feel like it and while I have plenty of ideas to make improvements, there is no fixed roadmap or schedule
- As a consequence, the code is also far from being professional and while I'm striving to improve code quality with every update, I have no intention of evolving this into some "enterprise grade" solution.

# How to contribute?

While there are no big, competitive ambitions behind this project, I do believe it has some potential and there are worthwhile things you can help with that are currently severly lacking:

- **Documentation**: this probably sounds lame at first, but trust me, it matters! Another big benefit of improving doc strings and the Wiki is that you have to become familiar with the codebase to do it effectively
- **Optimization**: Youngblood is very much being developed along a "core first, shine last" kind of philosophy and I think this becomes immediately apparent the first time you try to do heavier rendering tasks using the engine. I have a couple of ideas on how to improve speed, but I'm open to suggestions from folks who are well versed in optimizing!
- **New features**: there are many things that are fundamentally missing from this engine and while I think it's easy to find them, I hope to put together some sort of list eventually that could help people looking to contribute

# Things to keep in mind

I've already covered earlier that this is not a super professional enterprise framework, but I still have a few coding practices and design decisions that I constantly want to keep in mind.

## Code

The code is written in TypeScript and I do believe that strict static typing can lead to more reliable and predictable code, so I would like to ask that every contributor follows this and uses explicit types wherever possible. If contributors ever join I'm going to setup a few commit hooks that perform checks on coding practices and formatting.

## Design and architecture

If you've read the Wiki, you probably already know that Youngblood is built on a very elementary interpretation of Entity-Component-System designs, which means that there are a few ground rules and constraints to work with:

- *Entities* do not contain properties of their own except for an id, which is added automatically. They do contain a list of *Components* though
- *Components* do not contain any sort of logic. They are purely data, which means that the *Entities* that contain them are also just a collection of data by consequence
- *Systems* contain the actual logic that operates on the *Components* contained within Entities
  - **Ideally, the update function of your *Systems* should be pure functions**

There are a couple of other concepts that have been adden onto these core mechanisms, so let's cover those too:

- Scenes are a basic unit of separation for the engine. They have their own collection of Entities and Systems. They can be paused or switched between. **Scenes are not meant to reach into each other (at least not yet and definitely not in a monkey patching sort of way)**
- I will admit that Services are very loosely defined here, but basically they are a means to provide access to various browser APIs and custom APIs that are relevant to building games.
- Renderers are basically functions that accept a Scene and do whatever. The engine doesn't care about the outcome because right now it really is irrelevant. Your custom renderer can draw onto a canvas, a WebGL canvas, send it over WebSockets or to a printer, it really doesn't matter. The default renderer uses a regular 2D canvas. All rendering functions are pure functions and I'd love to keep it that way, but I have a suspicion that it will be hard to improve performance without introducing some statefulness.

