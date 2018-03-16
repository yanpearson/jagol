"use strict";

const R = require('ramda');
const game = require('../lib/jagol');

const DEAD_STATE = game.LifeState.dead;
const ALIVE_STATE = game.LifeState.alive;

describe("Hash table", function() {

	it("does generate", function() {
		const hashTable = game.createHashTable();

		// 0 0 0
		// 0 0 0
		// 0 0 0
		expect(hashTable[0]).toBe(DEAD_STATE);

		// 1 0 0
		// 1 0 0
		// 0 0 0
		expect(hashTable[3]).toBe(DEAD_STATE);

		// 1 0 0
		// 1 0 0
		// 1 0 0
		expect(hashTable[7]).toBe(ALIVE_STATE);

		// 1 0 0
		// 1 1 0
		// 0 0 0
		expect(hashTable[19]).toBe(ALIVE_STATE);

		// 0 1 0
		// 0 1 0
		// 0 1 0
		expect(hashTable[56]).toBe(ALIVE_STATE);

		// 0 0 1
		// 0 1 1
		// 1 0 0
		expect(hashTable[100]).toBe(ALIVE_STATE);

		// 1 1 1
		// 1 1 1
		// 1 1 1
		expect(hashTable[255]).toBe(DEAD_STATE);
	});
});
