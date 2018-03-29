"use strict";

const R = require('ramda');
const game = require('../lib/jagol');
const cellStateTable = game.createCellStateTable();

describe("If we do 100 generations", function() {

	it("must be done under 1 secondes", function() {

		const patterns = {
			oscillator: (offsetX, offsetY) => {
				return [{ x: 1 + offsetX, y: 0 + offsetY }, { x: 1 + offsetX, y: 1 + offsetY }, { x: 1 + offsetX, y: 2 + offsetY }];
			},
			glider: (offsetX, offsetY) => {
				return [{ x: 1 + offsetX, y: 0 + offsetY }, { x: 0 + offsetX, y: 1 + offsetY }, { x: 0 + offsetX, y: 2 + offsetY }, { x: 1 + offsetX, y: 2 + offsetY }, { x: 2 + offsetX, y: 2 + offsetY }];
			},
			gosperGliderGun: (offsetX, offsetY) => {
				return [
					{ x: 0 + offsetX, y: 4 + offsetY }, { x: 1 + offsetX, y: 4 + offsetY }, { x: 0 + offsetX, y: 5 + offsetY }, { x: 1 + offsetX, y: 5 + offsetY },
					{ x: 12 + offsetX, y: 2 + offsetY }, { x: 13 + offsetX, y: 2 + offsetY }, { x: 11 + offsetX, y: 3 + offsetY }, { x: 10 + offsetX, y: 4 + offsetY }, { x: 10 + offsetX, y: 5 + offsetY }, { x: 10 + offsetX, y: 6 + offsetY }, { x: 11 + offsetX, y: 7 + offsetY }, { x: 12 + offsetX, y: 8 + offsetY }, { x: 13 + offsetX, y: 8 + offsetY },
					{ x: 14 + offsetX, y: 5 + offsetY },
					{ x: 15 + offsetX, y: 3 + offsetY }, { x: 16 + offsetX, y: 4 + offsetY }, { x: 16 + offsetX, y: 5 + offsetY }, { x: 17 + offsetX, y: 5 + offsetY }, { x: 16 + offsetX, y: 6 + offsetY }, { x: 15 + offsetX, y: 7 + offsetY },
					{ x: 22 + offsetX, y: 1 + offsetY }, { x: 20 + offsetX, y: 2 + offsetY }, { x: 21 + offsetX, y: 2 + offsetY }, { x: 20 + offsetX, y: 3 + offsetY }, { x: 21 + offsetX, y: 3 + offsetY }, { x: 20 + offsetX, y: 4 + offsetY }, { x: 21 + offsetX, y: 4 + offsetY }, { x: 22 + offsetX, y: 5 + offsetY },
					{ x: 24 + offsetX, y: 0 + offsetY }, { x: 24 + offsetX, y: 1 + offsetY },
					{ x: 24 + offsetX, y: 5 + offsetY }, { x: 24 + offsetX, y: 6 + offsetY },
					{ x: 34 + offsetX, y: 2 + offsetY }, { x: 35 + offsetX, y: 2 + offsetY }, { x: 34 + offsetX, y: 3 + offsetY }, { x: 35 + offsetX, y: 3 + offsetY }
				];
			}
		};

		const oscillator = patterns.oscillator(47, 47);
		const glider = patterns.glider(47, 0);
		const gosperGliderGun = patterns.gosperGliderGun(0, 0);
		const seed = [].concat(oscillator).concat(glider).concat(gosperGliderGun);
		const board = game.board(50, 50, seed);

		const start = process.hrtime();

		game.doNthGeneration(100, cellStateTable, board);

		const elapsedTime = process.hrtime(start);
		const seconds = elapsedTime[0];
		const miliseconds = elapsedTime[1] / 1000000;
		console.log(`\nOutput 100 generations in ${seconds}s ${miliseconds}ms`);

		const speed = 1000 / (seconds * 1000 + miliseconds) * 100;
		console.log(`Speed: ${speed} generations/seconds`);

		expect(elapsedTime[0]).toBeLessThanOrEqual(1);
		expect(speed).toBeGreaterThanOrEqual(100);
	});

});
