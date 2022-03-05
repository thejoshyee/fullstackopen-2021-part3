const express = require('express')
const app = express()

const moment = require('moment')

const getCurrentDate = () => moment().format('MMMM Do YYYY, h:mm:ss a')
const generateId = () => {
    const maxId = persons.length > 0 
        ? Math.max(...persons.map(p => p.id))
        : 0
    return maxId + 1
}
app.use(express.json())


var morgan = require('morgan')
morgan.token('person', req => { 
    return JSON.stringify(req.body) 
})

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :person"))



let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
//root page
app.get("/", (request, response) => {
    response.send(`
        <p>Hello</p>
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
    response.json(persons)
})

//get individual person
app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if(person) {
        response.json(person)
    } else {
        response.status(404).send("404 - Error - Person not found!")
    }
})

// Delete Individual Person
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

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

    if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({
            error: "Name must be unique"
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)
    response.json(person)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }

app.use(unknownEndpoint)

  

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})