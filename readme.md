# generator-chrome-ninja

**Chrome extension generator.** Comes with feature and permission picker, React scaffolding (ES6 or ES5) via [bare-react](https://github.com/ironSource/node-generator-bare-react), [hot reloading](https://github.com/vweevers/livereactload-chrome), [gulp](http://gulpjs.com) tasks (ES6 or ES5), packaging via [nom](https://github.com/ironSource/node-generator-nom), [browserify](https://github.com/substack/node-browserify), [babelify](https://github.com/babel/babelify), [image minification](https://github.com/sindresorhus/gulp-imagemin), l18n, zipping and lastly pre-build configuration with [config-prompt](https://github.com/ironSource/node-config-prompt).

[![npm status](http://img.shields.io/npm/v/generator-chrome-ninja.svg?style=flat-square)](https://www.npmjs.org/package/generator-chrome-ninja)  [![Dependency status](https://img.shields.io/david/ironsource/node-generator-chrome-ninja.svg?style=flat-square)](https://david-dm.org/ironsource/node-generator-chrome-ninja)

## demo

*Note: outdated.*

![demo](https://github.com/ironSource/node-generator-chrome-ninja/raw/master/demo.gif)

## hot reloading

![hot reloading demo](https://github.com/vweevers/livereactload-chrome/raw/master/demo.gif)

## usage

```
mkdir my-extension
cd my-extension
yo chrome-ninja
gulp develop
```

Then go to `chrome://extensions`, enable developer mode and load `./dist` as an unpacked extension.

## options

```
--help -h       # Print the generator's options and usage
--skip-cache    # Do not remember prompt answers
--skip-install  # Do not automatically install dependencies
```

## install

Install Yeoman and generator-chrome-ninja globally with [npm](https://npmjs.org):

```
npm i yo generator-chrome-ninja -g
```

## changelog

### 2.0.0

- Hot reloading of background scripts, content scripts, popups, and option pages.
- Offer choice between ES5 and ES6, make ES6 modules opt-in. This
applies to extension scripts, React components, the gulpfile and gulp tasks.
- Add ES7 decorator support
- Have version field of `manifest.json` follow `package.json` version
- Pin Babel to 5. We can't move to Babel 6 until  [babel-plugin-react-transform#46](https://github.com/gaearon/babel-plugin-react-transform/issues/46) and [livereactload#78](https://github.com/milankinen/livereactload/issues/78) have been resolved.
- Remove all things CSS: live reloading and bundling CSS (parcelify), preprocessing (LESS/SASS). We're likely to move to CSS modules, please follow [#3](https://github.com/ironSource/node-generator-chrome-ninja/issues/3) for updates. Or, for an example of PostCSS postprocessing, check out the [cssnext](https://github.com/ironSource/node-generator-chrome-ninja/tree/feature-cssnext) branch.
- Upgrade to [bare-react](https://github.com/ironSource/node-generator-bare-react) 2.0.0 and [nom](https://github.com/ironSource/node-generator-nom) 2.0.0

## license and acknowledgments

[MIT](http://opensource.org/licenses/MIT) © [ironSource](http://www.ironsrc.com/). Templates and questions adapted from [generator-chrome-extension](https://github.com/yeoman/generator-chrome-extension) under [BSD license](http://opensource.org/licenses/bsd-license.php) © Yeoman. Yeoman icons are [CC BY 4.0](http://creativecommons.org/licenses/by/4.0/) © Yeoman.
