const express = require('express')
const bcrypt = require('bcrypt')
const User = require('../models/user_model')
const Joi = require('@hapi/joi')
const route = express.Router()

const schema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(20)
        .required(),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
})

route.get('/', (req, res) => {
    let result = listActiveUsers()
    result.then(users => {
        res.json(users)
    }).catch(err => {
        res.status(400).json({
            error
        })
    })
})

route.post('/', (req, res) => {
    let body = req.body

    User.findOne({email: body.email}, (err, user) => {
        if(err){
            return res.status(400).json({error:'Server error'})
        }
        if(user){
            //si el usuario existe
            return res.status(400).json({
                msj:'User already exists'
            })
        }
    })
    const {error, value} = schema.validate({name: body.name, email: body.email})
    if(!error){
        let result = createUser(body)
    
        result.then(user => {
            res.json({
                name: user.name,
                email: user.email               
            })
        }).catch (err => {
            res.status(400).json({
                error
            })
        })
    }else {
        res.status(400).json({
            error
        })
    }
})

route.put('/:email', (req, res) => {
    const {error, value} = schema.validate({name: req.body.name})
    if(!error){
        let result = updateUser(req.params.email, req.body)
        result.then(value => {
            res.json({
                name: value.name,
                email: value.email
            }).catch(err => {
                res.status(400).json()
                error
            })
        })
    }else{
        res.status(400).json({
            error
        })
    }

})

route.delete('/:email', (req, res) => {
    let result = desactiveUser(req.params.email)
    result.then(value => {
        res.json({
            name: value.name,
            email: value.name
        })
    }).catch(err => {
        res.status(400).json({
            error
        })
    })
})

async function listActiveUsers() {
    let users = await User.find({"state": true})
    .select({name:1, email:1})
    return users
}

async function createUser(body){
    let user = new User({
        email: body.email,
        name: body.name,
        password: bcrypt.hashSync(body.password, 10)
    })
    return await user.save()
}

async function updateUser(email, body){
    let user = await User.findOneAndUpdate({"email": email}, {
        $set: {
            name: body.name,
            password: body.password
        }
    }, {new: true})
    return user
}

async function desactiveUser(email){
    let user = await User.findByIdAndUpdate({"email": email}, {
        $set: {
            state: false
        }
    }, {new: true})
    return user
}
module.exports = route