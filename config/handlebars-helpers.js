const Handlebars = require('handlebars')

Handlebars.registerHelper('ifSelect', function (a, b, options) {
  if (a.toString() === b.toString()) {
    return options.fn(this)
  }
  return options.inverse(this)
})
