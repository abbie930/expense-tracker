const db = require('../../config/mongoose')
const { users, records } = require('../recordList')
const User = require('../user')
const Category = require('../category')
const Record = require('../record')

db.once('open', async () => {
  try {
    //get all category
    const categoriesFromDB = await Category.find().lean()

    await Promise.all(
      users.map(async (user, user_index) => {
        // create user model
        const createdUser = await User.create({
          ...user,
        })
        console.log('users created')

        // assign corresponding record for each user(record: 1,2,3, => user1, record: 4, 5 => user2)
        const recordList = user_index ? records.slice(3) : records.slice(0, 3)
        console.log('1', records.slice(3))
        console.log('2', records.slice(0, 3))
        await Promise.all(
          recordList.map(async (record) => {
            console.log('record', record)
            // get the value of the record
            const { name, date, amount, category } = record
            // Find the corresponding category id according to the category name
            const categoryData = categoriesFromDB.find((data) => data.name === category)
            console.log('categoryData', categoryData)
            // Integrate the category id and user id into the record
            await Record.create({
              name,
              date,
              amount,
              categoryId: categoryData._id,
              userId: createdUser._id,
            })
          })
        )
      })
    )
    console.log('recordSeeder created')
    process.exit()
  } catch (err) {
    console.log(err)
  }
})
