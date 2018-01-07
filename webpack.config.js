const path = require('path');

module.exports = {
	entry: {
		jagol: './lib/jagol/index.js',
		patterns: './lib/patterns/index.js',
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist'),
		library: '[name]',
		libraryTarget: 'var'
	}
};
