const express = require('express')
const router = express.Router()
const dayjs = require('dayjs')
const Record = require('../../models/record')
const Category = require('../../models/category')


//get new record page
router.get('/new', async (req, res) => {
  const categories = await Category.find().lean()
  return res.render('new', { categories })
})

//create record
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

//get edit record page
router.get('/:id/edit', async (req, res) => {
  try {
    const recordId = req.params.id
    //get record data
    const record = await Record.findById(recordId).lean()
    //render category
    const categories = await Category.find().lean()
    //date format
    record.date = dayjs(record.date).format('YYYY/MM/DD')
    res.render('edit', { record, categories, categoryId: record.categoryId})
  } catch (err) {
    console.log(err)
  }
})

//edit record
router.put('/:id', async (req, res) => {
  try {
    const userId = '63eba5ab576f32517f1e58d4'
    // const userId = req.user._id
    const _id = req.params.id
    const record = req.body
    await Record.findOneAndUpdate({ _id, userId }, { ...record, userId })
    return res.redirect('/')
  } catch (error) {
    console.log(error)
  }
})


module.exports = router