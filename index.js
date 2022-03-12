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

// get info about the collection 
app.get("/info", (request, response, next) => {
    Contact.countDocuments({}).then(numOfDocs => {
        response.send(`
        <p>You have ${numOfDocs} contacts your phonebook.</p>
        <p>${getCurrentDate()}</p>
        `)
    })
    .catch(error => next(error))
})

//get all persons
app.get("/api/persons", (request, response, next) => {
    Contact.find({}).then(people => {
        response.json(people)
    })
    .catch(error => next(error))

})

//get individual person
app.get("/api/persons/:id", (request, response, next) => {
    Contact.findById(request.params.id).then(person => {
        if(person) {
            response.json(person)
        } else {
            response.status(404).send("404 - Error - Person not found!")
        }
    })
    .catch(error => next(error))
})

// Delete Individual Person
app.delete('/api/persons/:id', (request, response, next) => {    
  Contact.findByIdAndRemove(request.params.id)
    .then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))
})

// Add New Person
app.post('/api/persons', (request, response, next) => {
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
    .catch(error => next(error))
})

// Update a person
app.put('/api/persons/:id', (request, response, next) => {
    const { name, number } = request.body

    Contact.findByIdAndUpdate(
        request.params.id,
        { name, number },
        { new: true, runValidators: true, context: 'query' }
    )
        .then(updatedPerson => {
            if (updatedPerson === null) {
                return response.status(404).end()
            }
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if(error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id'})
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
    
    next(error)
}

app.use(errorHandler)
  
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})