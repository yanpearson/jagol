"use strict";

const R = require('ramda');
const game = require('../lib/jagol');
const cellStateTable = game.createCellStateTable();
const get = (cell, board) => R.find(R.propEq('x', cell.x) && R.propEq('y', cell.y))(board.population);

describe("A cell that come to life", function() {

	it("will have 'newborn' state at next generation", function() {
		const seed = game.board(null, null, [ { x: 0, y: 0 } , { x: 1, y: 0 }, { x: 2, y: 0 } ]);

		const result = game.doNextGeneration(cellStateTable, seed);

		const cell = get({ x: 1, y: 1 }, result);

		expect(cell).toBeDefined();
		expect(cell.state).toBe(game.CellState.newborn);
	});

});

describe("A cell that stay alive", function() {

	it("will have 'alive' state at next generation", function() {
		const seed = game.board(null, null, [ { x: 0, y: 0 } , { x: 1, y: 0 }, { x: 2, y: 0 } ]);

		const result = game.doNextGeneration(cellStateTable, seed);

		const cell = get({ x: 1, y: 0 }, result);

		expect(cell).toBeDefined();
		expect(cell.state).toBe(game.CellState.alive);
	});

});
