const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')

module.exports = (app) => {
  // initialize the Passport module
  app.use(passport.initialize())
  app.use(passport.session())

  // set login LocalStrategy
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
      try {
        const user = await User.findOne({ email })
        if (!user) {
          return done(null, false, { message: 'That email is not registered!' })
        }
        if (user.password !== password) {
          return done(null, false, { message: 'Email or Password incorrect.' })
        }
        return done(null, user)
      } catch (err) {
        return done(err, false)
      }
    })
  )

  // set serialization and deserialization
  passport.serializeUser(async (user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id).lean()
      done(null, user)
    } catch (err) {
      done(err, null)
    }
  })
}