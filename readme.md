# generator-chrome-ninja

**Chrome extension generator.** Comes with feature and permission picker, [gulp](http://gulpjs.com), [browserify](https://github.com/substack/node-browserify), [babelify](https://github.com/babel/babelify), React scaffolding (ES6 or ES5) via [bare-react](https://github.com/ironSource/node-generator-bare-react), livereload, packaging via [nom](https://github.com/ironSource/node-generator-nom), [imagemin](https://github.com/sindresorhus/gulp-imagemin), l18n, zipping, [parcelify](https://github.com/rotundasoftware/parcelify) for styles and lastly pre-build configuration with [config-prompt](https://github.com/ironSource/node-config-prompt).

[![npm status](http://img.shields.io/npm/v/generator-chrome-ninja.svg?style=flat-square)](https://www.npmjs.org/package/generator-chrome-ninja)  [![Dependency status](https://img.shields.io/david/ironsource/node-generator-chrome-ninja.svg?style=flat-square)](https://david-dm.org/ironsource/node-generator-chrome-ninja)

![demo](https://github.com/ironSource/node-generator-chrome-ninja/raw/master/demo.gif)

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

## license and acknowledgments

[MIT](http://opensource.org/licenses/MIT) © [ironSource](http://www.ironsrc.com/). Templates and questions adapted from [generator-chrome-extension](https://github.com/yeoman/generator-chrome-extension) under [BSD license](http://opensource.org/licenses/bsd-license.php) © Yeoman. Yeoman icons are [CC BY 4.0](http://creativecommons.org/licenses/by/4.0/) © Yeoman.
