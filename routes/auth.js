const express = require('express')
const config = require('config')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user_model')
const { token } = require('morgan')
// const Joi = require('@hapi/joi')
const route = express.Router()

route.post('/', (req, res) => {
    User.findOne({email: req.body.email})
        .then(datos => {
            if(datos){
                const passwordValid = bcrypt.compareSync(req.body.password, datos.password)
                if(!passwordValid) return res.status(400).json({error: 'Ok', msj: 'User or password are incorrect.'})
                const jwToken = jwt.sign({
                    data: {_id: datos._id, name: dato.name, email: dato.email}
                  }, config.get('configToken.SEED'), { expiresIn: config.get('configToken.expiration') })
                //jwt.sign({_id: datos._id, name: dato.name, email: dato.email}, 'password')
                res.json({
                    user:{
                        _id: datos._id,
                        name: datos.name,
                        email: datos.email
                    },
                    jwToken
                })
            }else{
                res.status(400).json({
                    err:'ok',
                    msj:'User or password are incorrect.'
                })
            }
        })
        .catch(err => {
            res.status(400).json({
                err: 'Ok',
                msj: 'Error on server' + err
            })
        })
})
module.exports = route