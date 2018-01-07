"use strict";

const block = (originX, originY) => {
	return [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }]
		.map(cell => ({ x: cell.x + originX, y: cell.y + originY }));
};

const oscillator = (originX, originY) => {
	return [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }]
		.map(cell => ({ x: cell.x + originX, y: cell.y + originY }));
};

const glider = (originX, originY) => {
	return [{ x: 1, y: 0 }, { x: 2, y: 1 }, { x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2}]
		.map(cell => ({ x: cell.x + originX, y: cell.y + originY }));
};

const gosperGliderGun = (originX, originY) => {
	return [
		{ x: 12, y: 2 }, { x: 13, y: 2 }, { x: 11, y: 3 }, { x: 10, y: 4 }, { x: 10, y: 5 }, { x: 10, y: 6 }, { x: 11, y: 7 }, { x: 12, y: 8 }, { x: 13, y: 8 },
		{ x: 14, y: 5 },
		{ x: 15, y: 3 }, { x: 16, y: 4 }, { x: 16, y: 5 }, { x: 17, y: 5 }, { x: 16, y: 6 }, { x: 15, y: 7 },
		{ x: 22, y: 1 }, { x: 20, y: 2 }, { x: 21, y: 2 }, { x: 20, y: 3 }, { x: 21, y: 3 }, { x: 20, y: 4 }, { x: 21, y: 4 }, { x: 22, y: 5 },
		{ x: 24, y: 0 }, { x: 24, y: 1 },
		{ x: 24, y: 5 }, { x: 24, y: 6 }
	]
		.concat(block(0, 4))
		.concat(block(34, 2))
		.map(cell => ({ x: cell.x + originX, y: cell.y + originY }));
};

module.exports.block = block;
module.exports.oscillator = oscillator;
module.exports.glider = glider;
module.exports.gosperGliderGun = gosperGliderGun;
