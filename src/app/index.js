var { Base } = require('yeoman-generator')

const self = module.exports = class ChromeGenerator extends Base {
  constructor(args, options, config) {
    super(args, options, config)
  }

  build() {
    // This doesn't make much sense, until we split build into several subgenerators
    this.composeWith('chrome-ext:build', { options: this.options, args: [] }, {
      local: require.resolve('../build'),
      link: 'strong'
    })
  }
}
