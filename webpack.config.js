const path = require('path');
const webpack = require('webpack');

module.exports = {
	entry: {
		jagol: './lib/jagol/index.js',
		patterns: './lib/patterns/index.js',
		immutable: 'immutable'
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist'),
		library: '[name]',
		libraryTarget: 'var'
	}
};
