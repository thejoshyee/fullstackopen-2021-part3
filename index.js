require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const Contact = require('./models/contact')

const moment = require('moment')

const getCurrentDate = () => moment().format('MMMM Do YYYY, h:mm:ss a')
const generateId = () => {
    const maxId = persons.length > 0 
        ? Math.max(...persons.map(p => p.id))
        : 0
    return maxId + 1
}

app.use(cors())

app.use(express.json())

app.use(express.static('build'))


var morgan = require('morgan')
morgan.token('person', req => { 
    return JSON.stringify(req.body) 
})

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :person"))


//root page
app.get("/", (request, response) => {
    response.send(`
        <p>Hello it's me...</p>
    `)
})

//info page
app.get("/info", (request, response) => {
    response.send(`
        <p>Phonebook has info for ${persons.length} people.</p>
        <p>${getCurrentDate()}</p>
    `)
})

//get all persons
app.get("/api/persons", (request, response) => {
    Contact.find({}).then(people => {
        response.json(people)
    })

})

//get individual person
app.get("/api/persons/:id", (request, response) => {
    Contact.findById(request.params.id).then(person => {
        if(person) {
            response.json(person)
        } else {
            response.status(404).send("404 - Error - Person not found!")
        }
    })
})

// Delete Individual Person
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    
    Contact.find({}).then(people => {
        people.filter(person => person.id !== id)
    })


    response.status(204).end()
})


// Add New Person
app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: "Name is missing"
        })
    } 

    if (!body.number) {
        return response.status(400).json({
            error: "Number is missing"
        })
    }

    // if (person.name.find(person => person.name === body.name)) {
    //     return response.status(400).json({
    //         error: "Name must be unique"
    //     })
    // }

    const person = new Contact({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }

app.use(unknownEndpoint)

  

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})