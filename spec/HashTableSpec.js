"use strict";

const R = require('ramda');
const game = require('../lib/jagol');

const NeighborhoodState = game.NeighborhoodState;
const CellState = game.CellState;

describe("When creating an hash table", function() {

	it("contains valid data", function() {
		const hashTable = game.createHashTable();
		let hash = 0;

		// 0 0 0
		// 0 0 0
		// 0 0 0
		expect(hashTable[hash]).toBe(CellState.dead);

		// 1 0 0
		// 1 0 0
		// 0 0 0
		hash = NeighborhoodState.neighbor1Alive
			 + NeighborhoodState.neighbor2Alive;

		expect(hashTable[hash]).toBe(CellState.dead);

		// 1 0 0
		// 1 0 0
		// 1 0 0
		hash = NeighborhoodState.neighbor1Alive
			 + NeighborhoodState.neighbor2Alive
			 + NeighborhoodState.neighbor3Alive;

		expect(hashTable[hash]).toBe(CellState.alive);

		// 1 0 0
		// 1 1 0
		// 0 0 0
		hash = NeighborhoodState.neighbor1Alive
			 + NeighborhoodState.neighbor2Alive
			 + CellState.alive;

		expect(hashTable[hash]).toBe(CellState.alive);

		// 0 1 0
		// 0 1 0
		// 0 1 0
		hash = NeighborhoodState.neighbor4Alive
			 + NeighborhoodState.neighbor5Alive
			 + CellState.alive;

		expect(hashTable[hash]).toBe(CellState.alive);

		// 0 0 1
		// 0 1 1
		// 1 0 0
		hash = NeighborhoodState.neighbor3Alive
			 + NeighborhoodState.neighbor6Alive
			 + NeighborhoodState.neighbor7Alive
			 + CellState.alive;

		expect(hashTable[hash]).toBe(CellState.alive);

		// 1 1 1
		// 1 1 1
		// 1 1 1
		hash = NeighborhoodState.neighbor1Alive
			 + NeighborhoodState.neighbor2Alive
			 + NeighborhoodState.neighbor3Alive
			 + NeighborhoodState.neighbor4Alive
			 + NeighborhoodState.neighbor5Alive
			 + NeighborhoodState.neighbor6Alive
			 + NeighborhoodState.neighbor7Alive
			 + NeighborhoodState.neighbor8Alive
			 + CellState.alive;

		expect(hashTable[hash]).toBe(CellState.dead);
	});
});
