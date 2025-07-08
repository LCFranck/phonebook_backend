const Person = require('./models/person')
require('dotenv').config()
const express = require('express')
const app = express()
const http = require('http')
const morgan = require('morgan')
//const cors = require('cors')

app.use(express.static('dist'))
app.use(express.json())
app.use(morgan('tiny'))
//app.use(requestLogger)


morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


app.get('/', (request, response) => {
  response.send('<h1>Hello , Welcome to my phonebook!</h1>')
})


app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})


app.get('/api/info', (request, response) => {
  const time = new Date()
  Person.find({}).then(persons => {
    const length = persons.length

  const html = `
    <p> Phonebook has info for ${length} people </p>
    <p> ${time} </p>`
    response.send(html)})
})

/* app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  Person.find({}).then(persons => {
  const person = persons.find((person) => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
  })}) */

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {

      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
    //.catch(error => {
     // console.log(error)
     // response.status(400).send({ error: 'malformatted id' })
     // response.status(500).end()
   // })
})







/* app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  Person.find({}).then(persons => {
  persons = persons.filter((person) => person.id !== id)

  response.status(204).end()})

  
}) */

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).end()
      }

      person.name = name
      person.number = number

      return person.save().then((updatedperson) => {
        response.json(updatedperson)
      })
    })
    .catch(error => next(error))
})

/* const generateId = () => {
  const randomID = Math.floor(Math.random() * 1000);
  return String(randomID)
} */

app.post('/api/persons', (request, response, next) => {

  console.log("started posting")
  
  const body = request.body

  /* if (!body.name) {
    return response.status(400).json({ error: 'name missing' })
  } */
  
    if (!body.name) {
      return response.status(400).json({
        error: 'name missing',
      })
    }

    else if (!body.number) {
      return response.status(400).json({
        error: 'number missing',
      })
    }

  const person = new Person({
      name: body.name, 
      number: body.number,
  })

  console.log(body.name)
  if (person.name && person.number){
      person.save().then(result => {
      console.log('person saved!')
      response.status(201).json(result)
      })
      .catch(error => next(error))

       
  }
  
  })

  const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })

  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)




const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
