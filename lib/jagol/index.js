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

const NeighborhoodState = {
	neighbor1Alive: 1,
	neighbor2Alive: 2,
	neighbor3Alive: 4,
	neighbor4Alive: 8,
	neighbor5Alive: 16,
	neighbor6Alive: 32,
	neighbor7Alive: 64,
	neighbor8Alive: 128,
};

const CellState = {
	dead: 0,
	alive: 256,
	newborn: 512,
};

/* types */
function Board(width, height, population, generation) {
	this.width =  width || 3;
	this.height = height || 3;
	this.population = population || [];
	this.generation = generation || 0;
}

function Cell(x, y, state) {
	this.x = x;
	this.y = y;
	this.state = state | CellState.dead;
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

// range :: Number -> [Number]
const range = R.memoizeWith(R.identity, R.range(0));

//  readArrayAtIndex :: [b] -> a -> b
const readArrayAtIndex = mArray => index => mArray[index];

// writeArrayAtIndex :: [b] -> (a, b) -> undefined
const writeArrayAtIndex = mArray => (index, value) => {
	mArray[index] = value;
};

// appendToArray :: [a] -> a -> undefined
const appendToArray = mArray => value => mArray.push(value);

// doNextGeneration :: [a] -> Board -> Board
const doNextGeneration = (cellStateTable, board) => {

	// getNeighborCell :: Cell -> direction -> Cell
	const getNeighborCell = (cell, direction) => new Cell(
		cell.x + (direction.x ? direction.x : 0),
		cell.y + (direction.y ? direction.y : 0),
		cell.state
	);

	// isOutOfBounds :: Number -> Number -> Cell -> Boolean
	const isOutOfBounds =
		(boardWidth, boardHeight, cell) => cell.x < 0 || cell.y < 0 || cell.x >= boardWidth || cell.y >= boardHeight;

	// getCellFromIndex :: Number -> Number -> Number -> Cell
	const getCellFromIndex = (boardWidth, boardHeight, cellIndex) => {
		const y = (cellIndex / boardWidth) >> 0;
		const x = cellIndex - (y * boardWidth);
		const cell = new Cell(x, y, CellState.alive);
		if (isOutOfBounds(boardWidth, boardHeight, cell)) {
			return null;
		}
		return cell;
	};

	// getIndexFromCell :: Number -> Number -> Cell -> Number
	const getIndexFromCell = (boardWidth, boardHeight, cell) => {
		if (isOutOfBounds(boardWidth, boardHeight, cell)) {
			return null;
		}
		return (cell.y * boardWidth) + cell.x;
	};

	// incHashValue :: Number -> Number -> [a] -> Cell -> a -> Maybe a
	const incHashValue = (boardWidth, boardHeight, serializedBoard, cell, value) => {
		const index = getIndexFromCell(boardWidth, boardHeight, cell);
		return Maybe.of(index)
			.map(index => {
				const newState = (readArrayAtIndex(serializedBoard)(index) || 0) + value;
				writeArrayAtIndex(serializedBoard)(index, newState);
				return newState;
			});
	};

	// serializeBoard :: Board -> [Number]
	const serializeBoard = board => {
		const length = board.width * board.height;
		const buffer = new ArrayBuffer(length * 2);

		return R.reduce((acc, value) => {
			const cell = new Cell(value.x, value.y, value.state || CellState.newborn);

			if (isOutOfBounds(board.width, board.height, cell)) {
				return acc;
			}

			switch(cell.state) {
				case CellState.newborn:
					incHashValue(board.width, board.height, acc, cell, CellState.alive | CellState.newborn);
					break;
				case CellState.alive:
					incHashValue(board.width, board.height, acc, cell, CellState.alive);
					break;
			}

			incHashValue(board.width, board.height, acc, getNeighborCell(cell, topLeft), 128);
			incHashValue(board.width, board.height, acc, getNeighborCell(cell, left), 64);
			incHashValue(board.width, board.height, acc, getNeighborCell(cell, bottomLeft), 32);
			incHashValue(board.width, board.height, acc, getNeighborCell(cell, top), 16);
			incHashValue(board.width, board.height, acc, getNeighborCell(cell, bottom), 8);
			incHashValue(board.width, board.height, acc, getNeighborCell(cell, topRight), 4);
			incHashValue(board.width, board.height, acc, getNeighborCell(cell, right), 2);
			incHashValue(board.width, board.height, acc, getNeighborCell(cell, bottomRight), 1);
			return acc;
		}, new Uint16Array(buffer), board.population);
	};

	// getPopulation :: Number -> Number -> [a] -> [b] -> [cell]
	const getPopulation = (boardWidth, boardHeight, cellStateTable, serializedBoard) => {
		const length = serializedBoard.length;
		const aliveCells = R.reduce((acc, value) => {
			const hash = readArrayAtIndex(serializedBoard)(value);
			const cellState = readArrayAtIndex(cellStateTable)(hash);

			if (CellState.alive & cellState) {
				const cell = getCellFromIndex(boardWidth, boardHeight, value);
				if (cell) {
					appendToArray(acc)({ x: cell.x, y: cell.y, state: CellState.newborn & cellState ? CellState.newborn : CellState.alive });
				}
			}

			return acc;
		}, [], range(length));

		return aliveCells || [];
	};

	const width = board.width;
	const height = board.height;
	const nextGeneration = board.generation + 1;

	return R.compose(
		R.curry(createBoard)(width, height, R.__, nextGeneration),
		R.curry(getPopulation)(board.width, board.height, cellStateTable),
		R.curry(serializeBoard)
	)(board);
};

// doNthGeneration :: Number -> [a] -> Board
const doNthGeneration = (nth, cellStateTable, board) => {
	if (nth <= 0) return undefined;
	if (nth === 1) return doNextGeneration(cellStateTable, board);
	return doNthGeneration(nth - 1, cellStateTable, doNextGeneration(cellStateTable, board));
};


// createCellStateTable :: _ -> [a]
const createCellStateTable = () => {
	// ruleB3 :: Number -> Number -> Boolean
	const ruleB3 = (hash, neighborsCount) => !(hash & CellState.alive) && neighborsCount === 3;

	// ruleS2 :: Number -> Number -> Boolean
	const ruleS2 = (hash, neighborsCount) => hash & CellState.alive && neighborsCount === 2;

	// ruleS3 :: Number -> Number -> Boolean
	const ruleS3 = (hash, neighborsCount) => hash & CellState.alive && neighborsCount === 3;

	const rules = [ruleB3, ruleS2, ruleS3];

	// getNeighborsCount :: Number -> Number
	const getNeighborsCount = state => R.reduce(
		(acc, value) => state & value ? acc + 1 : acc, 0, [
			NeighborhoodState.neighbor1Alive,
			NeighborhoodState.neighbor2Alive,
			NeighborhoodState.neighbor3Alive,
			NeighborhoodState.neighbor4Alive,
			NeighborhoodState.neighbor5Alive,
			NeighborhoodState.neighbor6Alive,
			NeighborhoodState.neighbor7Alive,
			NeighborhoodState.neighbor8Alive
		]);

	const cellStateTable = R.map(value => {
		const neighborsCount = getNeighborsCount(value);
		const isCellAlive = R.anyPass(rules)(value, neighborsCount);

		if (!isCellAlive) return CellState.dead;

		const isNewBorn = (!(value & CellState.alive)) && isCellAlive;

		if (isNewBorn) return CellState.alive | CellState.newborn;

		return CellState.alive;
	}, range(1024));

	return cellStateTable;
};

// play :: [a] -> (Board)
const play = cellStateTable => R.curry(doNextGeneration)(cellStateTable);

// createBoard :: Number -> Number -> [Cell] -> Number -> Board
const createBoard = (width, height, population, generation) => new Board(width, height, population, generation);

/* exports */
module.exports.CellState = CellState;
module.exports.NeighborhoodState = NeighborhoodState;
module.exports.doNextGeneration = doNextGeneration;
module.exports.doNthGeneration = doNthGeneration;
module.exports.createCellStateTable = createCellStateTable;
module.exports.play = play;
module.exports.board = createBoard;
