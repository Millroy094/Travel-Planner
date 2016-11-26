'use strict'

const fs = require('fs')
const rewire = require('rewire')
const direction = rewire('../modules/directions')

describe('Check directions module returns error for invalid location', function() {


	direction.__set__('apiCall', function(origin, destination) {

		return new Promise((resolve, reject) => {

			const firstIndex = 0
			const body = fs.readFileSync('spec/direction/invalid.json', 'utf8')
			const json = JSON.parse(body)

			resolve(json)

		})

	})


	it('Should return an error when distance data is asked', function(done) {
		direction.getDistance('Birmingham','Goa').then(() => {
			done()
		}).catch((error) => {
			expect(`${error}`).toEqual('Error: Invalid location')
			done()
		})
	})

	it('Should return an error when duration data is asked', function(done) {
		direction.getDuration('Birmingham','Goa').then(() => {
			done()
		}).catch((error) => {
			expect(`${error}`).toEqual('Error: Invalid location')
			done()
		})
	})

	it('Should return an error when directions are asked', function(done) {
		direction.getDirections('Birmingham','Goa').then(() => {
		}).catch((error) => {
			expect(`${error}`).toEqual('Error: Invalid location')
			done()
		})
	})

	it('Should return an error when coordinates are asked', function(done) {
		direction.getCoordinates('Birmingham','Goa').then(() => {
		}).catch((error) => {
			expect(`${error}`).toEqual('Error: Invalid location')
			done()
		})
	})


})
