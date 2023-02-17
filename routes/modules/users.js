const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')

const User = require('../../models/user')

// get login page
router.get('/login', (req, res) => {
  res.render('login')
})

// add middleware to verify request login status
router.post(
  '/login',
  (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
      req.flash('warning_msg', '請輸入 email 和密碼')
      return res.redirect('/users/login')
    }
    next()
  },
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true,
  })
)

// get register Page
router.get('/register', (req, res) => {
  res.render('register')
})


// register verify
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body
    const errors = []
    if (!name || !email || !password || !confirmPassword) {
      errors.push({ message: '所有欄位都是必填。' })
    }
    if (password !== confirmPassword) {
      errors.push({ message: '密碼與確認密碼不相符！' })
    }
    if (errors.length) {
      return res.render('register', {
        errors,
        name,
        email,
        password,
        confirmPassword,
      })
    }
    const user = await User.findOne({ email })
    if (user) {
      errors.push({ message: '這個 Email 已經註冊過了。' })
      res.render('register', {
        errors,
        name,
        email,
        password,
        confirmPassword,
      })
    } else {
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)
      await User.create({
        name,
        email,
        password: hashedPassword,
      })
      res.redirect('/')
    }
  } catch (err) {
    console.log(err)
  }
})


// logout
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '你已經成功登出。')
  res.redirect('/users/login')
})

module.exports = router
