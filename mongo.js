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

  if (process.argv.length === 3) {
    Contact.find({}).then(result => {
      console.log("Phonebook: ")
      result.forEach(contact => {
        console.log(contact.name, contact.number)
      })
      mongoose.connection.close()
    })
  } else {
    const contact = new Contact({
      name: name,
      number: number,
    })

    contact.save().then(result => {
      console.log(`Added ${contact.name} Number: ${contact.number} to phonebook`)
      mongoose.connection.close()
    })
  }


