"use strict";

const R = require('ramda');

/* constants */
const topLeft = { x: -1, y: -1 };
const top = { y: -1 };
const topRight = { x: 1, y: -1 };
const left = { x: -1 };
const right = { x: 1 };
const bottomLeft = { x: -1, y: 1 };
const bottom = { y: 1 };
const bottomRight = { x: 1, y: 1 };

const DEAD_STATE = false;
const ALIVE_STATE = true;


/* types */
function Board(width, height, population, generation) {
	this.width =  width || 3;
	this.height = height || 3;
	this.population = population || [];
	this.generation = generation || 0;
}

function Cell(x, y) {
	this.x = x;
	this.y = y;
};

//
// From:
// https://jrsinclair.com/articles/2016/marvellously-mysterious-javascript-maybe-monad/
//
function Maybe(val) {
	this.__value = val;
}

Maybe.of = function(val) {
	return new Maybe(val);
};

Maybe.prototype.isNothing = function() {
	return this.__value === null || this.__value === undefined;
};

Maybe.prototype.map = function(f) {
	return this.isNothing() ? Maybe.of(null) : Maybe.of(f(this.__value));
};

/* functions */

// range :: int -> [int]
const range = R.memoizeWith(R.identity, R.range(0));

//  readArrayAtIndex :: [a] -> int -> a
const readArrayAtIndex = mArray => index => mArray[index];

// writeArrayAtIndex :: [a] -> (int -> a) -> undefined
const writeArrayAtIndex = mArray => (index, value) => {
	mArray[index] = value;
};

// appendToArray :: [a] -> a -> undefined
const appendToArray = mArray => value => mArray.push(value);

// doNextGeneration :: [bool] -> Board -> Board
const doNextGeneration = (rulesTable, board) => {

	// getNeighborCell :: Cell -> direction -> Cell
	const getNeighborCell = (cell, direction) => new Cell(
		cell.x + (direction.x ? direction.x : 0),
		cell.y + (direction.y ? direction.y : 0)
	);

	// isOutOfBounds :: int -> int -> Cell -> bool
	const isOutOfBounds =
		(boardWidth, boardHeight, cell) => cell.x < 0 || cell.y < 0 || cell.x >= boardWidth || cell.y >= boardHeight;

	// getCellFromIndex :: int -> int -> int -> Cell
	const getCellFromIndex = (boardWidth, boardHeight, cellIndex) => {
		const y = (cellIndex / boardWidth) >> 0;
		const x = cellIndex - (y * boardWidth);
		const cell = new Cell(x, y);
		if (isOutOfBounds(boardWidth, boardHeight, cell)) {
			return null;
		}
		return new Cell(x, y);
	};

	// getIndexFromCell :: int -> int -> Cell -> int
	const getIndexFromCell = (boardWidth, boardHeight, cell) => {
		if (isOutOfBounds(boardWidth, boardHeight, cell)) {
			return null;
		}
		return (cell.y * boardWidth) + cell.x;
	};

	// setCellState :: int -> int -> [int] -> Cell -> int -> Maybe int
	const setCellState = (boardWidth, boardHeight, stateArray, cell, state) => {
		const index = getIndexFromCell(boardWidth, boardHeight, cell);
		return Maybe.of(index)
			.map(index => {
				const newState = (readArrayAtIndex(stateArray)(index) || 0) + state;
				writeArrayAtIndex(stateArray)(index, newState);
				return newState;
			});
	};

	// createStateArray :: Board -> [int]
	const createStateArray = board => {
		const length = board.width * board.height;
		const buffer = new ArrayBuffer(length * 2);

		return R.reduce((acc, value) => {
			const cell = new Cell(value.x, value.y);
			if (isOutOfBounds(board.width, board.height, cell)) {
				return acc;
			}
			setCellState(board.width, board.height, acc, cell, 16);
			setCellState(board.width, board.height, acc, getNeighborCell(cell, topLeft), 256);
			setCellState(board.width, board.height, acc, getNeighborCell(cell, left), 128);
			setCellState(board.width, board.height, acc, getNeighborCell(cell, bottomLeft), 64);
			setCellState(board.width, board.height, acc, getNeighborCell(cell, top), 32);
			setCellState(board.width, board.height, acc, getNeighborCell(cell, bottom), 8);
			setCellState(board.width, board.height, acc, getNeighborCell(cell, topRight), 4);
			setCellState(board.width, board.height, acc, getNeighborCell(cell, right), 2);
			setCellState(board.width, board.height, acc, getNeighborCell(cell, bottomRight), 1);
			return acc;
		}, new Uint16Array(buffer), board.population);
	};

	// getPopulation :: int -> int -> [bool] -> [int] -> [cell]
	const getPopulation = (boardWidth, boardHeight, rulesTable, stateArray) => {
		const length = stateArray.length;

		const aliveCells = R.reduce((acc, value) => {
			const cellState = readArrayAtIndex(stateArray)(value);
			const isCellAlive = readArrayAtIndex(rulesTable)(cellState) === ALIVE_STATE;

			if (isCellAlive) {
				const cell = getCellFromIndex(boardWidth, boardHeight, value);
				if (cell) {
					appendToArray(acc)({ x: cell.x, y: cell.y });
				}
			}

			return acc;
		}, [], range(length - 1));

		return aliveCells || [];
	};

	const width = board.width;
	const height = board.height;
	const nextGeneration = board.generation + 1;

	return R.compose(
		R.curry(createBoard)(width, height, R.__, nextGeneration),
		R.curry(getPopulation)(board.width, board.height, rulesTable),
		R.curry(createStateArray)
	)(board);
};

// doNthGeneration :: int -> [bool] -> Board
const doNthGeneration = (nth, rulesTable, board) => {
	if (nth <= 0) return undefined;
	if (nth === 1) return doNextGeneration(rulesTable, board);
	return doNthGeneration(nth - 1, rulesTable, doNextGeneration(rulesTable, board));
};


// createRulesTable :: _ -> [bool]
const createRulesTable = () => {
	// ruleB3 :: int -> int -> bool
	const ruleB3 = (cellState, neighborsCount) => !(cellState & 16) && neighborsCount === 3;

	// ruleS2 :: int -> int -> bool
	const ruleS2 = (cellState, neighborsCount) => cellState & 16 && neighborsCount === 2;

	// ruleS3 :: int -> int -> bool
	const ruleS3 = (cellState, neighborsCount) => cellState & 16 && neighborsCount === 3;

	const rules = [ruleB3, ruleS2, ruleS3];

	// getNeighborsCount :: int -> int
	const getNeighborsCount = state => R.reduce(
		(acc, value) => state & value ? acc + 1 : acc, 0, [1, 2, 4, 8, 32, 64, 128, 256]);

	const rulesTable = R.map(value => {
		const neighborsCount = getNeighborsCount(value);
		const isCellAlive = R.anyPass(rules)(value, neighborsCount);
		return isCellAlive ? ALIVE_STATE : DEAD_STATE;
	}, range(513));

	return rulesTable;
};

// play :: [bool] -> (board)
const play = rulesTable => R.curry(doNextGeneration)(rulesTable);

// createBoard :: int -> int -> [cell] -> int -> board
const createBoard = (width, height, population, generation) => new Board(width, height, population, generation);

/* exports */
module.exports.doNextGeneration = doNextGeneration;
module.exports.doNthGeneration = doNthGeneration;
module.exports.createRulesTable = createRulesTable;
module.exports.play = play;
module.exports.board = createBoard;
