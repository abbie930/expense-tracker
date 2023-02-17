const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
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

  // set FacebookStrategy
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK,
        profileFields: ['email', 'displayName'],
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          if (!profile) {
            console.log(err)
            res.sendStatus(500)
            return
          }
          console.log(profile)
          const { name, email } = profile._json
          const user = await User.findOne({ email })
          if (user) {
            return done(null, user)
          } else {
            const randomPassword = Math.random().toString(36).slice(-8)
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(randomPassword, salt)
            const newUserFromFb = await User.create({
              name,
              email,
              password: hashedPassword,
            })
            return done(null, newUserFromFb)
          }
        } catch (err) {
          return done(err, false, req.flash('failure_msg', 'Facebook Verification Failed'))
        }
      }
    )
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
