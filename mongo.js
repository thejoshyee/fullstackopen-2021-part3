const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password> <name> <number>')
    process.exit(1)
  }
  
  const password = process.argv[2]
  const name = process.argv[3]
  const number = process.argv[4]
  
  const url =
    `mongodb+srv://joshyee:${password}@cluster0.ejtbw.mongodb.net/phonebook?retryWrites=true&w=majority`
  
  mongoose.connect(url)
  
  const contactSchema = new mongoose.Schema({
    name: String,
    number: String,
  })
  
  const Contact = mongoose.model('contact', contactSchema)
  
  const contact = new Contact({
    name: name,
    number: number,
  })

  
  contact.save().then(result => {
    console.log('The contact was saved!')
    mongoose.connection.close()
  })

// Contact.find({}).then(result => {
//     result.forEach(contact => {
//       console.log(contact)
//     })
//     mongoose.connection.close()
//   })
