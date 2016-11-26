'use strict'

const fs = require('fs')
const rewire = require('rewire')
const direction = rewire('../modules/directions')

describe('Check directions module returns accurate data', function() {


	direction.__set__('apiCall', function(origin, destination) {

		return new Promise((resolve, reject) => {

			const firstIndex = 0

			const body = fs.readFileSync('spec/direction/bham_to_swindon.json', 'utf8')

			const json = JSON.parse(body)

			resolve(json)

		})

	})

	it('Should return the right distance', function(done) {
		direction.getDistance('Birmingham','Swindon').then((data) => {
			expect(data).toEqual('149 km')
			done()
		}).catch((error) => {
			console.log(error)
			done()
		})
	})

	it('Should return the right duration', function(done) {
		direction.getDuration('Birmingham','Swindon').then((data) => {
			expect(data).toEqual('1 hour 43 mins')
			done()
		}).catch((error) => {
			console.log(error)
			done()
		})
	})

	it('Should return the right number of directions', function(done) {
		direction.getDirections('Birmingham','Swindon').then((data) => {
			expect(data.length).toEqual(24)
			done()
		}).catch((error) => {
			console.log(error)
			done()
		})
	})

	it('Should return the right coordinates', function(done) {
		direction.getCoordinates('Birmingham','Swindon').then((data) => {
			expect(data.lat).toEqual(51.55571219999999)
			expect(data.lng).toEqual(-1.7799789)
			done()
		}).catch((error) => {
			console.log(error)
			done()
		})
	})

})
