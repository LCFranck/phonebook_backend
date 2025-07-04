

const express = require('express')
const app = express()
const http = require('http')
const morgan = require('morgan')
const cors = require('cors')



let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.use(express.json())
app.use(morgan('tiny'))
app.use(express.static('dist'))


//app.use(cors())

morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

//:param[id] 



app.get('/', (request, response) => {
  response.send('<h1>Hello , Welcome to my phonebook!</h1>')
})

app.get('/api/persons', (request, response) => {
  
  response.json(persons)
})


app.get('/api/info', (request, response) => {
  const time = new Date()
  const length = persons.length

  const html = `
    <p> Phonebook has info for ${length} people </p>
    <p> ${time} </p>`
    response.send(html)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find((person) => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter((person) => person.id !== id)

  response.status(204).end()
})

const generateId = () => {
  const randomID = Math.floor(Math.random() * 1000);
  return String(randomID)
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  

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

  if(persons.find(p => p.name === body.name)){
    return response.status(400).json({
      error: 'name must be unique',
    })
  }


  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(person)

  response.json(person)
})



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})