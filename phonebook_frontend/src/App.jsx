import Person from './components/Person.jsx'
import Filter from './components/Filter.jsx'
import Form from './components/Form.jsx'
import Notification from './components/Notification.jsx'

import { useState, useEffect } from 'react'
import personService from './services/persons.jsx'


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const names = persons.map(person => (person.name))
  const [newFilter, setNewFilter] = useState('')
  const [notifMessage, setNotification] = useState(null) 
  const [notifType, setNotifType] = useState('success') 
  const personsToShow = persons.filter(person => person?.name?.toLowerCase().includes(newFilter.toLowerCase())
)


  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons)
    })
  }, [])


  const addPerson = (event) => {
    event.preventDefault()
    console.log(names);

     const personObject = {
      name: newName,
      number: newNumber,
    }



    const duplicatePerson = persons.find(p => p.name === newName)

    if (duplicatePerson){
      if (window.confirm("Name is already saved, do you want to update the phone number?")) {
        personService.update(duplicatePerson.id, personObject).then((returnedPerson) => {
        setPersons(persons.map(p => p.id !== duplicatePerson.id ? p : returnedPerson))
        setNewName('')
        setNewNumber('')})
        
        setNotifType('success')
        setNotification(` the person '${duplicatePerson.name}' was added`)        
          setTimeout(() => {setNotification(null)}, 5000)

        console.log("updated")
        return
    } 
      else {
        alert(`${newName} is already added to phonebook`);
        console.log("already includes")
        return
    }
    } 


    personService.create(personObject).then((returnedPerson) => {
      setPersons(persons.concat(returnedPerson))
      setNewName('')
      setNewNumber('')

      setNotifType('success')
      setNotification(` the person '${personObject.name}' was added`)        
      setTimeout(() => {setNotification(null)}, 5000)

    }).catch(error => {
      setNotifType('error')
      setNotification(error.response.data.error)  
      setTimeout(() => {setNotification(null)}, 5000)
      console.log(error.response.data.error)
    })
  }

  const handleDelete = (person) =>{
    console.log("deleted!!")
    
    personService.remove(person.id).then(() => {
      setNotifType('success')
      setPersons(persons.filter(newPerson => newPerson.id !== person.id))
      setNotification(` the person '${person.name}' was removed`)        
      setTimeout(() => {setNotification(null)}, 5000)
    })
      .catch(() => {   
      setNotifType('error')   
      setNotification(` the person '${person.name}' was already removed`)        
      setTimeout(() => {setNotification(null)}, 5000)  
    })
    }  


  const handleFilter = (event) =>{
    setNewFilter(event.target.value)
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notifMessage} type={notifType}/> 
        <Filter newFilter={newFilter} handleFilter={handleFilter} />
      <h2>Add a person!</h2>
        <Form 
          newName={newName} 
          handleNameChange={handleNameChange} 
          newNumber={newNumber} 
          handleNumberChange={handleNumberChange}
          addPerson={addPerson}
        />

    
      <h2>Numbers</h2>
      <ul>
        {personsToShow.map((person) => (
          <Person key={person.id} person={person} handleDelete={() => handleDelete(person)} />
        ))}
      </ul>
    </div>
  )

}



export default App