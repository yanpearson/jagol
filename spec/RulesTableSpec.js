"use strict";

const R = require('ramda');
const game = require('../lib/jagol');

const DEAD_STATE = 0;
const ALIVE_STATE = 255;

describe("Rules table", function() {

	it("does generate", function() {
		const rulesTable = game.createRulesTable();

		// 0 0 0
		// 0 0 0
		// 0 0 0
		expect(rulesTable[0]).toBe(DEAD_STATE);

		// 1 0 0
		// 1 0 0
		// 0 0 0
		expect(rulesTable[3]).toBe(DEAD_STATE);

		// 1 0 0
		// 1 0 0
		// 1 0 0
		expect(rulesTable[7]).toBe(ALIVE_STATE);

		// 1 0 0
		// 1 1 0
		// 0 0 0
		expect(rulesTable[19]).toBe(ALIVE_STATE);

		// 0 1 0
		// 0 1 0
		// 0 1 0
		expect(rulesTable[56]).toBe(ALIVE_STATE);

		// 0 0 1
		// 0 1 1
		// 1 0 0
		expect(rulesTable[212]).toBe(ALIVE_STATE);

		// 1 1 1
		// 1 1 1
		// 1 1 1
		expect(rulesTable[511]).toBe(DEAD_STATE);
	});
});
