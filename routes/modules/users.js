const express = require('express')
const router = express.Router()

const User = require('../../models/user')

//get login page
router.get('/login', (req, res) => {
  res.render('login')
})


router.post('/register', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  try { 
    const user = await User.findOne({ email })
    if (user) {
      console.log('User already exists.')
      res.render('register', {
        name,
        email,
        password,
        confirmPassword,
      })
    } else {
      await User.create({
        name,
        email,
        password,
      })
      res.redirect('/')
    }
  } catch (err) {
    console.log(err)
  }
})


//get register Page
router.get('/register', (req, res) => {
  res.render('register')
})




module.exports = router
