"use strict";

const R = require('ramda');
const game = require('../lib/jagol');

describe("Rules table", function() {

	it("does generate", function() {
		const rulesTable = game.createRulesTable();

		// 0 0 0
		// 0 0 0
		// 0 0 0
		expect(rulesTable[0]).toBe(false);

		// 1 0 0
		// 1 0 0
		// 0 0 0
		expect(rulesTable[3]).toBe(false);

		// 1 0 0
		// 1 0 0
		// 1 0 0
		expect(rulesTable[7]).toBe(true);

		// 1 0 0
		// 1 1 0
		// 0 0 0
		expect(rulesTable[19]).toBe(true);

		// 0 1 0
		// 0 1 0
		// 0 1 0
		expect(rulesTable[56]).toBe(true);

		// 0 0 1
		// 0 1 1
		// 1 0 0
		expect(rulesTable[212]).toBe(true);

		// 1 1 1
		// 1 1 1
		// 1 1 1
		expect(rulesTable[511]).toBe(false);
	});
});
