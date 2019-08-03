<h1 align="center">
  <b>@11ways/color</b>
</h1>
<div align="center">
  <!-- CI - TravisCI -->
  <a href="https://travis-ci.org/11ways/color">
    <img src="https://img.shields.io/travis/typicode/husky/master.svg?label=Mac%20OSX%20%26%20Linux" alt="Mac/Linux Build Status" />
  </a>

  <!-- CI - AppVeyor -->
  <a href="https://ci.appveyor.com/project/11ways/color">
    <img src="https://img.shields.io/appveyor/ci/11ways/color/master.svg?label=Windows" alt="Windows Build status" />
  </a>

  <!-- Coverage - Codecov -->
  <a href="https://codecov.io/gh/11ways/color">
    <img src="https://img.shields.io/codecov/c/github/11ways/color/master.svg" alt="Codecov Coverage report" />
  </a>

  <!-- DM - Snyk -->
  <a href="https://snyk.io/test/github/11ways/color?targetFile=package.json">
    <img src="https://snyk.io/test/github/11ways/color/badge.svg?targetFile=package.json" alt="Known Vulnerabilities" />
  </a>

  <!-- DM - David -->
  <a href="https://david-dm.org/11ways/color">
    <img src="https://david-dm.org/11ways/color/status.svg" alt="Dependency Status" />
  </a>
</div>

<div align="center">
  <!-- Version - npm -->
  <a href="https://www.npmjs.com/package/node-skeleton">
    <img src="https://img.shields.io/npm/v/node-skeleton.svg" alt="Latest version on npm" />
  </a>

  <!-- License - MIT -->
  <a href="https://github.com/11ways/color#license">
    <img src="https://img.shields.io/github/license/11ways/color.svg" alt="Project license" />
  </a>
</div>
<br>
<div align="center">
  🌈 Color type for JavaScript
</div>
<div align="center">
  <sub>
    Coded with ❤️ by <a href="#authors">Jelle De Loecker</a>.
  </sub>
</div>


## Introduction

Working with color instances

## Install

```bash
npm install @11ways/color
```

## Usage

```js
var Color = require('@11ways/color');
```

## API

### Constructors

```js
var yellow = new Color('yellow');
var yellow = new Color('#ffff00');
var yellow = new Color('hsla(60, 100%, 50%, 1)');
var yellow = new Color({r: 255, g: 255, b: 0});
```

### #luminosity ⇒ `number`

The WCAG luminosity of the color.
This can also be used as a setter, though it will only attempt to approximate it.

### #whiten(ratio) ⇒ `this`

Using the HWB model, 
whiten the current color by adding the current whiteness * the given ratio.

If the whiteness is currently 0, the ratio is added as-is.

### #blacken(ratio) ⇒ `this`

Using the HWB model, 
blacken the current color by adding the current blakcness * the given ratio.

If the blackness is currently 0, the ratio is added as-is.

### #lighten(ratio) ⇒ `this`

Using the HSL model, 
lighten the current color by adding the current lightness * the given ratio.

If the lightness is currently 0, the ratio is added as-is.

### #darken(ratio) ⇒ `this`

Using the HSL model, 
darken the current color by subtracting the current lightness * the given ratio.

If the lightness is currently 0, nothing is changed.

### #contrast(other_color) ⇒ `number`

Calculate the contrast between this and the other color.

### #makeReadable(other_color, target_contrast = 7.1, allow_changing_other_color = true) ⇒ `boolean`

Make this readable on the given color.

## Contributing
Contributions are REALLY welcome.
Please check the [contributing guidelines](.github/contributing.md) for more details. Thanks!

## Authors
- **Jelle De Loecker** -  *Follow* me on *Github* ([:octocat:@skerit](https://github.com/skerit)) and on  *Twitter* ([🐦@skeriten](http://twitter.com/intent/user?screen_name=skeriten))

See also the list of [contributors](https://github.com/11ways/color/contributors) who participated in this project.

## License
This project is licensed under the MIT License - see the [LICENSE](https://github.com/11ways/color/LICENSE) file for details.
