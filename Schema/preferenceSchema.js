
'use strict'

// import the mongoose package
const mongoose = require('mongoose')
mongoose.connect('mongodb://millroy098:itcanbedone@ds151707.mlab.com:51707/travelplanner')
mongoose.Promise = global.Promise
const Schema = mongoose.Schema

// createa a Preference schema
const preferSchema = new Schema({
	id: String,
	modified: Date,
	origin: String,
	destination: String
})

// create a model using the schema
const Prefer = mongoose.model('Preference', preferSchema)

// export this so it can be used in the API
exports.Preference = Prefer

// createa a User schema
const userSchema = new Schema({
	username: String,
	password: String
})

// create a model using the schema
const User = mongoose.model('User', userSchema)

// export this so it can be used in the API
exports.Accounts = User

