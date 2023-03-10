const bcrypt = require('bcryptjs')
const { users, records } = require('../recordList')
const User = require('../user')
const Category = require('../category')
const Record = require('../record')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const db = require('../../config/mongoose')

db.once('open', async () => {
  try {
    //get all category
    const categoriesFromDB = await Category.find().lean()

    await Promise.all(
      users.map(async (user, user_index) => {
        const { name, email, password } = user
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        // create user model
        const createdUser = await User.create({
          name,
          email,
          password: hashedPassword,
        })

        // assign corresponding record for each user(record: 1,2,3, => user1, record: 4, 5 => user2)
        const recordList = user_index ? records.slice(3) : records.slice(0, 3)
        await Promise.all(
          recordList.map(async (record) => {
            // get the value of the record
            const { name, date, amount, category } = record
            // Find the corresponding category id according to the category name
            const categoryData = categoriesFromDB.find((data) => data.name === category)
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
