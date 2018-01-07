"use strict";

const game = require('../lib/jagol');
const rulesTable = game.createRulesTable();

describe("doing 1 generation from a seed", function() {

	it("is the first generation", function() {
		const seed = game.board();

		const result = game.doNextGeneration(rulesTable, seed);

		expect(result.generation).toBe(1);
	});

});

describe("doing 100 generations from a seed", function() {

	it("is the 100th generation", function() {
		const seed = game.board();

		const result = game.doNthGeneration(100, rulesTable, seed);

		expect(result.generation).toBe(100);
	});

});
