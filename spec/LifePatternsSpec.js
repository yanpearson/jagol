"use strict";

const R = require('ramda');
const game = require('../lib/jagol');
const patterns = require('../lib/patterns');
const cellStateTable = game.createCellStateTable();
const contains = (cell, board) => R.contains(cell, board.population.map(c => ({ x: c.x, y: c.y })));

describe("block pattern", function() {

	it("does not change over multiple generations", function() {
		// Provided:
		// 1 1 0
		// 1 1 0
		// 0 0 0
		const seed = patterns.block(0, 0);
		const board = game.board(null, null, seed);

		// Generation 1
		const gen1 = game.doNextGeneration(cellStateTable, board);

		// Expected:
		// ✓ ✓ 0
		// ✓ ✓ 0
		// 0 0 0
		expect(contains({ x: 0, y: 0 }, gen1)).toBe(true);
		expect(contains({ x: 1, y: 0 }, gen1)).toBe(true);
		expect(contains({ x: 0, y: 1 }, gen1)).toBe(true);
		expect(contains({ x: 1, y: 1 }, gen1)).toBe(true);

		expect(gen1.population.length).toEqual(4);

		// Generation 2
		const gen2 = game.doNextGeneration(cellStateTable, gen1);

		// Expected:
		// ✓ ✓ 0
		// ✓ ✓ 0
		// 0 0 0
		expect(contains({ x: 0, y: 0 }, gen2)).toBe(true);
		expect(contains({ x: 1, y: 0 }, gen2)).toBe(true);
		expect(contains({ x: 0, y: 1 }, gen2)).toBe(true);
		expect(contains({ x: 1, y: 1 }, gen2)).toBe(true);

		expect(gen2.population.length).toEqual(4);

		// Generation 3
		const gen3 = game.doNextGeneration(cellStateTable, gen2);

		// Expected:
		// ✓ ✓ 0
		// ✓ ✓ 0
		// 0 0 0
		expect(contains({ x: 0, y: 0 }, gen3)).toBe(true);
		expect(contains({ x: 1, y: 0 }, gen3)).toBe(true);
		expect(contains({ x: 0, y: 1 }, gen3)).toBe(true);
		expect(contains({ x: 1, y: 1 }, gen3)).toBe(true);

		expect(gen3.population.length).toEqual(4);

		// Generation 100
		const gen100 = game.doNthGeneration(100, cellStateTable, board);

		// Expected:
		// ✓ ✓ 0
		// ✓ ✓ 0
		// 0 0 0
		expect(contains({ x: 0, y: 0 }, gen100)).toBe(true);
		expect(contains({ x: 1, y: 0 }, gen100)).toBe(true);
		expect(contains({ x: 0, y: 1 }, gen100)).toBe(true);
		expect(contains({ x: 1, y: 1 }, gen100)).toBe(true);

		expect(gen100.population.length).toEqual(4);
	});
});

describe("blinker pattern", function() {

	it("oscilates over 2 forms", function() {
		// Provided:
		// 0 1 0
		// 0 1 0
		// 0 1 0
		const seed = game.board(null, null, [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }]);

		// Generation 1
		const gen1 = game.doNextGeneration(cellStateTable, seed);

		// Expected:
		// 0 0 0
		// ✓ ✓ ✓
		// 0 0 0
		expect(contains({ x: 0, y: 1 }, gen1)).toBe(true);
		expect(contains({ x: 1, y: 1 }, gen1)).toBe(true);
		expect(contains({ x: 2, y: 1 }, gen1)).toBe(true);

		expect(gen1.population.length).toEqual(3);

		// Generation 2
		const gen2 = game.doNextGeneration(cellStateTable, gen1);

		// Expected:
		// 0 ✓ 0
		// 0 ✓ 0
		// 0 ✓ 0
		expect(contains({ x: 1, y: 0 }, gen2)).toBe(true);
		expect(contains({ x: 1, y: 1 }, gen2)).toBe(true);
		expect(contains({ x: 1, y: 2 }, gen2)).toBe(true);

		expect(gen2.population.length).toEqual(3);

		// Generation 100
		const gen100Board = game.doNthGeneration(100, cellStateTable, seed);

		// Expected:
		// 0 ✓ 0
		// 0 ✓ 0
		// 0 ✓ 0
		expect(contains({ x: 1, y: 0 }, gen100Board)).toBe(true);
		expect(contains({ x: 1, y: 1 }, gen100Board)).toBe(true);
		expect(contains({ x: 1, y: 2 }, gen100Board)).toBe(true);

		expect(gen100Board.population.length).toEqual(3);

		// Generation 101
		const gen101 = game.doNthGeneration(101, cellStateTable, seed);

		// Expected:
		// 0 0 0
		// ✓ ✓ ✓
		// 0 0 0
		expect(contains({ x: 0, y: 1 }, gen101)).toBe(true);
		expect(contains({ x: 1, y: 1 }, gen101)).toBe(true);
		expect(contains({ x: 2, y: 1 }, gen101)).toBe(true);

		expect(gen101.population.length).toEqual(3);

	});
});

describe("glider pattern", function() {

	it("moves diagonally after 4 generations", function() {
		// Provided:
		// 0 1 0 0
		// 0 0 1 0
		// 1 1 1 0
		// 0 0 0 0
		const seed = patterns.glider(0, 0);
		const board = game.board(5, 5 , seed);

		// Generation 4
		const gen4 = game.doNthGeneration(4, cellStateTable, board);

		// Expected:
		// 0 0 0 0
		// 0 0 ✓ 0
		// 0 0 0 ✓
		// 0 ✓ ✓ ✓
		expect(contains({ x: 2, y: 1 }, gen4)).toBe(true);
		expect(contains({ x: 3, y: 2 }, gen4)).toBe(true);
		expect(contains({ x: 1, y: 3 }, gen4)).toBe(true);
		expect(contains({ x: 2, y: 3 }, gen4)).toBe(true);
		expect(contains({ x: 3, y: 3 }, gen4)).toBe(true);

		expect(gen4.population.length).toEqual(5);
	});

});
