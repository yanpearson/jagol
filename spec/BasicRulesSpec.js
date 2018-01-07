"use strict";

const R = require('ramda');
const game = require('../lib/jagol');
const rulesTable = game.createRulesTable();
const contains = (cell, board) => R.contains(cell, board.population);

describe("if a dead cell is surrounded by 3 alive neighbors", function() {

	it("reborns", function() {
		// Provided:
		// 0 1 0
		// 0 1 0
		// 0 1 0
		const seed = game.board(null, null, [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }]);

		const result = game.doNextGeneration(rulesTable, seed);

		// Expected:
		// 0 0 0
		// ✓ 1 ✓
		// 0 0 0
		expect(contains({ x: 0, y: 1 }, result)).toBe(true);
		expect(contains({ x: 2, y: 1 }, result)).toBe(true);
	});

});

describe("if an alive cell is surrounded by 2 alive neighbors", function() {

	it("stays alive", function() {
		// Provided:
		// 0 1 0
		// 0 1 0
		// 0 1 0
		const seed = game.board(null, null, [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }]);

		const result = game.doNextGeneration(rulesTable, seed);

		// Expected:
		// 0 0 0
		// 1 ✓ 1
		// 0 0 0
		expect(contains({ x: 1, y: 1 }, result)).toBe(true);
	});

});

describe("if an alive cell is surrounded by 3 alive neighbors", function() {

	it("stays alive", function() {
		// Provided:
		// 1 1 0
		// 0 1 0
		// 0 1 0
		const seed = game.board(null, null, [{ x: 0,  y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }]);

		const result = game.doNextGeneration(rulesTable, seed);

		// Expected:
		// 1 1 0
		// 1 ✓ 1
		// 0 0 0
		expect(contains({ x: 1, y: 1 }, result)).toBe(true);
	});

});

describe("if an alive cell is surrounded by less than 2 alive neighbors", function() {

	it("dies", function() {
		// Provided:
		// 0 1 0
		// 0 1 0
		// 0 1 0
		const seed = game.board(null, null, [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }]);

		const result = game.doNextGeneration(rulesTable, seed);

		// Expected:
		// 0 ✕ 0
		// 1 1 1
		// 0 ✕ 0
		expect(contains({ x: 1, y: 0 }, result)).toBe(false);
		expect(contains({ x: 1, y: 2 }, result)).toBe(false);
	});

});

describe("if an alive cell is surrounded by more than 3 alive neighbors", function() {

	it("dies", function() {
		// Provided:
		// 1 0 1
		// 0 1 0
		// 1 0 1
		const seed = game.board(null, null, [{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 2 }, { x: 2, y: 2 }]);

		const result = game.doNextGeneration(rulesTable, seed);

		// Expected:
		// 0 1 0
		// 1 ✕ 1
		// 0 1 0
		expect(contains({ x: 1, y: 1 }, result)).toBe(false);
	});

});
