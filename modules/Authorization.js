'use strict'

const bcrypt = require('bcrypt')

exports.validateHeader = authorization => new Promise ((resolve, reject)=> {

	if(authorization === undefined || authorization.basic === undefined) {
		reject(new Error('Authorization head is missing'))
	}

	const auth = authorization.basic

	if (auth.username === undefined || auth.password === undefined) {
		reject(new Error('missing username / password'))
	}

	resolve({username: auth.username, password: auth.password})

})

exports.getHashValue = password => new Promise( (resolve, reject) => {
  const salt = bcrypt.genSaltSync(10)
  password = bcrypt.hashSync(password, salt)
  resolve(password)
})

exports.validateUser = (provided, stored) => new Promise( (resolve, reject) => {
  if (!bcrypt.compareSync(provided, stored)) {
		reject(new Error('invalid password'))
	}
  resolve()
})