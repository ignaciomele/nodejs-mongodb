const express = require('express')
const config = require('config')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user_model')
const { token } = require('morgan')
// const Joi = require('@hapi/joi')
const route = express.Router()
const { logInUser } = require('../controllers/authControllers')

route.post('/', logInUser)



module.exports = route