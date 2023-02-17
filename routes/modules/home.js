const express = require('express')
const router = express.Router()
const dayjs = require('dayjs')

const Record = require('../../models/record')
const Category = require('../../models/category')


// home router
router.get('/', async (req, res) => {
  try {
    const userId = req.user._id
    // get all category
    const categories = await Category.find().lean()
    // get categoryId data from dropdown list
    const categorySelected = req.query.categoryId

    //use populate() => let Record and Category associate
    let recordList = await Record.find({ userId }).populate('categoryId').lean().sort({ date: 'asc' })

    const selectList = recordList.filter((record) => {
      return record.categoryId._id.toString() === categorySelected
    })

    if (selectList.length > 0) {
      recordList = selectList
    } 
    //date format
    recordList.forEach((data) => {
      data.date = dayjs(data.date).format('YYYY/MM/DD')
    })
    //total amount
    const totalAmount = recordList.reduce((acc, cur) => acc + cur.amount, 0)

    res.render('index', { recordList, totalAmount, categories, categorySelected })
  } catch (err) {
    console.log(err)
  }
})

module.exports = router
