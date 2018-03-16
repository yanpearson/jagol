"use strict";

const game = require('../lib/jagol');
const hashTable = game.createHashTable();

describe("doing 1 generation from a seed", function() {

	it("is the first generation", function() {
		const seed = game.board();

		const result = game.doNextGeneration(hashTable, seed);

		expect(result.generation).toBe(1);
	});

});

describe("doing 100 generations from a seed", function() {

	it("is the 100th generation", function() {
		const seed = game.board();

		const result = game.doNthGeneration(100, hashTable, seed);

		expect(result.generation).toBe(100);
	});

});
