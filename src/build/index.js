const paramCase = require('param-case')
    , bootswatch = require('bootswatch/api/3.json').themes
    , bareReact = require.resolve('generator-bare-react')

const { Base } = require('yeoman-generator')

const DEV_DEPENDENCIES =
  { 'babelify': '~6.4.0'
  , 'browserify': null // use latest
  , 'envify': null
  , 'trash': '~2.0.0' // promisified as of 3.0
  , 'gulp-zip': null
  , 'run-sequence': null
  , 'through2': null
  , 'uglifyify': null
  , 'watchify': null
  , 'concat-stream': null
  , 'path-exists': null
  , 'gulp-imagemin': null
  , 'config-prompt': '~1.0.0'
  , 'in-production': null
  , 'vinyl-imitate': '~1.0.0'
  , 'add-transforms': '~1.0.0' }

const REACT_DEV_DEPENDENCIES =
  { 'babel-plugin-react-transform': '~1.1.1'
  , 'livereactload': '~2.1.0'
  , 'react-proxy': '~1.1.1'
  , 'livereactload-chrome': '~1.0.2' }

function bootswatchNames() {
  return bootswatch.map(theme => theme.name)
}

const self = module.exports = class ChromeGenerator extends Base {
  // TODO: rename all methods, use priorities
  askFor() {
    // In case a module was already generated or created
    let { name, description } = this.fs.readJSON('package.json', {})

    // Use existing manifest values as defaults
    let { permissions = [], browser_action, page_action, options_page, omnibox
        , content_scripts }
        = this.fs.readJSON('app/manifest.json', {})

    let questions = [
      {
        name: 'name',
        message: 'What would you like to call this extension?',
        default: name || (this.appname ? paramCase(this.appname) : 'my-chrome-extension'),
        validate: (val) => paramCase(val).length ? true : 'You have to provide a name',
        filter: paramCase
      },
      {
        name: 'description',
        message: 'How would you like to describe this extension?',
        default: description || 'My Chrome Extension',
        validate: (val) => val.trim().length ? true : 'You have to provide a description',
        filter: (s) => s.trim()
      },
      {
        type: 'list',
        name: 'action',
        message: 'Would you like to use UI Action?',
        default: browser_action ? 'Browser' : page_action ? 'Page' : 'No',
        choices: [
          'No',
          'Browser',
          'Page'
        ]
      },
      {
        type: 'checkbox',
        name: 'uifeatures',
        message: 'Would you like more UI Features?',
        choices: [{
          value: 'options',
          name: 'Options Page',
          checked: !!options_page
        }, {
          value: 'contentscript',
          name: 'Content Scripts',
          checked: !!content_scripts
        }, {
          value: 'omnibox',
          name: 'Omnibox',
          checked: !!omnibox
        }]
      },
      {
        type: 'confirm',
        name: 'bootstrap',
        store: true,
        message: 'Would you like to use Bootstrap?',
        default: false
      },
      {
        type: 'list',
        name: 'bootstrapTheme',
        message: 'Which Bootstrap theme would you like?',
        when: (answers) => answers.bootstrap === true,
        default: 'none',
        store: true,
        choices: [ 'none', 'default' ].concat(bootswatchNames())
      },
      {
        type: 'checkbox',
        name: 'permissions',
        message: 'Which permissions do you need?',
        choices: [{
          value: 'tabs',
          name: 'Tabs',
          checked: permissions.indexOf('tabs') >= 0
        }, {
          value: 'bookmarks',
          name: 'Bookmarks',
          checked: permissions.indexOf('bookmarks') >= 0
        }, {
          value: 'cookies',
          name: 'Cookies',
          checked: permissions.indexOf('cookies') >= 0
        }, {
          value: 'history',
          name: 'History',
          checked: permissions.indexOf('history') >= 0
        }, {
          value: 'management',
          name: 'Management',
          checked: permissions.indexOf('management') >= 0
        }]
      }
    ];

    let done = this.async()

    this.prompt(questions, (answers) => {
      let isChecked = (choices, value) => choices.indexOf(value) >= 0
      let escape = (s) => s.replace(/\"/g, '\\"')

      let name = this.appname = escape(answers.name)
        , description = escape(answers.description)

      // TODO: set display value for question
      if (answers.bootstrapTheme === 'none') answers.bootstrapTheme = null

      this.ctx = answers
      this.manifest = { name, description, permissions: {} }

      this.manifest.action = answers.action === 'No' ? 0 : answers.action === 'Browser' ? 1 : 2
      this.manifest.options = isChecked(answers.uifeatures, 'options')
      this.manifest.omnibox = isChecked(answers.uifeatures, 'omnibox')
      this.manifest.contentscript = isChecked(answers.uifeatures, 'contentscript')
      this.manifest.permissions.tabs = isChecked(answers.permissions, 'tabs')
      this.manifest.permissions.bookmarks = isChecked(answers.permissions, 'bookmarks')
      this.manifest.permissions.cookies = isChecked(answers.permissions, 'cookies')
      this.manifest.permissions.history = isChecked(answers.permissions, 'history')
      this.manifest.permissions.management = isChecked(answers.permissions, 'management')

      let dependencies = {}
        , devDependencies = { ...DEV_DEPENDENCIES }

      if (this.manifest.action > 0 || this.manifest.options || this.manifest.contentscript) {
        // Put additional babelrc in app dir, with livereactload config
        this._copy('react.babelrc', 'app/.babelrc')

        // Add livereactload dependencies
        devDependencies = { ...devDependencies, ...REACT_DEV_DEPENDENCIES }
      }

      this.composeWith('nom'
        , { options:  { name
                      , description
                      , skipInstall: this.options.skipInstall
                      , skipCache: this.options.skipCache
                      , enable: [ 'gulp'
                                , 'npm'  ]
                      , gulp: { tasks: this.templatePath('tasks') + '/**/*', ctx: this.ctx }
                      , npm:  { cli: false
                              , dependencies
                              , devDependencies }}}
        , { local: require.resolve('generator-nom')
          , link: 'strong' })

      done()
    })
  }

  _addReact(options) {
    let link = { local: bareReact, link: 'strong' }
    this.composeWith('bare-react', { options }, link)
  }

  // TODO: remove legacy code and just stringify manifest as a whole
  manifest() {
    let manifest = {}
      , permissions = []
      , items = []

    // add browser / page action field
    if (this.manifest.action > 0) {
      let action = { default_icon: { 19: 'images/icon-19.png'
                                   , 38: 'images/icon-38.png' }
                   , default_title: this.manifest.name
                   , default_popup: 'lib/popup/popup.html' }

      let type = this.manifest.action === 1 ? 'browser_action' : 'page_action'

      manifest[type] = JSON.stringify(action, null, 2).replace(/\n/g, '\n  ')

      this._addReact
       ({ type: 'app'
        , dest: 'app/lib/popup'
        , name: 'Popup'
        , router: false
        , bootstrap: this.ctx.bootstrap
        , skipInstall: this.options.skipInstall
        , skipCache: this.options.skipCache
        , children: [ 'PopupNinja' ] })
    }

    // add options page field.
    if (this.manifest.options) {
      let options_ui = { page: 'lib/options/options.html', chrome_style: true }

      manifest.options_page = '"lib/options/options.html"'
      manifest.options_ui = JSON.stringify(options_ui, null, 2).replace(/\n/g, '\n  ')

      this._addReact
       ({ type: 'app'
        , skipInstall: this.options.skipInstall
        , skipCache: this.options.skipCache
        , bootstrap: this.ctx.bootstrap
        , dest: 'app/lib/options'
        , name: 'Options' })
    }

    // add omnibox keyword field.
    if (this.manifest.omnibox) {
      let omnibox = { keyword: this.manifest.name }
      manifest.omnibox = JSON.stringify(omnibox, null, 2).replace(/\n/g, '\n  ')
    }

    // add contentscript field.
    if (this.manifest.contentscript) {
      let contentscript = { matches: ['http://*/*', 'https://*/*']
                          , js: ['lib/content-script/index.js']
                          , run_at: 'document_end'
                          , all_frames: false }

      manifest.content_scripts =
        JSON.stringify([contentscript], null, 2).replace(/\n/g, '\n  ')

      this._addReact
       ({ type: 'app'
        , skipInstall: this.options.skipInstall
        , skipCache: this.options.skipCache
        , dest: 'app/lib/content-script'
        , name: 'ContentScript'
        , append: true
        , router: false
        , bootstrap: false })
    }

    // add generate permission field.
    for (let p in this.manifest.permissions) {
      if (this.manifest.permissions[p]) {
        permissions.push(p)
      }
    }

    // add generic match pattern field.
    if (this.manifest.permissions.tabs) {
      permissions.push('http://*/*')
      permissions.push('https://*/*')
    }

    if (permissions.length > 0) {
      manifest.permissions =
        JSON.stringify(permissions, null, 2).replace(/\n/g, '\n  ')
    }

    for (let k in manifest) {
      items.push(['  "', k, '": ', manifest[k]].join(''))
    }

    this.manifest.items = items.length > 0 ? ',\n' + items.join(',\n') : ''

    this._copyTpl('manifest.json', 'app/manifest.json', this.manifest)
  }

  actions() {
    if (this.manifest.action !== 0) {
      this._copy('popup.html', 'app/lib/popup/popup.html')
      this._copy('images/icon-19.png', 'app/images/icon-19.png')
      this._copy('images/icon-38.png', 'app/images/icon-38.png')
      this._copyCSS('app/lib/popup')
    }
  }

  eventpage() {
    let pageName = 'background page'
      , withAction = false
      , action = this.manifest.action

    if (action === 2) {
      pageName = 'event page for Page Action'
      withAction = true
    } else if (action === 1) {
      pageName = 'event page for Browser Action'
      withAction = true
    }

    let ctx = { pageName, withAction }
    this._copyJS('background.js', 'app/lib/background/index.js', ctx)
  }

  optionsHtml() {
    if (this.manifest.options) {
      this._copy('options.html', 'app/lib/options/options.html')
      this._copyCSS('app/lib/options')
    }
  }

  contentscript() {
    if (this.manifest.contentscript) {
      this._copyCSS('app/lib/content-script')
    }
  }

  assets() {
    let messages = '_locales/en/messages.json'

    this._copyTpl(messages, `app/${messages}`, this.manifest)
    this._copy('images/icon-16.png', 'app/images/icon-16.png')
    this._copy('images/icon-128.png', 'app/images/icon-128.png')
  }

  _copy(src, dest = src) {
    this.fs.copy(this.templatePath(src), this.destinationPath(dest))
  }

  _copyTpl(src, dest = src, ctx = {}) {
    this.fs.copyTpl(this.templatePath(src), this.destinationPath(dest), ctx)
  }

  _copyJS(src, dest = src, ctx = {}) {
    this._copyTpl('scripts/' + src, dest, ctx)
  }

  _copyCSS(dest) {
    this._copyTpl('styles/index.css', dest + '/index.css', this.ctx)
  }
}
