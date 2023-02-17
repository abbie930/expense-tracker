const express = require('express')
const router = express.Router()

const User = require('../../models/user')

//get login page
router.get('/login', (req, res) => {
  res.render('login')
})


//login router
router.post('/login', (req, res) => {

})


//get register Page
router.get('/register', (req, res) => {
  res.render('register')
})




module.exports = router
