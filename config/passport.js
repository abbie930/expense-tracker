const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')

const User = require('../models/user')

module.exports = (app) => {
  // initialize the Passport module
  app.use(passport.initialize())
  app.use(passport.session())

  // set login LocalStrategy
  passport.use(
    new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, async (req, email, password, done) => {
      try {
        const user = await User.findOne({ email })
        if (!user) {
          return done(null, false, req.flash('failure_msg', '這個 email 還沒有註冊過！'))
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
          return done(null, false, req.flash('failure_msg', 'Email 或 密碼 不正確！'))
        } else {
          return done(null, user)
        }
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