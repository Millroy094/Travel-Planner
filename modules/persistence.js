'use strict'

/**
 * persistence module.
 * @module persistence
 */

/* gets the Schema for the database to implement persistence */

const Database = require('../Schema/schema')

/**
 * Clears all the preferences from the database
 * @public
 * @function clearAllPreferences
 * @returns {Promise} returns a promise either saying delete operation is completed or rejecting with an error
 */
exports.clearAllPreferences = () => new Promise ((resolve, reject) => {


	Database.Preference.remove({}, (err) => {
		if(err) reject (`${err}`)
		resolve ('All preferences deleted')
	})


})

/**
 * function saves a new preference
 * @function savePreference
 * @public
 * @param {Object} preferInfo - An object holding preference data
 * @returns {Promise} returns a promise either saying save was successful or rejecting it with an error
 */
exports.savePreference = preferInfo => new Promise ((resolve, reject) => {

	/* Validates whether all the data is supplied */

	if('id' in preferInfo && 'origin' in preferInfo && 'destination' && preferInfo && 'modified' in preferInfo )

		/* Checks if the preference already exists */

		preferenceExists(preferInfo.id).then(() => {

			/* If it doesn't then go ahead save it in the database, if there is an error reject it */

			const prefer = new Database.Preference(preferInfo)

			prefer.save( (err, preference) => {
				if (err) {
					reject(new Error('an error saving preference'))
				}
				console.log(preference)
				resolve('Save Successful')
			})
		}).catch((error) => {
			reject(error)
		})


	else {
		reject (new Error('Invalid preference object'))
	}
})

/**
 * function gets all the list of preferences
 * @function getAllPreferences
 * @public
 * @returns {Promise} returns a promise with a list of preferences if any or else rejects with an error
 */
exports.getAllPreferences = () => new Promise ((resolve, reject) => {

	/* Searches the whole collection */

	Database.Preference.find({}, (err, preferences) => {

		/* found results are returned as part of the promise, if there is an error, it gets rejected */

		if (err) reject (new Error('database error'))
		if (!preferences.length) reject(new Error ('No preferences found'))
		resolve(preferences)
	})


})


/**
 * function lets you delete an existing preference
 * @function deleteByID
 * @public
 * @param {String} id - an identifer for the preference
 * @returns {Promise} returns a promise saying delete was successful or else returns a rejection with an error
 */
exports.deleteByID = id => new Promise((resolve, reject) => {

	Database.Preference.findOneAndRemove({ id: `${id}`}, (err) => {

		if(err) reject(new Error ('Database error! preference could not be deleted'))
		resolve (`preference with id ${id} is deleted`)

	})


})

/**
 * function lets you update an existing preference
 * @function updateByID
 * @public
 * @param {Object} preferInfo - An object holding preference data
 * @returns {Promise} returns a promise saying update was successful or else returns a rejection with an error
 */
exports.updateByID = preferInfo => new Promise ((resolve, reject) => {

	/* Validates whether all the data is supplied */

	if('id' in preferInfo && 'origin' in preferInfo && 'destination' in preferInfo && 'modified' in preferInfo ){

		/* Finds and updates the preferences, if there is a error it rejects it */

		Database.Preference.findOneAndUpdate({ id: preferInfo.id }, {origin: preferInfo.origin, destination: preferInfo.destination, modified: preferInfo.modified}, (err, done) => {

			if(err) reject(new Error('Database error! preference could not be updated'))
			console.log(done)
			resolve(`Preference with the name ${preferInfo.id} is Updated`)
		})

	}	else reject (new Error('Invalid preference object'))


})

/**
 * function lets you check if a preference already exists
 * @function preferenceExists
 * @private
 * @param {String} preferenceID - an identifer for the preference
 * @returns {Promise} rejects with an error if preference exists or else resolves it if it doesnt
 */
function preferenceExists(preferenceID){
	return new Promise((resolve, reject) => {

		Database.Preference.find({id: preferenceID}, (err, preferences) => {

			if (err) reject (new Error('database error'))
			if (!preferences.length) resolve ()
			reject(new Error('Preference already exists'))
		})


	})


}

/**
 * Clears all the users from the database
 * @public
 * @function clearAllUsers
 * @returns {Promise} returns a promise either saying delete operation is completed or rejecting with an error
 */
exports.clearAllUsers = () => new Promise ((resolve, reject) => {

	Database.Accounts.remove({}, (err) => {
		if(err) reject (`${err}`)
		resolve ('All users deleted')
	})

})

/**
 * function saves a new user account
 * @function addAccount
 * @public
 * @param {Object} details - An object holding user data
 * @returns {Promise} returns a promise either saying save was successful or rejecting it with an error
 */
exports.addAccount = details => new Promise( (resolve, reject) => {

	/* Validates whether details supplied are valid */

	if ('username' in details && 'password' in details ) {
		const user = new Database.Accounts(details)

		/* If all is good user is saved. If there is an error a rejection is send with an error */

		user.save( (err, user) => {
			if (err) {
				reject(new Error('error creating account'))
			}
			console.log(user)
			resolve('New user added')
		})

	}	else {
		reject(new Error('invalid user object'))
	}
})

/**
 * function checks if user account already exists
 * @function accountExists
 * @public
 * @param {string} username - represents the username of the user
 * @returns {Promise} returns a promise rejecting on user already exist or else resolves it for does not exist
 */
exports.accountExists = username => new Promise( (resolve, reject) => {
	Database.Accounts.find({username: username}, (err, findings) => {
		if (err) reject(err)
		if (findings.length) reject(new Error('username already exists'))
		resolve()
	})
})

/**
 * function retreives hash password of the user
 * @function getPassword
 * @public
 * @param {string} username - represents the username of the user
 * @returns {Promise} returns a promise with hash value of password or rejects it with an error
 */
exports.getPassword = username => new Promise( (resolve, reject) => {

	const firstIndex = 0

	Database.Accounts.find({username: username}, (err, docs) => {
		if (err) reject(new Error('database error'))
		if (docs.length) resolve(docs[firstIndex].password)
		reject(new Error('invalid username'))

	})
})

