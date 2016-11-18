'use strict'

const authorization = require('../modules/Authorization')

describe('Check the authorization module functions as excepted', function() {


	it('Validates the authorization header and returns the username and password', function (done) {
		
		const auth = {basic: {username: 'Test', password: '12325'}}

		authorization.validateHeader(auth).then((data)=>{
			expect(data.username).toEqual('Test')
			expect(data.password).toEqual('12325')
			done()
		}).catch((error)=>{
			done()
		})

	})

	it('Validates the authorization header and throws an error if authorization header is undefined', function (done) {
		
		let auth

		authorization.validateHeader(auth).then(()=>{
			done()
		}).catch((error)=>{
			expect(`${error}`).toEqual('Error: Authorization head is missing')
			done()
		})

	})

	it('Validates the authorization header and throws an error if username & password is undefined', function (done) {
		
		const auth = {basic: {}} 

		authorization.validateHeader(auth).then(()=>{
			done()
		}).catch((error)=>{
			expect(`${error}`).toEqual('Error: missing username / password')
			done()
		})

	})

	it('Should return the right hash value', function (done) {
		
		authorization.getHashValue('12345').then((Hash)=>{
			return authorization.validateUser('12345', Hash)
		}).then((data)=>{
			expect().toEqual()
			done()
		}).catch((error)=>{
			done()
		})

	})

	it('Should return an error invalid password', function (done) {
		
		authorization.getHashValue('12345').then((Hash)=>{
			return authorization.validateUser('1245', Hash)
		}).catch((error)=>{
			expect(`${error}`).toEqual('Error: invalid password')
			done()
		})

	})

})
