const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// defines where the bundle file will live
const bundlePath = path.resolve(__dirname, 'dist/');

module.exports = (_env, argv) => {
	let entryPoints = {
		VideoOverlay: {
			path: './src/views/VideoOverlay.tsx',
			outputHtml: 'video_overlay.html',
			build: true,
		},
	};

	let entry = {};

	// edit webpack plugins here!
	let plugins = [
		// new webpack.HotModuleReplacementPlugin(),
	];

	for (name in entryPoints) {
		if (entryPoints[name].build) {
			entry[name] = entryPoints[name].path;
			if (argv.mode === 'production') {
				plugins.push(
					new HtmlWebpackPlugin({
						inject: true,
						chunks: [name],
						template: './template.html',
						filename: entryPoints[name].outputHtml,
						title: 'LudeCat Twitch Extension',
					})
				);
			}
		}
	}

	let config = {
		//entry points for webpack- remove if not used/needed
		entry,
		optimization: {
			minimize: false, // neccessary to pass Twitch's review process
		},
		devtool: 'source-map',
		module: {
			rules: [
				{
					test: /\.(js|jsx)$/,
					exclude: /(node_modules)/,
					loader: 'babel-loader',
				},
				{
					test: /\.(ts|tsx)$/,
					exclude: /(node_modules)/,
					loader: 'awesome-typescript-loader',
				},
				{
					test: /\.(jpe?g|png|gif|svg)$/i,
					loader: 'file-loader?name=/assets/spritesheet[name].[ext]',
				},
				{
					test: /\.(eot|ttf|woff|woff2)$/i,
					loader: 'file-loader',
				},
				{
					test: /\.(ogg|mp3|wav|mpe?g)$/i,
					loader: 'file-loader',
				},
			],
		},
		resolve: {
			extensions: ['*', '.js', '.jsx', '.ts', '.tsx'],
		},
		output: {
			filename: '[name].bundle.js',
			path: bundlePath,
		},
		plugins,
	};

	if (argv.mode === 'development') {
		config.devServer = {
			contentBase: path.join(__dirname, 'dist'),
			host: 'localhost',
			headers: {
				'Access-Control-Allow-Origin': '*',
			},
			port: 3434,
		};
		config.devServer.https = true;
	}
	if (argv.mode === 'production') {
		config.plugins.push(new CleanWebpackPlugin());

		config.optimization.splitChunks = {
			cacheGroups: {
				default: false,
				vendors: false,
				vendor: {
					chunks: 'all',
					test: /node_modules/,
					name: false,
				},
			},
			name: false,
		};
	}

	return config;
};
