const express = require('express')
const router = express.Router()
const dayjs = require('dayjs')
const Record = require('../../models/record')
const Category = require('../../models/category')

// get new record page
router.get('/new', async (req, res) => {
  const categories = await Category.find().lean()
  return res.render('new', { categories })
})

// create record
router.post('/', async (req, res) => {
  try {
    const userId = req.user._id
    const { name, date, categoryId, amount } = req.body
    await Record.create({
      name,
      date,
      categoryId,
      amount,
      userId,
    })
    req.flash('success_msg', '成功新增一筆支出！')
    res.redirect('/')
  } catch (err) {
    console.log(err)
  }
})

// get edit record page
router.get('/:id/edit', async (req, res) => {
  try {
    const userId = req.user._id
    const _id = req.params.id
    //get record data
    const record = await Record.findOne({ _id, userId }).lean()
    //render category
    const categories = await Category.find().lean()
    //date format
    record.date = dayjs(record.date).format('YYYY/MM/DD')
    res.render('edit', { record, categories, categoryId: record.categoryId })
  } catch (err) {
    console.log(err)
  }
})

// edit record
router.put('/:id', async (req, res) => {
  try {
    const userId = req.user._id
    const _id = req.params.id
    const record = req.body
    await Record.findOneAndUpdate({ _id, userId }, { ...record, userId })
    req.flash('success_msg', '編輯成功！')
    return res.redirect('/')
  } catch (err) {
    console.log(err)
  }
})

// delete record
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.user._id
    const _id = req.params.id
    await Record.findOneAndDelete({ _id, userId })
    res.redirect('/')
  } catch (err) {
    console.log(err)
  }
})

module.exports = router