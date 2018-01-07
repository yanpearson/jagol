"use strict";

const R = require('ramda');
const game = require('../lib/jagol');
const rulesTable = game.createRulesTable();
const contains = (cell, board) => R.contains(cell, board.population);

describe("If an alive cell is outside of board border limits", function() {

	it("will die on next generation", function() {
		// Provided:
		// 0 0 1 1
		// 0 0 1 1
		// 0 0 0 0
		const seed = game.board(3, 3, [{ x: 2, y: 0 }, { x: 3, y: 0 }, { x: 2, y: 1 }, { x: 3, y: 1 }]);

		const result = game.doNextGeneration(rulesTable, seed);

		// Expected:
		// 0 0 0
		// 0 0 0
		// 0 0 0
		expect(contains({ x: 2, y: 0 }, result)).toBe(false);
		expect(contains({ x: 2, y: 1 }, result)).toBe(false);

		expect(result.population.length).toEqual(0);
	});

});
