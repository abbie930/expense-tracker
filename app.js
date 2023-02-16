const express = require('express')
const { engine } = require('express-handlebars')
const bodyParser = require('body-parser')
const routes = require('./routes')
const handlebarsHelpers = require('./config/handlebars-helpers')



if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
require('./config/mongoose')

const app = express()
const port = 3000


app.engine('handlebars', engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.set('views', './views')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(routes)


app.listen(port, () => {
  console.log(`Express is running on http://localhost:${port}`)
})