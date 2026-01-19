const mongoose = require('mongoose')
require('dotenv').config()


mongoose.set('strictQuery', false)


const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url)

  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })


const personSchema = new mongoose.Schema({
  name: { type: String,    minLength: 3,    required: true  },
  number: { type: String,     validate: {
    validator: (num) => {
      const splitArray = num.split('-')
      let regex = /^\d+$/
      if (splitArray.length===2 &&
            splitArray[0].length<=2 &&
            splitArray[0].length>0 &&
            regex.test(splitArray[0]) &&
            regex.test(splitArray[1]) && num.length>=9
      ){
        return true
      }
      else
        return false
    },
    message: 'Incorrect number format'
  } }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)