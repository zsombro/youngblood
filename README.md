![Build status](https://travis-ci.com/zsombro/youngblood.svg?branch=master) ![npm](https://img.shields.io/npm/v/youngblood) ![npm bundle size](https://img.shields.io/bundlephobia/min/youngblood) 
# youngblood.js

`youngblood.js` is a simple game development framework for web browsers, written in TypeScript. The aim of this framework is to be
simple to use and understand. The JavaScript code for setting it up is just a few lines of code:

```javascript
<canvas></canvas>
<script src="youngblood.js"></script>
<script>
  new yb.Game()
    .startRendering();
</script>
```

You can also find the package on NPM, which means that you can use it from a proper setup by installing it:

`npm install youngblood`

And then importing the stuff you need in your code:

```javascript
import { Game } from `youngblood`;
```

# Getting Started

- [Read the Wiki](https://github.com/zsombro/youngblood/wiki) on how to get started with Youngblood
- Look at some quick and dirty examples in [the 'examples' folder of this repositorry](https://github.com/zsombro/youngblood/tree/master/examples)
- [Check out this repository](https://github.com/zsombro/youngblood-example-project) to see a working example with bundling

# Contributing

To start working on the code, you just have to

1. Clone the repo
2. `npm install`
3. `npm build`

At this point, you should be able to run the examples included with this codebase! If you would like to contribute, [please read the contribution guide](https://github.com/zsombro/youngblood/blob/master/CONTRIBUTING.md) before doing so!
