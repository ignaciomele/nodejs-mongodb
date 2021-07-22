// Importando express y mongoose
const users = require('./routes/users')
const auth = require('./routes/auth')
const express = require('express')
const mongoose = require('mongoose')
const config = require('config')

//Conect to DB
mongoose.connect(config.get('configDB.HOST'),
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then(() => console.log('Conected to mongoDB'))
    .catch(err => console.log("doesn't connected with MongoDB"))


const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api/users', users)
app.use('/api/auth', auth)

// configuracion del puerto y conexion
const port = process.env.PORT || 3000
app.listen(port, () => console.log('Api RESTful Ok, and Running'))