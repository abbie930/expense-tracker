const express = require('express')
const router = express.Router()

const Record = require('../../models/record')

// 定義首頁路由
router.get('/', async (req, res) => {
  try {
    const records = await Record.find().lean()
    res.render('index', { records })
  } catch (error) {
    console.log(error)
  }
})
// 匯出路由模組
module.exports = router
