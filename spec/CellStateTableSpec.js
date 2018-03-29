"use strict";

const R = require('ramda');
const game = require('../lib/jagol');

const NeighborhoodState = game.NeighborhoodState;
const CellState = game.CellState;

describe("validating some dead states", function() {
	const cellStateTable = game.createCellStateTable();

	it("ensures those states are valid", function() {
		let hash = 0;

		// 0 0 0
		// 0 0 0
		// 0 0 0
		expect(cellStateTable[hash]).toBe(CellState.dead);

		// 1 0 0
		// 1 0 0
		// 0 0 0
		hash = NeighborhoodState.neighbor1Alive
			 + NeighborhoodState.neighbor2Alive;

		expect(cellStateTable[hash]).toBe(CellState.dead);

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

		expect(cellStateTable[hash]).toBe(CellState.dead);
	});

});

describe("validating some alive states", function() {
	const cellStateTable = game.createCellStateTable();

	it("ensures those states are valid", function() {
		let hash = 0;

		// 1 0 0
		// 1 0 0
		// 1 0 0
		hash = NeighborhoodState.neighbor1Alive
			 + NeighborhoodState.neighbor2Alive
			 + NeighborhoodState.neighbor3Alive;

		expect(cellStateTable[hash] & CellState.alive).toBeTruthy();

		// 1 0 0
		// 1 1 0
		// 0 0 0
		hash = NeighborhoodState.neighbor1Alive
			 + NeighborhoodState.neighbor2Alive
			 + CellState.alive;

		expect(cellStateTable[hash] & CellState.alive).toBeTruthy();

		// 0 1 0
		// 0 1 0
		// 0 1 0
		hash = NeighborhoodState.neighbor4Alive
			 + NeighborhoodState.neighbor5Alive
			 + CellState.alive;

		expect(cellStateTable[hash] & CellState.alive).toBeTruthy();

		// 0 0 1
		// 0 1 1
		// 1 0 0
		hash = NeighborhoodState.neighbor3Alive
			 + NeighborhoodState.neighbor6Alive
			 + NeighborhoodState.neighbor7Alive
			 + CellState.alive;

		expect(cellStateTable[hash] & CellState.alive).toBeTruthy();

		// 0 1 1
		// 0 0 0
		// 0 1 0
		hash = NeighborhoodState.neighbor4Alive
			 + NeighborhoodState.neighbor5Alive
			 + NeighborhoodState.neighbor6Alive;

		expect(cellStateTable[hash] & CellState.alive).toBeTruthy();
	});
});

describe("validating some newborn states", function() {
	const cellStateTable = game.createCellStateTable();

	it("ensures those states are valid", function() {
		let hash = 0;

		// 1 0 0
		// 1 0 0
		// 1 0 0
		hash = NeighborhoodState.neighbor1Alive
			 + NeighborhoodState.neighbor2Alive
			 + NeighborhoodState.neighbor3Alive;

		expect(cellStateTable[hash] & CellState.newborn).toBeTruthy();

		// 0 1 1
		// 0 0 0
		// 0 1 0
		hash = NeighborhoodState.neighbor4Alive
			 + NeighborhoodState.neighbor5Alive
			 + NeighborhoodState.neighbor6Alive;

		expect(cellStateTable[hash] & CellState.newborn).toBeTruthy();
	});
});
