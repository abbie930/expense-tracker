const Handlebars = require('handlebars')

Handlebars.registerHelper('ifSelect', function (a, b, options) {
  if (String(a) === String(b)) {
    return options.fn(this)
  }
  return options.inverse(this)
})