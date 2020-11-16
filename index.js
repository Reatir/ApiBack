const express = require('express')
const cors = require('cors')
const app = express()
const interventions = require('./interventions.json')
const fs = require('fs');

app.use(express.json())
app.use(cors())

app.listen(8080, () => {
    console.log('Serveur à l\'écoute')
  })

app.get('/interventions',(req,res) =>{
    res.status(200).json(interventions)
})

app.get('/interventions/:id',(req,res) =>{
    const id = parseInt(req.params.id)
    const intervention = interventions.find(interventions => interventions.id === id)
    res.status(200).json(intervention)
})

app.post('/interventions',(req,res)=>{
    let test = fs.readFileSync('last_identifier.json')
    console.log(test)
    let strIdentifier = JSON.parse(test)
    let lastIdentifier = parseInt(strIdentifier.id)
    let id = lastIdentifier + 1
    let new_identifier = { id: id}
    let new_identifier_json = JSON.stringify(new_identifier)
    let intervention = req.body
    intervention.id = id
    interventions.push(intervention)
    fs.writeFileSync('last_identifier.json', new_identifier_json)
    let data = JSON.stringify(interventions)
    fs.writeFileSync('interventions.json', data);
    res.status(200).json(interventions)
})

app.delete('/interventions/:id',(req,res) =>{
    const id = parseInt(req.params.id)
    const intervention = interventions.find(interventions => interventions.id === id)
    interventions.splice(interventions.indexOf(intervention),1)
    let data = JSON.stringify(interventions)
    fs.writeFileSync('interventions.json', data);
    res.status(200).json(interventions)
})

app.put('/interventions/:id',(req,res) =>{
    const id = parseInt(req.params.id)
    const intervention = interventions.find(interventions => interventions.id === id)
    const modifyIntervention = intervention
    modifyIntervention.title = req.body.title
    modifyIntervention.operator = req.body.operator
    modifyIntervention.description = req.body.description
    modifyIntervention.completed = req.body.completed
    interventions.splice(interventions.indexOf(intervention),1,modifyIntervention)
    let data = JSON.stringify(interventions)
    fs.writeFileSync('interventions.json', data);
    res.status(200).json(interventions)
})
