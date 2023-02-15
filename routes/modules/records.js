const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')


//get new record page
router.get('/new', async (req, res) => {
  const categories = await Category.find().lean()
  return res.render('new', { categories })
})

//post new record
router.post('/', async (req, res) => {
  try {
    const mockUserId = "63eba5ab576f32517f1e58d4"
    const { name, date, categoryId, amount } = req.body
    await Record.create({
      name,
      date,
      categoryId,
      amount,
      userId: mockUserId,
    })
    res.redirect('/')
  } catch (err) {
    console.log(err)
  }
})

//

module.exports = router