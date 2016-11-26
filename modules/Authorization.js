'use strict'

const bcrypt = require('bcrypt')

/* Used as a parameter in genSaltSyn*/

const saltValue = 10


/**
 * This functions validates the header and checks if all the information is provided
 * @function validateHeader
 * @public
 * @param {authorization} authorization - represents the authenitication data from the head in the http request
 * @returns {Promise} returns a promise with the user's credentials or rejects with an error
 */
exports.validateHeader = authorization => new Promise ((resolve, reject) => {

	/* Checks if the header is not undefined */

	if(authorization === undefined || authorization.basic === undefined) {
		reject(new Error('Authorization head is missing'))
	}

	/* it then checks if username and password is supplied */

	const auth = authorization.basic

	if (auth.username === undefined || auth.password === undefined) {
		reject(new Error('missing username / password'))
	}

	resolve({username: auth.username, password: auth.password})

})

/**
 * This functions generates the hash value of the string supplied
 * @function getHashValue
 * @public
 * @param {string} password - represents the plain text version of password that will be used by user
 * @returns {Promise} returns a promise with a hash value of password
 */
exports.getHashValue = password => new Promise( (resolve) => {
	const salt = bcrypt.genSaltSync(saltValue)

	password = bcrypt.hashSync(password, salt)
	resolve(password)
})

/**
 * This functions checks the password hash against the plain text supplied and resolves them if theu match
 * @function validateUser
 * @public
 * @param {string} provided - represents the plain text version of password
 * @param {string} stored - represents the hash value of password retreived from the database
 * @returns {Promise} returns a promise resolving they match or else rejection if they don't
 */
exports.validateUser = (provided, stored) => new Promise( (resolve, reject) => {
	if (!bcrypt.compareSync(provided, stored)) {
		reject(new Error('invalid password'))
	}
	resolve()
})
