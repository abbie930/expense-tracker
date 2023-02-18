const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()
const dayjs = require('dayjs')

const Record = require('../../models/record')
const Category = require('../../models/category')


// home router
router.get('/', async (req, res) => {
  try {
    const userId = req.user._id
    // get categoryId data from dropdown list
    const categorySelected = req.query

    const categories = await Category.find().lean()
    let recordList = await Record.find({ userId })
      .populate('categoryId')
      .lean()
      .sort({ date: 'asc' } && { categoryId: 'asc' })

      
    // filter records by category
    const recordSelected = recordList.filter((record) => {
      return record.categoryId._id.toString() === categorySelected.categoryId
    })

    if (categorySelected.categoryId) {
      recordList = recordSelected
    }

    const isEmptyRecord = recordList.length ? false : true

    //date format
    recordList.forEach((data) => {
      data.date = dayjs(data.date).format('YYYY/MM/DD')
    })
    //total amount
    const totalAmount = recordList.reduce((acc, cur) => acc + cur.amount, 0)

    res.render('index', { recordList, totalAmount, categories, categorySelected, isEmptyRecord })
  } catch (err) {
    console.log(err)
  }
})

module.exports = router
